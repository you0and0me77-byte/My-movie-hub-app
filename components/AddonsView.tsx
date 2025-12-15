import React, { useState } from 'react';

interface AddonsViewProps {
  onBack: () => void;
}

const AddonsView: React.FC<AddonsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'store'>('installed');

  return (
    <div className="min-h-screen bg-[#0b0c0f] pb-24 animate-in slide-in-from-right duration-300">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="text-white hover:bg-gray-800 p-2 rounded-full transition">
                 <i className="fas fa-arrow-left text-lg"></i>
            </button>
            <h1 className="text-xl font-bold text-white">Addons</h1>
        </div>

        <div className="flex border-b border-gray-800 mb-4">
            <button 
                onClick={() => setActiveTab('installed')} 
                className={`flex-1 pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'installed' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent'}`}
            >
                Installed
            </button>
            <button 
                onClick={() => setActiveTab('store')} 
                className={`flex-1 pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'store' ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent'}`}
            >
                Store
            </button>
        </div>

        {activeTab === 'installed' && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="bg-[#15161a] p-4 rounded-xl mb-3 border border-gray-800 shadow-md">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center text-green-500 font-bold">T</div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Torrentio</h3>
                            <p className="text-[10px] text-gray-500">v0.0.15 • Best Sources</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-[#1a1b20] py-2 rounded text-xs text-gray-300 border border-gray-700 hover:bg-red-900/20 hover:text-red-400 transition">UNINSTALL</button>
                        <button className="px-3 bg-[#1a1b20] rounded border border-gray-700 text-gray-400 hover:text-white transition"><i className="fas fa-cog"></i></button>
                    </div>
                </div>
                 <div className="bg-[#15161a] p-4 rounded-xl mb-3 border border-gray-800 shadow-md">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-500 font-bold">M</div>
                        <div>
                            <h3 className="font-bold text-white text-sm">MediaFusion</h3>
                            <p className="text-[10px] text-gray-500">v3.0.1 • ElfHosted</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-[#1a1b20] py-2 rounded text-xs text-gray-300 border border-gray-700 hover:bg-red-900/20 hover:text-red-400 transition">UNINSTALL</button>
                        <button className="px-3 bg-[#1a1b20] rounded border border-gray-700 text-gray-400 hover:text-white transition"><i className="fas fa-cog"></i></button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'store' && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="bg-[#15161a] p-4 rounded-xl mb-3 border border-gray-800 shadow-md">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-yellow-900/20 rounded-lg flex items-center justify-center text-yellow-500 font-bold"><i className="fas fa-skull"></i></div>
                        <div>
                            <h3 className="font-bold text-white text-sm">ThePirateBay+</h3>
                            <p className="text-[10px] text-gray-500">v1.4.0 • Public Tracker</p>
                        </div>
                    </div>
                    <button className="w-full bg-red-600 py-2 rounded text-xs text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20">INSTALL</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AddonsView;