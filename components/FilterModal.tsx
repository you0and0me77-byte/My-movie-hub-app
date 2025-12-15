import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [activeCategory, setActiveCategory] = useState('Genre');
  const [selections, setSelections] = useState<any>({});

  const categories = ['Genre', 'Year', 'Sort By', 'Region', 'Quality'];
  
  const options: any = {
    'Genre': ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Adventure', 'Documentary', 'Animation'],
    'Year': ['2024', '2023', '2022', '2020-2021', '2010-2019', '2000-2009', 'Before 2000'],
    'Sort By': ['Trending Now', 'Latest Release', 'Top Rated', 'Most Watched'],
    'Region': ['International', 'United States', 'India', 'United Kingdom', 'South Korea', 'Japan'],
    'Quality': ['4K HDR', '1080p Web-DL', '720p', 'Cam/TS (New)']
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300" onClick={onClose}>
      <div 
        className="w-full md:max-w-2xl bg-[#141414] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in slide-in-from-bottom-10 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#1a1a1a]">
            <h3 className="font-bold text-lg text-white">Advanced Filters</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition">
              <i className="fas fa-times"></i>
            </button>
        </div>

        <div className="flex h-[50vh] md:h-[400px]">
            {/* Left Sidebar: Categories */}
            <div className="w-1/3 bg-[#0f0f0f] py-2 overflow-y-auto border-r border-white/5">
                {categories.map(cat => (
                    <div 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-4 text-sm cursor-pointer font-semibold transition flex justify-between items-center ${
                          activeCategory === cat 
                          ? 'bg-[#1a1a1a] text-white border-l-4 border-red-600' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        {cat}
                        {selections[cat] && <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>}
                    </div>
                ))}
            </div>

            {/* Right Panel: Options */}
            <div className="w-2/3 p-2 md:p-4 overflow-y-auto bg-[#141414]">
                <h4 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-[#141414] z-10">
                  Select {activeCategory}
                </h4>
                <div className="space-y-1">
                    {options[activeCategory].map((opt: string) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group p-3 hover:bg-white/5 rounded-lg transition">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                              selections[activeCategory] === opt ? 'border-red-600' : 'border-gray-600 group-hover:border-gray-400'
                            }`}>
                                {selections[activeCategory] === opt && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                            </div>
                            <span className={`text-sm font-medium ${selections[activeCategory] === opt ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                              {opt}
                            </span>
                            <input 
                                type="radio" 
                                name={activeCategory} 
                                className="hidden" 
                                checked={selections[activeCategory] === opt}
                                onChange={() => setSelections({...selections, [activeCategory]: opt})}
                            />
                        </label>
                    ))}
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-white/5 flex gap-3 bg-[#1a1a1a]">
            <button 
              onClick={() => { setSelections({}); }} 
              className="flex-1 py-3 text-sm font-bold text-gray-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              Reset
            </button>
            <button 
              onClick={() => { onApply(selections); onClose(); }} 
              className="flex-[2] py-3 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-lg shadow-red-900/20 transition transform hover:scale-[1.02]"
            >
              Show Results
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;