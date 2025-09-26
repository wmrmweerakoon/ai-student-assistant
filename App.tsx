
import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import AITutor from './components/AITutor';
import Summarizer from './components/Summarizer';
import StudyPlanner from './components/StudyPlanner';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Tutor);

  const renderActiveView = () => {
    switch (activeView) {
      case View.Tutor:
        return <AITutor />;
      case View.Summarizer:
        return <Summarizer />;
      case View.Planner:
        return <StudyPlanner />;
      default:
        return <AITutor />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-slate-800 font-sans">
      <Sidebar activeView={activeView} setView={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default App;