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
    if (hour < 12) setGreeting('Bom dia,');
    else if (hour < 18) setGreeting('Tarde foca,');
    else setGreeting('Boa noite,');
  }, []);

  const openModal = (type: 'weight' | 'water' | 'journal' | 'stats') => {
      setModalType(type);
      setModalOpen(true);
  };

  const nextWorkout = workouts.find(w => !w.completed);
  const completedCount = workouts.filter(w => w.completed).length;
  const progressPercent = Math.round((completedCount / 15) * 100);

  // --- XP & RANKING SYSTEM ---
  const currentXP = user?.current_xp || 0;
  
  const getRank = (xp: number) => {
      if (xp < 500) return { title: 'Iniciante', next: 500, icon: '🌱' };
      if (xp < 1500) return { title: 'Queimador', next: 1500, icon: '🔥' };
      if (xp < 3000) return { title: 'Elite', next: 3000, icon: '⚡' };
      return { title: 'Lenda', next: 10000, icon: '👑' };
  };

  const rank = getRank(currentXP);
  const xpProgress = Math.min(100, (currentXP / rank.next) * 100);

  // --- BMI & HEALTH LOGIC ---
  const heightM = (user?.height_cm || 160) / 100;
  const currentWeight = user?.current_weight_kg || 0;
  const targetWeight = user?.target_weight_kg || 0;
  
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);
  const bmiNum = Number(bmi);

  const getBMIInfo = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo', color: 'text-blue-500', bg: 'bg-blue-500', barPos: '15%' };
    if (val < 24.9) return { label: 'Ideal', color: 'text-green-500', bg: 'bg-green-500', barPos: '40%' };
    if (val < 29.9) return { label: 'Sobrepeso', color: 'text-yellow-500', bg: 'bg-yellow-500', barPos: '65%' };
    return { label: 'Obeso', color: 'text-red-500', bg: 'bg-red-500', barPos: '90%' };
  };
  const bmiInfo = getBMIInfo(bmiNum);

  return (
    <div className="pb-24 animate-in fade-in duration-500 bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-brand-accent selection:text-white">
      
      {/* --- HEADER: PREMIUM HUD --- */}
      <header className="p-6 pb-2 flex justify-between items-center sticky top-0 z-20 bg-[#0A0A0A]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
              <div 
                  className="w-10 h-10 rounded-full bg-brand-accent p-0.5 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openModal('stats')}
              >
                  <img src={user?.avatar_url || "https://i.pravatar.cc/150?u=ana"} className="w-full h-full rounded-full object-cover border-2 border-[#0A0A0A]" />
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{greeting}</span>
                  <span className="text-sm font-bold text-white leading-none">{user?.full_name.split(' ')[0]}</span>
              </div>
          </div>

          <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_#FF5500]"></div>
              <span className="text-xs font-bold font-mono">{user?.streak_days || 0} Dias</span>
          </div>
      </header>

      <div className="p-6 space-y-8">

        {/* --- 1. GAMIFICATION SCOREBOARD --- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#151515] to-[#050505] border border-white/5 p-6">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-[50px] rounded-full pointer-events-none"></div>
             
             <div className="flex justify-between items-end mb-4">
                 <div>
                     <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Nível Atual</span>
                     <div className="flex items-center gap-2">
                        <span className="text-2xl">{rank.icon}</span>
                        <h2 className="text-3xl font-black italic text-white uppercase">{rank.title}</h2>
                     </div>
                 </div>
                 <div className="text-right">
                     <span className="block text-2xl font-bold text-brand-accent tabular-nums">{currentXP}</span>
                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Fire Points</span>
                 </div>
             </div>

             {/* XP Progress Bar */}
             <div className="relative h-2 bg-[#222] rounded-full overflow-hidden">
                 <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-brand-accent transition-all duration-1000"
                    style={{ width: `${xpProgress}%` }}
                 >
                     <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>
                 </div>
             </div>
             <p className="text-[10px] text-gray-500 mt-2 text-right">Próximo nível: {rank.next} XP</p>
        </section>


        {/* --- 2. THE MISSION (HERO) --- */}
        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-4 bg-brand-accent"></div>
                <h3 className="text-lg font-bold uppercase italic tracking-wider text-white">Próxima Missão</h3>
            </div>

            {nextWorkout ? (
                <div 
                    onClick={() => selectWorkout(nextWorkout.id)}
                    className="group relative h-64 w-full rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl"
                >
                    <img src={nextWorkout.thumbnail_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        +{150} XP
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="bg-brand-accent text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">Dia {nextWorkout.day_number}</span>
                             <span className="text-xs font-bold text-gray-300">{nextWorkout.duration_minutes} min • {nextWorkout.difficulty}</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-none mb-4 italic uppercase">{nextWorkout.title}</h2>
                        
                        <button className="w-full bg-brand-accent hover:bg-[#ff6a00] text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(255,85,0,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                            <span>Iniciar Treino</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-[#151515] p-8 rounded-3xl text-center border border-white/5">
                    <h2 className="text-2xl font-bold text-white mb-2">Desafio Concluído!</h2>
                    <p className="text-gray-400 text-sm">Você completou os 15 dias. Incrível!</p>
                </div>
            )}
        </section>


        {/* --- 3. HEALTH COMMAND CENTER (TECH STYLE) --- */}
        <section className="bg-[#111] rounded-3xl p-1 border border-white/5">
            <div className="bg-[#151515] rounded-[20px] p-5">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-sm font-bold uppercase text-gray-400 tracking-widest">Métricas Corporais</h3>
                    <button onClick={() => openModal('stats')} className="text-xs text-brand-accent hover:text-white transition-colors">ATUALIZAR DADOS</button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6 relative">
                    {/* Vertical Divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 transform -translate-x-1/2"></div>

                    {/* Weight Display */}
                    <div className="text-center">
                        <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Peso Atual</span>
                        <div className="flex items-end justify-center gap-1">
                            <span className="text-4xl font-black text-white tracking-tighter">{currentWeight}</span>
                            <span className="text-sm text-gray-500 font-bold mb-1.5">kg</span>
                        </div>
                        <div className="mt-2 flex justify-center gap-2">
                            <span className="text-[10px] text-gray-600">Meta: {targetWeight}</span>
                        </div>
                    </div>

                    {/* BMI Display */}
                    <div className="text-center">
                        <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1">IMC Calc</span>
                        <div className="flex items-end justify-center gap-1">
                            <span className="text-4xl font-black text-white tracking-tighter">{bmi}</span>
                        </div>
                        <div className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bmiInfo.color} bg-white/5`}>
                            {bmiInfo.label}
                        </div>
                    </div>
                </div>

                {/* Visual Graph/Bar */}
                <div className="relative h-32 w-full bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden mb-4">
                     <div className="absolute inset-0 opacity-50">
                        {user?.weight_history && <WeightChart data={user.weight_history} />}
                     </div>
                </div>

                {/* BMI Gauge Bar */}
                <div className="relative h-2 w-full bg-[#222] rounded-full overflow-hidden mt-2">
                     <div className="absolute left-[15%] w-[1px] h-full bg-[#0A0A0A] z-10"></div>
                     <div className="absolute left-[40%] w-[1px] h-full bg-[#0A0A0A] z-10"></div>
                     <div className="absolute left-[65%] w-[1px] h-full bg-[#0A0A0A] z-10"></div>
                     
                     <div className="flex h-full w-full">
                         <div className="flex-1 bg-blue-900/50"></div>
                         <div className="flex-[2] bg-green-900/50"></div>
                         <div className="flex-[2] bg-yellow-900/50"></div>
                         <div className="flex-[2] bg-red-900/50"></div>
                     </div>
                     {/* Indicator */}
                     <div 
                        className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_white] z-20"
                        style={{ left: bmiInfo.barPos }}
                     ></div>
                </div>
            </div>
        </section>


        {/* --- 4. DAILY SIDE QUESTS --- */}
        <div className="grid grid-cols-2 gap-4">
            
            {/* Water Quest */}
            <button 
                onClick={() => openModal('water')}
                className="group relative overflow-hidden bg-[#111] hover:bg-[#161616] border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-40 transition-all"
            >
                <div className="flex justify-between items-start z-10">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">+20 XP</span>
                </div>
                
                <div className="z-10">
                    <span className="text-3xl font-black text-white">{waterIntakeL}<span className="text-lg text-gray-500">L</span></span>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Hidratação</p>
                </div>

                {/* Liquid Fill Effect */}
                <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-600/10 transition-all duration-700"
                    style={{ height: `${Math.min(100, (waterIntakeL/2.5)*100)}%` }}
                ></div>
            </button>

            {/* Journal Quest */}
            <button 
                onClick={() => openModal('journal')}
                className="group bg-[#111] hover:bg-[#161616] border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-40 transition-all"
            >
                 <div className="flex justify-between items-start">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">+30 XP</span>
                </div>

                <div>
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mb-2 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                        <span className="text-lg font-bold">+</span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Registrar Diário</p>
                </div>
            </button>
        </div>


        {/* --- 5. DAILY TIP (FOOTER) --- */}
        {dailyTip && (
            <div className="border-t border-white/5 pt-6 text-center">
                 <span className="text-[10px] font-black uppercase text-brand-accent tracking-[0.2em] mb-2 block">{dailyTip.category}</span>
                 <p className="text-sm font-medium text-gray-300 italic max-w-xs mx-auto">"{dailyTip.content}"</p>
            </div>
        )}

      </div>

      {/* Modals & Badges */}
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

      {newBadgeUnlocked && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={clearNewBadge}></div>
              <div className="relative bg-[#111] w-full max-w-sm p-8 text-center border-2 border-brand-accent shadow-[0_0_50px_rgba(255,85,0,0.3)] animate-in zoom-in duration-300 rounded-3xl">
                  <div className="text-6xl mb-6 animate-bounce">{newBadgeUnlocked.icon}</div>
                  <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">Conquista!</h2>
                  <h3 className="text-xl font-bold text-brand-accent mb-4">{newBadgeUnlocked.title}</h3>
                  <p className="text-gray-400 font-medium mb-8 leading-relaxed">{newBadgeUnlocked.description}</p>
                  <button 
                    onClick={clearNewBadge}
                    className="w-full bg-brand-accent text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                      Continuar
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
