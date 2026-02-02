import React, { useState } from 'react';
import { AR } from '../constants';
import { User } from '../types';
import { ApiService } from '../api';

interface AuthViewProps {
  onLogin: (userData: User, token: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await ApiService.login(email, password);
        if (result) {
          onLogin(result.user, result.token);
        } else {
          setError('خطأ في البيانات.. حاول مرة أخرى');
        }
      } else {
        if (!fullName) { setError('يرجى إدخال اسمك'); setIsLoading(false); return; }
        const result = await ApiService.register(fullName, email, password);
        onLogin(result.user, result.token);
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] max-w-md mx-auto flex flex-col p-10 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px]"></div>
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-12">
          <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 rounded-[2.8rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40 rotate-3">
             <i className="fas fa-graduation-cap text-white text-5xl"></i>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">مخطط الدراسة</h1>
          <p className="text-gray-400 font-bold text-sm bg-gray-100 px-4 py-1 rounded-full inline-block">ذكاء اصطناعي • سحابي • آمن</p>
        </div>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-2xl mb-8 animate-bounce">
            <p className="text-red-700 text-xs font-black">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div className="relative">
              <i className="fas fa-user absolute left-5 top-5 text-gray-300"></i>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-[1.8rem] py-5 pl-6 pr-14 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
                placeholder="اسمك الكامل"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <i className="fas fa-envelope absolute left-5 top-5 text-gray-300"></i>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-[1.8rem] py-5 pl-6 pr-14 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
              placeholder="البريد الإلكتروني"
              required
            />
          </div>

          <div className="relative">
            <i className="fas fa-lock absolute left-5 top-5 text-gray-300"></i>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-[1.8rem] py-5 pl-6 pr-14 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold outline-none"
              placeholder="كلمة المرور"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50 text-xl mt-4"
          >
            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : (mode === 'login' ? 'دخول للمنصة' : 'انضم إلينا الآن')}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-400 font-bold text-sm mb-4">
            {mode === 'login' ? 'ليس لديك حساب حتى الآن؟' : 'هل تمتلك حساباً بالفعل؟'}
          </p>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-indigo-600 font-black text-lg hover:underline decoration-2 underline-offset-8"
          >
            {mode === 'login' ? 'أنشئ حسابك المجاني' : 'سجل دخولك الآن'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;