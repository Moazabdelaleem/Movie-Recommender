/**
 * Feature Vector Generator for Movie Recommender
 * 
 * Maps TMDB movie metadata (genres, runtime, vote_average, cast, director)
 * into a fixed 128-dimensional numerical float array for pgvector similarity.
 */

// TMDB Standard Genre ID mapping to fixed vector indices (0 - 18)
const GENRE_MAP = {
  28: 0,     // Action
  12: 1,     // Adventure
  16: 2,     // Animation
  35: 3,     // Comedy
  80: 4,     // Crime
  99: 5,     // Documentary
  18: 6,     // Drama
  10751: 7,  // Family
  14: 8,     // Fantasy
  36: 9,     // History
  27: 10,    // Horror
  10402: 11, // Music
  9648: 12,  // Mystery
  10749: 13, // Romance
  878: 14,   // Science Fiction
  10770: 15, // TV Movie
  53: 16,    // Thriller
  10752: 17, // War
  37: 18,    // Western
};

const VECTOR_DIM = 128;
const HASH_BUCKET_OFFSET = 22;
const HASH_BUCKET_SIZE = VECTOR_DIM - HASH_BUCKET_OFFSET; // 106 buckets for cast/crew

/**
 * FNV-1a 32-bit hash function for string hashing into fixed buckets
 */
function fnv1aHash(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

/**
 * Generates a 128-dimensional normalized feature vector for a movie
 * @param {Object} movie
 * @param {Array<number|Object>} movie.genres - Genre IDs or objects with id property
 * @param {number} movie.runtime - Runtime in minutes
 * @param {number} movie.vote_average - Vote average (0 - 10)
 * @param {Array<string>} movie.cast_members - Array of actor names
 * @param {string} movie.director - Director name
 * @returns {Array<number>} 128-float array formatted for pgvector
 */
function generateMovieFeatureVector(movie) {
  const vector = new Array(VECTOR_DIM).fill(0.0);

  // 1. Encode Genres (Indices 0 - 18)
  if (Array.isArray(movie.genres)) {
    movie.genres.forEach(g => {
      const genreId = typeof g === 'object' ? g.id : Number(g);
      if (GENRE_MAP[genreId] !== undefined) {
        vector[GENRE_MAP[genreId]] = 1.0;
      }
    });
  }

  // 2. Encode Runtime (Index 19) — Normalized [0, 1] up to 240 mins
  const runtime = Number(movie.runtime) || 100;
  vector[19] = Math.min(runtime, 240) / 240.0;

  // 3. Encode Vote Average (Index 20) — Normalized [0, 1]
  const voteAvg = Number(movie.vote_average) || 7.0;
  vector[20] = Math.min(Math.max(voteAvg, 0), 10) / 10.0;

  // 4. Encode Popularity / Release Year proxy (Index 21)
  if (movie.release_date) {
    const year = parseInt(movie.release_date.substring(0, 4), 10);
    if (!isNaN(year)) {
      vector[21] = Math.max(0, (year - 1950) / 80.0); // 1950 - 2030 normalized
    }
  }

  // 5. Hashed Cast & Director Embeddings (Indices 22 - 127)
  if (movie.director) {
    const directorHash = fnv1aHash(movie.director.toLowerCase().trim()) % HASH_BUCKET_SIZE;
    vector[HASH_BUCKET_OFFSET + directorHash] += 1.5; // Higher weight for director
  }

  if (Array.isArray(movie.cast_members)) {
    movie.cast_members.slice(0, 5).forEach((actor, idx) => {
      if (typeof actor === 'string') {
        const actorHash = fnv1aHash(actor.toLowerCase().trim()) % HASH_BUCKET_SIZE;
        // Weight top cast member higher
        const weight = 1.0 - (idx * 0.15);
        vector[HASH_BUCKET_OFFSET + actorHash] += weight;
      }
    });
  }

  // L2 Normalize Vector for Cosine Distance Querying in pgvector
  let normSquare = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    normSquare += vector[i] * vector[i];
  }

  if (normSquare > 0) {
    const norm = Math.sqrt(normSquare);
    for (let i = 0; i < VECTOR_DIM; i++) {
      vector[i] = parseFloat((vector[i] / norm).toFixed(6));
    }
  }

  return vector;
}

module.exports = {
  generateMovieFeatureVector,
  VECTOR_DIM,
  GENRE_MAP
};
