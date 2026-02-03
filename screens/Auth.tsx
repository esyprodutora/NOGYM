import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';

export const Auth: React.FC = () => {
  const { login } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Use absolute path for public asset instead of import
  const logo = '/assets/logo.png';

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        login();
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col relative bg-zinc-900 w-full overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0 bg-brand-surface">
             {/* Image: Woman doing Yoga/Pilates at home. High reliability URL. */}
             <img 
                src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1920&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60" 
                alt="Woman doing pilates at home"
                onError={(e) => {
                    // Fallback: Woman stretching
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1920&auto=format&fit=crop";
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col p-8">
            <div className="mt-12 mb-auto">
                 <div className="flex items-center gap-3 mb-4">
                     {!logoError ? (
                         <img 
                            src={logo} 
                            alt="NO Gym Logo" 
                            className="h-16 w-auto object-contain" 
                            onError={() => setLogoError(true)}
                         />
                     ) : (
                        // Fallback Text Logo if image fails to load
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(164,0,109,0.5)]">N</div>
                            <span className="text-3xl font-bold tracking-tighter text-brand-accent">NO <span className="text-white">Gym</span></span>
                        </div>
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