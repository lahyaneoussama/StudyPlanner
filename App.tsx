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
      }, 1500);
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
            contents: `أنت مساعد دراسة لطيف وودود. قدم نصيحة دراسية واحدة قصيرة جداً وملهمة للطالب ${user?.fullName}. لديه ${subs.length} مواد و ${pendingTasks} مهام متبقية. أجب بالعربية بلهجة تشجيعية.`,
          });
          if (response.text) setAiTip(response.text.trim());
        } catch (aiErr) {
          setAiTip("كل خطوة صغيرة تقربك من حلمك الكبير.. استمر!");
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
    <div className={`fixed inset-0 flex flex-col w-full h-full overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-[#FAFBFF] text-gray-900'}`}>
      
      {loading && (
        <div className="absolute inset-0 z-[100] bg-white/20 backdrop-blur-xl flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Modern Floating Header */}
      <header className="shrink-0 p-6 pt-12 pb-2 safe-area-top">
        <div className={`flex justify-between items-center p-4 rounded-[2.2rem] border-2 transition-all duration-500 ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/70 border-white shadow-xl shadow-rose-100/20'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <i className="fas fa-crown text-sm"></i>
            </div>
            <div>
              <h1 className="text-sm font-black text-gray-800 dark:text-white leading-none tracking-tighter">{AR.appName}</h1>
              <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest">Premium Mode</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-400 flex items-center justify-center transition-all">
               <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-xs`}></i>
             </button>
             <div onClick={() => setCurrentView('profile')} className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 font-black text-xs cursor-pointer active:scale-90">
               {user?.fullName?.charAt(0) || 'م'}
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