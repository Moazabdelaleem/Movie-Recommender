/**
 * CUE Filter Engine Client Service
 * 
 * Maps single-tap filter row selections to precise search constraints
 * and calculates real-time candidate pool count estimates.
 */

import { Movie } from '@/constants/mockData';

export interface FilterSelections {
  shortIndex: number; // 0: Any, 1: < 90m, 2: < 110m
  focusIndex: number; // 0: Thoughtful, 1: Easy, 2: Mind-bending
  energyIndex: number; // 0: Medium, 1: High energy, 2: Low key
  moodIndex: number; // 0: Doesn't matter, 1: Feel good, 2: Dark & Intense
}

export interface FilterCriteria {
  maxRuntime?: number;
  includeGenres?: string[];
}

/**
 * Maps UI indices into filter criteria
 */
export function buildFilterCriteria(selections: FilterSelections): FilterCriteria {
  const criteria: FilterCriteria = {};

  // 1. Runtime Constraint
  if (selections.shortIndex === 1) criteria.maxRuntime = 90;
  else if (selections.shortIndex === 2) criteria.maxRuntime = 110;

  // 2. Genre Inclusions
  const genresSet = new Set<string>();

  // Focus
  if (selections.focusIndex === 0) { // Thoughtful
    ['Drama', 'Sci-Fi', 'Science Fiction', 'Crime'].forEach(g => genresSet.add(g));
  } else if (selections.focusIndex === 1) { // Easy watching
    ['Comedy', 'Animation', 'Family', 'Romance'].forEach(g => genresSet.add(g));
  } else if (selections.focusIndex === 2) { // Mind-bending
    ['Sci-Fi', 'Science Fiction', 'Thriller', 'Mystery'].forEach(g => genresSet.add(g));
  }

  // Energy
  if (selections.energyIndex === 1) { // High energy
    ['Action', 'Adventure', 'Thriller'].forEach(g => genresSet.add(g));
  } else if (selections.energyIndex === 2) { // Low key
    ['Drama', 'Romance', 'Animation'].forEach(g => genresSet.add(g));
  }

  // Mood
  if (selections.moodIndex === 1) { // Feel good
    ['Comedy', 'Animation', 'Family', 'Romance'].forEach(g => genresSet.add(g));
  } else if (selections.moodIndex === 2) { // Dark & Intense
    ['Crime', 'Thriller', 'Horror', 'Drama'].forEach(g => genresSet.add(g));
  }

  if (genresSet.size > 0) {
    criteria.includeGenres = Array.from(genresSet);
  }

  return criteria;
}

/**
 * Filters movie pool based on FilterCriteria with safety net fallback preventing empty candidate decks
 */
export function filterMoviePool(movies: Movie[], criteria: FilterCriteria): Movie[] {
  let filtered = movies;

  // 1. Filter Runtime
  if (criteria.maxRuntime) {
    const runtimeFiltered = filtered.filter(m => m.runtime <= criteria.maxRuntime!);
    if (runtimeFiltered.length > 0) {
      filtered = runtimeFiltered;
    }
  }

  // 2. Filter Genres
  if (criteria.includeGenres && criteria.includeGenres.length > 0) {
    const genreFiltered = filtered.filter(m => 
      m.genres.some(g => criteria.includeGenres!.includes(g))
    );
    if (genreFiltered.length > 0) {
      filtered = genreFiltered;
    }
  }

  // 3. Safety Net Fallback
  if (filtered.length === 0) {
    filtered = movies;
  }

  return filtered;
}
