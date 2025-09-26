import React from 'react';
import { View } from '../types';
import { ChatIcon, SummarizeIcon, PlannerIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
}

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-md ${
      isActive
        ? 'bg-primary/20 text-primary font-semibold'
        : 'text-slate-500 hover:bg-primary/10 hover:text-primary'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView }) => {
  return (
    <aside className="w-64 bg-white/70 backdrop-blur-sm flex flex-col border-r border-slate-200">
      <div className="h-20 flex items-center justify-center border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-700 tracking-wider">Student AI</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavButton
          icon={<ChatIcon className="w-6 h-6" />}
          label="AI Tutor"
          isActive={activeView === View.Tutor}
          onClick={() => setView(View.Tutor)}
        />
        <NavButton
          icon={<SummarizeIcon className="w-6 h-6" />}
          label="Text Summarizer"
          isActive={activeView === View.Summarizer}
          onClick={() => setView(View.Summarizer)}
        />
        <NavButton
          icon={<PlannerIcon className="w-6 h-6" />}
          label="Study Planner"
          isActive={activeView === View.Planner}
          onClick={() => setView(View.Planner)}
        />
      </nav>
      <div className="px-4 py-4 border-t border-slate-200 text-xs text-slate-400">
        <p>&copy; 2024 AI Student Assistant</p>
        <p>Powered by Gemini</p>
      </div>
    </aside>
  );
};

export default Sidebar;