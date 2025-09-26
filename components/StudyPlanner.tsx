import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { PlannerIcon } from './icons';

const StudyPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState('');
  const [topics, setTopics] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjects || !topics || !timeframe || !hoursPerWeek) return;
    setIsLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await generateStudyPlan(subjects, topics, timeframe, hoursPerWeek);
      if (result === 'error') {
        throw new Error("Failed to get a valid plan from the AI.");
      }
      const parsedPlan: StudyPlan = JSON.parse(result);
      setPlan(parsedPlan);
    } catch (err) {
      console.error(err);
      setError('Could not generate the study plan. The AI may have returned an invalid format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Study Planner</h2>
      <p className="text-slate-500 mb-6">Tell the AI your study needs, and get a custom plan.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-sm border border-slate-200 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-4 text-slate-700">Your Study Details</h3>
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label htmlFor="subjects" className="block text-sm font-medium text-slate-600">Subjects</label>
              <input type="text" id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="e.g., Math, History, Chemistry" className="mt-1 block w-full bg-white border-slate-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="topics" className="block text-sm font-medium text-slate-600">Topics/Chapters</label>
              <textarea id="topics" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="e.g., Algebra, The Cold War, Organic Compounds" className="mt-1 block w-full bg-white border-slate-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" rows={3}></textarea>
            </div>
            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-slate-600">Timeframe</label>
              <input type="text" id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="e.g., Next 4 weeks, Until Dec 15th" className="mt-1 block w-full bg-white border-slate-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-slate-600">Hours per Week</label>
              <input type="text" id="hours" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="e.g., 10-15 hours" className="mt-1 block w-full bg-white border-slate-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-hover disabled:bg-slate-300 text-slate-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
              {isLoading ? <LoadingSpinner /> : 'Generate Plan'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 p-6 rounded-xl min-h-[400px]">
          <h3 className="font-bold text-lg mb-4 text-slate-700">Your Custom Study Plan</h3>
          <div className="overflow-y-auto max-h-[65vh]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <LoadingSpinner className="w-10 h-10 text-primary" />
                <p className="mt-3 text-slate-500">Crafting your personalized plan...</p>
              </div>
            )}
            {error && <div className="text-red-600 bg-red-100 border border-red-200 p-4 rounded-md">{error}</div>}
            {!isLoading && !plan && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <PlannerIcon className="w-16 h-16 text-slate-300" />
                    <p className="mt-3 text-slate-400">Your generated study plan will appear here.</p>
                </div>
            )}
            {plan && (
              <div className="space-y-4">
                {plan.map((day, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm border border-slate-200 p-4 rounded-lg">
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-md text-primary">{day.day}</h4>
                        <p className="text-xs text-slate-400">{day.date}</p>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {day.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-center justify-between bg-background/50 p-3 rounded-md">
                          <div>
                            <p className="font-semibold text-sm">{task.subject}</p>
                            <p className="text-xs text-slate-500">{task.topic}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary bg-primary/20 px-2 py-1 rounded-full">{task.duration} min</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;