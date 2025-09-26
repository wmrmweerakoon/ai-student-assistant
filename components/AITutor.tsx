import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { ai } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';
import { SendIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

const AITutor: React.FC = () => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);
  
  const initializeChat = useCallback(() => {
    if (!chatRef.current) {
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are a friendly and encouraging AI tutor for students. Explain concepts clearly, provide helpful examples, and guide students to find answers themselves when appropriate. Your tone should be patient and supportive.',
            },
            history: [],
        });
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = chatRef.current;
      const result = await chat.sendMessageStream({ message: input });

      let text = '';
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of result) {
        text += chunk.text;
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].parts[0].text = text;
          return newHistory;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, something went wrong. Please try again.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isModel = message.role === 'model';
    const textWithBreaks = message.parts[0].text.replace(/\n/g, '<br />');

    return (
      <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-2xl px-5 py-3 rounded-2xl shadow-sm ${isModel ? 'bg-white rounded-bl-none' : 'bg-primary text-slate-800 rounded-br-none'}`}>
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: textWithBreaks }}></p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 overflow-y-auto pr-4 -mr-4">
        {history.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && history[history.length - 1]?.role === 'user' && (
            <div className="flex justify-start mb-4">
                 <div className="max-w-2xl px-5 py-3 rounded-2xl bg-white rounded-bl-none flex items-center shadow-sm">
                    <LoadingSpinner className="w-5 h-5" />
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-6 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your studies..."
          className="flex-1 bg-white border border-slate-300 rounded-full py-3 px-6 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="ml-4 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-800 rounded-full p-3 transition-colors duration-200"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default AITutor;