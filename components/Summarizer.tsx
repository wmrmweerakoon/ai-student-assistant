import React, { useState } from 'react';
import { summarizeText } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const Summarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeText(inputText);
      setSummary(result);
    } catch (error) {
      setSummary('An error occurred while summarizing the text.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Text Summarizer</h2>
      <p className="text-slate-500 mb-6">Paste your text below to get a concise summary.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col">
          <label htmlFor="input-text" className="text-sm font-medium text-slate-600 mb-2">Your Text</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your lecture notes, article, or any long text here..."
            className="flex-1 w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="summary-output" className="text-sm font-medium text-slate-600 mb-2">AI Summary</label>
          <div className="flex-1 w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-700 overflow-y-auto relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner className="w-8 h-8 mx-auto text-primary" />
                    <p className="mt-2 text-slate-500">Generating summary...</p>
                </div>
              </div>
            ) : (
                summary ? (
                    <p className="whitespace-pre-wrap">{summary}</p>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400">Your summary will appear here.</p>
                    </div>
                )
            )}
          </div>
        </div>
      </div>
       <div className="mt-6 flex justify-end">
        <button
          onClick={handleSummarize}
          disabled={isLoading || !inputText.trim()}
          className="bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isLoading ? 'Summarizing...' : 'Summarize Text'}
        </button>
      </div>
    </div>
  );
};

export default Summarizer;