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
    { view: 'home', icon: 'fa-house-chimney', label: AR.home },
    { view: 'subjects', icon: 'fa-book-bookmark', label: AR.subjects },
    { view: 'tasks', icon: 'fa-circle-check', label: AR.tasks },
    { view: 'schedule', icon: 'fa-calendar-day', label: AR.schedule },
    { view: 'stats', icon: 'fa-chart-pie', label: AR.stats },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] max-w-md mx-auto">
      <nav className={`flex justify-around items-center p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border backdrop-blur-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-white/50'}`}>
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-[1.5rem] transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 -translate-y-2' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <i className={`fas ${item.icon} ${isActive ? 'text-lg' : 'text-xl'}`}></i>
              {isActive && (
                <span className="absolute -bottom-6 text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
        
        {/* Profile Button - Separate logic to keep it visually consistent */}
        <button
          onClick={() => setView('profile')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-[1.5rem] transition-all duration-300 ${
            currentView === 'profile' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 -translate-y-2' 
              : 'text-gray-400'
          }`}
        >
          <i className={`fas fa-user-ninja ${currentView === 'profile' ? 'text-lg' : 'text-xl'}`}></i>
          {currentView === 'profile' && (
            <span className="absolute -bottom-6 text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
              الملف
            </span>
          )}
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;