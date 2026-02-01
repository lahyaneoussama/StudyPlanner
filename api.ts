
import { User, Subject, Task, StudySession } from './types';

/**
 * 🔗 رابط الـ Backend الخاص بك على Koyeb
 */
const KOYEB_URL = 'https://rough-bride-oussamaln-07fee82b.koyeb.app'; 

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:3000/api`;
    }
  }
  return `${KOYEB_URL}/api`;
};

const BASE_URL = getBaseUrl();

const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (res: Response) => {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: 'تعذر فهم استجابة السيرفر' };
  }
  
  if (!res.ok) {
    throw new Error(data.error || `خطأ: ${res.status}`);
  }
  return data;
};

export const ApiService = {
  login: async (email: string, pass: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    return await handleResponse(res);
  },
  
  register: async (fullName: string, email: string, pass: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password: pass })
    });
    return await handleResponse(res);
  },
  
  updateProfile: async (user: User) => {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user)
    });
    return await handleResponse(res);
  },
  
  getSubjects: async (uid: string) => {
    const res = await fetch(`${BASE_URL}/subjects`, { headers: getHeaders() });
    return await handleResponse(res);
  },
  
  saveSubject: async (s: Subject, uid: string) => {
    const res = await fetch(`${BASE_URL}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(s)
    });
    return await handleResponse(res);
  },
  
  deleteSubject: async (id: string) => {
    const res = await fetch(`${BASE_URL}/subjects/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    });
    return await handleResponse(res);
  },
  
  getTasks: async (uid: string) => {
    const res = await fetch(`${BASE_URL}/tasks`, { headers: getHeaders() });
    const data = await handleResponse(res);
    return data.map((t: any) => ({
      id: t.id, 
      title: t.title, 
      subjectId: t.subject_id,
      dueDate: t.due_date ? t.due_date.split('T')[0] : '',
      completed: !!t.completed
    }));
  },
  
  saveTask: async (t: Task, uid: string) => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: t.id, 
        subject_id: t.subjectId, 
        title: t.title,
        due_date: t.dueDate, 
        completed: t.completed
      })
    });
    return await handleResponse(res);
  },
  
  deleteTask: async (id: string) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    });
    return await handleResponse(res);
  },
  
  getSessions: async (uid: string) => {
    const res = await fetch(`${BASE_URL}/sessions`, { headers: getHeaders() });
    const data = await handleResponse(res);
    return data.map((s: any) => ({
      id: s.id, 
      subjectId: s.subject_id, 
      day: s.day_name,
      startTime: s.start_time, 
      duration: s.duration, 
      goal: s.goal
    }));
  },
  
  saveSession: async (s: StudySession, uid: string) => {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: s.id, 
        subject_id: s.subjectId, 
        day_name: s.day,
        start_time: s.startTime, 
        duration: s.duration, 
        goal: s.goal
      })
    });
    return await handleResponse(res);
  },
  
  deleteSession: async (id: string) => {
    const res = await fetch(`${BASE_URL}/sessions/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    });
    return await handleResponse(res);
  }
};
