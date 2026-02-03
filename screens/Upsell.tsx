import React from 'react';
import { useAppStore } from '../store/appStore';
import { AppScreen } from '../types';
import { Button } from '../components/Button';

export const Upsell: React.FC = () => {
  const { setScreen } = useAppStore();

  return (
    <div className="h-full flex flex-col relative animate-in slide-in-from-bottom duration-500">
      {/* Close Button */}
      <button 
        onClick={() => setScreen(AppScreen.DASHBOARD)}
        className="absolute top-6 right-6 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white/80"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://picsum.photos/id/338/800/1200" 
            className="w-full h-full object-cover opacity-60" 
            alt="Woman training" 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-12">
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/50 self-start">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Acesso Premium</span>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Desbloqueie sua <span className="text-brand-accent">verdadeira força.</span>
        </h1>
        
        <p className="text-brand-muted mb-8 leading-relaxed">
          Junte-se a milhares de mulheres 30+ transformando seus corpos em casa. Sem equipamentos. Sem cultura de academia. Apenas resultados.
        </p>

        <div className="space-y-3 mb-8">
            <FeatureRow text="Programa sistemático de 28 dias" />
            <FeatureRow text="Acompanhamento avançado de progresso" />
            <FeatureRow text="Receitas saudáveis e simples" />
            <FeatureRow text="Suporte prioritário da comunidade" />
        </div>

        <Button fullWidth onClick={() => alert("Payment Flow Triggered")}>
          Iniciar 7 Dias Grátis
        </Button>
        
        <p className="text-center text-xs text-brand-muted mt-4">
          R$ 29,90/mês após o teste. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
};

const FeatureRow = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-brand-surface border border-brand-accent flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A4006D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span className="text-sm text-white/90">{text}</span>
    </div>
);