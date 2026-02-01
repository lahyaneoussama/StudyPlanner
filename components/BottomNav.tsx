
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
    { view: 'home', icon: 'fa-house', label: AR.home },
    { view: 'subjects', icon: 'fa-book-open', label: AR.subjects },
    { view: 'tasks', icon: 'fa-list-check', label: AR.tasks },
    { view: 'schedule', icon: 'fa-calendar-days', label: AR.schedule },
    { view: 'stats', icon: 'fa-chart-simple', label: AR.stats },
    { view: 'profile', icon: 'fa-user', label: AR.profile },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t flex justify-around items-center pt-2 pb-8 px-1 safe-area-bottom z-20 shadow-2xl transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0F172A]/90 backdrop-blur-xl border-slate-800' : 'bg-white/90 backdrop-blur-md border-gray-100'}`}>
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`flex flex-col items-center flex-1 transition-all duration-200 active:scale-90 ${
            currentView === item.view ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400'
          }`}
        >
          <i className={`fas ${item.icon} text-lg mb-1`}></i>
          <span className="text-[10px] font-black tracking-tight">{item.label}</span>
          {currentView === item.view && (
            <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-1 animate-pulse"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
