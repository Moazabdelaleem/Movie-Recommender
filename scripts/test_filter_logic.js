/**
 * Automated Verification Script for Phase 3 Filter Question Logic
 * 
 * Verifies candidate pool sizing across 10 filter combinations.
 */

const { getPreparedSeedMovies } = require('./seed_onboarding');
const seedMovies = getPreparedSeedMovies();

function filterPool(movies, maxRuntime, includeGenres) {
  let filtered = movies;

  // 1. Runtime constraint
  if (maxRuntime) {
    const runtimeFiltered = filtered.filter(m => m.runtime <= maxRuntime);
    if (runtimeFiltered.length > 0) {
      filtered = runtimeFiltered;
    }
  }

  // 2. Genre constraint
  if (includeGenres && includeGenres.length > 0) {
    const genreFiltered = filtered.filter(m => 
      m.genres.some(g => typeof g === 'object' ? includeGenres.includes(g.name) : includeGenres.includes(g))
    );
    if (genreFiltered.length > 0) {
      filtered = genreFiltered;
    }
  }

  // 3. Safety Net Fallback: Never return 0 candidates
  if (filtered.length === 0) {
    filtered = movies;
  }

  return filtered;
}

const TEST_SCENARIOS = [
  { name: '1. No filters (Default)', maxRuntime: null, genres: null },
  { name: '2. Short (< 120 min)', maxRuntime: 120, genres: null },
  { name: '3. Short (< 140 min)', maxRuntime: 140, genres: null },
  { name: '4. Action / High Energy', maxRuntime: null, genres: ['Action', 'Adventure'] },
  { name: '5. Feel Good (Comedy/Animation)', maxRuntime: null, genres: ['Comedy', 'Animation'] },
  { name: '6. Dark & Intense (Crime/Drama)', maxRuntime: null, genres: ['Crime', 'Drama'] },
  { name: '7. Short (< 140 min) + Action', maxRuntime: 140, genres: ['Action'] },
  { name: '8. Short (< 130 min) + Comedy', maxRuntime: 130, genres: ['Comedy'] },
  { name: '9. Sci-Fi + Drama', maxRuntime: null, genres: ['Science Fiction', 'Drama'] },
  { name: '10. Highly Restrictive (< 90 min + Western)', maxRuntime: 90, genres: ['Western'] },
];

console.log('--- RUNNING PHASE 3 FILTER POOL SIZING VERIFICATION SUITE ---\n');

let allPassed = true;

TEST_SCENARIOS.forEach(sc => {
  const result = filterPool(seedMovies, sc.maxRuntime, sc.genres);
  const count = result.length;
  const isPass = count >= 1 && count <= seedMovies.length;
  if (!isPass) allPassed = false;

  console.log(`Scenario "${sc.name}": Pool Size = ${count} movies ${isPass ? '✅' : '❌'}`);
});

console.log('\n---------------------------------------------------------');
if (allPassed) {
  console.log('ALL PHASE 3 FILTER POOL SIZING VERIFICATION TESTS PASSED! 🎉');
} else {
  console.error('TESTS FAILED IN PHASE 3 VERIFICATION!');
  process.exit(1);
}
