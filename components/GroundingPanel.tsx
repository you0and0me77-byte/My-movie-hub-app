
import React from 'react';
import { GroundingSource } from '../types';

interface GroundingPanelProps {
  isLoading: boolean;
  data: { text: string, sources: GroundingSource[], dorks: string[] } | null;
}

const GroundingPanel: React.FC<GroundingPanelProps> = ({ isLoading, data }) => {
  const openSearch = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="glass p-4 rounded-lg flex flex-col gap-4 min-h-[400px]">
      <div className="flex items-center gap-2 mb-2">
        <i className="fas fa-magic text-red-500"></i>
        <h3 className="font-bold text-lg">Smart Google Links Generator</h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
          <div className="loader-ring"></div>
          <p className="text-gray-400 text-sm animate-pulse">Calculating Dork queries & finding sources...</p>
          <style>{`
            .loader-ring { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #e50914; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-6">
          
          {/* AI Analysis Section */}
          <div className="bg-black/40 border border-gray-800 p-4 rounded text-sm text-gray-300 leading-relaxed whitespace-pre-wrap italic">
            <span className="text-red-500 font-bold uppercase text-[10px] block mb-2">AI Analysis</span>
            {data.text}
          </div>

          {/* Dork Search Section - The successful strategy requested */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <i className="fab fa-google text-blue-500 text-xs"></i>
              <h4 className="text-xs font-bold text-gray-400">SMART GOOGLE DORK SEARCHES (Fast Downloads)</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.dorks.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => openSearch(query)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 rounded text-left transition group flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-mono truncate max-w-[200px]">{query}</span>
                    <span className="text-[10px] text-gray-500">Search via Google Dorks</span>
                  </div>
                  <i className="fas fa-search text-[10px] text-blue-500 group-hover:scale-110 transition"></i>
                </button>
              ))}
            </div>
          </div>

          {/* Verified Sources Section */}
          {data.sources.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-link text-green-500 text-xs"></i>
                <h4 className="text-xs font-bold text-gray-400">GROUNDED WEB SOURCES</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 p-3 rounded transition group"
                  >
                    <div className="flex flex-col overflow-hidden pr-2">
                      <span className="text-white text-xs font-semibold truncate">{source.title}</span>
                      <span className="text-[10px] text-gray-500 truncate">{source.uri}</span>
                    </div>
                    <i className="fas fa-external-link-alt text-[10px] text-red-600 group-hover:translate-x-1 transition transform"></i>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-12">
          <i className="fas fa-search-location text-3xl mb-2 opacity-20"></i>
          <p className="text-xs">No research data available. Try selecting a trending movie.</p>
        </div>
      )}
    </div>
  );
};

export default GroundingPanel;
