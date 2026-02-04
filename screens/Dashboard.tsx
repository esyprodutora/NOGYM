import React, { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { WeightChart } from '../components/WeightChart';
import { TrackingModal } from '../components/TrackingModal';
import { AppScreen } from '../types';

export const Dashboard: React.FC = () => {
  const { user, workouts, selectWorkout, dailyTip, waterIntakeL, logWeight, logWater, logJournal, updateProfileStats, newBadgeUnlocked, clearNewBadge, badges } = useAppStore();
  const [greeting, setGreeting] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'water' | 'journal' | 'stats'>('weight');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const openModal = (type: 'weight' | 'water' | 'journal' | 'stats') => {
      setModalType(type);
      setModalOpen(true);
  };

  const nextWorkout = workouts.find(w => !w.completed);
  
  // --- GAMIFICATION LOGIC ---
  const completedCount = workouts.filter(w => w.completed).length;
  const totalWorkouts = workouts.length;
  
  // Level Calculation
  const getLevel = (count: number) => {
      if (count >= 21) return { title: 'Elite', color: 'from-fuchsia-600 to-purple-600', next: 28 };
      if (count >= 14) return { title: 'Imparável', color: 'from-yellow-500 to-orange-500', next: 21 };
      if (count >= 7) return { title: 'Consistente', color: 'from-blue-500 to-cyan-500', next: 14 };
      return { title: 'Iniciante', color: 'from-brand-accent to-pink-600', next: 7 };
  };
  
  const currentLevel = getLevel(completedCount);
  const levelProgress = Math.min(100, (completedCount / totalWorkouts) * 100);
  // Calculate progress relative to next level tier for the bar
  const prevTierLimit = currentLevel.next === 7 ? 0 : currentLevel.next === 14 ? 7 : currentLevel.next === 21 ? 14 : 21;
  const tierProgress = ((completedCount - prevTierLimit) / (currentLevel.next - prevTierLimit)) * 100;


  // --- WEEKLY CONSISTENCY LOGIC ---
  // Find current "week" block (1-7, 8-14, etc.) based on next workout
  const currentDay = nextWorkout ? nextWorkout.day_number : 28;
  const startDay = Math.floor((currentDay - 1) / 7) * 7 + 1;
  const endDay = startDay + 6;
  const weekWorkouts = workouts.filter(w => w.day_number >= startDay && w.day_number <= endDay);

  // --- BMI LOGIC ---
  const heightM = user ? user.height_cm / 100 : 1.6;
  const bmiValue = user ? (user.current_weight_kg / (heightM * heightM)).toFixed(1) : "0";
  const getBMICategory = (val: number) => {
     if (val < 18.5) return "Abaixo do peso";
     if (val < 24.9) return "Saudável";
     if (val < 29.9) return "Sobrepeso";
     return "Obesidade";
  };
  const bmiCategory = getBMICategory(Number(bmiValue));

  // --- WATER VISUAL ---
  const waterTarget = 2.5;
  const waterPercentage = Math.min(100, (waterIntakeL / waterTarget) * 100);
  const waterStrokeDash = 2 * Math.PI * 18; // r=18
  const waterStrokeOffset = waterStrokeDash - (waterPercentage / 100) * waterStrokeDash;

  return (
    <div className="pb-24 animate-in fade-in duration-500 bg-brand-light dark:bg-brand-dark transition-colors duration-300 relative">
      
      <div className="p-6 space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500 dark:text-brand-muted font-medium mb-0.5">{greeting},</p>
                <h1 className="text-2xl font-bold text-black dark:text-white">{user?.full_name.split(' ')[0]}</h1>
            </div>
            <div 
                className="w-10 h-10 rounded-full bg-white dark:bg-brand-surface border border-gray-100 dark:border-brand-border flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => openModal('stats')}
            >
                {user?.avatar_url ? (
                    <img src={user.avatar_url} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-brand-accent font-bold text-lg">{user?.full_name.charAt(0)}</div>
                )}
            </div>
        </div>

        {/* 1. VISUAL GAMIFICATION CARD (NEW) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentLevel.color} opacity-90 transition-all duration-1000`}></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Nível Atual</span>
                        <h2 className="text-3xl font-bold tracking-tight mt-1">{currentLevel.title}</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                        <span className="text-lg font-bold">{Math.floor((completedCount / totalWorkouts) * 100)}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium opacity-90">
                        <span>{completedCount} Treinos</span>
                        <span>Próximo: {currentLevel.next}</span>
                    </div>
                    <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                        <div 
                            className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-full transition-all duration-1000 ease-out relative" 
                            style={{ width: `${tierProgress}%` }}
                        >
                             <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
                        </div>
                    </div>
                    <p className="text-[10px] opacity-70 mt-1">
                        Complete mais {currentLevel.next - completedCount} treinos para evoluir.
                    </p>
                </div>
            </div>
        </div>

        {/* 2. WEEKLY CONSISTENCY (NEW) */}
        <section>
            <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="text-base font-bold text-black dark:text-white">Sua Semana</h3>
                <span className="text-xs text-brand-muted">Semana {Math.ceil(endDay / 7)} de 4</span>
            </div>
            
            <div className="bg-white dark:bg-brand-surface p-4 rounded-2xl border border-gray-200 dark:border-brand-border shadow-sm flex justify-between items-center">
                {weekWorkouts.map((w, index) => {
                    const isDone = w.completed;
                    const isLocked = w.is_locked && !isDone;
                    
                    return (
                        <div key={w.id} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold">D{w.day_number}</span>
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isDone 
                                ? 'bg-brand-accent border-brand-accent shadow-[0_0_10px_rgba(164,0,109,0.4)] scale-110' 
                                : isLocked 
                                    ? 'bg-transparent border-gray-200 dark:border-white/10 text-gray-300'
                                    : 'bg-white dark:bg-brand-surface border-brand-accent text-brand-accent'
                            }`}>
                                {isDone ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-gray-200 dark:bg-white/10' : 'bg-brand-accent'}`}></div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 3. ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weight Chart Container */}
            <section className="bg-white dark:bg-brand-surface rounded-3xl p-6 border border-gray-200 dark:border-brand-border shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                            Peso
                        </h2>
                        <span className="text-xs text-gray-500">Tendência últimos 30 dias</span>
                    </div>
                    <div className="text-right">
                         <span className="block text-2xl font-bold text-brand-accent">
                             {(user?.current_weight_kg || 0).toFixed(1)} <span className="text-sm text-gray-500">kg</span>
                         </span>
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${Number(bmiValue) < 25 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                            IMC {bmiValue}
                        </span>
                    </div>
                </div>

                <div className="h-40 relative z-10">
                     {user?.weight_history && <WeightChart data={user.weight_history} />}
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            </section>

            {/* Daily Tracker Grid */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* Visual Water Tracker */}
                <button 
                    onClick={() => openModal('water')}
                    className="bg-blue-500/5 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 hover:border-blue-500 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden group transition-all"
                >
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-200 dark:text-blue-900/30" />
                            <circle 
                                cx="50%" cy="50%" r="18" 
                                stroke="currentColor" strokeWidth="4" fill="transparent" 
                                strokeDasharray={waterStrokeDash}
                                strokeDashoffset={waterStrokeOffset}
                                strokeLinecap="round"
                                className="text-blue-500 transition-all duration-1000 ease-out" 
                            />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                         </div>
                    </div>
                    <div className="text-center relative z-10">
                         <span className="block text-xl font-bold text-black dark:text-white leading-none">{waterIntakeL}L</span>
                         <span className="text-[10px] uppercase font-bold text-blue-500">Hidratação</span>
                    </div>
                </button>

                {/* Vertical Stack for Weight & Journal */}
                <div className="flex flex-col gap-4">
                     <button 
                        onClick={() => openModal('weight')}
                        className="flex-1 bg-brand-surface border border-gray-200 dark:border-brand-border hover:border-brand-accent/50 rounded-2xl p-3 flex items-center gap-3 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                        </div>
                        <div className="text-left">
                            <span className="block text-xs text-gray-500 dark:text-brand-muted">Registrar</span>
                            <span className="block text-sm font-bold text-black dark:text-white">Peso</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => openModal('journal')}
                        className="flex-1 bg-brand-surface border border-gray-200 dark:border-brand-border hover:border-purple-500/50 rounded-2xl p-3 flex items-center gap-3 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </div>
                        <div className="text-left">
                            <span className="block text-xs text-gray-500 dark:text-brand-muted">Diário</span>
                            <span className="block text-sm font-bold text-black dark:text-white">Notas</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        {/* 4. TODAY'S WORKOUT (Bottom Hero) */}
        {nextWorkout && (
            <div>
                 <h2 className="text-lg font-bold text-black dark:text-white mb-4">Próximo Passo</h2>
                 <div className="relative overflow-hidden rounded-[2rem] cursor-pointer group shadow-2xl" onClick={() => selectWorkout(nextWorkout.id)}>
                    <div className="absolute inset-0 bg-black/20 z-10 transition-colors group-hover:bg-black/10"></div>
                    <img src={nextWorkout.thumbnail_url} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/60 to-transparent">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-bold text-black bg-white px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
                                    Dia {nextWorkout.day_number}
                                </span>
                                <h3 className="text-2xl font-bold text-white leading-tight mb-1">{nextWorkout.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-200 font-medium">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {nextWorkout.duration_minutes} min
                                    </span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                    <span>{nextWorkout.difficulty}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-brand-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(164,0,109,0.5)] transform group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 5. DAILY TIP (Moved to bottom as secondary content) */}
        {dailyTip && (
            <div className="bg-gray-50 dark:bg-brand-surface p-5 rounded-2xl border border-gray-200 dark:border-brand-border flex items-start gap-4">
                 <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                 </div>
                 <div>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">Dica do Dia • {dailyTip.category}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{dailyTip.content}"</p>
                 </div>
            </div>
        )}

      </div>

      {/* Tracking Modal Component */}
      <TrackingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={
            modalType === 'weight' ? 'Registrar Peso' : 
            modalType === 'water' ? 'Registrar Água' : 
            modalType === 'stats' ? 'Atualizar Dados' : 'Diário Pessoal'
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
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={clearNewBadge}></div>
              <div className="relative bg-brand-surface w-full max-w-sm rounded-3xl p-8 text-center border-2 border-brand-accent shadow-[0_0_50px_rgba(164,0,109,0.5)] animate-in zoom-in duration-300">
                  <div className="text-6xl mb-4 animate-bounce">{newBadgeUnlocked.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Conquista Desbloqueada!</h2>
                  <h3 className="text-xl font-bold text-brand-accent mb-4">{newBadgeUnlocked.title}</h3>
                  <p className="text-gray-300 mb-6">{newBadgeUnlocked.description}</p>
                  <button 
                    onClick={clearNewBadge}
                    className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
                  >
                      Incrível!
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};