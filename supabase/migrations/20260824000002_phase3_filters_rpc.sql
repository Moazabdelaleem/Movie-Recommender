-- ============================================================================
-- Phase 3: Filter Question Logic & Candidate Pool Optimization (pgvector)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_filtered_recommendations(
    p_user_id UUID,
    p_max_runtime INT DEFAULT NULL,
    p_include_genres TEXT[] DEFAULT NULL,
    p_exclude_genres TEXT[] DEFAULT NULL,
    p_limit INT DEFAULT 30
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
    result_count INT;
BEGIN
    SELECT vector INTO user_vec FROM public.taste_vectors WHERE user_id = p_user_id;

    -- Query candidate movies with strict runtime and genre filters
    RETURN QUERY
    SELECT 
        m.tmdb_id, 
        m.title, 
        m.poster_path, 
        m.release_date, 
        m.runtime, 
        m.genres, 
        m.vote_average,
        CASE WHEN user_vec IS NULL THEN 0.0::float8 ELSE (m.embedding <=> user_vec)::float8 END AS distance
    FROM public.movies_cache m
    WHERE m.tmdb_id NOT IN (SELECT r.tmdb_id FROM public.ratings r WHERE r.user_id = p_user_id)
      AND (p_max_runtime IS NULL OR m.runtime <= p_max_runtime)
      AND (p_include_genres IS NULL OR m.genres && p_include_genres)
      AND (p_exclude_genres IS NULL OR NOT (m.genres && p_exclude_genres))
    ORDER BY 
      CASE WHEN user_vec IS NULL THEN m.vote_average END DESC,
      CASE WHEN user_vec IS NOT NULL THEN m.embedding <=> user_vec END ASC
    LIMIT p_limit;

    GET DIAGNOSTICS result_count = ROW_COUNT;

    -- Softening Fallback: If strict pool has < 5 candidates, return candidates matching runtime only
    IF result_count < 5 THEN
        RETURN QUERY
        SELECT 
            m.tmdb_id, 
            m.title, 
            m.poster_path, 
            m.release_date, 
            m.runtime, 
            m.genres, 
            m.vote_average,
            CASE WHEN user_vec IS NULL THEN 0.0::float8 ELSE (m.embedding <=> user_vec)::float8 END AS distance
        FROM public.movies_cache m
        WHERE m.tmdb_id NOT IN (SELECT r.tmdb_id FROM public.ratings r WHERE r.user_id = p_user_id)
          AND (p_max_runtime IS NULL OR m.runtime <= p_max_runtime)
        ORDER BY 
          CASE WHEN user_vec IS NULL THEN m.vote_average END DESC,
          CASE WHEN user_vec IS NOT NULL THEN m.embedding <=> user_vec END ASC
        LIMIT p_limit;
    END IF;
END;
$$;
