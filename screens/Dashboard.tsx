import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { WeightChart } from '../components/WeightChart';
import { TrackingModal } from '../components/TrackingModal';
import { AppScreen } from '../types';

export const Dashboard: React.FC = () => {
  const { user, workouts, selectWorkout, dailyTip, waterIntakeL, logWeight, logWater, logJournal, updateProfileStats, updateProgressPhoto, newBadgeUnlocked, clearNewBadge, badges } = useAppStore();
  const [greeting, setGreeting] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'weight' | 'water' | 'journal' | 'stats'>('weight');

  const startPhotoInputRef = useRef<HTMLInputElement>(null);
  const currentPhotoInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'current') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  updateProgressPhoto(type, ev.target.result as string);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const nextWorkout = workouts.find(w => !w.completed);
  
  // BMI calculation logic
  const heightM = user ? user.height_cm / 100 : 1.6;
  const bmiValue = user ? (user.current_weight_kg / (heightM * heightM)).toFixed(1) : "0";
  
  const getBMICategory = (val: number) => {
     if (val < 18.5) return "Abaixo do peso";
     if (val < 24.9) return "Saudável";
     if (val < 29.9) return "Sobrepeso";
     return "Obesidade";
  };
  const bmiCategory = getBMICategory(Number(bmiValue));

  // Gamification: Next Badge
  const nextBadge = badges.find(b => !user?.earned_badges.includes(b.id));

  return (
    <div className="pb-24 animate-in fade-in duration-500 bg-brand-light dark:bg-brand-dark transition-colors duration-300 relative">
      
      <div className="p-6 space-y-6">
        
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

        {/* --- TRANSFORMATION SECTION (New Top Feature) --- */}
        <section>
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Sua Transformação</h2>
            <div className="grid grid-cols-2 gap-4">
                {/* Start Photo */}
                <div 
                    onClick={() => startPhotoInputRef.current?.click()}
                    className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-brand-surface border-2 border-dashed border-gray-300 dark:border-white/10 relative overflow-hidden cursor-pointer group hover:border-brand-accent/50 transition-colors"
                >
                    <input type="file" ref={startPhotoInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'start')} />
                    {user?.start_photo_url ? (
                        <>
                             <img src={user.start_photo_url} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        </>
                    ) : (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-brand-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path><line x1="16" y1="5" x2="22" y2="5"></line><line x1="19" y1="2" x2="19" y2="8"></line><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                            <span className="text-xs mt-2 font-medium">Adicionar Foto</span>
                         </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                        Início
                    </div>
                </div>

                {/* Current Photo */}
                <div 
                    onClick={() => currentPhotoInputRef.current?.click()}
                    className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-brand-surface border-2 border-dashed border-gray-300 dark:border-white/10 relative overflow-hidden cursor-pointer group hover:border-brand-accent/50 transition-colors"
                >
                     <input type="file" ref={currentPhotoInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'current')} />
                     {user?.current_photo_url ? (
                        <>
                             <img src={user.current_photo_url} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        </>
                    ) : (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-brand-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            <span className="text-xs mt-2 font-medium">Adicionar Foto</span>
                         </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-brand-accent/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                        Hoje
                    </div>
                </div>
            </div>
        </section>

        {/* Daily Wisdom / Tip Card */}
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
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 leading-snug">{dailyTip.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light">"{dailyTip.content}"</p>
                </div>
            </div>
        )}

        {/* --- DAILY TRACKER --- */}
        <section>
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">Registro Diário</h2>
            <div className="grid grid-cols-3 gap-3">
                {/* Water Card */}
                <button 
                    onClick={() => openModal('water')}
                    className="bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    </div>
                    <div className="text-center">
                         <span className="block text-lg font-bold text-black dark:text-white leading-none">{waterIntakeL}L</span>
                         <span className="text-[10px] uppercase font-bold text-blue-500">Hidratação</span>
                    </div>
                </button>

                {/* Weight Log Card */}
                <button 
                    onClick={() => openModal('weight')}
                    className="bg-brand-accent/10 border border-brand-accent/20 hover:bg-brand-accent/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-lg shadow-brand-accent/30 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                    </div>
                     <div className="text-center">
                         <span className="block text-lg font-bold text-black dark:text-white leading-none">Pesar</span>
                         <span className="text-[10px] uppercase font-bold text-brand-accent">Registro</span>
                    </div>
                </button>

                {/* Journal Card */}
                <button 
                    onClick={() => openModal('journal')}
                    className="bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all group"
                >
                     <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </div>
                     <div className="text-center">
                         <span className="block text-lg font-bold text-black dark:text-white leading-none">Diário</span>
                         <span className="text-[10px] uppercase font-bold text-purple-500">Notas</span>
                    </div>
                </button>
            </div>
        </section>

        {/* --- NEXT ACHIEVEMENT TEASER (Gamification) --- */}
        {nextBadge && (
            <div className="bg-brand-surface border border-gray-800 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-full blur-xl -mr-6 -mt-6"></div>
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-brand-border flex items-center justify-center text-xl grayscale opacity-50">
                    {nextBadge.icon}
                </div>
                <div>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Próxima Conquista</span>
                    <h4 className="text-sm font-bold text-white">{nextBadge.title}</h4>
                    <p className="text-xs text-brand-muted">{nextBadge.description}</p>
                </div>
            </div>
        )}

        {/* Next Workout */}
        {nextWorkout && (
            <div>
                 <h2 className="text-lg font-bold text-black dark:text-white mb-4">Seu Treino de Hoje</h2>
                 <div className="relative overflow-hidden rounded-3xl cursor-pointer group shadow-xl" onClick={() => selectWorkout(nextWorkout.id)}>
                    <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/30"></div>
                    <img src={nextWorkout.thumbnail_url} className="w-full h-48 object-cover" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-bold text-brand-accent bg-white/90 px-2 py-0.5 rounded backdrop-blur-sm mb-2 inline-block uppercase tracking-wider">
                                    Dia {nextWorkout.day_number}
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
            </div>
        )}

        {/* --- BODY COMPOSITION CARD (Moved to Bottom) --- */}
        <section className="bg-white dark:bg-brand-surface rounded-3xl p-6 border border-gray-200 dark:border-brand-border shadow-sm mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
                    Composição Corporal
                </h2>
                <button 
                    onClick={() => openModal('stats')}
                    className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-3 py-1.5 rounded-full hover:bg-brand-accent/20 transition-colors"
                >
                    Editar Dados
                </button>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* IMC */}
                <div className="relative">
                    <span className="block text-xs text-gray-500 dark:text-brand-muted uppercase mb-1">IMC Atual</span>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-black dark:text-white">{bmiValue}</span>
                        <div className={`mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${Number(bmiValue) < 25 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                            {bmiCategory}
                        </div>
                    </div>
                </div>

                {/* Weight Trend Mini Summary */}
                <div className="flex flex-col justify-center items-end">
                     <span className="block text-xs text-gray-500 dark:text-brand-muted uppercase mb-1">Perdido</span>
                     <span className="text-2xl font-bold text-brand-accent">
                         {(user!.starting_weight_kg - user!.current_weight_kg).toFixed(1)} <span className="text-sm text-gray-500">kg</span>
                     </span>
                </div>
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-brand-border/50 text-center">
                    <span className="block text-[10px] text-gray-500 dark:text-brand-muted uppercase mb-1">Altura</span>
                    <span className="text-lg font-bold text-black dark:text-white">{user?.height_cm} <span className="text-xs font-normal text-gray-500">cm</span></span>
                </div>
                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-brand-border/50 text-center">
                    <span className="block text-[10px] text-gray-500 dark:text-brand-muted uppercase mb-1">Peso Atual</span>
                    <span className="text-lg font-bold text-black dark:text-white">{user?.current_weight_kg} <span className="text-xs font-normal text-gray-500">kg</span></span>
                </div>
                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-brand-border/50 text-center">
                    <span className="block text-[10px] text-gray-500 dark:text-brand-muted uppercase mb-1">Meta</span>
                    <span className="text-lg font-bold text-brand-accent">{user?.target_weight_kg} <span className="text-xs font-normal text-brand-accent/70">kg</span></span>
                </div>
            </div>

            {/* Weight Chart Integration */}
            <div className="pt-4 border-t border-gray-100 dark:border-brand-border/50">
                 <h3 className="text-xs font-bold text-gray-400 dark:text-brand-muted uppercase mb-4">Tendência Real</h3>
                 {user?.weight_history && <WeightChart data={user.weight_history} />}
            </div>
        </section>

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