
import React, { useState } from 'react';
import { StudySession, Subject } from '../types';
import { AR } from '../constants';
import { ApiService } from '../api';

interface ScheduleViewProps {
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  subjects: Subject[];
  userId: string;
}

const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const ScheduleView: React.FC<ScheduleViewProps> = ({ sessions, setSessions, subjects, userId }) => {
  const [selectedDay, setSelectedDay] = useState(DAYS[(new Date().getDay() + 1) % 7]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSession, setNewSession] = useState({ subjectId: subjects[0]?.id || '', startTime: '', duration: 60, goal: '' });

  const daySessions = sessions.filter(s => s.day === selectedDay);

  const handleOpenEdit = (session: StudySession) => {
    setEditingId(session.id);
    setNewSession({ subjectId: session.subjectId, startTime: session.startTime, duration: session.duration, goal: session.goal });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!newSession.subjectId || !newSession.startTime) return;
    
    const sessionData: StudySession = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      day: selectedDay,
      ...newSession
    };

    try {
      const saved = await ApiService.saveSession(sessionData, userId);
      if (editingId) {
        setSessions(sessions.map(s => s.id === editingId ? saved : s));
      } else {
        setSessions([...sessions, saved]);
      }
      resetForm();
    } catch (e) {
      alert('حدث خطأ أثناء حفظ الجلسة');
    }
  };

  const resetForm = () => {
    setNewSession({ subjectId: subjects[0]?.id || '', startTime: '', duration: 60, goal: '' });
    setEditingId(null);
    setShowModal(false);
  };

  const deleteSession = async (id: string) => {
    if (confirm('هل تريد حذف هذه الجلسة؟')) {
      try {
        await ApiService.deleteSession(id);
        setSessions(sessions.filter(s => s.id !== id));
      } catch (e) {
        alert('فشل في حذف الجلسة من الخادم');
      }
    }
  };

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">{AR.schedule}</h2>
        <button onClick={() => setShowModal(true)} className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform">
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="overflow-x-auto pb-4 flex space-x-3 space-x-reverse no-scrollbar">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-black transition-all ${selectedDay === day ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-slate-800 text-gray-400'}`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="relative mt-2">
        <div className="absolute top-0 right-4 bottom-0 w-1 bg-gray-100 dark:bg-slate-800 rounded-full"></div>
        <div className="space-y-6 pr-10">
          {daySessions.length > 0 ? (
            daySessions.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(session => {
              const sub = getSubject(session.subjectId);
              return (
                <div key={session.id} className="relative group">
                  <div className="absolute top-6 -right-11 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-600 z-10 shadow-sm"></div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-slate-700 flex justify-between items-start hover:shadow-lg transition-all">
                    <div>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 block mb-1">{session.startTime}</span>
                      <h4 className="text-lg font-black">{sub?.name || 'مادة محذوفة'}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium italic">{session.goal || 'بدون هدف محدد'}</p>
                      <div className="mt-4 flex gap-2">
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold px-3 py-1 rounded-full text-blue-600 dark:text-blue-400">{session.duration} دقيقة</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(session)} className="text-blue-400 hover:text-blue-600"><i className="fas fa-edit"></i></button>
                      <button onClick={() => deleteSession(session.id)} className="text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-400 bg-white dark:bg-slate-800 rounded-[3rem]">
              <i className="fas fa-calendar-xmark text-5xl mb-4 opacity-20 block"></i>
              <p className="font-bold">لا توجد جلسات مجدولة ليوم {selectedDay}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
            <h3 className="text-2xl font-black mb-6">{editingId ? AR.editSession : AR.addSession}</h3>
            
            <div className="space-y-6">
              <select 
                value={newSession.subjectId}
                onChange={(e) => setNewSession({...newSession, subjectId: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-4 font-bold"
              >
                <option value="" disabled>اختر مادة</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="flex gap-4">
                <input 
                  type="time" 
                  value={newSession.startTime}
                  onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                  className="flex-1 bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-4 font-bold"
                />
                <input 
                  type="number" 
                  value={newSession.duration}
                  onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 0})}
                  className="flex-1 bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-4 font-bold"
                  placeholder="المدة بالدقائق"
                />
              </div>
              <input 
                type="text" 
                value={newSession.goal}
                onChange={(e) => setNewSession({...newSession, goal: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-4 font-bold"
                placeholder="هدف الجلسة..."
              />
              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20">{AR.save}</button>
                <button onClick={resetForm} className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-500 font-black py-4 rounded-2xl">{AR.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
