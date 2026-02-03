import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { Workout } from '../types';

export const Program: React.FC = () => {
  const { workouts, selectWorkout } = useAppStore();

  const completedCount = useMemo(() => workouts.filter(w => w.completed).length, [workouts]);
  const progress = (completedCount / workouts.length) * 100;

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="p-6 pt-8">
        <h1 className="text-2xl font-bold text-white mb-2">Seu Programa</h1>
        <p className="text-brand-muted text-sm mb-6">28 dias para transformar seu corpo e mente.</p>

        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between text-xs text-brand-muted mb-2">
                <span>Progresso Total</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-brand-surface rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-accent rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
        
        <div className="space-y-4">
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
      className={`relative group overflow-hidden rounded-xl border ${workout.completed ? 'border-brand-accent/30 bg-brand-accent/5' : 'border-brand-border bg-brand-surface'} transition-all active:scale-[0.98] cursor-pointer`}
    >
      <div className="flex p-4 gap-4">
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
               <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
               </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start">
             <span className="text-[10px] font-bold tracking-wider text-brand-muted uppercase mb-1">Dia {workout.day_number}</span>
             <span className="text-[10px] bg-brand-border/50 px-2 py-0.5 rounded text-brand-muted">{workout.duration_minutes} min</span>
          </div>
          <h3 className={`font-medium leading-tight ${workout.is_locked ? 'text-brand-muted' : 'text-white'}`}>
            {workout.title}
          </h3>
          <p className="text-xs text-brand-muted mt-1 line-clamp-1">{workout.description}</p>
        </div>
      </div>
      
      {/* Blur overlay for locked items to simulate upsell view */}
      {workout.is_locked && (
        <div className="absolute inset-0 backdrop-blur-[2px] bg-brand-dark/10 flex items-center justify-center">
          {/* Icon is already handled in thumbnail, this adds a subtle texture */}
        </div>
      )}
    </div>
  );
});