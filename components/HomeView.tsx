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
  const getSubjectColor = (id: string) => subjects.find(s => s.id === id)?.color || '#FF85A2';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'مادة';

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Info */}
      <div className="flex items-center gap-4 px-2">
        <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white text-2xl shadow-xl shadow-rose-200">
          <i className="fas fa-sparkles"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">أهلاً، {user?.fullName.split(' ')[0]} ✨</h2>
          <p className="text-gray-400 font-bold text-sm">يوم جديد.. إنجاز جديد!</p>
        </div>
      </div>

      {/* AI Inspiration Card */}
      {aiTip && (
        <section className="p-6 rounded-[2.5rem] bg-gradient-to-r from-[#E0C3FC] to-[#8EC5FC] text-white shadow-2xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative flex gap-4">
            <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <i className="fas fa-lightbulb"></i>
            </div>
            <p className="font-bold leading-relaxed text-sm italic">"{aiTip}"</p>
          </div>
        </section>
      )}

      {/* Stats Blocks */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 group hover:scale-[1.05] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <i className="fas fa-fire"></i>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{AR.streak}</p>
          <h3 className="text-3xl font-black text-gray-800">{user?.streak || 0}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 group hover:scale-[1.05] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
            <i className="fas fa-check-double"></i>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مهام متبقية</p>
          <h3 className="text-3xl font-black text-gray-800">{pendingTasks.length}</h3>
        </div>
      </div>

      {/* Today's Schedule - Modern List */}
      <section>
        <div className="flex justify-between items-center mb-5 px-2">
          <h3 className="text-xl font-black text-gray-800">جدول اليوم 📅</h3>
          <span className="bg-rose-100 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">LIVE</span>
        </div>

        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session.id} className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-gray-50 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner" style={{ backgroundColor: `${getSubjectColor(session.subjectId)}15`, color: getSubjectColor(session.subjectId) }}>
                  <i className="fas fa-book-open"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-800">{getSubjectName(session.subjectId)}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-black"><i className="far fa-clock ml-1"></i> {session.startTime}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-[10px] text-gray-400 font-black">{session.duration} دقيقة</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <i className="fas fa-chevron-left text-xs"></i>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/50 p-12 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
               <i className="fas fa-umbrella-beach text-2xl text-rose-200"></i>
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{AR.noSessions}</p>
          </div>
        )}
      </section>

      {/* Encouragement Card */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border-2 border-rose-50 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-crown"></i>
            </div>
            <div>
              <p className="text-xs font-black text-gray-400">نقاطك اليوم</p>
              <h4 className="text-xl font-black text-gray-800">1,250 <span className="text-[10px] opacity-40">🏆</span></h4>
            </div>
         </div>
         <button className="bg-rose-500 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-lg shadow-rose-200">التحديات</button>
      </section>

    </div>
  );
};

export default HomeView;