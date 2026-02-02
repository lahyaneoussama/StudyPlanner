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
          setError('البيانات غير صحيحة.. جرب مرة أخرى');
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
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col p-10 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-50 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-50 rounded-full blur-[100px]"></div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-tr from-rose-400 to-rose-600 rounded-[2.2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-200 rotate-6">
             <i className="fas fa-crown text-white text-4xl"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">مخططي الذكي</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">التنظيم يبدأ من هنا</p>
        </div>

        {error && (
          <div className="bg-rose-50 border-r-4 border-rose-500 p-4 rounded-2xl mb-8">
            <p className="text-rose-700 text-xs font-black">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="group">
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-300 rounded-[1.8rem] py-5 px-8 font-bold outline-none transition-all placeholder:text-gray-300"
                placeholder="اسمك الكامل"
                required
              />
            </div>
          )}
          
          <div className="group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-300 rounded-[1.8rem] py-5 px-8 font-bold outline-none transition-all placeholder:text-gray-300"
              placeholder="بريدك الإلكتروني"
              required
            />
          </div>

          <div className="group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-300 rounded-[1.8rem] py-5 px-8 font-bold outline-none transition-all placeholder:text-gray-300"
              placeholder="كلمة السر"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-400 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-rose-200 active:scale-95 transition-all disabled:opacity-50 text-xl mt-4"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? 'ابدأ الرحلة' : 'انضمام الآن')}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-300 font-black text-xs mb-4">
            {mode === 'login' ? 'ليس لديك حساب؟' : 'تمتلك حساباً؟'}
          </p>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-rose-500 font-black text-lg hover:opacity-80 transition-opacity"
          >
            {mode === 'login' ? 'سجل الآن مجاناً' : 'سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;