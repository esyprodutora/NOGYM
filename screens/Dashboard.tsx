import React from 'react';
import { useAppStore } from '../store/appStore';
import { WeightChart } from '../components/WeightChart';
import { AppScreen } from '../types';

export const Dashboard: React.FC = () => {
  const { user, workouts, selectWorkout } = useAppStore();

  const nextWorkout = workouts.find(w => !w.completed);
  const totalLoss = user ? (user.starting_weight_kg - user.current_weight_kg).toFixed(1) : 0;
  const progressToGoal = user ? ((user.starting_weight_kg - user.current_weight_kg) / (user.starting_weight_kg - user.target_weight_kg)) * 100 : 0;

  return (
    <div className="pb-24 animate-in fade-in duration-500 bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      
      <div className="p-6 space-y-8">
        
        {/* Next Gen Stats Row */}
        <div className="grid grid-cols-3 gap-3">
             <div className="bg-white dark:bg-brand-surface p-3 rounded-2xl border border-gray-200 dark:border-brand-border flex flex-col items-center justify-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                 </div>
                 <span className="text-lg font-bold text-black dark:text-white">1.2L</span>
                 <span className="text-[10px] text-gray-500 dark:text-brand-muted uppercase font-semibold">Hidratação</span>
             </div>
             
             <div className="bg-white dark:bg-brand-surface p-3 rounded-2xl border border-gray-200 dark:border-brand-border flex flex-col items-center justify-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 2.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2zm-2 0a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2zm-2 0a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2zM9 7H4a1 1 0 0 0-1 1v12.5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9.5a.5.5 0 0 1-.5-.5V7zm8 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                 </div>
                 <span className="text-lg font-bold text-black dark:text-white">{user?.streak_days}</span>
                 <span className="text-[10px] text-gray-500 dark:text-brand-muted uppercase font-semibold">Sequência</span>
             </div>

             <div className="bg-white dark:bg-brand-surface p-3 rounded-2xl border border-gray-200 dark:border-brand-border flex flex-col items-center justify-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                 </div>
                 <span className="text-lg font-bold text-black dark:text-white">94%</span>
                 <span className="text-[10px] text-gray-500 dark:text-brand-muted uppercase font-semibold">Recuperação</span>
             </div>
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

        {/* Body Evolution Section (Moved from Profile) */}
        <section>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-black dark:text-white">Evolução Corporal</h2>
                <span className="text-brand-accent text-sm font-semibold">-{totalLoss}kg Total</span>
            </div>
            
            <div className="bg-white dark:bg-brand-surface rounded-2xl p-1 border border-gray-200 dark:border-brand-border overflow-hidden shadow-lg">
                <div className="grid grid-cols-2 gap-0.5 bg-gray-100 dark:bg-brand-dark/50">
                    <div className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-900 group">
                        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale" alt="Antes" />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">01 Jan</div>
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="text-xl font-bold text-black dark:text-white block">{user?.starting_weight_kg}</span>
                            <span className="text-[10px] text-gray-600 dark:text-gray-400 uppercase">Inicial</span>
                        </div>
                    </div>

                    <div className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-900 overflow-hidden">
                            <div className="absolute inset-0 bg-brand-accent/10 z-10"></div>
                            <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="Atual" />
                            <div className="absolute top-3 right-3 bg-brand-accent px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">Atual</div>
                            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                            <span className="text-2xl font-bold text-white block drop-shadow-md">{user?.current_weight_kg}</span>
                            <span className="text-[10px] text-brand-accent uppercase font-bold">Hoje</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-brand-surface p-4 border-t border-gray-100 dark:border-brand-border">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-brand-muted mb-2">
                        <span>Progresso da Meta</span>
                        <span>{Math.round(progressToGoal)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-brand-dark rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent" style={{ width: `${progressToGoal}%` }}></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Weight Chart Section (Moved from Profile) */}
        <section>
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Análise de Tendência</h2>
            <div className="bg-white dark:bg-brand-surface rounded-2xl p-4 border border-gray-200 dark:border-brand-border shadow-lg">
                {user?.weight_history && <WeightChart data={user.weight_history} />}
            </div>
        </section>

      </div>
    </div>
  );
};