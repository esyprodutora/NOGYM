import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { Workout } from '../types';

export const Program: React.FC = () => {
  const { workouts, selectWorkout } = useAppStore();

  const completedCount = useMemo(() => workouts.filter(w => w.completed).length, [workouts]);
  const progress = (completedCount / workouts.length) * 100;

  return (
    <div className="pb-24 md:pb-8 animate-in fade-in duration-500">
      <div className="p-6 pt-8 md:p-0">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Seu Programa</h1>
        <p className="text-gray-500 dark:text-brand-muted text-sm mb-6">28 dias para transformar seu corpo e mente.</p>

        {/* Progress Bar */}
        <div className="mb-8 bg-white dark:bg-brand-surface p-6 rounded-2xl border border-gray-100 dark:border-brand-border shadow-sm">
            <div className="flex justify-between text-xs text-gray-500 dark:text-brand-muted mb-2 font-medium">
                <span>Progresso Total</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-accent rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
        </div>
        
        {/* Responsive List/Grid */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {workouts.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onPress={() => selectWorkout(workout.id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Optimized List Item
const WorkoutCard = React.memo(({ workout, onPress }: { workout: Workout; onPress: () => void }) => {
  return (
    <div 
      onClick={onPress}
      className={`relative group overflow-hidden rounded-xl border ${
          workout.completed 
          ? 'border-brand-accent/30 bg-brand-accent/5 dark:bg-brand-accent/10' 
          : 'border-gray-200 dark:border-brand-border bg-white dark:bg-brand-surface'
      } transition-all active:scale-[0.98] cursor-pointer hover:border-brand-accent/50 hover:shadow-lg`}
    >
      <div className="flex p-4 gap-4 items-center">
        {/* Thumbnail / Status */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 shrink-0">
          <img src={workout.thumbnail_url} alt={workout.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          
          {/* Overlay Status Icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            {workout.is_locked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            ) : workout.completed ? (
               <div className="bg-brand-accent rounded-full p-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </div>
            ) : (
               <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
               </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-1">
             <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-brand-muted uppercase">Dia {workout.day_number}</span>
             <span className="text-[10px] bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-gray-600 dark:text-brand-muted border border-gray-200 dark:border-white/5">{workout.duration_minutes} min</span>
          </div>
          <h3 className={`font-medium leading-tight text-base ${workout.is_locked ? 'text-gray-400 dark:text-brand-muted' : 'text-black dark:text-white group-hover:text-brand-accent transition-colors'}`}>
            {workout.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-brand-muted mt-1 line-clamp-1">{workout.description}</p>
        </div>
      </div>
      
      {/* Blur overlay for locked items to simulate upsell view */}
      {workout.is_locked && (
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 dark:bg-brand-dark/10 flex items-center justify-center z-10 pointer-events-none">
        </div>
      )}
    </div>
  );
});