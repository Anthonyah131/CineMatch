/**
 * Backend URL - Configuración centralizada
 */
export const BACKEND_URL = __DEV__
  ? 'https://cine-match-backend.vercel.app' // Development
  : 'https://cine-match-backend.vercel.app'; // Production

/**
 * Configuración de la API
 */
export const API_CONFIG = {
  BASE_URL: BACKEND_URL,
  TIMEOUT: 30000, // 30 segundos
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Configuración de desarrollo
 */
export const DEV_CONFIG = {
  ENABLE_LOGS: __DEV__, // Solo logs en desarrollo
  AUTO_LOGOUT_ON_GOOGLE_SIGNIN: __DEV__, // Solo en desarrollo
};

/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',

  // Users
  USERS_BY_ID: (uid: string) => `/users/${uid}`,
  USERS_ME: '/users/me',
  USERS_FAVORITES: '/users/me/favorites',
  USERS_FAVORITE_BY_ID: (tmdbId: number, mediaType: string) =>
    `/users/me/favorites/${tmdbId}/${mediaType}`,
  USERS_FOLLOW: (targetUid: string) => `/users/follow/${targetUid}`,
  USERS_FOLLOWERS: '/users/me/followers',
  USERS_FOLLOWING: '/users/me/following',

  // Lists
  LISTS: '/lists',
  LISTS_MY: '/lists/my-lists',
  LISTS_BY_ID: (listId: string) => `/lists/${listId}`,

  // Matches
  MATCHES_SWIPE: '/matches/swipe',
  MATCHES_MY: '/matches/my-matches',
  MATCHES_CHECK_MUTUAL: (targetUserId: string, movieId: string) =>
    `/matches/check-mutual/${targetUserId}/${movieId}`,

  // TMDB Movies
  TMDB_MOVIES_POPULAR: '/tmdb/movies/popular',
  TMDB_MOVIES_SEARCH: '/tmdb/movies/search',
  TMDB_MOVIES_TRENDING: '/tmdb/movies/trending',
  TMDB_MOVIES_UPCOMING: '/tmdb/movies/upcoming',
  TMDB_MOVIES_TOP_RATED: '/tmdb/movies/top-rated',
  TMDB_MOVIES_DETAILS: (id: number) => `/tmdb/movies/${id}`,
  TMDB_MOVIES_CREDITS: (id: number) => `/tmdb/movies/${id}/credits`,
  TMDB_MOVIES_WATCH_PROVIDERS: (id: number) => `/tmdb/movies/${id}/watch/providers`,
  TMDB_MOVIES_DISCOVER: '/tmdb/movies/discover',
  TMDB_GENRES_MOVIES: '/tmdb/genres/movies',

  // TMDB TV
  TMDB_TV_POPULAR: '/tmdb/tv/popular',
  TMDB_TV_SEARCH: '/tmdb/tv/search',
  TMDB_TV_TRENDING: '/tmdb/tv/trending',
  TMDB_TV_TOP_RATED: '/tmdb/tv/top-rated',
  TMDB_GENRES_TV: '/tmdb/genres/tv',

  // Media Cache
  MEDIA_CACHE_SEARCH: '/media/cache/search',
  MEDIA_CACHE_MOVIE: (tmdbId: number) => `/media/cache/${tmdbId}/movie`,
  MEDIA_CACHE_TV: (tmdbId: number) => `/media/cache/${tmdbId}/tv`,
  MEDIA_CACHE_SAVE_MOVIE: (tmdbId: number) => `/media/cache/save-movie/${tmdbId}`,
  MEDIA_CACHE_SAVE_TV: (tmdbId: number) => `/media/cache/save-tv/${tmdbId}`,
};
