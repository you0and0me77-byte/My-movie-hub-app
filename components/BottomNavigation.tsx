import React from 'react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: 'fa-home', label: 'Home' },
    { id: 'discover', icon: 'fa-compass', label: 'Discover' },
    { id: 'files', icon: 'fa-folder', label: 'Files' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0b0c0f] border-t border-gray-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              activeTab === tab.id ? 'text-[#e50914]' : 'text-gray-500'
            }`}
          >
            <i className={`fas ${tab.icon} text-lg mb-1`}></i>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;