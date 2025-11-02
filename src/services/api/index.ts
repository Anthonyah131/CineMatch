import { apiClient } from './apiClient';

// ============================================
// TIPOS DE DATOS
// ============================================

export interface AuthResponse {
  access_token: string;
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserDto {
  displayName?: string;
  bio?: string;
  photoURL?: string;
}

export interface Favorite {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  addedAt: string;
}

export interface List {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  movies: number[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListDto {
  name: string;
  description?: string;
  isPublic: boolean;
  movies?: number[];
}

export interface UpdateListDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface Match {
  id: string;
  movieId: string;
  liked: boolean;
  mediaType: 'movie' | 'tv';
  user: User;
  createdAt: string;
}

export interface SwipeDto {
  movieId: string;
  liked: boolean;
  mediaType: 'movie' | 'tv';
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path?: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviders {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverFilters {
  with_genres?: string;
  sort_by?: string;
  page?: number;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  'release_date.gte'?: string;
  'release_date.lte'?: string;
  with_original_language?: string;
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  /**
   * Registrar nuevo usuario con firebaseToken
   */
  register: (firebaseToken: string) =>
    apiClient.post<AuthResponse>('/auth/register', { firebaseToken }),

  /**
   * Iniciar sesión con firebaseToken
   */
  login: (firebaseToken: string) =>
    apiClient.post<AuthResponse>('/auth/login', { firebaseToken }),

  /**
   * Obtener información del usuario actual
   */
  getMe: () => apiClient.get<User>('/auth/me'),
};

// ============================================
// USERS API
// ============================================

export const usersAPI = {
  /**
   * Obtener usuario por UID
   */
  getById: (uid: string) => apiClient.get<User>(`/users/${uid}`),

  /**
   * Actualizar mi perfil
   */
  updateMe: (data: UpdateUserDto) => apiClient.put<User>('/users/me', data),

  /**
   * Agregar película/serie a favoritos
   */
  addFavorite: (tmdbId: number, mediaType: 'movie' | 'tv') =>
    apiClient.post<Favorite>('/users/me/favorites', { tmdbId, mediaType }),

  /**
   * Remover película/serie de favoritos
   */
  removeFavorite: (tmdbId: number, mediaType: 'movie' | 'tv') =>
    apiClient.delete<void>(`/users/me/favorites/${tmdbId}/${mediaType}`),

  /**
   * Obtener mis favoritos
   */
  getMyFavorites: () => apiClient.get<Favorite[]>('/users/me/favorites'),

  /**
   * Seguir a un usuario
   */
  followUser: (targetUid: string) => apiClient.post<void>(`/users/follow/${targetUid}`),

  /**
   * Dejar de seguir a un usuario
   */
  unfollowUser: (targetUid: string) => apiClient.delete<void>(`/users/follow/${targetUid}`),

  /**
   * Obtener mis seguidores
   */
  getMyFollowers: () => apiClient.get<User[]>('/users/me/followers'),

  /**
   * Obtener usuarios que sigo
   */
  getMyFollowing: () => apiClient.get<User[]>('/users/me/following'),
};

// ============================================
// LISTS API
// ============================================

export const listsAPI = {
  /**
   * Crear una nueva lista
   */
  create: (data: CreateListDto) => apiClient.post<List>('/lists', data),

  /**
   * Obtener mis listas
   */
  getMyLists: () => apiClient.get<List[]>('/lists/my-lists'),

  /**
   * Obtener lista por ID
   */
  getById: (listId: string) => apiClient.get<List>(`/lists/${listId}`),

  /**
   * Actualizar una lista
   */
  update: (listId: string, data: UpdateListDto) => apiClient.put<List>(`/lists/${listId}`, data),

  /**
   * Eliminar una lista
   */
  delete: (listId: string) => apiClient.delete<void>(`/lists/${listId}`),

  /**
   * Agregar película a una lista
   */
  addMovie: (listId: string, tmdbId: number) =>
    apiClient.post<List>(`/lists/${listId}/movies`, { tmdbId }),

  /**
   * Remover película de una lista
   */
  removeMovie: (listId: string, tmdbId: number) =>
    apiClient.delete<List>(`/lists/${listId}/movies/${tmdbId}`),
};

// ============================================
// MATCHES API
// ============================================

export const matchesAPI = {
  /**
   * Dar swipe a una película/serie
   */
  swipe: (data: SwipeDto) => apiClient.post<Match>('/matches/swipe', data),

  /**
   * Obtener mis matches
   */
  getMyMatches: () => apiClient.get<Match[]>('/matches/my-matches'),

  /**
   * Verificar match mutuo con otro usuario
   */
  checkMutual: (targetUserId: string, movieId: string) =>
    apiClient.post<{ isMatch: boolean; matchedAt?: string }>(
      `/matches/check-mutual/${targetUserId}/${movieId}`,
    ),
};

// ============================================
// TMDB MOVIES API
// ============================================

export const tmdbAPI = {
  /**
   * Obtener películas populares
   */
  getPopular: (page: number = 1) =>
    apiClient.get<PaginatedResponse<Movie>>(`/tmdb/movies/popular?page=${page}`),

  /**
   * Buscar películas
   */
  search: (query: string, page: number = 1) =>
    apiClient.get<PaginatedResponse<Movie>>(
      `/tmdb/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
    ),

  /**
   * Obtener películas en tendencia
   */
  getTrending: (page: number = 1) =>
    apiClient.get<PaginatedResponse<Movie>>(`/tmdb/movies/trending?page=${page}`),

  /**
   * Obtener próximos estrenos
   */
  getUpcoming: (page: number = 1) =>
    apiClient.get<PaginatedResponse<Movie>>(`/tmdb/movies/upcoming?page=${page}`),

  /**
   * Obtener películas mejor calificadas
   */
  getTopRated: (page: number = 1) =>
    apiClient.get<PaginatedResponse<Movie>>(`/tmdb/movies/top-rated?page=${page}`),

  /**
   * Obtener detalles de una película
   */
  getMovieDetails: (movieId: number) => apiClient.get<MovieDetails>(`/tmdb/movies/${movieId}`),

  /**
   * Obtener créditos de una película (cast & crew)
   */
  getCredits: (movieId: number) => apiClient.get<Credits>(`/tmdb/movies/${movieId}/credits`),

  /**
   * Obtener proveedores de streaming para una película
   */
  getWatchProviders: (movieId: number) =>
    apiClient.get<{ results: Record<string, WatchProviders> }>(
      `/tmdb/movies/${movieId}/watch/providers`,
    ),

  /**
   * Descubrir películas con filtros personalizados
   */
  discover: (filters: DiscoverFilters) => {
    const params = new URLSearchParams(filters as any);
    return apiClient.get<PaginatedResponse<Movie>>(`/tmdb/movies/discover?${params}`);
  },

  /**
   * Obtener géneros de películas
   */
  getGenres: () => apiClient.get<{ genres: Genre[] }>('/tmdb/genres/movies'),
};

// ============================================
// TMDB TV SHOWS API
// ============================================

export const tvAPI = {
  /**
   * Obtener series populares
   */
  getPopular: (page: number = 1) =>
    apiClient.get<PaginatedResponse<TVShow>>(`/tmdb/tv/popular?page=${page}`),

  /**
   * Buscar series
   */
  search: (query: string, page: number = 1) =>
    apiClient.get<PaginatedResponse<TVShow>>(
      `/tmdb/tv/search?query=${encodeURIComponent(query)}&page=${page}`,
    ),

  /**
   * Obtener series en tendencia
   */
  getTrending: (page: number = 1) =>
    apiClient.get<PaginatedResponse<TVShow>>(`/tmdb/tv/trending?page=${page}`),

  /**
   * Obtener series mejor calificadas
   */
  getTopRated: (page: number = 1) =>
    apiClient.get<PaginatedResponse<TVShow>>(`/tmdb/tv/top-rated?page=${page}`),

  /**
   * Obtener géneros de series
   */
  getGenres: () => apiClient.get<{ genres: Genre[] }>('/tmdb/genres/tv'),
};

// ============================================
// MEDIA CACHE API
// ============================================

export const mediaCacheAPI = {
  /**
   * Buscar en el cache
   */
  search: (query: string) =>
    apiClient.get<(Movie | TVShow)[]>(`/media/cache/search?query=${encodeURIComponent(query)}`),

  /**
   * Obtener película del cache
   */
  getMovie: (tmdbId: number) => apiClient.get<Movie>(`/media/cache/${tmdbId}/movie`),

  /**
   * Obtener serie del cache
   */
  getTVShow: (tmdbId: number) => apiClient.get<TVShow>(`/media/cache/${tmdbId}/tv`),

  /**
   * Guardar película en el cache
   */
  saveMovie: (tmdbId: number) => apiClient.post<Movie>(`/media/cache/save-movie/${tmdbId}`),

  /**
   * Guardar serie en el cache
   */
  saveTVShow: (tmdbId: number) => apiClient.post<TVShow>(`/media/cache/save-tv/${tmdbId}`),
};
