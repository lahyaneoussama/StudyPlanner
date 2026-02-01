
import React, { useState } from 'react';
import { Subject } from '../types';
import { AR, SUBJECT_COLORS, ICONS } from '../constants';
import { ApiService } from '../api';

interface SubjectsViewProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  userId: string;
}

const SubjectsView: React.FC<SubjectsViewProps> = ({ subjects, setSubjects, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({ name: '', color: SUBJECT_COLORS[0], icon: ICONS[0] });

  const handleSave = async () => {
    if (!newSubject.name.trim()) return;
    
    const subjectToSave: Subject = {
      id: editingId || Date.now().toString(),
      ...newSubject
    };

    const saved = await ApiService.saveSubject(subjectToSave, userId);
    
    if (editingId) {
      setSubjects(subjects.map(s => s.id === editingId ? saved : s));
    } else {
      setSubjects([...subjects, saved]);
    }
    resetForm();
  };

  const deleteSubject = async (id: string) => {
    if (confirm('حذف المادة؟')) {
      await ApiService.deleteSubject(id);
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const resetForm = () => {
    setNewSubject({ name: '', color: SUBJECT_COLORS[0], icon: ICONS[0] });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-3xl font-black">{AR.subjects}</h2>
        <button onClick={() => setShowModal(true)} className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center">
          <i className="fas fa-plus text-2xl"></i>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-700 relative group overflow-hidden">
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingId(subject.id); setNewSubject(subject); setShowModal(true); }} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="fas fa-pencil text-xs"></i>
              </button>
              <button onClick={() => deleteSubject(subject.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <i className="fas fa-trash text-xs"></i>
              </button>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
              <i className={`fas ${subject.icon} text-3xl`}></i>
            </div>
            <h4 className="font-black text-center">{subject.name}</h4>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center px-4 pb-10">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-8 text-center">{editingId ? AR.editSubject : AR.addSubject}</h3>
            <input 
              type="text" 
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              className="w-full bg-gray-50 dark:bg-slate-700 p-5 rounded-2xl font-black mb-6 outline-none"
              placeholder="اسم المادة"
            />
            <div className="flex gap-4 pt-4">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-5 rounded-3xl">حفظ</button>
              <button onClick={resetForm} className="flex-1 bg-gray-100 text-gray-500 font-black py-5 rounded-3xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsView;
