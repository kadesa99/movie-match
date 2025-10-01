import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Genre-IDs, die ausgeschlossen werden sollen:
// Drama (18), Horror (27), Liebesfilm (10749), Doku (99), 
// News (10763), Soap (10766), Talk (10767), War & Politics (10768)
const excludedGenres = '18,27,10749,99,10763,10766,10767,10768';

export const fetchPopularMovies = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      language: 'de-DE',
      page,
      sort_by: 'popularity.desc',
      'vote_average.gte': 6,
      'primary_release_date.gte': '1980-01-01',
      with_watch_monetization_types: 'flatrate',
      without_genres: excludedGenres,
    },
  });
  return response.data.results;
};

export const fetchPopularSeries = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/discover/tv`, {
    params: {
      api_key: API_KEY,
      language: 'de-DE',
      page,
      sort_by: 'popularity.desc',
      'vote_average.gte': 6,
      'first_air_date.gte': '1980-01-01',
      with_watch_monetization_types: 'flatrate',
      without_genres: excludedGenres,
    },
  });
  return response.data.results;
};
