/**
 * TMDB Client Utility for Movie Recommender
 * 
 * Fetches movie metadata from TMDB v3 API and prepares payloads
 * for caching in Supabase with computed 128-dim feature vectors.
 */

const { generateMovieFeatureVector } = require('./feature_vector');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetch a movie by ID from TMDB including credits
 * @param {number|string} tmdbId 
 * @param {string} apiKeyOrToken - TMDB API key or Bearer token
 * @returns {Promise<Object>} Formatted movie record for Supabase movies_cache
 */
async function fetchAndFormatMovie(tmdbId, apiKeyOrToken) {
  const isBearer = apiKeyOrToken && apiKeyOrToken.length > 50;
  const headers = isBearer 
    ? { Authorization: `Bearer ${apiKeyOrToken}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
  
  const queryParam = !isBearer ? `?api_key=${apiKeyOrToken}` : '';

  // 1. Fetch main movie details
  const res = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}${queryParam}`, { headers });
  if (!res.ok) {
    throw new Error(`TMDB fetch failed for ID ${tmdbId}: ${res.status} ${res.statusText}`);
  }
  const movie = await res.json();

  // 2. Fetch credits (cast & crew)
  const creditsRes = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/credits${queryParam}`, { headers });
  let castMembers = [];
  let director = null;

  if (creditsRes.ok) {
    const credits = await creditsRes.json();
    if (credits.cast) {
      castMembers = credits.cast.slice(0, 5).map(c => c.name);
    }
    if (credits.crew) {
      const directorObj = credits.crew.find(c => c.job === 'Director');
      if (directorObj) {
        director = directorObj.name;
      }
    }
  }

  // 3. Format metadata for database
  const movieRecord = {
    tmdb_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    runtime: movie.runtime || 100,
    genres: (movie.genres || []).map(g => g.name),
    cast_members: castMembers,
    director: director || 'Unknown',
    overview: movie.overview,
    vote_average: movie.vote_average ? parseFloat(movie.vote_average.toFixed(1)) : 7.0,
    last_synced_at: new Date().toISOString()
  };

  // 4. Compute 128-dim feature vector
  movieRecord.embedding = generateMovieFeatureVector({
    genres: movie.genres || [],
    runtime: movieRecord.runtime,
    vote_average: movieRecord.vote_average,
    release_date: movieRecord.release_date,
    cast_members: castMembers,
    director: director
  });

  return movieRecord;
}

module.exports = {
  fetchAndFormatMovie,
  TMDB_BASE_URL
};
