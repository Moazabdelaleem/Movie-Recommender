-- Enable pgvector extension for similarity matching
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Invites Table (Invite-only onboarding)
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ
);

-- 2. Movies Cache Table
CREATE TABLE IF NOT EXISTS public.movies_cache (
    tmdb_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    poster_path TEXT,
    release_date TEXT,
    runtime INTEGER,
    genres TEXT[] DEFAULT '{}',
    cast_members TEXT[] DEFAULT '{}',
    director TEXT,
    overview TEXT,
    vote_average NUMERIC(3, 1),
    embedding vector(128),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast vector similarity search using HNSW (Cosine Distance)
CREATE INDEX IF NOT EXISTS idx_movies_cache_embedding 
ON public.movies_cache 
USING hnsw (embedding vector_cosine_ops);

-- 3. Ratings Table (Dual Rating System: Thumbs for Onboarding, 1-5 Stars for Post-Watch)
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL REFERENCES public.movies_cache(tmdb_id) ON DELETE CASCADE,
    rating_type TEXT NOT NULL CHECK (rating_type IN ('thumbs_up', 'thumbs_down', 'star_1', 'star_2', 'star_3', 'star_4', 'star_5')),
    score NUMERIC NOT NULL, -- +1.0 (thumbs up), -1.0 (thumbs down), or 1.0 to 5.0 (stars)
    source TEXT NOT NULL CHECK (source IN ('onboarding', 'post_watch', 'manual')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_movie_rating UNIQUE (user_id, tmdb_id, source)
);

-- 4. Watch History / Saved Movies Table
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL REFERENCES public.movies_cache(tmdb_id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'watched', 'dismissed')),
    swiped_at TIMESTAMPTZ DEFAULT NOW(),
    watch_unlock_at TIMESTAMPTZ, -- Set to swiped_at + (runtime * interval '1 minute')
    rated_at TIMESTAMPTZ,
    CONSTRAINT unique_user_movie_watch UNIQUE (user_id, tmdb_id)
);

-- 5. Taste Vectors Table
CREATE TABLE IF NOT EXISTS public.taste_vectors (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    vector vector(128) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Filter Sessions Table (For Time-to-Decision metrics & filter logging)
CREATE TABLE IF NOT EXISTS public.filter_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    pool_size_after INTEGER NOT NULL,
    decided_movie_id INTEGER REFERENCES public.movies_cache(tmdb_id) ON DELETE SET NULL,
    time_to_decision_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taste_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filter_sessions ENABLE ROW LEVEL SECURITY;

-- Movies Cache: Public read access for authenticated users
CREATE POLICY "Allow public read access to movies_cache" 
ON public.movies_cache FOR SELECT 
TO authenticated, anon 
USING (true);

-- Invites: Authenticated & anon users can check code validity
CREATE POLICY "Allow read access to invites for code validation" 
ON public.invites FOR SELECT 
TO authenticated, anon 
USING (true);

-- Ratings: Users can manage their own ratings
CREATE POLICY "Users can view own ratings" 
ON public.ratings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings" 
ON public.ratings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" 
ON public.ratings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Watch History: Users manage their own watch history
CREATE POLICY "Users can view own watch history" 
ON public.watch_history FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history" 
ON public.watch_history FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history" 
ON public.watch_history FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Taste Vectors: Users manage their own taste vector
CREATE POLICY "Users can view own taste vector" 
ON public.taste_vectors FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own taste vector" 
ON public.taste_vectors FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Filter Sessions: Users manage their own filter sessions
CREATE POLICY "Users can insert own filter sessions" 
ON public.filter_sessions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own filter sessions" 
ON public.filter_sessions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
