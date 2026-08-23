const { generateMovieFeatureVector, VECTOR_DIM } = require('./feature_vector');

const sampleMovie = {
  title: 'Inception',
  genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
  runtime: 148,
  vote_average: 8.4,
  release_date: '2010-07-16',
  cast_members: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
  director: 'Christopher Nolan'
};

const vector = generateMovieFeatureVector(sampleMovie);

console.log(`Generated vector of length: ${vector.length}`);
console.log(`Dimension check (must be ${VECTOR_DIM}):`, vector.length === VECTOR_DIM ? 'PASS' : 'FAIL');
console.log('Sample non-zero values:', vector.filter(v => v !== 0).slice(0, 10));

// Check norm (should be ~1.0)
const normSquare = vector.reduce((acc, val) => acc + val * val, 0);
console.log(`L2 Vector Norm (expected ~1.0): ${Math.sqrt(normSquare).toFixed(4)}`);
