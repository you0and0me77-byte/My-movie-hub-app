
export const TMDB_API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const SERVERS = [
  { 
    id: 1, 
    name: 'SERVER 1 (BEST)', 
    getUrl: (tmdb: number, imdb: string) => `https://vidlink.pro/movie/${tmdb}?primaryColor=e50914&autoplay=false` 
  },
  { 
    id: 2, 
    name: 'SERVER 2 (FAST)', 
    getUrl: (tmdb: number, imdb: string) => `https://vidsrc.xyz/embed/movie/${tmdb}` 
  },
  { 
    id: 3, 
    name: 'SERVER 3 (OLD)', 
    getUrl: (tmdb: number, imdb: string) => `https://www.2embed.cc/embed/${tmdb}` 
  },
  { 
    id: 4, 
    name: 'SERVER 4 (BACKUP)', 
    getUrl: (tmdb: number, imdb: string) => `https://multiembed.mov/?video_id=${imdb}&tmdb_id=${tmdb}` 
  },
  { 
    id: 5, 
    name: 'SERVER 5 (HD)', 
    getUrl: (tmdb: number, imdb: string) => `https://www.nontongo.win/embed/movie/${tmdb}` 
  },
  { 
    id: 6, 
    name: 'SERVER 6 (ULTRA)', 
    getUrl: (tmdb: number, imdb: string) => `https://vidsrc.to/embed/movie/${tmdb}` 
  },
];
