import React from 'react';
import { useAppStore } from '../store/appStore';
import { AppScreen } from '../types';

export const JournalHistory: React.FC = () => {
  const { journal, setScreen } = useAppStore();

  return (
    <div className="pb-24 animate-in fade-in duration-300 min-h-full">
        {/* Header */}
        <div className="p-6 pt-8 bg-white dark:bg-brand-surface/50 border-b border-gray-200 dark:border-brand-border sticky top-0 z-10 backdrop-blur-md">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Seu Diário</h1>
            <p className="text-gray-500 dark:text-brand-muted text-sm">Acompanhe seus pensamentos e progresso mental.</p>
        </div>

        <div className="p-6 space-y-6">
            {journal.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <div className="text-4xl mb-4">📓</div>
                    <p className="text-black dark:text-white font-medium">O diário está vazio.</p>
                    <p className="text-sm text-gray-500 dark:text-brand-muted mt-2">Faça sua primeira anotação no Painel.</p>
                    <button 
                        onClick={() => setScreen(AppScreen.DASHBOARD)}
                        className="mt-6 text-brand-accent font-bold text-sm hover:underline"
                    >
                        Ir para o Painel
                    </button>
                </div>
            ) : (
                journal.map((entry) => (
                    <div key={entry.id} className="relative pl-6 border-l-2 border-brand-accent/30 hover:border-brand-accent transition-colors">
                        {/* Dot indicator */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-light dark:bg-brand-dark border-2 border-brand-accent"></div>
                        
                        <div className="mb-1">
                             <span className="text-xs font-bold text-brand-accent uppercase tracking-wider bg-brand-accent/10 px-2 py-0.5 rounded">
                                 {entry.date}
                             </span>
                        </div>
                        
                        <div className="bg-white dark:bg-brand-surface p-5 rounded-2xl border border-gray-200 dark:border-brand-border shadow-sm mt-2">
                             <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                 {entry.content}
                             </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};