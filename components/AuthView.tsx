
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
          setError('خطأ في البريد أو كلمة المرور. تأكد من صحة البيانات.');
        }
      } else {
        if (!fullName) { setError('يرجى إدخال الاسم الكامل'); setIsLoading(false); return; }
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
    <div className="min-h-screen bg-[#F8FAFC] max-w-md mx-auto flex flex-col p-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
             <i className="fas fa-graduation-cap text-white text-5xl"></i>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{AR.appName}</h1>
          <p className="text-gray-400 font-medium">نظام مشفر وسحابي آمن 🔒</p>
        </div>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-2xl mb-6">
            <p className="text-red-700 text-xs font-black">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border-2 border-transparent shadow-sm rounded-2xl py-4 px-6 focus:border-blue-500 transition-all font-bold outline-none"
              placeholder="الاسم الكامل"
              required
            />
          )}
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border-2 border-transparent shadow-sm rounded-2xl py-4 px-6 focus:border-blue-500 transition-all font-bold outline-none"
            placeholder="البريد الإلكتروني"
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border-2 border-transparent shadow-sm rounded-2xl py-4 px-6 focus:border-blue-500 transition-all font-bold outline-none"
            placeholder="كلمة المرور"
            required
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all disabled:opacity-50 text-lg"
          >
            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : (mode === 'login' ? AR.login : AR.register)}
          </button>
        </form>

        <button 
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-8 text-sm text-blue-600 font-black"
        >
          {mode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخولك'}
        </button>
      </div>
    </div>
  );
};

export default AuthView;
