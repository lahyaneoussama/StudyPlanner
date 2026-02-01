
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

  // التحقق من الجلسة عند بدء التطبيق
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (token && savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setIsLoggedIn(true);
      fetchData(u.id);
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

      // Generate AI Tip using Gemini
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser) as User;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const pendingTasks = tks.filter(t => !t.completed).length;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `أنت مساعد دراسة ذكي وودود. قدم نصيحة دراسية واحدة قصيرة وملهمة باللغة العربية للطالب ${u.fullName} (مستواه: ${u.educationLevel}). لديه ${subs.length} مواد و ${pendingTasks} مهام متبقية اليوم. هدفه اليومي ${u.dailyStudyGoal} ساعات.`,
        });
        
        if (response.text) {
          setAiTip(response.text.trim());
        }
      }
    } catch (e) {
      console.error("خطأ في جلب البيانات", e);
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
    <div className={`flex flex-col h-full overflow-hidden max-w-md mx-auto shadow-2xl relative transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-gray-900'}`}>
      {loading && (
        <div className="absolute inset-0 z-[100] bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <header className={`bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-900 to-blue-900' : 'from-blue-700 to-blue-600'} text-white p-6 pt-12 pb-8 sticky top-0 z-30 shadow-lg safe-area-top rounded-b-[2.5rem]`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">{AR.appName}</h1>
            <p className="opacity-70 text-[10px] uppercase font-bold tracking-widest mt-0.5">Secure Cloud Database</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90">
               <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
             </button>
             <div onClick={() => setCurrentView('profile')} className="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-xl cursor-pointer active:scale-90 transition-transform">
               <div className="w-full h-full rounded-[0.9rem] bg-blue-100 flex items-center justify-center text-blue-700 font-black text-lg overflow-hidden">
                 {user?.fullName.charAt(0)}
               </div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-32 no-scrollbar">
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
