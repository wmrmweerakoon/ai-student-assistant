
export enum View {
  Tutor,
  Summarizer,
  Planner,
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface StudyTask {
  subject: string;
  topic: string;
  duration: number; // in minutes
}

export interface StudyDay {
  day: string;
  date: string;
  tasks: StudyTask[];
}

export type StudyPlan = StudyDay[];
