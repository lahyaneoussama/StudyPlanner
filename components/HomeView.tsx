import React from 'react';
import { User, Subject, Task, StudySession } from '../types';
import { AR } from '../constants';

interface HomeViewProps {
  user: User | null;
  subjects: Subject[];
  tasks: Task[];
  sessions: StudySession[];
  aiTip: string;
}

const HomeView: React.FC<HomeViewProps> = ({ user, subjects, tasks, sessions, aiTip }) => {
  const pendingTasks = tasks.filter(t => !t.completed);
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'مادة عامة';
  const getSubjectColor = (id: string) => subjects.find(s => s.id === id)?.color || '#6366f1';

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      
      {/* Welcome Message */}
      <div className="px-2">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white">مرحباً، {user?.fullName.split(' ')[0]} 👋</h2>
        <p className="text-gray-400 font-bold mt-1">هل أنت مستعد للتفوق اليوم؟</p>
      </div>

      {/* Smart AI Glass Card */}
      {aiTip && (
        <section className="relative overflow-hidden p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/40 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 group">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 shrink-0">
              <i className="fas fa-sparkles text-xl animate-pulse"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full">نصيحة ذكية</span>
              <p className="text-gray-700 dark:text-slate-200 text-sm leading-relaxed mt-3 font-semibold italic">"{aiTip}"</p>
            </div>
          </div>
        </section>
      )}

      {/* Modern Stats Grid */}
      <section className="grid grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
             <i className="fas fa-fire-alt text-6xl"></i>
           </div>
           <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">{AR.streak}</p>
           <h3 className="text-3xl font-black mt-1">{user?.streak || 0} <span className="text-sm font-bold opacity-60">أيام</span></h3>
           <div className="mt-4 w-12 h-1 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/40 dark:shadow-none group">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:rotate-12 transition-transform">
             <i className="fas fa-rocket text-xl"></i>
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">مهام متبقية</p>
           <h3 className="text-3xl font-black text-gray-800 dark:text-white mt-1">{pendingTasks.length}</h3>
        </div>
      </section>

      {/* Today's Focus - Reimagined */}
      <section>
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white">جدولك اليوم 📅</h3>
            <div className="w-8 h-1 bg-blue-600 rounded-full mt-1"></div>
          </div>
          <button className="text-blue-600 dark:text-blue-400 text-xs font-black hover:underline">عرض الجدول الكامل</button>
        </div>
        
        {sessions.length > 0 ? (
          <div className="space-y-5">
            {sessions.map(session => (
              <div key={session.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2.2rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-slate-700/50 flex items-center gap-5 hover:scale-[1.02] transition-all duration-300">
                <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner relative group" style={{ backgroundColor: `${getSubjectColor(session.subjectId)}15`, color: getSubjectColor(session.subjectId) }}>
                  <i className="fas fa-clock-rotate-left"></i>
                  <div className="absolute inset-0 rounded-[1.5rem] animate-ping opacity-20" style={{ backgroundColor: getSubjectColor(session.subjectId) }}></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-gray-800 dark:text-white">{getSubjectName(session.subjectId)}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-gray-400 font-bold"><i className="far fa-clock ml-1"></i> {session.startTime}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[11px] text-gray-400 font-bold"><i className="far fa-hourglass ml-1"></i> {session.duration} دقيقة</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-400">
                  <i className="fas fa-chevron-left text-xs"></i>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 p-12 rounded-[3rem] text-center border-2 border-dashed border-gray-100 dark:border-slate-700">
            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
              <i className="fas fa-mug-hot text-3xl text-blue-200"></i>
            </div>
            <p className="text-gray-400 font-black text-sm uppercase tracking-widest">وقت مستقطع.. استمتع به!</p>
          </div>
        )}
      </section>

      {/* Progress Glance */}
      <section className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h4 className="font-black text-xl">هدفك اليومي 🎯</h4>
            <p className="text-blue-100 text-xs mt-1">أنجزت 60% من هدفك اليوم</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center font-black">
            60%
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeView;