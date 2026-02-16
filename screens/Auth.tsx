import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';
import { AppScreen } from '../types';

type AuthView = 'login' | 'register' | 'forgot_password';

export const Auth: React.FC = () => {
  const { login, register, resetPassword } = useAppStore();
  const [view, setView] = useState<AuthView>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
        if (view === 'login') {
            if (!email || !password) throw new Error("Preencha e-mail e senha.");
            await login(email, password);
        } 
        else if (view === 'register') {
            if (!email || !password || !fullName) throw new Error("Preencha todos os campos obrigatórios.");
            
            const success = await register(email, password, fullName, phone);
            
            if (success) {
                const { currentScreen } = useAppStore.getState();
                if (currentScreen === AppScreen.AUTH) {
                    setSuccessMsg("Conta criada com sucesso! Verifique seu e-mail para ativar a conta antes de entrar.");
                    setTimeout(() => setView('login'), 5000);
                }
            }
        }
        else if (view === 'forgot_password') {
            if (!email) throw new Error("Informe seu e-mail.");
            const success = await resetPassword(email);
            if (success) {
                setSuccessMsg("E-mail de recuperação enviado!");
                setTimeout(() => setView('login'), 3000);
            } else {
                throw new Error("Erro ao enviar e-mail. Verifique o endereço.");
            }
        }
    } catch (err: any) {
        const msg = err.message || "";
        console.error("Auth UI Error:", msg);

        if (msg.includes('Failed to fetch') || msg.includes('Network request failed')) {
             setErrorMsg("Erro de Conexão: O app não conseguiu conectar ao Supabase. Verifique se as chaves em 'services/supabase.ts' estão configuradas corretamente.");
        } 
        else if (msg.includes('registered') || msg.includes('exists')) {
             setErrorMsg("Este e-mail já está cadastrado. Tente fazer login.");
        } else if (msg.includes('rate limit')) {
             setErrorMsg("Muitas tentativas. Aguarde um pouco.");
        } else if (msg.includes('password')) {
             setErrorMsg("Senha muito fraca. Use pelo menos 6 caracteres.");
        } else if (msg.includes('invalid login credentials')) {
             setErrorMsg("E-mail ou senha incorretos.");
        } else {
             setErrorMsg(msg || "Ocorreu um erro. Tente novamente.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full min-h-screen flex flex-col relative bg-zinc-900 w-full overflow-hidden md:flex-row">
        {/* Background Video/Image - Covers full screen on mobile, left half on desktop */}
        <div className="absolute inset-0 z-0 bg-brand-surface md:static md:flex-1 md:h-full">
             <img 
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1920&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60 md:opacity-80" 
                alt="Background"
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1920&auto=format&fit=crop";
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 md:via-black/30 md:to-transparent"></div>
             
             {/* Desktop Logo Slogan */}
             <div className="hidden md:flex absolute inset-0 flex-col justify-between p-12 z-20 pointer-events-none">
                 <div className="flex flex-col items-start">
                    <span className="text-lg font-bold text-zinc-500 uppercase tracking-[0.4em] mb-2 ml-1">Desafio</span>
                    <div className="flex flex-col">
                        <h1 className="text-8xl font-black italic text-brand-accent leading-[0.85] tracking-tighter drop-shadow-[0_0_25px_rgba(255,85,0,0.6)]">
                            SECA EM<br/>CASA
                        </h1>
                        <span className="text-3xl font-light text-white tracking-[0.3em] self-end mt-4">15 DIAS</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-600 uppercase tracking-widest mt-12">By NoGym</span>
                 </div>
                 
                 <div className="max-w-xl">
                     <h2 className="text-5xl font-bold text-white mb-4 leading-tight">Transforme seu corpo em 15 dias.</h2>
                     <p className="text-xl text-gray-200">Desafio intenso, resultados reais, sem equipamentos.</p>
                 </div>
             </div>
        </div>

        {/* Content Container - Bottom on mobile, Right on desktop */}
        <div className="relative z-10 flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar md:bg-zinc-900 md:max-w-md md:justify-center md:shadow-2xl md:border-l md:border-white/5">
            <div className="mt-8 mb-auto md:mt-0 md:mb-0">
                 {/* Mobile Logo */}
                 <div className="md:hidden flex flex-col items-center mb-10">
                    <div className="flex flex-col relative">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-1 ml-1 self-start">Desafio</span>
                        <h1 className="text-5xl font-black italic text-brand-accent leading-[0.85] tracking-tighter drop-shadow-[0_0_15px_rgba(255,85,0,0.5)]">
                            SECA EM<br/>CASA
                        </h1>
                        <span className="text-xl font-light text-white tracking-[0.2em] self-end -mt-1">15 DIAS</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest mt-6">By NoGym</span>
                 </div>
                
                <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                    {view === 'login' && "Bem-vinda de volta."}
                    {view === 'register' && "Aceite o Desafio."}
                    {view === 'forgot_password' && "Recupere seu acesso."}
                </h1>
                <p className="text-gray-400 mb-8 text-sm">
                    {view === 'login' && "Entre para continuar sua evolução de 15 dias."}
                    {view === 'register' && "Comece agora sua jornada de 15 dias para secar."}
                    {view === 'forgot_password' && "Insira seu e-mail para redefinir a senha."}
                </p>

                <form onSubmit={handleAction} className="space-y-4 w-full">
                    {errorMsg && (
                        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm animate-in fade-in">
                            <p className="font-bold mb-1">Atenção</p>
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-500/20 border border-green-500/50 p-3 rounded-xl text-green-200 text-sm text-center animate-in fade-in">
                            {successMsg}
                        </div>
                    )}
                    
                    {/* Inputs based on View */}
                    <div className="space-y-3">
                        {view === 'register' && (
                            <>
                                <input 
                                    type="text" 
                                    placeholder="Nome Completo" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                                    required={view === 'register'}
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Telefone (Whatsapp)" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                                />
                            </>
                        )}

                        <input 
                            type="email" 
                            placeholder="E-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                            required
                            autoComplete="email"
                        />
                        
                        {view !== 'forgot_password' && (
                            <input 
                                type="password" 
                                placeholder="Senha" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                                required
                                minLength={6}
                                autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                            />
                        )}
                    </div>
                    
                    {view === 'login' && (
                        <div className="flex justify-end items-center">
                            <button 
                                type="button"
                                onClick={() => setView('forgot_password')}
                                className="text-sm text-brand-muted hover:text-white transition-colors"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>
                    )}

                    <Button fullWidth type="submit" isLoading={isLoading}>
                        {view === 'login' ? 'Entrar' : view === 'register' ? 'Criar Conta' : 'Enviar Link'}
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-4 pb-4">
                        {view === 'login' && (
                            <>
                                <span className="text-brand-muted text-sm">Não tem uma conta?</span>
                                <button type="button" onClick={() => setView('register')} className="text-brand-accent font-bold text-sm">Cadastre-se</button>
                            </>
                        )}
                        {(view === 'register' || view === 'forgot_password') && (
                            <button type="button" onClick={() => setView('login')} className="text-brand-muted font-bold text-sm hover:text-white">
                                Voltar para o Login
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};