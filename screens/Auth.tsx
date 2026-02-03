import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';

export const Auth: React.FC = () => {
  const { login } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder para URL do logotipo na tela de Login
  const logoUrl = ""; 

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        login();
    }, 1500);
  };

  return (
    <div className="min-h-full flex flex-col relative animate-in fade-in duration-700 bg-black">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
             {/* Updated image: Woman doing bodyweight exercise (calisthenics/floor work) at home, no weights */}
             <img src="https://images.unsplash.com/photo-1609899537878-39d4a7988463?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col p-8">
            <div className="mt-12 mb-auto">
                 <div className="flex items-center gap-3 mb-4">
                     {logoUrl ? (
                         <img src={logoUrl} alt="NO Gym Logo" className="h-12 w-auto object-contain" />
                     ) : (
                        // Fallback Text Logo
                        <>
                            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(164,0,109,0.5)]">N</div>
                            <span className="text-3xl font-bold tracking-tighter text-brand-accent">NO <span className="text-white">Gym</span></span>
                        </>
                     )}
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight">
                    Sua melhor versão,<br/>sem sair de casa.
                </h1>
            </div>

            <div className="space-y-4 w-full">
                <div className="space-y-2">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                        defaultValue="ana@exemplo.com"
                    />
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                        defaultValue="password"
                    />
                </div>
                
                <div className="flex justify-end">
                    <button className="text-sm text-brand-muted hover:text-white transition-colors">Esqueceu a senha?</button>
                </div>

                <Button fullWidth onClick={handleLogin} isLoading={isLoading}>
                    Entrar
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-brand-muted text-sm">Não tem uma conta?</span>
                    <button className="text-brand-accent font-bold text-sm">Cadastre-se</button>
                </div>
            </div>
        </div>
    </div>
  );
};