import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { WeightChart } from '../components/WeightChart';
import { TrackingModal } from '../components/TrackingModal';
import { AppScreen } from '../types';

export const Dashboard: React.FC = () => {
  const { user, workouts, selectWorkout, dailyTip, waterIntakeL, logWeight, logWater, logJournal, updateProfileStats, newBadgeUnlocked, clearNewBadge } = useAppStore();
  const [greeting, setGreeting] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'water' | 'journal' | 'stats'>('weight');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Vamos secar,');
    else if (hour < 18) setGreeting('Foco total,');
    else setGreeting('Não pare,');
  }, []);

  const openModal = (type: 'weight' | 'water' | 'journal' | 'stats') => {
      setModalType(type);
      setModalOpen(true);
  };

  const nextWorkout = workouts.find(w => !w.completed);
  const completedCount = workouts.filter(w => w.completed).length;
  const progressPercent = Math.round((completedCount / 15) * 100);

  // --- 15 DAY LOGIC ---
  // Create a fixed array of 15 days for the visual timeline
  const challengeDays = Array.from({ length: 15 }, (_, i) => {
      const dayNum = i + 1;
      const workout = workouts.find(w => w.day_number === dayNum);
      return {
          day: dayNum,
          status: workout?.completed ? 'completed' : (workout?.id === nextWorkout?.id ? 'current' : 'locked'),
          id: workout?.id
      };
  });

  return (
    <div className="pb-24 animate-in fade-in duration-500 bg-white dark:bg-brand-dark transition-colors duration-300 min-h-screen">
      
      <div className="p-6 space-y-8">
        
        {/* HEADER - FLAT & CLEAN */}
        <div className="flex justify-between items-center">
            <div>
                <p className="text-xs uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">{greeting}</p>
                <h1 className="text-3xl font-black italic uppercase text-black dark:text-white leading-none">
                    {user?.full_name.split(' ')[0]}
                </h1>
            </div>
            <div 
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 border-2 border-transparent hover:border-brand-accent flex items-center justify-center overflow-hidden cursor-pointer transition-colors"
                onClick={() => openModal('stats')}
            >
                {user?.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-brand-accent font-black text-xl">{user?.full_name.charAt(0)}</div>
                )}
            </div>
        </div>

        {/* 1. HERO SECTION - "THE MAIN ONE" - FLAT FIRE DESIGN */}
        <div className="relative w-full bg-brand-accent rounded-none md:rounded-3xl shadow-none overflow-hidden">
             {/* Abstract Fire Shapes */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

             <div className="relative p-6 md:p-10 flex flex-col items-center justify-center text-center">
                 
                 <div className="flex items-center gap-2 mb-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white animate-pulse" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.314.218.634.468.9.75ZM12 7a2 2 0 0 1-1-2c-4 4-5 9-1 13 4 4 9 3 13-1-3 0-5-3-5-7 0-1.5.5-2.5 1-3Z"/></svg>
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Desafio 15 Dias</span>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white animate-pulse" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.314.218.634.468.9.75ZM12 7a2 2 0 0 1-1-2c-4 4-5 9-1 13 4 4 9 3 13-1-3 0-5-3-5-7 0-1.5.5-2.5 1-3Z"/></svg>
                 </div>

                 <h2 className="text-6xl font-black text-white italic tracking-tighter mb-4">
                     {completedCount}<span className="text-3xl opacity-50 not-italic">/15</span>
                 </h2>

                 {/* Custom Flat Progress Bar */}
                 <div className="w-full max-w-xs h-6 bg-black/20 rounded-none skew-x-[-12deg] overflow-hidden mb-4 relative">
                     <div 
                        className="h-full bg-white transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                     ></div>
                     {/* Striped Texture Overlay */}
                     <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10"></div>
                 </div>

                 {nextWorkout ? (
                    <button 
                        onClick={() => selectWorkout(nextWorkout.id)}
                        className="bg-white text-brand-accent px-8 py-3 rounded-none skew-x-[-12deg] font-black uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none"
                    >
                        <span className="skew-x-[12deg] inline-block">Iniciar Dia {nextWorkout.day_number}</span>
                    </button>
                 ) : (
                     <div className="bg-white text-brand-accent px-6 py-2 font-bold text-sm rounded-full">
                         Desafio Concluído! 🏆
                     </div>
                 )}
             </div>
        </div>

        {/* 2. TIMELINE - "BELOW THAT, 15 DAYS" */}
        <section>
            <div className="flex justify-between items-end mb-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
                <h3 className="text-lg font-black italic text-black dark:text-white uppercase">Sua Jornada</h3>
                <span className="text-xs font-bold text-brand-accent uppercase">{progressPercent}% Completo</span>
            </div>
            
            {/* Horizontal Scroll Linear Tracker */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {challengeDays.map((d) => {
                    const isCheckPoint = d.day === 7;
                    const isFinal = d.day === 15;
                    
                    // Style determination based on state
                    let containerStyle = "border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-400";
                    let content = <span className="text-sm font-bold">{d.day}</span>;

                    if (d.status === 'completed') {
                        containerStyle = "bg-brand-accent border-brand-accent text-white shadow-[0_4px_10px_rgba(255,85,0,0.3)]";
                        content = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
                    } else if (d.status === 'current') {
                        containerStyle = "border-brand-accent bg-brand-accent/10 text-brand-accent animate-pulse border-2";
                        content = <span className="text-sm font-black">{d.day}</span>;
                    }

                    // Special Markers
                    if (isCheckPoint && d.status !== 'completed') {
                         content = <span className="text-[10px] font-black uppercase tracking-tighter">Meio</span>
                         if(d.status !== 'current') containerStyle += " border-yellow-500/50 text-yellow-500"
                    }
                    if (isFinal && d.status !== 'completed') {
                         content = <span className="text-lg">🏆</span>
                         if(d.status !== 'current') containerStyle += " border-brand-accent/50"
                    }

                    return (
                        <div key={d.day} className="flex flex-col items-center gap-2 shrink-0">
                            <div 
                                onClick={() => d.id && selectWorkout(d.id)}
                                className={`w-12 h-14 rounded-lg flex items-center justify-center border transition-all duration-200 cursor-pointer ${containerStyle}`}
                            >
                                {content}
                            </div>
                            {/* Connector Line Logic (visual only) */}
                            {d.day < 15 && (
                                <div className={`hidden w-4 h-1 ${d.status === 'completed' ? 'bg-brand-accent' : 'bg-gray-200 dark:bg-zinc-800'}`}></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 3. ANALYTICS - FLAT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Weight Flat Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 border-l-4 border-brand-accent shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Peso Atual</h3>
                    <button onClick={() => openModal('weight')} className="text-brand-accent hover:text-white hover:bg-brand-accent p-1 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                    </button>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black dark:text-white tracking-tighter">
                        {user?.current_weight_kg}
                    </span>
                    <span className="text-sm font-bold text-gray-400">kg</span>
                </div>
                <div className="mt-4 h-24 opacity-80 grayscale hover:grayscale-0 transition-all">
                     {/* Simplified chart inside flat card */}
                     {user?.weight_history && <WeightChart data={user.weight_history} />}
                </div>
            </div>

            {/* Daily Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Water Flat */}
                <button 
                    onClick={() => openModal('water')}
                    className="bg-blue-500 text-white p-4 flex flex-col justify-between items-start shadow-sm hover:brightness-110 transition-all"
                >
                    <div className="w-full flex justify-between">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                         <span className="font-black text-xl">{waterIntakeL}L</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80 mt-4">Hidratação</span>
                    <div className="w-full h-1 bg-black/20 mt-2">
                        <div className="h-full bg-white" style={{ width: `${Math.min(100, (waterIntakeL/2.5)*100)}%` }}></div>
                    </div>
                </button>

                {/* Journal Flat */}
                <button 
                    onClick={() => openModal('journal')}
                    className="bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white p-4 flex flex-col justify-between items-start shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60 mt-4 text-left">Diário &<br/>Notas</span>
                </button>
            </div>
        </div>

        {/* 4. DAILY TIP (Flat Banner at bottom) */}
        {dailyTip && (
            <div className="bg-zinc-50 dark:bg-zinc-900 border-l-4 border-black dark:border-white p-4">
                 <span className="text-[10px] font-black uppercase text-brand-accent tracking-widest mb-1 block">{dailyTip.category.toUpperCase()}</span>
                 <p className="text-sm font-medium text-black dark:text-gray-300 italic">"{dailyTip.content}"</p>
            </div>
        )}

      </div>

      {/* Tracking Modal Component */}
      <TrackingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={
            modalType === 'weight' ? 'REGISTRAR PESO' : 
            modalType === 'water' ? 'REGISTRAR ÁGUA' : 
            modalType === 'stats' ? 'ATUALIZAR DADOS' : 'DIÁRIO PESSOAL'
        }
        type={modalType}
        currentValue={modalType === 'stats' ? { height: user?.height_cm || 0, target: user?.target_weight_kg || 0, current: user?.current_weight_kg || 0 } : undefined}
        onSave={(val) => {
            if(modalType === 'weight') logWeight(Number(val));
            if(modalType === 'water') logWater(Number(val));
            if(modalType === 'stats') updateProfileStats(val.height, val.target, val.current);
            if(modalType === 'journal') logJournal(val);
        }}
      />

      {/* Gamification: New Badge Unlocked Modal */}
      {newBadgeUnlocked && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90" onClick={clearNewBadge}></div>
              <div className="relative bg-brand-accent w-full max-w-sm p-8 text-center border-4 border-white shadow-2xl animate-in zoom-in duration-300">
                  <div className="text-6xl mb-4 animate-bounce">{newBadgeUnlocked.icon}</div>
                  <h2 className="text-3xl font-black italic text-white mb-2 uppercase">Conquista!</h2>
                  <h3 className="text-xl font-bold text-black mb-4">{newBadgeUnlocked.title}</h3>
                  <p className="text-white/90 font-medium mb-6">{newBadgeUnlocked.description}</p>
                  <button 
                    onClick={clearNewBadge}
                    className="bg-black text-white font-bold py-3 px-8 uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                      Continuar
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};