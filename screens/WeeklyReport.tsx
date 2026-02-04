import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';
import { WeightChart } from '../components/WeightChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const WeeklyReport: React.FC = () => {
  const { user, workouts, waterIntakeL, journal } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);

  // --- CALCULATION LOGIC ---
  
  // 1. Exercise Percentage
  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const progressPercent = Math.round((completedWorkouts / totalWorkouts) * 100);

  // 2. Weight Stats
  const currentWeight = user?.current_weight_kg || 0;
  const startingWeight = user?.starting_weight_kg || 0;
  const targetWeight = user?.target_weight_kg || 0;
  
  // Logic to find weight 7 days ago (mocked for now as finding the nearest previous entry)
  // In a real app, we would query the backend for date ranges.
  const history = user?.weight_history || [];
  const lastWeekWeight = history.length > 1 ? history[history.length - 2].weight : startingWeight;
  const weeklyChange = currentWeight - lastWeekWeight; // Negative means loss (Good)
  const totalChange = currentWeight - startingWeight;
  const distToGoal = currentWeight - targetWeight;

  // 3. Hydration (Mocking comparison for demo)
  const dailyTarget = 2.5;
  const hydrationStatus = waterIntakeL >= dailyTarget ? 'Meta Atingida' : 'Abaixo da Meta';
  const hydrationDiff = (waterIntakeL - dailyTarget).toFixed(1);

  // 4. Journal Stats
  // Count entries in the last 7 days
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyNotes = journal.filter(j => {
      // Parse DD/MM/YYYY to Date object
      const parts = j.date.split('/');
      const dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      return dateObj >= oneWeekAgo;
  }).length;

  // --- PDF EXPORT ---
  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsExporting(true);
    
    try {
        // Force light mode styles for print capture if needed, but html2canvas captures rendered state.
        // We add a class to ensure text visibility if the user is in dark mode but wants a clean PDF.
        element.classList.add('bg-white', 'text-black');
        element.classList.remove('dark:bg-brand-dark', 'dark:text-white');

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Relatorio_Semanal_NOGym_${new Date().toISOString().split('T')[0]}.pdf`);

        // Revert styles
        element.classList.remove('bg-white', 'text-black');
    } catch (err) {
        console.error("Erro ao gerar PDF", err);
        alert("Não foi possível gerar o PDF neste momento.");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300 min-h-full">
        {/* Header */}
        <div className="p-6 pt-8 bg-white dark:bg-brand-surface/50 border-b border-gray-200 dark:border-brand-border sticky top-0 z-10 backdrop-blur-md flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Relatório Semanal</h1>
                <p className="text-gray-500 dark:text-brand-muted text-xs uppercase tracking-wider">
                    {new Date().toLocaleDateString('pt-BR')}
                </p>
            </div>
            <Button 
                variant="outline" 
                onClick={handleDownloadPDF} 
                isLoading={isExporting}
                className="!py-2 !px-4 !text-xs"
            >
                {isExporting ? 'Gerando...' : 'Exportar PDF'}
            </Button>
        </div>

        {/* REPORT CONTENT (ID for PDF Capture) */}
        <div id="report-content" className="p-6 space-y-6 bg-white dark:bg-brand-dark transition-colors">
            
            {/* 1. Exercise Stats */}
            <section className="bg-gray-50 dark:bg-brand-surface border border-gray-200 dark:border-brand-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-brand-accent mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Frequência de Treino
                </h2>
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-brand-accent" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        </svg>
                        <span className="absolute text-xl font-bold text-black dark:text-white">{progressPercent}%</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-brand-muted mb-1">Total Concluído</p>
                        <p className="text-2xl font-bold text-black dark:text-white">{completedWorkouts} <span className="text-base font-normal text-gray-400">/ {totalWorkouts}</span></p>
                    </div>
                </div>
            </section>

            {/* 2. Weight Analysis */}
            <section className="bg-gray-50 dark:bg-brand-surface border border-gray-200 dark:border-brand-border rounded-2xl p-6">
                 <h2 className="text-lg font-bold text-brand-accent mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
                    Análise de Peso
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-brand-border/30">
                        <span className="block text-xs text-gray-500 uppercase mb-1">Variação Semanal</span>
                        <span className={`text-xl font-bold ${weeklyChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)} kg
                        </span>
                    </div>
                    <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-brand-border/30">
                        <span className="block text-xs text-gray-500 uppercase mb-1">Faltam para Meta</span>
                        <span className="text-xl font-bold text-brand-accent">
                            {distToGoal.toFixed(1)} kg
                        </span>
                    </div>
                </div>

                <div className="h-40 w-full">
                     <WeightChart data={user?.weight_history || []} />
                </div>
            </section>

            {/* 3. Hydration & Journal Row */}
            <div className="grid grid-cols-2 gap-4">
                 <section className="bg-gray-50 dark:bg-brand-surface border border-gray-200 dark:border-brand-border rounded-2xl p-5">
                    <h2 className="text-sm font-bold text-brand-accent mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                        Hidratação
                    </h2>
                    <p className="text-2xl font-bold text-black dark:text-white mb-1">{waterIntakeL}L <span className="text-xs font-normal text-gray-400">hoje</span></p>
                    <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${waterIntakeL >= dailyTarget ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {waterIntakeL >= dailyTarget ? 'Meta Atingida' : `${Math.abs(Number(hydrationDiff))}L p/ meta`}
                    </div>
                 </section>

                 <section className="bg-gray-50 dark:bg-brand-surface border border-gray-200 dark:border-brand-border rounded-2xl p-5">
                    <h2 className="text-sm font-bold text-brand-accent mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        Diário
                    </h2>
                    <p className="text-2xl font-bold text-black dark:text-white mb-1">{weeklyNotes}</p>
                    <p className="text-xs text-gray-500 dark:text-brand-muted">Notas registradas nos últimos 7 dias.</p>
                 </section>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200 dark:border-brand-border">
                <p className="text-xs text-gray-400 dark:text-brand-muted">NO Gym - Relatório de Progresso Pessoal</p>
            </div>
        </div>
    </div>
  );
};