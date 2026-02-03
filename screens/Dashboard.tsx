import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { WeightChart } from '../components/WeightChart';
import { TrackingModal } from '../components/TrackingModal';
import { AppScreen } from '../types';

export const Dashboard: React.FC = () => {
  const { user, workouts, selectWorkout, dailyTip, waterIntakeL, logWeight, logWater } = useAppStore();
  const [greeting, setGreeting] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'water' | 'journal'>('weight');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const openModal = (type: 'weight' | 'water' | 'journal') => {
      setModalType(type);
      setModalOpen(true);
  };

  const nextWorkout = workouts.find(w => !w.completed);
  // Calculates total loss based on current vs starting
  const totalLoss = user ? (user.starting_weight_kg - user.current_weight_kg).toFixed(1) : 0;
  
  return (
    <div className="pb-24 animate-in fade-in duration-500 bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      
      <div className="p-6 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500 dark:text-brand-muted font-medium">{greeting},</p>
                <h1 className="text-2xl font-bold text-black dark:text-white">{user?.full_name.split(' ')[0]}</h1>
            </div>
            <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-full bg-white dark:bg-brand-surface border border-gray-100 dark:border-brand-border flex items-center justify-center text-gray-600 dark:text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                 </button>
            </div>
        </div>

        {/* Daily Wisdom / Tip Card (Premium Feature) */}
        {dailyTip && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a1b26] to-black border border-brand-accent/20 shadow-lg p-5">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v5.59l-3.29 3.29 1.41 1.42 4-4a1 1 0 0 0 .88-1.59V7a1 1 0 0 0-1-1z"/></svg>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded uppercase tracking-wider border border-brand-accent/20">
                            {dailyTip.category}
                        </span>
                        <span className="text-[10px] text-brand-muted uppercase tracking-wider">Dica do Dia</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 leading-snug">{dailyTip.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light">"{dailyTip.content}"</p>
                </div>
            </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
             {/* Water Stat */}
             <div className="bg-white dark:bg-brand-surface p-3 rounded-2xl border border-gray-200 dark:border-brand-border flex flex-col items-center justify-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                 </div>
                 <span className="text-lg font-bold text-black dark:text-white">{waterIntakeL}L</span>
                 <span className="text-[10px] text-gray-500 dark:text-brand-muted uppercase font-semibold">Hidratação</span>
             </div>
             
             {/* Streak Stat */}
             <div className="bg-white dark:bg-brand-surface p-3 rounded-2xl border border-gray-200 dark:border-brand-border flex flex-col items-center justify-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 2.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2zm-2 0a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2zm-2 0a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2zM9 7H4a1 1 0 0 0-1 1v12.5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9.5a.5.5 0 0 1-.5-.5V7zm8 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                 </div>
                 <span className="text-lg font-bold text-black dark:text-white">{user?.streak_days}</span>
                 <span className="text-[10px] text-gray-500 dark:text-brand-muted uppercase font-semibold">Sequência</span>
             </div>

             {/* Recovery Stat (Static for now, but visually completes the grid) */}
             <div className="bg-white dark:bg-brand-surface p-3 rounded-2xl border border-gray-200 dark:border-brand-border flex flex-col items-center justify-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                 </div>
                 <span className="text-lg font-bold text-black dark:text-white">94%</span>
                 <span className="text-[10px] text-gray-500 dark:text-brand-muted uppercase font-semibold">Recuperação</span>
             </div>
        </div>

        {/* Quick Actions (Functional) */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            <button 
                onClick={() => openModal('water')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-brand-surface border border-gray-200 dark:border-brand-border shrink-0 shadow-sm active:scale-95 transition-transform"
            >
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">+</div>
                <span className="text-xs font-bold text-black dark:text-white">Água</span>
            </button>
            <button 
                onClick={() => openModal('weight')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-brand-surface border border-gray-200 dark:border-brand-border shrink-0 shadow-sm active:scale-95 transition-transform"
            >
                <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-xs">+</div>
                <span className="text-xs font-bold text-black dark:text-white">Peso</span>
            </button>
             <button 
                onClick={() => openModal('journal')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-brand-surface border border-gray-200 dark:border-brand-border shrink-0 shadow-sm active:scale-95 transition-transform"
            >
                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">+</div>
                <span className="text-xs font-bold text-black dark:text-white">Diário</span>
            </button>
        </div>

        {/* Featured Card - Next Workout */}
        {nextWorkout && (
            <div className="relative overflow-hidden rounded-3xl cursor-pointer group shadow-xl" onClick={() => selectWorkout(nextWorkout.id)}>
                <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/30"></div>
                <img src={nextWorkout.thumbnail_url} className="w-full h-48 object-cover" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex justify-between items-end">
                        <div>
                             <span className="text-[10px] font-bold text-brand-accent bg-white/90 px-2 py-0.5 rounded backdrop-blur-sm mb-2 inline-block uppercase tracking-wider">
                                Próximo: Dia {nextWorkout.day_number}
                            </span>
                            <h3 className="text-2xl font-bold text-white leading-tight mb-1">{nextWorkout.title}</h3>
                             <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span>{nextWorkout.duration_minutes} min</span>
                                <span>•</span>
                                <span>{nextWorkout.difficulty}</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Weight Chart Section - Expanded & Cleaned Up */}
        <section>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-black dark:text-white">Tendência de Peso</h2>
                <div className="flex items-center gap-1 text-xs text-brand-accent font-semibold bg-brand-accent/10 px-2 py-1 rounded">
                    <span>-{totalLoss}kg</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                </div>
            </div>
            <div className="bg-white dark:bg-brand-surface rounded-3xl p-6 border border-gray-200 dark:border-brand-border shadow-lg">
                {user?.weight_history && <WeightChart data={user.weight_history} />}
                
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-brand-border/50">
                    <div>
                        <span className="block text-[10px] text-gray-500 dark:text-brand-muted uppercase">Inicial</span>
                        <span className="text-sm font-bold text-black dark:text-white">{user?.starting_weight_kg}kg</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] text-gray-500 dark:text-brand-muted uppercase">Atual</span>
                        <span className="text-xl font-bold text-brand-accent">{user?.current_weight_kg}kg</span>
                    </div>
                     <div className="text-right">
                        <span className="block text-[10px] text-gray-500 dark:text-brand-muted uppercase">Meta</span>
                        <span className="text-sm font-bold text-black dark:text-white">{user?.target_weight_kg}kg</span>
                    </div>
                </div>
            </div>
        </section>
      </div>

      {/* Tracking Modal Component */}
      <TrackingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalType === 'weight' ? 'Registrar Peso' : modalType === 'water' ? 'Registrar Água' : 'Diário Pessoal'}
        type={modalType}
        onSave={(val) => {
            if(modalType === 'weight') logWeight(Number(val));
            if(modalType === 'water') logWater(Number(val));
            // journal logic would go here
        }}
      />
    </div>
  );
};