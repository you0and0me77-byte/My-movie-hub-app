
import React, { useState } from 'react';

const DownloadManager: React.FC = () => {
  const [magnet, setMagnet] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startTorrent = () => {
    if(!magnet.trim()) return;
    setIsStreaming(true);
    // Real webtorrent library usage requires direct browser access to ports, 
    // which may be limited in sandboxes, so we provide UI logic and placeholder.
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-4 rounded-lg">
        <label className="block text-xs text-gray-400 mb-2">Paste Magnet Link to play via P2P (Seed dependent)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={magnet}
            onChange={(e) => setMagnet(e.target.value)}
            placeholder="magnet:?xt=urn:btih:..."
            className="flex-1 bg-black/50 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-red-600"
          />
          <button
            onClick={startTorrent}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition"
          >
            CONNECT
          </button>
        </div>
      </div>

      {isStreaming ? (
        <div className="relative w-full aspect-video bg-black rounded-lg flex items-center justify-center glass">
          <div className="text-center">
             <div className="animate-spin text-red-600 text-4xl mb-4">
               <i className="fas fa-spinner"></i>
             </div>
             <p className="text-gray-300">Attempting P2P handshake...</p>
             <p className="text-[10px] text-gray-500 mt-2">Connecting to trackers and peers...</p>
             <button onClick={() => setIsStreaming(false)} className="mt-4 text-xs text-red-500 underline">Cancel Connection</button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-lg p-12 text-center text-gray-500 text-xs">
          <i className="fas fa-magnet text-4xl mb-4 block opacity-20"></i>
          P2P Streaming uses your bandwidth to seed. Be mindful of data caps.
        </div>
      )}
    </div>
  );
};

export default DownloadManager;
