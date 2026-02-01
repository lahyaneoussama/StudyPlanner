
import React, { useState } from 'react';
import { User } from '../types';
import { AR } from '../constants';
import { ApiService } from '../api';

interface ProfileViewProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, onLogout, theme, toggleTheme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<User>(user || {
    id: '', fullName: '', email: '', educationLevel: '', dailyStudyGoal: 4, streak: 0
  });

  const handleUpdate = async () => {
    if (!formData.fullName || !formData.email) return;
    
    setIsSaving(true);
    try {
      await ApiService.updateProfile(formData);
      setUser(formData);
      localStorage.setItem('user', JSON.stringify(formData));
      setIsEditing(false);
    } catch (error) {
      alert('فشل في تحديث البيانات. تأكد من اتصال الخادم.');
    } finally {
      setIsSaving(false);
    }
  };

  const eduLevels = [
    { id: 'primary', label: AR.primarySchool },
    { id: 'middle', label: AR.middleSchool },
    { id: 'high', label: AR.highSchool },
    { id: 'university', label: AR.university },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-10">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-black">{AR.profile}</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all"
        >
          {isEditing ? AR.cancel : AR.edit}
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 dark:shadow-none text-center relative overflow-hidden border border-gray-50 dark:border-slate-700">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black mx-auto border-8 border-white dark:border-slate-700 shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            {user?.fullName.charAt(0)}
          </div>
          {!isEditing ? (
            <>
              <h3 className="text-2xl font-black mb-1">{user?.fullName}</h3>
              <p className="text-gray-400 text-sm font-bold tracking-tight">{user?.email}</p>
            </>
          ) : (
            <div className="space-y-3 max-w-xs mx-auto">
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full text-center bg-gray-50 dark:bg-slate-700 p-3 rounded-2xl font-black border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all"
                placeholder="الاسم بالكامل"
              />
              <input 
                type="email" 
                value={formData.email}
                disabled // البريد غالباً لا يتغير لكونه معرف فريد
                className="w-full text-center bg-gray-100 dark:bg-slate-600 p-3 rounded-2xl font-bold border-2 border-transparent cursor-not-allowed"
                placeholder="البريد الإلكتروني"
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Form or Info List */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-700">
        {isEditing ? (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 mr-2 uppercase tracking-widest">{AR.educationLevel}</label>
              <select 
                value={formData.educationLevel}
                onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-700 p-4 rounded-2xl font-black border-none focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {eduLevels.map(lvl => (
                  <option key={lvl.id} value={lvl.label}>{lvl.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2 mr-2 uppercase tracking-widest">{AR.studyGoal} (ساعة)</label>
              <input 
                type="number" 
                value={formData.dailyStudyGoal}
                onChange={(e) => setFormData({...formData, dailyStudyGoal: parseInt(e.target.value) || 0})}
                className="w-full bg-gray-50 dark:bg-slate-700 p-4 rounded-2xl font-black border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={handleUpdate}
              disabled={isSaving}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? <i className="fas fa-circle-notch fa-spin ml-2"></i> : <i className="fas fa-save ml-2"></i>}
              {AR.save}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-700">
            <div className="p-6 flex items-center hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors rounded-t-[3rem]">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center ml-5 shrink-0">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">{AR.educationLevel}</p>
                <p className="font-black text-gray-800 dark:text-white text-lg">{user?.educationLevel || 'غير محدد'}</p>
              </div>
            </div>

            <div className="p-6 flex items-center hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center ml-5 shrink-0">
                <i className="fas fa-fire text-xl"></i>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">{AR.studyGoal}</p>
                <p className="font-black text-gray-800 dark:text-white text-lg">{user?.dailyStudyGoal} ساعات يومياً</p>
              </div>
            </div>

            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors" onClick={toggleTheme}>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ml-5 shrink-0 ${theme === 'dark' ? 'bg-indigo-900/40 text-indigo-400' : 'bg-gray-100 text-gray-600'}`}>
                  <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-xl`}></i>
                </div>
                <p className="font-black text-lg">{theme === 'dark' ? AR.darkMode : AR.lightMode}</p>
              </div>
              <div className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 transform ${theme === 'dark' ? '-translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <div className="p-4 rounded-b-[3rem]">
               <button 
                onClick={onLogout}
                className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-red-100 dark:hover:bg-red-900/40"
              >
                <i className="fas fa-power-off"></i>
                <span>{AR.logout}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
