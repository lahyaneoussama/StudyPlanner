import React, { useState, useEffect } from 'react';
import { AppView, User, Subject, Task, StudySession } from './types';
import { AR } from './constants';
import { ApiService } from './api';
import HomeView from './components/HomeView';
import SubjectsView from './components/SubjectsView';
import TasksView from './components/TasksView';
import ScheduleView from './components/ScheduleView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import AuthView from './components/AuthView';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [aiTip, setAiTip] = useState<string>("");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
      }, 1000);
    }

    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setIsLoggedIn(true);
        fetchData(u.id);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const fetchData = async (uid: string) => {
    setLoading(true);
    try {
      const [subs, tks, sess] = await Promise.all([
        ApiService.getSubjects(uid),
        ApiService.getTasks(uid),
        ApiService.getSessions(uid)
      ]);
      setSubjects(subs);
      setTasks(tks);
      setSessions(sess);

      const apiKey = (process.env as any).API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const pendingTasks = tks.filter(t => !t.completed).length;
        
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `أنت مساعد دراسة ذكي ومحفز. قدم نصيحة دراسية واحدة قوية جداً وملهمة للطالب ${user?.fullName}. لديه ${subs.length} مواد و ${pendingTasks} مهام لم ينهها بعد. كن قصيراً وودوداً بالعربية.`,
          });
          if (response.text) setAiTip(response.text.trim());
        } catch (aiErr) {
          setAiTip("كل دقيقة تقضيها في التعلم اليوم هي لبنة في بناء مستقبلك العظيم!");
        }
      }
    } catch (e) {
      console.error("Data fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    fetchData(userData.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!isLoggedIn) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className={`fixed inset-0 flex flex-col w-full h-full overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#fcfdff] text-gray-900'}`}>
      {loading && (
        <div className="absolute inset-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-xl flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
        </div>
      )}

      {/* Modern Floating Header */}
      <header className={`shrink-0 p-6 pt-12 pb-6 sticky top-0 z-40 safe-area-top`}>
        <div className={`flex justify-between items-center p-4 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-black/20' : 'bg-white/60 border-white/50 shadow-xl shadow-gray-200/50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-graduation-cap text-lg"></i>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tighter leading-none">{AR.appName}</h1>
              <span className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em]">{currentView} mode</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={toggleTheme} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-100 text-gray-500'}`}>
               <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
             </button>
             <div onClick={() => setCurrentView('profile')} className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-[2px] shadow-lg active:scale-90 transition-transform cursor-pointer">
               <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">
                 {user?.fullName?.charAt(0) || 'م'}
               </div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-40">
        {(() => {
          switch (currentView) {
            case 'home': return <HomeView user={user} subjects={subjects} tasks={tasks} sessions={sessions} aiTip={aiTip} />;
            case 'subjects': return <SubjectsView subjects={subjects} setSubjects={setSubjects} userId={user?.id || ''} />;
            case 'tasks': return <TasksView tasks={tasks} setTasks={setTasks} subjects={subjects} userId={user?.id || ''} />;
            case 'schedule': return <ScheduleView sessions={sessions} setSessions={setSessions} subjects={subjects} userId={user?.id || ''} />;
            case 'stats': return <StatsView tasks={tasks} sessions={sessions} />;
            case 'profile': return <ProfileView user={user} setUser={setUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
            default: return <HomeView user={user} subjects={subjects} tasks={tasks} sessions={sessions} aiTip={aiTip} />;
          }
        })()}
      </main>

      <BottomNav currentView={currentView} setView={setCurrentView} theme={theme} />
    </div>
  );
};

export default App;