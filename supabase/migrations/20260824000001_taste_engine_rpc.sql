-- ============================================================================
-- Phase 2: Taste Profile Engine SQL Functions (pgvector)
-- ============================================================================

-- Function 1: Compute and update user taste vector based on movie ratings
CREATE OR REPLACE FUNCTION public.compute_user_taste_vector(p_user_id UUID)
RETURNS vector(128)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
    v_sum float8[] := array_fill(0.0::float8, ARRAY[128]);
    v_norm float8 := 0.0;
    v_weight float8;
    v_elem float8;
    v_final float8[] := array_fill(0.0::float8, ARRAY[128]);
    i INT;
    v_result vector(128);
BEGIN
    -- Loop through all ratings for the target user
    FOR r IN 
        SELECT 
            r_item.rating_type, 
            r_item.score, 
            m.embedding 
        FROM public.ratings r_item
        JOIN public.movies_cache m ON r_item.tmdb_id = m.tmdb_id
        WHERE r_item.user_id = p_user_id AND m.embedding IS NOT NULL
    LOOP
        -- Determine weighting based on rating_type / score
        IF r.rating_type = 'thumbs_up' THEN
            v_weight := 1.0;
        ELSIF r.rating_type = 'thumbs_down' THEN
            v_weight := -0.8; -- Pulls taste vector away from disliked movies
        ELSIF r.rating_type LIKE 'star_%' THEN
            v_weight := (r.score - 3.0) / 2.0; -- 5 stars = +1.0, 3 stars = 0, 1 star = -1.0
        ELSE
            v_weight := 1.0;
        END IF;

        -- Add weighted embedding elements
        FOR i IN 1..128 LOOP
            v_sum[i] := v_sum[i] + (v_weight * (r.embedding[i]));
        END LOOP;
    END LOOP;

    -- Calculate L2 norm square
    FOR i IN 1..128 LOOP
        v_norm := v_norm + (v_sum[i] * v_sum[i]);
    END LOOP;

    -- Normalize vector to unit length
    IF v_norm > 0 THEN
        v_norm := sqrt(v_norm);
        FOR i IN 1..128 LOOP
            v_final[i] := round((v_sum[i] / v_norm)::numeric, 6);
        END LOOP;
    END IF;

    -- Cast to vector type
    v_result := v_final::vector(128);

    -- Upsert into taste_vectors table
    INSERT INTO public.taste_vectors (user_id, vector, updated_at)
    VALUES (p_user_id, v_result, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET vector = EXCLUDED.vector, updated_at = NOW();

    RETURN v_result;
END;
$$;

-- Function 2: Query candidate movie recommendations using pgvector Cosine Distance (<=>)
CREATE OR REPLACE FUNCTION public.get_recommendations(
    p_user_id UUID,
    p_max_runtime INT DEFAULT NULL,
    p_limit INT DEFAULT 20
)
RETURNS TABLE (
    tmdb_id INT,
    title TEXT,
    poster_path TEXT,
    release_date TEXT,
    runtime INT,
    genres TEXT[],
    vote_average NUMERIC,
    distance FLOAT8
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_vec vector(128);
BEGIN
    -- Retrieve user taste vector
    SELECT vector INTO user_vec FROM public.taste_vectors WHERE user_id = p_user_id;

    -- Fallback: if no taste vector calculated yet, return top rated unrated movies
    IF user_vec IS NULL THEN
        RETURN QUERY
        SELECT 
            m.tmdb_id, m.title, m.poster_path, m.release_date, m.runtime, m.genres, m.vote_average, 0.0::float8 AS distance
        FROM public.movies_cache m
        WHERE m.tmdb_id NOT IN (SELECT r.tmdb_id FROM public.ratings r WHERE r.user_id = p_user_id)
          AND (p_max_runtime IS NULL OR m.runtime <= p_max_runtime)
        ORDER BY m.vote_average DESC
        LIMIT p_limit;
    ELSE
        -- Perform pgvector nearest-neighbor similarity search
        RETURN QUERY
        SELECT 
            m.tmdb_id, 
            m.title, 
            m.poster_path, 
            m.release_date, 
            m.runtime, 
            m.genres, 
            m.vote_average,
            (m.embedding <=> user_vec)::float8 AS distance
        FROM public.movies_cache m
        WHERE m.tmdb_id NOT IN (SELECT r.tmdb_id FROM public.ratings r WHERE r.user_id = p_user_id)
          AND (p_max_runtime IS NULL OR m.runtime <= p_max_runtime)
        ORDER BY m.embedding <=> user_vec ASC
        LIMIT p_limit;
    END IF;
END;
$$;
