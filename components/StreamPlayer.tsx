
import React from 'react';
import { Movie } from '../types';
import { SERVERS } from '../constants';
import ManualDownload from './ManualDownload';

interface StreamPlayerProps {
  movie: Movie;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ movie }) => {
  // Default to Server 1 (VidLink) which is index 0
  const currentUrl = SERVERS[0].getUrl(movie.id, movie.imdb_id || '');

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Embed Player (Fallback/Instant) */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden glass shadow-2xl">
        <iframe
          src={currentUrl}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          title="Video Player"
        />
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-gray-400 pointer-events-none">
           Instant Stream
        </div>
      </div>

      {/* Manual Download / P2P Selector (Main Interface now) */}
      <ManualDownload imdbId={movie.imdb_id} />
    </div>
  );
};

export default StreamPlayer;
