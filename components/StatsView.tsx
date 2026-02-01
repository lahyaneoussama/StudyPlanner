
import React from 'react';
import { Task, StudySession } from '../types';
import { AR } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface StatsViewProps {
  tasks: Task[];
  sessions: StudySession[];
}

const StatsView: React.FC<StatsViewProps> = ({ tasks, sessions }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const weeklyData = [
    { name: 'السبت', hours: 4 },
    { name: 'الأحد', hours: 2 },
    { name: 'الاثنين', hours: 5 },
    { name: 'الثلاثاء', hours: 3 },
    { name: 'الأربعاء', hours: 6 },
    { name: 'الخميس', hours: 4 },
    { name: 'الجمعة', hours: 1 },
  ];

  const taskData = [
    { name: 'مكتملة', value: completedTasks, color: '#10B981' },
    { name: 'متبقية', value: pendingTasks, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 px-2">
      <div className="mb-6">
        <h2 className="text-3xl font-black tracking-tighter">{AR.stats}</h2>
        <p className="text-gray-400 text-xs font-bold mt-1">تحليل مفصل لأدائك الدراسي</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-slate-700">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{AR.completed}</p>
          <p className="text-3xl font-black text-green-500">{completedTasks}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-slate-700">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">نسبة الإنجاز</p>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{completionRate}%</p>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-700 overflow-hidden">
        <h3 className="font-black mb-6 text-center text-lg">توزيع المجهود الأسبوعي</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="hours" radius={[10, 10, 10, 10]} barSize={25}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.hours > 4 ? '#3B82F6' : '#94A3B8'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-700 relative">
        <h3 className="font-black mb-6 text-center text-lg">حالة المهام</h3>
        <div className="h-48 w-full flex items-center justify-center relative">
           <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
           </ResponsiveContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">الإجمالي</span>
             <span className="text-3xl font-black">{tasks.length}</span>
           </div>
        </div>
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 ml-2"></span>
            <span className="text-xs font-bold text-gray-500">مكتملة</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span>
            <span className="text-xs font-bold text-gray-500">متبقية</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsView;
