
import React, { useState, useEffect } from 'react';
import { getTrendingMovies, searchMovies, getExternalIds } from './services/tmdb';
import StreamPlayer from './components/StreamPlayer';
import DorkGenerator from './components/DorkGenerator';
import ManualDownload from './components/ManualDownload';
import ContinueWatchingRow from './components/ContinueWatchingRow';
import BottomNavigation from './components/BottomNavigation';
import ProfileView from './components/ProfileView';
import AddonsView from './components/AddonsView';
import { Movie } from './types';

// --- CONFIGURATION ---
const IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

const App: React.FC = () => {
  // Data State
  const [trending, setTrending] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [showAddons, setShowAddons] = useState(false);
  
  // Player State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const movies = await getTrendingMovies();
      // Enhance movies with badges needed for the UI
      const enhancedMovies = movies.filter(m => m.poster_path).map(m => ({
        ...m,
        badge: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'HDTC V2' : 'S01E04') : (Math.random() > 0.7 ? '4K' : undefined),
        progress: Math.floor(Math.random() * 80) + 10
      }));
      
      setTrending(enhancedMovies);
      setContinueWatching(enhancedMovies.slice(0, 5)); 
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const movies = await searchMovies(query);
      const enhancedMovies = movies.filter(m => m.poster_path).map(m => ({
        ...m,
        badge: 'HD'
      }));
      setSearchResults(enhancedMovies);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleMovieSelect = async (movie: Movie) => {
    setSelectedMovie(movie);
    try {
      const imdbId = await getExternalIds(movie.id);
      if (imdbId) {
        setSelectedMovie(prev => (prev && prev.id === movie.id) ? { ...prev, imdb_id: imdbId } : prev);
      }
    } catch (e) { console.error(e); }
  };

  // --- VIEWS ---

  const renderHome = () => (
    <div className="pb-20 pt-4 animate-in fade-in">
      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative bg-[#15161b] rounded-lg h-12 flex items-center px-4 border border-gray-800">
          <i className="fas fa-search text-gray-500 mr-3"></i>
          <input 
            type="text" 
            placeholder="Search movies, shows..." 
            className="bg-transparent border-none text-white text-sm w-full focus:outline-none placeholder-gray-600"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Continue Watching */}
      {!searchQuery && (
        <ContinueWatchingRow 
          movies={continueWatching} 
          onPlay={handleMovieSelect} 
        />
      )}

      {/* Popular Channels */}
      {!searchQuery && (
        <div className="px-4 mb-8">
           <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Popular Channels</h2>
           <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1b20] border border-gray-800 flex items-center justify-center shadow-lg">
                      <img src="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png" className="w-8 h-8 object-contain" alt="Netflix" />
                  </div>
                  <span className="text-[10px] text-gray-400">Netflix</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1b20] border border-gray-800 flex items-center justify-center shadow-lg">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/1200px-Amazon_Prime_Video_logo.svg.png" className="w-8 h-8 object-contain" alt="Amazon" />
                  </div>
                  <span className="text-[10px] text-gray-400">Amazon</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1b20] border border-gray-800 flex items-center justify-center shadow-lg">
                      <i className="fab fa-apple text-white text-2xl"></i>
                  </div>
                  <span className="text-[10px] text-gray-400">Apple TV</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1b20] border border-gray-800 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-white text-lg">HBO</span>
                  </div>
                  <span className="text-[10px] text-gray-400">HBO Max</span>
              </div>
           </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-200">
            {searchQuery ? 'Search Results' : 'Recently Added Movies'}
          </h2>
          {!searchQuery && <span className="text-xs text-gray-500">By Our Editors</span>}
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="loader"></div></div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {(searchQuery ? searchResults : trending).map((movie) => (
              <div 
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                className="relative aspect-[2/3] bg-[#15161b] rounded-lg overflow-hidden"
              >
                <img 
                  src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300'} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Badge - Top Left */}
                {movie.badge && (
                  <div className="absolute top-0 left-0 bg-[#e50914] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br shadow-md">
                    {movie.badge}
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-2 pt-6">
                  <p className="text-[10px] text-gray-300 truncate text-center">{movie.title}</p>
                  <p className="text-[9px] text-gray-500 text-center">{movie.release_date?.split('-')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDiscover = () => (
    <div className="pt-8 pb-24 px-4">
      <DorkGenerator />
    </div>
  );

  const renderFiles = () => (
    <div className="pt-8 pb-24 px-4">
       <h2 className="text-xl font-bold text-white mb-6">File Manager</h2>
       <ManualDownload />
    </div>
  );

  // --- RENDER ---

  if (showAddons) {
    return <AddonsView onBack={() => setShowAddons(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* View Switcher */}
      {activeTab === 'home' && renderHome()}
      {activeTab === 'discover' && renderDiscover()}
      {activeTab === 'files' && renderFiles()}
      {activeTab === 'profile' && <ProfileView onOpenAddons={() => setShowAddons(true)} />}

      {/* Video Player Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-200 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-[#15161b] border-b border-gray-800 z-10">
             <div className="flex flex-col">
                <span className="text-white font-bold text-sm truncate max-w-[250px]">{selectedMovie.title}</span>
                <span className="text-[10px] text-gray-500">Watching {selectedMovie.title}</span>
             </div>
             <button 
               onClick={() => setSelectedMovie(null)} 
               className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-red-600 transition"
             >
               <i className="fas fa-times"></i>
             </button>
          </div>
          
          <div className="flex-1 bg-black overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-6">
               <StreamPlayer movie={selectedMovie} />

               <div className="p-4 bg-[#15161b] rounded-lg border border-gray-800">
                  <h3 className="text-xs font-bold text-gray-400 mb-2">DESCRIPTION</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedMovie.overview}
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
