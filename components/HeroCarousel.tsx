import React, { useState, useEffect } from 'react';
import { Movie } from '../types';

interface HeroCarouselProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies, onPlay, onInfo }) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (movies.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies, isHovered]);

  if (movies.length === 0) return null;

  const movie = movies[index];
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

  return (
    <div 
      className="relative w-full h-[55vh] md:h-[80vh] overflow-hidden group mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform scale-105"
        style={{ backgroundImage: `url('${backdropUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/60 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full md:w-2/3 flex flex-col gap-3 md:gap-4 z-20">
        <div className="flex items-center gap-2 animate-in slide-in-from-left-4 duration-500 fade-in">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                #{index + 1} Trending
            </span>
            {movie.badge && (
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {movie.badge}
              </span>
            )}
        </div>
        
        <h1 className="text-3xl md:text-6xl font-black text-white leading-none drop-shadow-2xl animate-in slide-in-from-bottom-2 duration-700 fade-in">
          {movie.title}
        </h1>

        <div className="flex items-center gap-3 text-xs md:text-sm text-gray-200 font-medium animate-in slide-in-from-bottom-2 duration-1000 fade-in delay-100">
          <span className="text-green-400 font-bold">{Math.round((movie.vote_average || 7) * 10)}% Match</span>
          <span>{movie.release_date?.split('-')[0]}</span>
          <span className="border border-white/30 px-1 rounded text-[10px] bg-black/30">HD</span>
          <span className="border border-white/30 px-1 rounded text-[10px] bg-black/30">5.1</span>
        </div>

        <p className="text-gray-300 text-xs md:text-base line-clamp-2 md:line-clamp-3 max-w-xl drop-shadow-md animate-in slide-in-from-bottom-2 duration-1000 fade-in delay-200">
          {movie.overview}
        </p>

        <div className="flex items-center gap-3 mt-2 md:mt-4 animate-in slide-in-from-bottom-2 duration-1000 fade-in delay-300">
          <button 
            onClick={() => onPlay(movie)}
            className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-200 transition font-bold flex items-center gap-2"
          >
            <i className="fas fa-play"></i> Play Now
          </button>
          <button 
            onClick={() => onInfo(movie)}
            className="bg-gray-600/60 backdrop-blur-md text-white px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/60 transition font-bold flex items-center gap-2"
          >
            <i className="fas fa-info-circle"></i> More Info
          </button>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-4 md:right-12 flex gap-2 z-30">
        {movies.slice(0, 5).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-red-600' : 'w-2 bg-gray-500/50 hover:bg-gray-400'}`} 
            />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;