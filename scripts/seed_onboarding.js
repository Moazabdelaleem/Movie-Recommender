/**
 * Seed Onboarding Movies Script
 * 
 * Generates initial dataset of popular, genre-diverse movies
 * complete with pre-calculated 128-dim feature vectors.
 */

const { generateMovieFeatureVector } = require('./feature_vector');

const SEED_MOVIES = [
  {
    tmdb_id: 27205,
    title: 'Inception',
    poster_path: '/oYuLEW9SpB15k12C21Bf2RtfU4b.jpg',
    release_date: '2010-07-16',
    runtime: 148,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    cast_members: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    director: 'Christopher Nolan',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating subconscious minds.',
    vote_average: 8.4
  },
  {
    tmdb_id: 157336,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    release_date: '2014-11-05',
    runtime: 169,
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 18, name: 'Drama' }],
    cast_members: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
    overview: 'Explorers travel through a wormhole in space to ensure humanity survival.',
    vote_average: 8.4
  },
  {
    tmdb_id: 550,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    release_date: '1999-10-15',
    runtime: 139,
    genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    cast_members: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
    director: 'David Fincher',
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    vote_average: 8.4
  },
  {
    tmdb_id: 680,
    title: 'Pulp Fiction',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    release_date: '1994-09-10',
    runtime: 154,
    genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    cast_members: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman'],
    director: 'Quentin Tarantino',
    overview: 'A burger-loving hitman, his philosophical partner, and a gangster wife.',
    vote_average: 8.5
  },
  {
    tmdb_id: 13,
    title: 'Forrest Gump',
    poster_path: '/arw2vcBveWOVZr6pxd9Liyvu0Te.jpg',
    release_date: '1994-06-23',
    runtime: 142,
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
    cast_members: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    director: 'Robert Zemeckis',
    overview: 'A man with a low IQ accomplishes great things and influences history.',
    vote_average: 8.5
  },
  {
    tmdb_id: 603,
    title: 'The Matrix',
    poster_path: '/f89U3w9RAxWphLCuOXviTVFLyM0.jpg',
    release_date: '1999-03-30',
    runtime: 136,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    cast_members: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    director: 'Lana Wachowski',
    overview: 'A computer hacker learns from rebels about the true nature of his simulated reality.',
    vote_average: 8.2
  },
  {
    tmdb_id: 155,
    title: 'The Dark Knight',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    release_date: '2008-07-16',
    runtime: 152,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    cast_members: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    director: 'Christopher Nolan',
    overview: 'When the Joker wreaks havoc and chaos on Gotham City, Batman must accept the ultimate test.',
    vote_average: 8.5
  },
  {
    tmdb_id: 129,
    title: 'Spirited Away',
    poster_path: '/39wmItEikcA5jZ4xYvL7t9Dkvsq.jpg',
    release_date: '2001-07-20',
    runtime: 125,
    genres: [{ id: 16, name: 'Animation' }, { id: 14, name: 'Fantasy' }],
    cast_members: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    director: 'Hayao Miyazaki',
    overview: 'A young girl wanders into a world ruled by gods, witches, and spirits.',
    vote_average: 8.5
  },
  {
    tmdb_id: 128,
    title: 'Princess Mononoke',
    poster_path: '/cMYCDAD1zMAc8T2jmuofSTZaTz3.jpg',
    release_date: '1997-07-12',
    runtime: 134,
    genres: [{ id: 16, name: 'Animation' }, { id: 14, name: 'Fantasy' }, { id: 12, name: 'Adventure' }],
    cast_members: ['Yoji Matsuda', 'Yuriko Ishida', 'Yuko Tanaka'],
    director: 'Hayao Miyazaki',
    overview: 'Ashitaka is infected by a animal attack and seeks a cure from the Deer God.',
    vote_average: 8.5
  },
  {
    tmdb_id: 496243,
    title: 'Parasite',
    poster_path: '/7IiT9Z8AChwLH2zSDsKJ6A3m9m.jpg',
    release_date: '2019-05-30',
    runtime: 132,
    genres: [{ id: 35, name: 'Comedy' }, { id: 53, name: 'Thriller' }],
    cast_members: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    director: 'Bong Joon-ho',
    overview: 'Greed and class discrimination threaten a symbiotic relationship between two families.',
    vote_average: 8.5
  },
  {
    tmdb_id: 120,
    title: 'The Lord of the Rings',
    poster_path: '/6oom5WYQwhNvMf52y1vWhBBWLEE.jpg',
    release_date: '2001-12-18',
    runtime: 178,
    genres: [{ id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }],
    cast_members: ['Elijah Wood', 'Ian McKellen', 'Viggo Mortensen'],
    director: 'Peter Jackson',
    overview: 'A meek Hobbit and eight companions set out on a journey to destroy the One Ring.',
    vote_average: 8.4
  },
  {
    tmdb_id: 278,
    title: 'The Shawshank Redemption',
    poster_path: '/9cqN1wXHQFmvuZmygC88KnSTme.jpg',
    release_date: '1994-09-23',
    runtime: 142,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    cast_members: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    director: 'Frank Darabont',
    overview: 'Framed for murder, upstanding banker Andy Dufresne begins a new life at Shawshank prison.',
    vote_average: 8.7
  },
  {
    tmdb_id: 372058,
    title: 'Your Name',
    poster_path: '/q719jXXEzOoYaps6babgKnONONX.jpg',
    release_date: '2016-08-26',
    runtime: 106,
    genres: [{ id: 16, name: 'Animation' }, { id: 10749, name: 'Romance' }],
    cast_members: ['Ryunosuke Kamiki', 'Mone Kamishiraishi'],
    director: 'Makoto Shinkai',
    overview: 'High schoolers lead different lives until they suddenly swap bodies.',
    vote_average: 8.5
  },
  {
    tmdb_id: 244786,
    title: 'Whiplash',
    poster_path: '/7fn624j5lj3xTme2SgiLCeMYm9r.jpg',
    release_date: '2014-10-10',
    runtime: 107,
    genres: [{ id: 18, name: 'Drama' }, { id: 10402, name: 'Music' }],
    cast_members: ['Miles Teller', 'J.K. Simmons', 'Paul Reiser'],
    director: 'Damien Chazelle',
    overview: 'A promising young drummer enrolls at a cut-throat music conservatory.',
    vote_average: 8.4
  }
];

function getPreparedSeedMovies() {
  return SEED_MOVIES.map(movie => ({
    ...movie,
    embedding: generateMovieFeatureVector(movie)
  }));
}

module.exports = {
  SEED_MOVIES,
  getPreparedSeedMovies
};
