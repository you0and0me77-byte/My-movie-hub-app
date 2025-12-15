
import React, { useState, useEffect, useRef } from 'react';

// Declare WebTorrent on window since it's loaded via CDN
declare global {
  interface Window {
    WebTorrent: any;
  }
}

interface TorrentioStream {
  title: string;
  infoHash: string;
  behaviorHints?: {
    bingeGroup?: string;
  };
}

interface ManualDownloadProps {
  imdbId?: string;
}

const ManualDownload: React.FC<ManualDownloadProps> = ({ imdbId: propImdbId }) => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState(''); // Real-Debrid API Key
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isTorrentConnecting, setIsTorrentConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Torrentio State
  const [imdbId, setImdbId] = useState(propImdbId || 'tt0371746');
  const [streams, setStreams] = useState<TorrentioStream[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(false);
  
  const torrentContainerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (propImdbId) {
      setImdbId(propImdbId);
      // Auto-fetch when prop is present
      fetchTorrentioStreams(propImdbId);
    }
  }, [propImdbId]);

  useEffect(() => {
    // Initialize WebTorrent Client
    if (window.WebTorrent && !clientRef.current) {
      clientRef.current = new window.WebTorrent();
    }
    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
        clientRef.current = null;
      }
    };
  }, []);

  const handleOpenLink = () => {
    if (!url.trim()) return;
    window.open(url, '_blank');
  };

  const isVideoLink = url.match(/\.(mp4|mkv|webm|mov|avi)$|googleusercontent/i);
  const isMagnet = url.trim().startsWith('magnet:?');

  // --- UPDATED TORRENTIO LOGIC (Simple Version) ---
  const fetchTorrentioStreams = async (idOverride?: string) => {
    const targetId = idOverride || imdbId;
    if (!targetId) return;
    
    setLoadingStreams(true);
    if (!propImdbId) setStatusMessage("Searching Torrentio...");

    const requestUrl = "https://torrentio.strem.fun/stream/movie/" + targetId.trim() + ".json";

    try {
      const response = await fetch(requestUrl);
      
      if (!response.ok) {
         throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.streams) {
        setStreams(data.streams);
        if (!propImdbId) setStatusMessage(`✅ Found ${data.streams.length} streams!`);
      } else {
        setStatusMessage("⚠️ No streams found.");
        setStreams([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatusMessage("❌ Failed to fetch streams. (See Console)");
    } finally {
      setLoadingStreams(false);
    }
  };

  const selectStream = (stream: TorrentioStream) => {
    const magnetLink = `magnet:?xt=urn:btih:${stream.infoHash}&dn=${encodeURIComponent(stream.title)}`;
    setUrl(magnetLink);
    // We don't clear streams immediately so user can change selection if needed, 
    // unless they start playing.
    setStatusMessage(`Selected: ${stream.title.split('\n')[0]}`);
  };

  // --- REAL-DEBRID LOGIC ---
  const processRealDebrid = async () => {
    if (!apiKey) {
        setStatusMessage("❌ Error: Please enter your Real-Debrid API Key.");
        return;
    }
    if (!isMagnet) {
        setStatusMessage("❌ Error: Please paste a valid Magnet Link.");
        return;
    }

    setStatusMessage("🚀 Server: Processing Magnet Link...");

    try {
        const addResponse = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/addMagnet`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}` },
            body: new URLSearchParams({ 'magnet': url })
        });
        const addData = await addResponse.json();
        
        if (addData.error) throw new Error(addData.error);
        const torrentId = addData.id;

        setStatusMessage(`✅ Server: Torrent Added (ID: ${torrentId})`);

        const infoResponse = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const infoData = await infoResponse.json();

        if (infoData.status === 'downloaded') {
            const downloadLink = await getDirectLink(infoData.links[0]);
            if (downloadLink) {
                setStatusMessage("🎉 SUCCESS: High Speed Link Generated!");
                window.open(downloadLink, '_blank');
            }
        } else {
            await fetch(`https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}` },
                body: new URLSearchParams({ 'files': 'all' })
            });
            setStatusMessage("⏳ Server: File downloading... Please wait or try cached link.");
        }

    } catch (error: any) {
        console.error("❌ Server Error:", error);
        setStatusMessage(`❌ Server Error: ${error.message || 'Unknown error'}`);
    }
  };

  const getDirectLink = async (restrictedLink: string) => {
    try {
        const unrestrictResponse = await fetch(`https://api.real-debrid.com/rest/1.0/unrestrict/link`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}` },
            body: new URLSearchParams({ 'link': restrictedLink })
        });
        const data = await unrestrictResponse.json();
        return data.download;
    } catch (error) {
        return null;
    }
  };

  // --- WEBTORRENT LOGIC ---
  const startWebTorrent = () => {
    if (!clientRef.current) return;
    
    setIsTorrentConnecting(true);
    setIsPreviewing(true);
    setStatusMessage("Connecting to P2P Network...");

    clientRef.current.add(url.trim(), (torrent: any) => {
      setStatusMessage(`Fetching Metadata... Peers: ${torrent.numPeers}`);
      
      const interval = setInterval(() => {
        if(!torrent.destroyed) {
          setStatusMessage(`Downloading... Peers: ${torrent.numPeers} | Speed: ${(torrent.downloadSpeed / 1024 / 1024).toFixed(2)} MB/s`);
        }
      }, 1000);

      const file = torrent.files.find((f: any) => 
        f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm')
      );

      if (file) {
        setStatusMessage(`Playing: ${file.name}`);
        file.renderTo(torrentContainerRef.current, { autoplay: true, controls: true });
      } else {
        setStatusMessage("No playable video file found in torrent.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <i className="fas fa-bolt text-yellow-500"></i>
          Select Stream Quality
        </h3>
        
        {/* Torrentio Search Logic */}
        <div className="mb-4">
          {/* Only show input if NO prop ID provided */}
          {!propImdbId && (
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Enter IMDb ID (e.g. tt1234567)"
                value={imdbId}
                onChange={(e) => setImdbId(e.target.value)}
                className="flex-1 bg-black/30 border border-gray-700 text-white px-3 py-2 rounded text-sm focus:border-green-500 outline-none"
              />
              <button 
                onClick={() => fetchTorrentioStreams()}
                disabled={loadingStreams}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 disabled:opacity-50"
              >
                {loadingStreams ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
              </button>
            </div>
          )}
          
          {loadingStreams && (
            <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center">
                    <i className="fas fa-circle-notch fa-spin text-red-500 text-2xl mb-2"></i>
                    <p className="text-xs text-gray-500">Searching networks...</p>
                </div>
            </div>
          )}
          
          {!loadingStreams && streams.length === 0 && propImdbId && (
              <p className="text-xs text-gray-500 text-center py-2">No P2P streams found for this title.</p>
          )}
          
          {streams.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide font-bold">Available Streams ({streams.length})</p>
              {streams.map((stream, idx) => (
                <div 
                  key={idx} 
                  onClick={() => selectStream(stream)}
                  className={`p-3 rounded cursor-pointer border flex justify-between items-center group transition ${
                    url.includes(stream.infoHash) 
                        ? 'bg-red-900/20 border-red-500' 
                        : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                  }`}
                >
                  <div className="flex flex-col w-3/4">
                      <span className="text-xs text-white truncate font-medium">{stream.title.split('\n')[0]}</span>
                      <span className="text-[10px] text-gray-500 truncate">{stream.title.split('\n')[1] || stream.behaviorHints?.bingeGroup || 'P2P Source'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded transition ${
                       url.includes(stream.infoHash) ? 'bg-red-600 text-white' : 'bg-black/40 text-gray-400 group-hover:bg-white group-hover:text-black'
                  }`}>
                      {url.includes(stream.infoHash) ? 'Selected' : 'Play'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* URL Input (Hidden mostly, acts as state holder) */}
        {!propImdbId && (
            <div className="flex gap-2 mb-4">
            <input
                type="text"
                value={url}
                onChange={(e) => {
                setUrl(e.target.value);
                setIsPreviewing(false);
                setIsTorrentConnecting(false);
                setStatusMessage('');
                if (clientRef.current && clientRef.current.torrents.length > 0) {
                    clientRef.current.torrents.forEach((t: any) => t.destroy());
                }
                }}
                placeholder="Magnet Link"
                className="flex-1 bg-black/50 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-red-600 transition"
            />
            </div>
        )}

        {/* Real-Debrid API Key Input */}
        {isMagnet && (
            <div className="mb-4 animate-in slide-in-from-top-2">
                <div className="relative">
                    <i className="fas fa-key absolute left-3 top-3.5 text-gray-500 text-xs"></i>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter Real-Debrid API Key (Optional for Speed)"
                        className="w-full bg-[#111] border border-gray-800 text-white pl-8 pr-4 py-2 rounded text-xs focus:outline-none focus:border-green-600"
                    />
                </div>
            </div>
        )}

        {/* Action Buttons - Visible when URL is set */}
        {url && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 animate-in slide-in-from-bottom-2">
            <button
                onClick={handleOpenLink}
                className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
            >
                <i className="fas fa-external-link-alt"></i> External Player
            </button>
            
            {isMagnet && apiKey ? (
                <button
                    onClick={processRealDebrid}
                    className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white py-3 rounded-lg font-bold text-sm transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                >
                    <i className="fas fa-bolt"></i> Instant Download (RD)
                </button>
            ) : isMagnet ? (
                <button
                    onClick={startWebTorrent}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-sm transition shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                >
                    <i className="fas fa-play"></i> Stream P2P Now
                </button>
            ) : null}
            </div>
        )}

        {/* Status Console */}
        {statusMessage && (
            <div className="bg-black/40 border border-gray-800 p-3 rounded mb-4 font-mono text-xs text-green-400">
                <span className="animate-pulse">_</span> {statusMessage}
            </div>
        )}

        {/* Video Player Area */}
        {isPreviewing && (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 animate-in fade-in zoom-in duration-300">
            {isTorrentConnecting ? (
               <div ref={torrentContainerRef} className="w-full h-full"></div>
            ) : (
                <video 
                    src={url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                    onError={() => setStatusMessage("❌ Error: Could not load video. Format may not be supported.")}
                />
            )}
            <button 
                onClick={() => {
                    setIsPreviewing(false);
                    if (clientRef.current) {
                        clientRef.current.torrents.forEach((t: any) => t.destroy());
                    }
                }}
                className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition"
            >
                <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualDownload;
