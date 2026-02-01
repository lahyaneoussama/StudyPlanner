
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
  const getSubjectColor = (id: string) => subjects.find(s => s.id === id)?.color || '#3B82F6';

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Smart AI Card */}
      {aiTip && (
        <section className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-blue-100 dark:border-slate-700 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>
          <div className="relative flex gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none shrink-0">
              <i className="fas fa-robot animate-bounce"></i>
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">نصيحة الذكاء الاصطناعي</h4>
              <p className="text-gray-700 dark:text-slate-200 text-sm leading-relaxed mt-1 font-medium italic">"{aiTip}"</p>
            </div>
          </div>
        </section>
      )}

      {/* User Stats Summary */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-[2rem] text-white shadow-xl">
           <i className="fas fa-fire-alt text-2xl mb-2 text-orange-400"></i>
           <p className="text-xs opacity-80">{AR.streak}</p>
           <h3 className="text-2xl font-black">{user?.streak || 0} أيام</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
           <i className="fas fa-tasks text-2xl mb-2 text-blue-600 dark:text-blue-400"></i>
           <p className="text-xs text-gray-400">مهام اليوم</p>
           <h3 className="text-2xl font-black text-gray-800 dark:text-white">{pendingTasks.length} مهام</h3>
        </div>
      </section>

      {/* Today's Focus */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black">جدولك اليوم 📅</h3>
          <button className="text-blue-600 dark:text-blue-400 text-xs font-bold">رؤية الكل</button>
        </div>
        
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner" style={{ backgroundColor: `${getSubjectColor(session.subjectId)}20`, color: getSubjectColor(session.subjectId) }}>
                  <i className="fas fa-clock-rotate-left"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{getSubjectName(session.subjectId)}</h4>
                  <p className="text-xs text-gray-400 font-medium">{session.startTime} • {session.duration} دقيقة</p>
                </div>
                <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-full uppercase">قادم</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50/50 dark:bg-slate-800/50 p-10 rounded-3xl text-center border-2 border-dashed border-blue-100 dark:border-slate-700">
            <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
              <i className="fas fa-calendar-day text-2xl"></i>
            </div>
            <p className="text-blue-400 font-bold text-sm">يوم هادئ.. لا توجد جلسات مجدولة</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeView;
