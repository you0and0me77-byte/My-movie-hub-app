import React, { useState } from 'react';

interface DorkGeneratorProps {
  defaultMovie?: string;
}

const DorkGenerator: React.FC<DorkGeneratorProps> = ({ defaultMovie = '' }) => {
  const [movieName, setMovieName] = useState(defaultMovie);

  // Function: Bina kisi server ke Direct Download Links dhoondo
  const generateSmartLinks = (movie: string) => {
    const query = encodeURIComponent(movie);
    
    // Logic 1: Open Directories (Jahan files exposed hoti hain)
    const serverLink = `https://www.google.com/search?q=intitle:"index of" "${query}" (mp4|mkv|avi) -html -htm -jsp -php`;
    
    // Logic 2: Google Drive Public Files
    const driveLink = `https://www.google.com/search?q=site:drive.google.com "${query}"`;
    
    // Logic 3: Specific Hindi Sites (Vega/Katmovie style)
    const hindiSiteLink = `https://www.google.com/search?q=site:vegamovies.rs OR site:mp4moviez.ing "${query}"`;
    
    return { serverLink, driveLink, hindiSiteLink };
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const links = generateSmartLinks(movieName);

  return (
    <div className="animate-in fade-in">
      <h1 className="text-xl font-bold text-white mb-6">Discover Links</h1>

      <div className="bg-[#1a1b20] p-5 rounded-xl border border-gray-800 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
            <div className="bg-red-500/10 p-2 rounded-full">
              <i className="fas fa-search text-red-500"></i>
            </div>
            <h2 className="font-bold text-white">Dork Link Generator</h2>
        </div>
        
        <p className="text-xs text-gray-400 mb-4">
            India mein download websites block hain? Type movie name below for smart Google Links that bypass ISP blocks.
        </p>

        <input 
            type="text" 
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Type Movie Name (e.g. Jawan, Leo)..." 
            className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded-lg mb-4 focus:border-red-500 outline-none focus:ring-1 focus:ring-red-500 transition"
        />

        {movieName.length > 2 ? (
            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                 <button 
                    onClick={() => openLink(links.serverLink)}
                    className="w-full bg-[#222] p-3 rounded mb-2 cursor-pointer border border-gray-700 hover:border-red-500 flex justify-between items-center transition group"
                >
                    <span className="text-sm font-bold text-white">Index of / Server (Direct)</span>
                    <i className="fas fa-external-link-alt text-xs text-gray-500 group-hover:text-red-500"></i>
                </button>
                <button 
                    onClick={() => openLink(links.driveLink)}
                    className="w-full bg-[#222] p-3 rounded mb-2 cursor-pointer border border-gray-700 hover:border-blue-500 flex justify-between items-center transition group"
                >
                    <span className="text-sm font-bold text-white">Google Drive Public</span>
                    <i className="fab fa-google-drive text-xs text-gray-500 group-hover:text-blue-500"></i>
                </button>
                <button 
                    onClick={() => openLink(links.hindiSiteLink)}
                    className="w-full bg-[#222] p-3 rounded mb-2 cursor-pointer border border-gray-700 hover:border-green-500 flex justify-between items-center transition group"
                >
                    <span className="text-sm font-bold text-white">Vega/Hindi Sites</span>
                    <i className="fas fa-film text-xs text-gray-500 group-hover:text-green-500"></i>
                </button>
            </div>
        ) : (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 min-h-[150px]">
                <i className="fas fa-keyboard text-gray-600 text-2xl"></i>
                <p className="text-gray-500 text-xs">Type a movie name above to generate download dorks.</p>
            </div>
        )}
      </div>

      <div className="mt-4 flex gap-3 bg-yellow-900/10 p-3 rounded-lg border border-yellow-900/30">
        <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
        <p className="text-[10px] text-gray-400">
            <span className="text-yellow-500 font-bold">Tip:</span> Agar block page aaye toh Google Search results se direct result pick karein, wahan proxy usually kaam karta hai.
        </p>
      </div>
    </div>
  );
};

export default DorkGenerator;