import React from 'react';

export const Mindset: React.FC = () => {
  const items = [
    { title: "Visualizando Seu Sucesso", duration: "5 min", type: "Áudio", active: true },
    { title: "Superando a Ansiedade do Platô", duration: "8 min", type: "Áudio", active: false },
    { title: "A Disciplina do Descanso", duration: "3 min", type: "Leitura", active: false },
    { title: "Por que não precisamos de academias", duration: "10 min", type: "Áudio", active: false },
  ];

  return (
    <div className="pb-24 animate-in fade-in duration-300">
        <div className="p-6 pt-8 bg-brand-surface/50 border-b border-brand-border">
            <h1 className="text-2xl font-bold text-white mb-2">Mindset</h1>
            <p className="text-brand-muted text-sm">A resiliência mental é tão treinável quanto a força física.</p>
        </div>

        <div className="p-6 space-y-4">
            {items.map((item, i) => (
                <div key={i} className={`group p-4 rounded-xl border transition-all active:scale-[0.98] cursor-pointer flex items-center gap-4 ${item.active ? 'bg-brand-surface border-brand-accent/50 shadow-[0_0_15px_rgba(164,0,109,0.1)]' : 'bg-brand-surface/30 border-brand-border opacity-70'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.active ? 'bg-brand-accent text-white' : 'bg-brand-border text-brand-muted'}`}>
                        {item.type === 'Áudio' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-semibold ${item.active ? 'text-white' : 'text-brand-muted'}`}>{item.title}</h3>
                        <p className="text-xs text-brand-muted mt-1">{item.type} • {item.duration}</p>
                    </div>
                    {item.active ? (
                         <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};