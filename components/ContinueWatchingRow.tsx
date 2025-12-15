import React from 'react';
import { Movie } from '../types';

interface ContinueWatchingRowProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
}

const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({ movies, onPlay }) => {
  if (movies.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-sm font-semibold text-gray-200">Continue Watching</h2>
        <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
      </div>
      
      <div className="flex overflow-x-auto gap-3 px-4 pb-2 hide-scrollbar snap-x">
        {movies.map((movie) => (
          <div key={movie.id} className="flex flex-col gap-2 flex-none w-[140px] snap-start">
            {/* Thumbnail */}
            <div 
              className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] cursor-pointer"
              onClick={() => onPlay(movie)}
            >
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450'} 
                alt={movie.title}
                className="w-full h-full object-cover opacity-80"
              />
              
              {/* Center Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                   <i className="fas fa-play text-white ml-1 text-sm"></i>
                </div>
              </div>

              {/* Progress Bar Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                <div 
                  className="h-full bg-[#e50914]" 
                  style={{ width: `${movie.progress || Math.random() * 80 + 10}%` }}
                ></div>
              </div>
            </div>
            
            {/* Action Buttons Below */}
            <div className="flex gap-2">
                <button className="flex-1 bg-[#15161b] border border-gray-700 rounded py-1 flex items-center justify-center text-gray-400">
                    <i className="fas fa-info-circle text-xs"></i>
                </button>
                <button className="flex-1 bg-[#15161b] border border-gray-700 rounded py-1 flex items-center justify-center text-gray-400">
                    <i className="fas fa-times text-xs"></i>
                </button>
            </div>
            
            <p className="text-xs text-gray-400 truncate mt-[-4px]">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatchingRow;