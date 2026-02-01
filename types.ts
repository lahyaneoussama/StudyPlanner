
export interface User {
  id: string;
  fullName: string;
  email: string;
  educationLevel: string;
  dailyStudyGoal: number; // in hours
  streak: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  completed: boolean;
}

export interface StudySession {
  id: string;
  subjectId: string;
  day: string;
  startTime: string;
  duration: number; // in minutes
  goal: string;
}

export type AppView = 'home' | 'subjects' | 'tasks' | 'schedule' | 'stats' | 'profile';
