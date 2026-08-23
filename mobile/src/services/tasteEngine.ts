/**
 * CUE Taste Profile Engine Client Service
 * 
 * Computes 128-dimensional taste vectors from user ratings
 * and performs cosine-distance candidate ranking locally or via Supabase pgvector.
 */

import { Movie } from '@/constants/mockData';

const VECTOR_DIM = 128;

// Standard Genre Map matching feature_vector.js
const GENRE_MAP: Record<string, number> = {
  'Action': 0, 'Adventure': 1, 'Animation': 2, 'Comedy': 3,
  'Crime': 4, 'Documentary': 5, 'Drama': 6, 'Family': 7,
  'Fantasy': 8, 'History': 9, 'Horror': 10, 'Music': 11,
  'Mystery': 12, 'Romance': 13, 'Sci-Fi': 14, 'Science Fiction': 14,
  'TV Movie': 15, 'Thriller': 16, 'War': 17, 'Western': 18
};

/**
 * Generates a 128-dimensional feature vector for a movie
 */
export function generateClientMovieVector(movie: Movie): number[] {
  const vector = new Array(VECTOR_DIM).fill(0.0);

  // 1. Genres (Indices 0 - 18)
  if (Array.isArray(movie.genres)) {
    movie.genres.forEach(genre => {
      const idx = GENRE_MAP[genre];
      if (idx !== undefined) {
        vector[idx] = 1.5;
      }
    });
  }

  // 2. Runtime (Index 19)
  vector[19] = Math.min(movie.runtime || 100, 240) / 240.0;

  // 3. Vote Average (Index 20)
  vector[20] = Math.min(Math.max(movie.vote_average || 7.0, 0), 10) / 10.0;

  // L2 Normalize
  let normSquare = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    normSquare += vector[i] * vector[i];
  }

  if (normSquare > 0) {
    const norm = Math.sqrt(normSquare);
    for (let i = 0; i < VECTOR_DIM; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}

export interface UserRating {
  tmdb_id: number;
  rating_type: 'thumbs_up' | 'thumbs_down' | 'star_1' | 'star_2' | 'star_3' | 'star_4' | 'star_5';
  score?: number;
  movie: Movie;
}

/**
 * Computes a 128-dimensional user taste vector from user ratings
 */
export function computeUserTasteVector(ratings: UserRating[]): number[] {
  const tasteVec = new Array(VECTOR_DIM).fill(0.0);

  ratings.forEach(r => {
    const movieVec = generateClientMovieVector(r.movie);
    let weight = 1.0;

    if (r.rating_type === 'thumbs_up') weight = 1.0;
    else if (r.rating_type === 'thumbs_down') weight = -0.8;
    else if (r.rating_type.startsWith('star_')) {
      const score = r.score || parseInt(r.rating_type.replace('star_', ''), 10) || 3;
      weight = (score - 3.0) / 2.0;
    }

    for (let i = 0; i < VECTOR_DIM; i++) {
      tasteVec[i] += weight * movieVec[i];
    }
  });

  // L2 Normalize
  let normSquare = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    normSquare += tasteVec[i] * tasteVec[i];
  }

  if (normSquare > 0) {
    const norm = Math.sqrt(normSquare);
    for (let i = 0; i < VECTOR_DIM; i++) {
      tasteVec[i] = tasteVec[i] / norm;
    }
  }

  return tasteVec;
}

/**
 * Cosine Distance between two 128-dim vectors
 */
export function cosineDistance(vecA: number[], vecB: number[]): number {
  let dot = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    dot += vecA[i] * vecB[i];
  }
  return 1.0 - dot;
}

/**
 * Ranks candidate movies based on user taste vector and optional runtime filter constraint
 */
export function rankRecommendations(
  tasteVector: number[], 
  candidates: Movie[], 
  ratedIds: number[],
  maxRuntime?: number
): Movie[] {
  const unrated = candidates.filter(m => !ratedIds.includes(m.tmdb_id));
  const filtered = maxRuntime ? unrated.filter(m => m.runtime <= maxRuntime) : unrated;

  return filtered.map(movie => {
    const movieVec = generateClientMovieVector(movie);
    const distance = cosineDistance(tasteVector, movieVec);
    return { movie, distance };
  })
  .sort((a, b) => a.distance - b.distance)
  .map(item => item.movie);
}
