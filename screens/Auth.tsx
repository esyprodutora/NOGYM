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

  const handleAction = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
        if (view === 'login') {
            if (!email || !password) throw new Error("Preencha e-mail e senha.");
            await login(email, password);
        } 
        else if (view === 'register') {
            if (!email || !password || !fullName || !phone) throw new Error("Preencha todos os campos.");
            
            const success = await register(email, password, fullName, phone);
            
            // Se chegou aqui, não houve erro (register lançaria erro)
            if (success) {
                // Se a tela não mudou, significa que precisa confirmar e-mail
                const { currentScreen } = useAppStore.getState();
                if (currentScreen === AppScreen.AUTH) {
                    setSuccessMsg("Conta criada com sucesso! Verifique seu e-mail para ativar a conta antes de entrar.");
                    // Limpa formulário ou muda para login após delay
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
        // Handle Supabase specific error messages for better UX
        const msg = err.message || "";
        if (msg.includes('registered') || msg.includes('exists')) {
             setErrorMsg("Este e-mail já está cadastrado. Tente fazer login.");
        } else if (msg.includes('rate limit')) {
             setErrorMsg("Muitas tentativas. Aguarde um pouco.");
        } else if (msg.includes('password')) {
             setErrorMsg("Senha muito fraca. Use pelo menos 6 caracteres.");
        } else {
             setErrorMsg(msg || "Ocorreu um erro. Tente novamente.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-zinc-900 w-full overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0 bg-brand-surface">
             <img 
                src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1920&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60" 
                alt="Background"
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1920&auto=format&fit=crop";
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar">
            <div className="mt-8 mb-auto">
                 {/* Text Logo Only (Icon Removed) */}
                 <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold tracking-tighter text-brand-accent">NO <span className="text-white">Gym</span></span>
                </div>
                
                <h1 className="text-4xl font-bold text-white leading-tight mb-2">
                    {view === 'login' && "Bem-vinda de volta."}
                    {view === 'register' && "Sua jornada começa agora."}
                    {view === 'forgot_password' && "Recupere seu acesso."}
                </h1>
                <p className="text-gray-300">
                    {view === 'login' && "Entre para continuar sua evolução."}
                    {view === 'register' && "Treinos rápidos, resultados reais. Sem academia."}
                    {view === 'forgot_password' && "Insira seu e-mail para redefinir a senha."}
                </p>
            </div>

            <div className="space-y-4 w-full mt-4">
                {errorMsg && (
                    <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl text-red-200 text-sm text-center animate-in fade-in">
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
                    />
                    
                    {view !== 'forgot_password' && (
                        <input 
                            type="password" 
                            placeholder="Senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-accent transition-colors"
                        />
                    )}
                </div>
                
                {view === 'login' && (
                    <div className="flex justify-end items-center">
                        <button 
                            onClick={() => setView('forgot_password')}
                            className="text-sm text-brand-muted hover:text-white transition-colors"
                        >
                            Esqueceu a senha?
                        </button>
                    </div>
                )}

                <Button fullWidth onClick={handleAction} isLoading={isLoading}>
                    {view === 'login' ? 'Entrar' : view === 'register' ? 'Criar Conta' : 'Enviar Link'}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 pb-4">
                    {view === 'login' && (
                        <>
                            <span className="text-brand-muted text-sm">Não tem uma conta?</span>
                            <button onClick={() => setView('register')} className="text-brand-accent font-bold text-sm">Cadastre-se</button>
                        </>
                    )}
                    {(view === 'register' || view === 'forgot_password') && (
                        <button onClick={() => setView('login')} className="text-brand-muted font-bold text-sm hover:text-white">
                            Voltar para o Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};