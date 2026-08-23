export interface Movie {
  tmdb_id: number;
  title: string;
  poster_path: string;
  release_date: string;
  runtime: number; // in minutes
  genres: string[];
  vote_average: number;
  overview: string;
}

export const COLD_START_MOVIES: Movie[] = [
  {
    tmdb_id: 27205,
    title: 'Inception',
    poster_path: '/oYuLEW9SpB15k12C21Bf2RtfU4b.jpg',
    release_date: '2010',
    runtime: 148,
    genres: ['Action', 'Sci-Fi'],
    vote_average: 8.4,
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets.'
  },
  {
    tmdb_id: 157336,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    release_date: '2014',
    runtime: 169,
    genres: ['Sci-Fi', 'Drama'],
    vote_average: 8.4,
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
  },
  {
    tmdb_id: 550,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    release_date: '1999',
    runtime: 139,
    genres: ['Drama', 'Thriller'],
    vote_average: 8.4,
    overview: 'A tick-tock clock, insomnia, and an enigmatic soap salesman.'
  },
  {
    tmdb_id: 680,
    title: 'Pulp Fiction',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    release_date: '1994',
    runtime: 154,
    genres: ['Crime', 'Thriller'],
    vote_average: 8.5,
    overview: 'A burger-loving hitman, his philosophical partner, a drug-addled gangster\'s moll.'
  },
  {
    tmdb_id: 13,
    title: 'Forrest Gump',
    poster_path: '/arw2vcBveWOVZr6pxd9Liyvu0Te.jpg',
    release_date: '1994',
    runtime: 142,
    genres: ['Comedy', 'Drama'],
    vote_average: 8.5,
    overview: 'The history of the United States through the perspective of an Alabama man.'
  },
  {
    tmdb_id: 603,
    title: 'The Matrix',
    poster_path: '/f89U3w9RAxWphLCuOXviTVFLyM0.jpg',
    release_date: '1999',
    runtime: 136,
    genres: ['Action', 'Sci-Fi'],
    vote_average: 8.2,
    overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality.'
  },
  {
    tmdb_id: 155,
    title: 'The Dark Knight',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    release_date: '2008',
    runtime: 152,
    genres: ['Action', 'Crime'],
    vote_average: 8.5,
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.'
  },
  {
    tmdb_id: 129,
    title: 'Spirited Away',
    poster_path: '/39wmItEikcA5jZ4xYvL7t9Dkvsq.jpg',
    release_date: '2001',
    runtime: 125,
    genres: ['Animation', 'Fantasy'],
    vote_average: 8.5,
    overview: 'A young girl wanders into a world ruled by gods, witches, and spirits.'
  },
  {
    tmdb_id: 496243,
    title: 'Parasite',
    poster_path: '/7IiT9Z8AChwLH2zSDsKJ6A3m9m.jpg',
    release_date: '2019',
    runtime: 132,
    genres: ['Comedy', 'Thriller'],
    vote_average: 8.5,
    overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship.'
  },
  {
    tmdb_id: 120,
    title: 'The Lord of the Rings',
    poster_path: '/6oom5WYQwhNvMf52y1vWhBBWLEE.jpg',
    release_date: '2001',
    runtime: 178,
    genres: ['Adventure', 'Fantasy'],
    vote_average: 8.4,
    overview: 'A meek Hobbit from the Shire and eight companions set out on a journey.'
  }
];

export const MOCK_SWIPE_CANDIDATES: Movie[] = [
  {
    tmdb_id: 372058,
    title: 'Your Name',
    poster_path: '/q719jXXEzOoYaps6babgKnONONX.jpg',
    release_date: '2016',
    runtime: 106,
    genres: ['Animation', 'Romance'],
    vote_average: 8.5,
    overview: 'Two strangers find themselves linked in a bizarre way.'
  },
  {
    tmdb_id: 19995,
    title: 'Avatar',
    poster_path: '/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
    release_date: '2009',
    runtime: 162,
    genres: ['Action', 'Sci-Fi'],
    vote_average: 7.6,
    overview: 'A paraplegic Marine dispatched to the moon Pandora.'
  },
  {
    tmdb_id: 429617,
    title: 'Spider-Man: Far From Home',
    poster_path: '/4D0Pp2jiRjh6OiwhqFJzp8GsuUd.jpg',
    release_date: '2019',
    runtime: 129,
    genres: ['Action', 'Adventure'],
    vote_average: 7.4,
    overview: 'Peter Parker and his friends go on a European vacation.'
  },
  {
    tmdb_id: 299536,
    title: 'Avengers: Infinity War',
    poster_path: '/7WsyChLLEzFiDOVTGfaWtmjFUp5.jpg',
    release_date: '2018',
    runtime: 149,
    genres: ['Action', 'Sci-Fi'],
    vote_average: 8.3,
    overview: 'The Avengers and their allies must be willing to sacrifice all.'
  }
];
