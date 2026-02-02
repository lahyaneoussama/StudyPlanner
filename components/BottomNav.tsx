import React from 'react';
import { AppView } from '../types';
import { AR } from '../constants';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  theme: 'light' | 'dark';
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, theme }) => {
  const navItems: { view: AppView; icon: string; label: string }[] = [
    { view: 'home', icon: 'fa-house-user', label: AR.home },
    { view: 'subjects', icon: 'fa-shapes', label: AR.subjects },
    { view: 'tasks', icon: 'fa-check-circle', label: AR.tasks },
    { view: 'schedule', icon: 'fa-calendar-alt', label: AR.schedule },
    { view: 'stats', icon: 'fa-bolt', label: AR.stats },
  ];

  return (
    <div className="fixed bottom-8 left-6 right-6 z-[100] max-w-md mx-auto">
      <nav className={`flex justify-around items-center p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,133,162,0.15)] border-2 backdrop-blur-xl transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-white'}`}>
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ${
                isActive 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-110 -translate-y-1' 
                  : 'text-gray-300'
              }`}
            >
              <i className={`fas ${item.icon} ${isActive ? 'text-sm' : 'text-lg'}`}></i>
              {isActive && (
                <div className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
        
        {/* Profile Separate logic */}
        <button
          onClick={() => setView('profile')}
          className={`w-12 h-12 rounded-2xl transition-all duration-500 ${
            currentView === 'profile' 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-110 -translate-y-1' 
              : 'text-gray-300'
          }`}
        >
          <i className={`fas fa-user-circle ${currentView === 'profile' ? 'text-sm' : 'text-lg'}`}></i>
          {currentView === 'profile' && (
            <div className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full"></div>
          )}
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;