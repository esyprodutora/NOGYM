import React from 'react';
import { useAppStore } from '../store/appStore';
import { AppScreen } from '../types';
import { Button } from '../components/Button';

export const WorkoutDetails: React.FC = () => {
  const { workouts, selectedWorkoutId, setScreen, toggleCompleteWorkout } = useAppStore();
  
  const workout = workouts.find(w => w.id === selectedWorkoutId);

  if (!workout) return null;

  if (workout.is_locked) {
      setTimeout(() => setScreen(AppScreen.UPSELL), 100);
      return null;
  }

  return (
    <div className="min-h-full bg-brand-dark flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
            onClick={() => setScreen(AppScreen.PROGRAM)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Video Placeholder */}
      <div className="w-full aspect-video bg-gray-900 relative flex items-center justify-center border-b border-brand-border">
         <img src={workout.thumbnail_url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
         <div className="w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(164,0,109,0.5)] cursor-pointer hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">
                {workout.difficulty.toUpperCase()}
            </span>
            <span className="text-xs text-brand-muted flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {workout.duration_minutes} Minutos
            </span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">{workout.title}</h1>
        <p className="text-brand-muted leading-relaxed mb-8">
            {workout.description} 
            <br/><br/>
            Foque na forma em vez da velocidade. Mantenha seu core ativado durante os movimentos. Esta sessão foca em estabilizadores musculares profundos.
        </p>

        <div className="mt-auto">
            <Button 
                variant={workout.completed ? "outline" : "primary"} 
                fullWidth 
                onClick={() => {
                    toggleCompleteWorkout(workout.id);
                    setScreen(AppScreen.PROGRAM);
                }}
            >
                {workout.completed ? "Marcar como Incompleto" : "Concluir Treino"}
            </Button>
        </div>
      </div>
    </div>
  );
};