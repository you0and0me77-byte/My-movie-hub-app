import React from 'react';

interface ProfileViewProps {
  onOpenAddons: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onOpenAddons }) => {
  const gridItems = [
    { icon: 'fa-list', label: 'Watchlist', color: 'bg-gray-800' },
    { icon: 'fa-history', label: 'History', color: 'bg-gray-800' },
    { icon: 'fa-puzzle-piece', label: 'Addons', color: 'bg-gray-800', action: onOpenAddons },
    { icon: 'fa-sync', label: 'Update', color: 'bg-gray-800' },
  ];

  const settingsItems = [
    { 
      title: 'Content Source', 
      subtitle: 'Panel Mode (From Server)', 
      icon: 'fa-cog', 
      iconColor: 'bg-orange-500', 
      toggle: true, 
      checked: true 
    },
    { 
      title: 'Allow Notifications', 
      subtitle: 'Receive Notifications About The...', 
      icon: 'fa-bell', 
      iconColor: 'bg-yellow-500', 
      toggle: true, 
      checked: false 
    },
    { 
      title: 'Use HG for Ad-free experience', 
      subtitle: '', 
      icon: 'fa-times', 
      iconColor: 'bg-red-900 text-red-200', 
      toggle: true, 
      checked: true 
    },
    { 
      title: 'Customise Subtitles', 
      subtitle: 'Change Subtitles Font, Color, Siz...', 
      icon: 'fa-closed-captioning', 
      iconColor: 'bg-teal-600', 
      toggle: false 
    },
    { 
      title: 'Support Mail', 
      subtitle: 'contactdooflix@gmail.com', 
      icon: 'fa-envelope', 
      iconColor: 'bg-purple-900', 
      toggle: false 
    },
    { 
      title: 'Website', 
      subtitle: 'Visit our website', 
      icon: 'fa-globe', 
      iconColor: 'bg-orange-700', 
      toggle: false 
    },
  ];

  return (
    <div className="p-4 pb-24">
      {/* Top Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {gridItems.map((item, idx) => (
          <button key={idx} onClick={item.action} className="flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-lg group-active:scale-95 transition`}>
              <i className={`fas ${item.icon} text-white text-lg`}></i>
            </div>
            <span className="text-xs text-gray-400 font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Settings List */}
      <div className="flex flex-col gap-4">
        {settingsItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-[#15161b] p-4 rounded-xl border border-gray-800/50">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${item.iconColor} flex items-center justify-center text-white shrink-0`}>
                <i className={`fas ${item.icon} text-sm`}></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-200">{item.title}</h4>
                {item.subtitle && <p className="text-[10px] text-gray-500">{item.subtitle}</p>}
              </div>
            </div>
            
            {item.toggle ? (
              <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  defaultChecked={item.checked} 
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  style={{ top: 0, left: item.checked ? 'auto' : 0, right: item.checked ? 0 : 'auto' }}
                />
                <label 
                  className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${item.checked ? 'bg-[#e50914]' : 'bg-gray-700'}`}
                ></label>
              </div>
            ) : (
              <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
            )}
          </div>
        ))}

        {/* Extra Bottom Buttons */}
        <div className="mt-4 border-t border-gray-800 pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-4 bg-[#15161b] p-3 rounded-xl border border-gray-800/50">
                <div className="bg-gray-800 w-8 h-8 flex items-center justify-center rounded-full text-white text-xs"><i className="fas fa-broom"></i></div>
                <div className="flex-1">
                    <div className="text-sm font-bold text-white">Clear Cache</div>
                    <div className="text-[10px] text-gray-500">246.7 MB</div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 bg-[#15161b] p-3 rounded-xl border border-gray-800/50">
                <div className="bg-gray-800 w-8 h-8 flex items-center justify-center rounded-full text-white text-xs"><i className="fas fa-info"></i></div>
                <div className="flex-1">
                    <div className="text-sm font-bold text-white">App Version</div>
                    <div className="text-[10px] text-gray-500">v9.4 (Latest)</div>
                </div>
            </div>

            <div className="p-4 text-center mt-2">
                <p className="text-[10px] text-gray-600 font-medium">TMDB License Verified • Developed by Irfan</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;