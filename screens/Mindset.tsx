import React from 'react';
import { useAppStore } from '../store/appStore';

export const Mindset: React.FC = () => {
  const { mindsetItems, toggleCompleteMindset } = useAppStore();

  return (
    <div className="pb-24 animate-in fade-in duration-300">
        <div className="p-6 pt-8 bg-brand-surface/50 border-b border-brand-border">
            <h1 className="text-2xl font-bold text-white mb-2">Mindset</h1>
            <p className="text-brand-muted text-sm">A resiliência mental é tão treinável quanto a força física.</p>
        </div>

        <div className="p-6 space-y-4">
            {mindsetItems.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => toggleCompleteMindset(item.id)}
                    className={`group p-4 rounded-xl border transition-all active:scale-[0.98] cursor-pointer flex items-center gap-4 ${item.completed ? 'bg-brand-surface border-brand-accent/50 shadow-[0_0_15px_rgba(164,0,109,0.1)]' : 'bg-brand-surface/30 border-brand-border hover:border-brand-accent/30'}`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${item.completed ? 'bg-brand-accent text-white' : 'bg-brand-border text-brand-muted group-hover:text-white'}`}>
                        {item.type === 'Áudio' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-semibold transition-colors ${item.completed ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.title}</h3>
                        <p className="text-xs text-brand-muted mt-1">{item.type} • {item.duration}</p>
                    </div>
                    {item.completed ? (
                         <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_#A4006D]"></div>
                    ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-brand-border group-hover:border-brand-accent/50"></div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};