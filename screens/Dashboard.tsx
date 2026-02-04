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
  const challengeDays = Array.from({ length: 15 }, (_, i) => {
      const dayNum = i + 1;
      const workout = workouts.find(w => w.day_number === dayNum);
      return {
          day: dayNum,
          status: workout?.completed ? 'completed' : (workout?.id === nextWorkout?.id ? 'current' : 'locked'),
          id: workout?.id
      };
  });

  // --- BMI & HEALTH LOGIC ---
  const heightM = (user?.height_cm || 160) / 100;
  const currentWeight = user?.current_weight_kg || 0;
  const targetWeight = user?.target_weight_kg || 0;
  const startWeight = user?.starting_weight_kg || currentWeight;
  
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);
  const bmiNum = Number(bmi);

  const getBMIInfo = (val: number) => {
    if (val < 18.5) return { label: 'Abaixo do Peso', color: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500', risk: 'Baixa energia', desc: 'Foque em ganho de massa magra.' };
    if (val < 24.9) return { label: 'Peso Ideal', color: 'text-green-500', border: 'border-green-500', bg: 'bg-green-500', risk: 'Baixo Risco', desc: 'Excelente! Mantenha o foco.' };
    if (val < 29.9) return { label: 'Sobrepeso', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500', risk: 'Risco Moderado', desc: 'Atenção ao cardio e dieta.' };
    return { label: 'Obesidade', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500', risk: 'Risco Alto', desc: 'Consulte um profissional.' };
  };

  const bmiInfo = getBMIInfo(bmiNum);

  // Calculate position percentage for BMI gauge (15 to 40 scale range)
  const bmiGaugePercent = Math.min(100, Math.max(0, ((bmiNum - 15) / (35 - 15)) * 100));

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

        {/* 1. HERO SECTION */}
        <div className="relative w-full bg-brand-accent rounded-none md:rounded-3xl shadow-none overflow-hidden">
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

                 <div className="w-full max-w-xs h-6 bg-black/20 rounded-none skew-x-[-12deg] overflow-hidden mb-4 relative">
                     <div 
                        className="h-full bg-white transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                     ></div>
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

        {/* 2. TIMELINE */}
        <section>
            <div className="flex justify-between items-end mb-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
                <h3 className="text-lg font-black italic text-black dark:text-white uppercase">Sua Jornada</h3>
                <span className="text-xs font-bold text-brand-accent uppercase">{progressPercent}% Completo</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {challengeDays.map((d) => {
                    const isCheckPoint = d.day === 7;
                    const isFinal = d.day === 15;
                    let containerStyle = "border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-400";
                    let content = <span className="text-sm font-bold">{d.day}</span>;

                    if (d.status === 'completed') {
                        containerStyle = "bg-brand-accent border-brand-accent text-white shadow-[0_4px_10px_rgba(255,85,0,0.3)]";
                        content = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
                    } else if (d.status === 'current') {
                        containerStyle = "border-brand-accent bg-brand-accent/10 text-brand-accent animate-pulse border-2";
                        content = <span className="text-sm font-black">{d.day}</span>;
                    }

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
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 3. HEALTH & BODY ANALYTICS (FULL WIDTH) */}
        <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 shadow-sm relative overflow-hidden">
             
             {/* Header */}
             <div className="flex justify-between items-start mb-8 relative z-10">
                 <div>
                    <h3 className="font-black text-2xl italic uppercase text-black dark:text-white leading-none mb-1">Análise Corporal</h3>
                    <p className="text-xs text-gray-500 font-medium">Monitoramento de Peso & Saúde</p>
                 </div>
                 <button onClick={() => openModal('stats')} className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg hover:bg-brand-accent hover:text-white transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                 </button>
             </div>

             {/* Main Weight Stats Row */}
             <div className="flex items-end justify-between mb-8 relative z-10">
                 <div className="text-center">
                     <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Início</span>
                     <span className="text-lg font-bold text-gray-500">{startWeight}</span>
                     <span className="text-xs text-gray-400"> kg</span>
                 </div>

                 {/* Current Weight (Highlight) */}
                 <div className="text-center bg-brand-accent/5 dark:bg-brand-accent/10 px-6 py-3 rounded-2xl border border-brand-accent/20">
                     <span className="block text-[10px] text-brand-accent uppercase tracking-widest font-bold mb-1">Atual</span>
                     <span className="text-4xl font-black text-black dark:text-white tracking-tighter">{currentWeight}</span>
                     <span className="text-sm font-bold text-brand-accent"> kg</span>
                 </div>

                 <div className="text-center">
                     <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Meta</span>
                     <span className="text-lg font-bold text-gray-500">{targetWeight}</span>
                     <span className="text-xs text-gray-400"> kg</span>
                 </div>
             </div>

             {/* Graph Area */}
             <div className="h-40 w-full mb-8 relative z-10">
                  {user?.weight_history && <WeightChart data={user.weight_history} />}
             </div>

             {/* BMI Section */}
             <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-zinc-800">
                 <div className="flex justify-between items-center mb-4">
                     <div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seu IMC</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-black dark:text-white">{bmi}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${bmiInfo.bg} text-white`}>{bmiInfo.label}</span>
                         </div>
                     </div>
                     <div className="text-right max-w-[50%]">
                         <span className={`text-[10px] font-bold uppercase ${bmiInfo.color}`}>Risco: {bmiInfo.risk}</span>
                         <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{bmiInfo.desc}</p>
                     </div>
                 </div>

                 {/* Visual Gauge */}
                 <div className="relative h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden flex">
                      {/* Segments */}
                      <div className="w-[15%] h-full bg-blue-300 opacity-50"></div> {/* Underweight */}
                      <div className="w-[30%] h-full bg-green-400 opacity-50"></div> {/* Normal */}
                      <div className="w-[25%] h-full bg-yellow-400 opacity-50"></div> {/* Overweight */}
                      <div className="w-[30%] h-full bg-red-400 opacity-50"></div>    {/* Obese */}
                      
                      {/* Indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-black dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 transition-all duration-1000"
                        style={{ left: `${bmiGaugePercent}%` }}
                      ></div>
                 </div>
                 <div className="flex justify-between text-[8px] text-gray-400 mt-1 font-bold uppercase">
                     <span>15</span>
                     <span>18.5</span>
                     <span>25</span>
                     <span>30</span>
                     <span>40</span>
                 </div>
             </div>
        </section>

        {/* 4. QUICK ACTIONS (Water & Journal) */}
        <div className="grid grid-cols-2 gap-4">
            {/* Water Flat */}
            <button 
                onClick={() => openModal('water')}
                className="bg-blue-500 text-white p-4 flex flex-col justify-between items-start shadow-sm hover:brightness-110 transition-all min-h-[140px]"
            >
                <div className="w-full flex justify-between">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                        <span className="font-black text-2xl">{waterIntakeL}L</span>
                </div>
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Hidratação</span>
                    <div className="w-full h-1 bg-black/20 mt-2">
                        <div className="h-full bg-white" style={{ width: `${Math.min(100, (waterIntakeL/2.5)*100)}%` }}></div>
                    </div>
                </div>
            </button>

            {/* Journal Flat */}
            <button 
                onClick={() => openModal('journal')}
                className="bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white p-4 flex flex-col justify-between items-start shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all min-h-[140px]"
            >
                <div className="w-full flex justify-between">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                        <span className="text-xs font-bold">+</span>
                    </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 text-left">Registrar<br/>Diário</span>
            </button>
        </div>

        {/* 5. DAILY TIP */}
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