
import React, { useState } from 'react';
import { Task, Subject } from '../types';
import { AR } from '../constants';
import { ApiService } from '../api';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  subjects: Subject[];
  // Fix: Added userId to props to match App.tsx usage
  userId: string;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks, subjects, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTask, setNewTask] = useState({ title: '', subjectId: subjects[0]?.id || '', dueDate: '' });

  const handleOpenEdit = (task: Task) => {
    setEditingId(task.id);
    setNewTask({ title: task.title, subjectId: task.subjectId, dueDate: task.dueDate });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!newTask.title.trim() || !newTask.subjectId) return;
    
    const taskData: Task = {
      id: editingId || Date.now().toString(),
      completed: false,
      ...newTask
    };

    // Use ApiService for persistence
    const saved = await ApiService.saveTask(taskData, userId);
    
    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? saved : t));
    } else {
      setTasks([saved, ...tasks]);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewTask({ title: '', subjectId: subjects[0]?.id || '', dueDate: '' });
    setEditingId(null);
    setShowModal(false);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    const saved = await ApiService.saveTask(updated, userId);
    setTasks(tasks.map(t => t.id === id ? saved : t));
  };

  const deleteTask = async (id: string) => {
    if (confirm('هل تريد حذف هذه المهمة نهائياً؟')) {
      await ApiService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const getSubjectColor = (id: string) => subjects.find(s => s.id === id)?.color || '#94A3B8';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'غير مصنف';

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 px-2 pb-10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">{AR.tasks}</h2>
          <p className="text-gray-400 text-xs font-bold mt-1">قائمة مهامك الدراسية وإنجازاتك</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <i className="fas fa-plus text-2xl"></i>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-2 rounded-[2rem] shadow-inner">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)} 
            className={`flex-1 py-4 text-xs font-black rounded-[1.5rem] transition-all duration-300 ${filter === f ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xl' : 'text-gray-400'}`}
          >
            {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد الإنجاز' : 'المكتملة'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-slate-700 flex items-center group hover:shadow-xl transition-all duration-300">
            <button onClick={() => toggleTask(task.id)} className="ml-5 transition-transform active:scale-75 shrink-0">
              {task.completed ? (
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
                  <i className="fas fa-check text-sm"></i>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border-4 border-gray-100 dark:border-slate-700 hover:border-blue-200 transition-colors"></div>
              )}
            </button>
            <div className="flex-1 text-right overflow-hidden">
              <h4 className={`font-black text-lg transition-all truncate ${task.completed ? 'line-through text-gray-300 dark:text-slate-600 opacity-60' : ''}`}>{task.title}</h4>
              <div className="flex items-center mt-1.5 gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getSubjectColor(task.subjectId) }}></span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">{getSubjectName(task.subjectId)} • {task.dueDate || 'بدون تاريخ'}</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mr-3">
              <button onClick={() => handleOpenEdit(task)} className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm"><i className="fas fa-edit text-xs"></i></button>
              <button onClick={() => deleteTask(task.id)} className="w-9 h-9 rounded-full bg-red-50 dark:bg-slate-700 text-red-600 dark:text-red-400 flex items-center justify-center shadow-sm"><i className="fas fa-trash text-xs"></i></button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <i className="fas fa-clipboard-list text-6xl mb-4 block"></i>
            <p className="font-bold">لا يوجد مهام في هذا التصنيف</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-end justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3.5rem] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-10"></div>
            <h3 className="text-3xl font-black mb-10 tracking-tighter text-center">{editingId ? AR.editTask : AR.addTask}</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black mb-3 text-gray-400 uppercase mr-2 tracking-widest">ما هي المهمة؟</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-5 font-black text-lg focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="مثال: مراجعة الوحدة الأولى"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black mb-3 text-gray-400 uppercase mr-2 tracking-widest">المادة</label>
                  <select 
                    value={newTask.subjectId}
                    onChange={(e) => setNewTask({...newTask, subjectId: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-5 font-black outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    <option value="" disabled>اختر مادة</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black mb-3 text-gray-400 uppercase mr-2 tracking-widest">الموعد النهائي</label>
                  <input 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-2xl p-5 font-black outline-none focus:ring-4 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-5 pt-4">
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl shadow-blue-500/30 text-lg active:scale-95 transition-all">{AR.save}</button>
                <button onClick={resetForm} className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-500 font-black py-5 rounded-[2.5rem] text-lg active:scale-95 transition-all">{AR.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
