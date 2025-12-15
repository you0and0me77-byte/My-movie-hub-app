
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  overview: string;
  imdb_id?: string;
  vote_average?: number;
  // UI Specific fields
  badge?: string;
  quality?: string;
  progress?: number; // 0-100
}

export enum PlayerTab {
  STREAM = 'stream',
  DOWNLOAD = 'download',
  SEARCH_GROUNDING = 'search_grounding',
  MANUAL_LINK = 'manual_link',
  DORK_GENERATOR = 'dork_generator'
}

export interface GroundingSource {
  title: string;
  uri: string;
}
