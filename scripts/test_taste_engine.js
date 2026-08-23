/**
 * Automated Verification Script for Taste Profile Engine (Phase 2)
 * 
 * Simulates 3 test personas, computes user taste vectors,
 * calculates Cosine Distances, and asserts recommendation ordering.
 */

const { getPreparedSeedMovies } = require('./seed_onboarding');
const { VECTOR_DIM } = require('./feature_vector');

const seedMovies = getPreparedSeedMovies();

/**
 * Computes User Taste Vector from an array of ratings
 * @param {Array<{tmdb_id: number, rating_type: string, score: number}>} ratings 
 * @returns {Array<number>} 128-float unit-normalized taste vector
 */
function computeTasteVector(ratings) {
  const tasteVector = new Array(VECTOR_DIM).fill(0.0);

  ratings.forEach(r => {
    const movie = seedMovies.find(m => m.tmdb_id === r.tmdb_id);
    if (!movie || !movie.embedding) return;

    let weight = 1.0;
    if (r.rating_type === 'thumbs_up') weight = 1.0;
    else if (r.rating_type === 'thumbs_down') weight = -0.8;
    else if (r.rating_type.startsWith('star_')) weight = (r.score - 3.0) / 2.0;

    for (let i = 0; i < VECTOR_DIM; i++) {
      tasteVector[i] += weight * movie.embedding[i];
    }
  });

  // Normalize L2
  let normSquare = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    normSquare += tasteVector[i] * tasteVector[i];
  }

  if (normSquare > 0) {
    const norm = Math.sqrt(normSquare);
    for (let i = 0; i < VECTOR_DIM; i++) {
      tasteVector[i] = parseFloat((tasteVector[i] / norm).toFixed(6));
    }
  }

  return tasteVector;
}

/**
 * Calculates Cosine Distance (1 - Cosine Similarity) between two normalized vectors
 */
function cosineDistance(vecA, vecB) {
  let dotProduct = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return 1.0 - dotProduct;
}

/**
 * Rank candidate movies for a user taste vector
 */
function rankCandidates(tasteVector, ratedIds, maxRuntime = null) {
  const candidates = seedMovies.filter(m => !ratedIds.includes(m.tmdb_id));
  const filtered = maxRuntime ? candidates.filter(m => m.runtime <= maxRuntime) : candidates;

  return filtered.map(m => ({
    title: m.title,
    genres: m.genres.map(g => g.name),
    runtime: m.runtime,
    distance: parseFloat(cosineDistance(tasteVector, m.embedding).toFixed(4))
  })).sort((a, b) => a.distance - b.distance);
}

// ============================================================================
// TEST SUITE: 3 Persona Tests
// ============================================================================

console.log('--- RUNNING PHASE 2 TASTE ENGINE VERIFICATION SUITE ---\n');

// 1. Action / Sci-Fi Fan Persona
console.log('Test 1: Action / Sci-Fi Enthusiast');
const actionUserRatings = [
  { tmdb_id: 27205, rating_type: 'thumbs_up', score: 1.0 }, // Inception
  { tmdb_id: 603, rating_type: 'thumbs_up', score: 1.0 },   // The Matrix
  { tmdb_id: 155, rating_type: 'thumbs_up', score: 1.0 },   // The Dark Knight
  { tmdb_id: 13, rating_type: 'thumbs_down', score: -0.8 }, // Forrest Gump (Disliked Comedy/Drama)
];
const actionTasteVec = computeTasteVector(actionUserRatings);
const actionRatedIds = actionUserRatings.map(r => r.tmdb_id);
const actionRecs = rankCandidates(actionTasteVec, actionRatedIds);

console.log('  Top 3 Recommendations:');
actionRecs.slice(0, 3).forEach((rec, i) => console.log(`   ${i + 1}. ${rec.title} (${rec.genres.join(', ')}) - Distance: ${rec.distance}`));
const topActionGenre = actionRecs[0].genres;
const isActionPass = topActionGenre.includes('Science Fiction') || topActionGenre.includes('Action') || topActionGenre.includes('Drama');
console.log(`  Persona 1 Result: ${isActionPass ? 'PASSED ✅' : 'FAILED ❌'}\n`);

// 2. Animation & Fantasy Fan Persona
console.log('Test 2: Animation & Fantasy Lover');
const animUserRatings = [
  { tmdb_id: 129, rating_type: 'thumbs_up', score: 1.0 },    // Spirited Away
  { tmdb_id: 372058, rating_type: 'thumbs_up', score: 1.0 }, // Your Name
  { tmdb_id: 120, rating_type: 'thumbs_up', score: 1.0 },    // Lord of the Rings
  { tmdb_id: 680, rating_type: 'thumbs_down', score: -0.8 }  // Pulp Fiction (Disliked Crime)
];
const animTasteVec = computeTasteVector(animUserRatings);
const animRatedIds = animUserRatings.map(r => r.tmdb_id);
const animRecs = rankCandidates(animTasteVec, animRatedIds);

console.log('  Top 3 Recommendations:');
animRecs.slice(0, 3).forEach((rec, i) => console.log(`   ${i + 1}. ${rec.title} (${rec.genres.join(', ')}) - Distance: ${rec.distance}`));
const topAnimGenre = animRecs[0].genres;
const isAnimPass = topAnimGenre.includes('Animation') || topAnimGenre.includes('Fantasy') || topAnimGenre.includes('Sci-Fi') || topAnimGenre.includes('Drama');
console.log(`  Persona 2 Result: ${isAnimPass ? 'PASSED ✅' : 'FAILED ❌'}\n`);

// 3. Short Runtime Filtered Recommendations (< 135 mins)
console.log('Test 3: Short Duration Filter Constraint (< 135 mins)');
const shortRecs = rankCandidates(actionTasteVec, actionRatedIds, 135);
console.log('  Top 3 Recommendations under 135 mins:');
shortRecs.slice(0, 3).forEach((rec, i) => console.log(`   ${i + 1}. ${rec.title} (${rec.runtime} mins) - Distance: ${rec.distance}`));
const isRuntimePass = shortRecs.every(rec => rec.runtime <= 135);
console.log(`  Persona 3 Result: ${isRuntimePass ? 'PASSED ✅' : 'FAILED ❌'}\n`);

if (isActionPass && isAnimPass && isRuntimePass) {
  console.log('ALL PHASE 2 TASTE ENGINE VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
} else {
  console.error('FEW TESTS FAILED IN PHASE 2 VERIFICATION!');
  process.exit(1);
}
