/**
 * 🎬 TMDB Types
 * Tipos para The Movie Database API
 */

// ==================== RESPONSES PAGINADAS ====================

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ==================== PELÍCULA BASE ====================

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

// ==================== GÉNERO ====================

export interface TmdbGenre {
  id: number;
  name: string;
}

// ==================== COMPAÑÍA DE PRODUCCIÓN ====================

export interface TmdbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

// ==================== PAÍS DE PRODUCCIÓN ====================

export interface TmdbProductionCountry {
  iso_3166_1: string;
  name: string;
}

// ==================== IDIOMA ====================

export interface TmdbSpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

// ==================== VIDEO ====================

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
}

export interface TmdbVideosResponse {
  id: number;
  results: TmdbVideo[];
}

// ==================== IMAGEN ====================

export interface TmdbImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TmdbImagesResponse {
  id: number;
  backdrops: TmdbImage[];
  logos: TmdbImage[];
  posters: TmdbImage[];
}

// ==================== CAST & CREW ====================

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
  cast_id: number;
  credit_id: string;
  adult: boolean;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
  credit_id: string;
  adult: boolean;
}

export interface TmdbCreditsResponse {
  id: number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

// ==================== WATCH PROVIDERS ====================

export interface TmdbWatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TmdbCountryWatchProviders {
  link: string;
  rent?: TmdbWatchProvider[];
  buy?: TmdbWatchProvider[];
  flatrate?: TmdbWatchProvider[];
}

export interface TmdbWatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: TmdbCountryWatchProviders;
  };
}

// ==================== DETALLES DE PELÍCULA ====================

export interface TmdbMovieDetails extends Omit<TmdbMovie, 'genre_ids'> {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: TmdbGenre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: TmdbSpokenLanguage[];
  status:
    | 'Rumored'
    | 'Planned'
    | 'In Production'
    | 'Post Production'
    | 'Released'
    | 'Canceled';
  tagline: string | null;
  videos?: TmdbVideosResponse;
  images?: TmdbImagesResponse;
  credits?: TmdbCreditsResponse;
  recommendations?: TmdbPaginatedResponse<TmdbMovie>;
  similar?: TmdbPaginatedResponse<TmdbMovie>;
}

// ==================== SERIE TV BASE ====================

export interface TmdbTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  adult: boolean;
}

// ==================== DETALLES DE SERIE TV ====================

export interface TmdbTVShowDetails extends Omit<TmdbTVShow, 'genre_ids'> {
  created_by: Array<{
    id: number;
    name: string;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  genres: TmdbGenre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    still_path: string | null;
  } | null;
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    still_path: string | null;
  } | null;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
  }>;
  spoken_languages: TmdbSpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
}

// ==================== CONFIGURACIÓN ====================

export interface TmdbConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

// ==================== GÉNEROS ====================

export interface TmdbGenresResponse {
  genres: TmdbGenre[];
}

// ==================== PARÁMETROS DE BÚSQUEDA ====================

export interface TmdbSearchParams {
  query: string;
  page?: number;
  language?: string;
  include_adult?: boolean;
  region?: string;
  year?: number;
  primary_release_year?: number;
}

export interface TmdbDiscoverMovieParams {
  page?: number;
  language?: string;
  region?: string;
  sort_by?: TmdbSortBy;
  certification_country?: string;
  certification?: string;
  'certification.lte'?: string;
  'certification.gte'?: string;
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'release_date.gte'?: string;
  'release_date.lte'?: string;
  with_release_type?: number;
  year?: number;
  'vote_count.gte'?: number;
  'vote_count.lte'?: number;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
  with_companies?: string;
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;
  'with_runtime.gte'?: number;
  'with_runtime.lte'?: number;
  with_original_language?: string;
  with_watch_providers?: string;
  watch_region?: string;
  with_watch_monetization_types?: string;
}

// ==================== ORDENAMIENTO ====================

export type TmdbSortBy =
  | 'popularity.asc'
  | 'popularity.desc'
  | 'release_date.asc'
  | 'release_date.desc'
  | 'revenue.asc'
  | 'revenue.desc'
  | 'primary_release_date.asc'
  | 'primary_release_date.desc'
  | 'original_title.asc'
  | 'original_title.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'
  | 'vote_count.asc'
  | 'vote_count.desc';

// ==================== TRENDING TIME WINDOW ====================

export type TmdbTimeWindow = 'day' | 'week';

// ==================== TAMAÑOS DE IMAGEN ====================

export type TmdbImageSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'original';

export type TmdbBackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

export type TmdbProfileSize = 'w45' | 'w185' | 'h632' | 'original';

export type TmdbLogoSize =
  | 'w45'
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w300'
  | 'w500'
  | 'original';

// ==================== IDS DE GÉNEROS COMUNES ====================

export enum TmdbMovieGenreId {
  Action = 28,
  Adventure = 12,
  Animation = 16,
  Comedy = 35,
  Crime = 80,
  Documentary = 99,
  Drama = 18,
  Family = 10751,
  Fantasy = 14,
  History = 36,
  Horror = 27,
  Music = 10402,
  Mystery = 9648,
  Romance = 10749,
  ScienceFiction = 878,
  TVMovie = 10770,
  Thriller = 53,
  War = 10752,
  Western = 37,
}

export enum TmdbTVGenreId {
  ActionAdventure = 10759,
  Animation = 16,
  Comedy = 35,
  Crime = 80,
  Documentary = 99,
  Drama = 18,
  Family = 10751,
  Kids = 10762,
  Mystery = 9648,
  News = 10763,
  Reality = 10764,
  SciFiFantasy = 10765,
  Soap = 10766,
  Talk = 10767,
  WarPolitics = 10768,
  Western = 37,
}
