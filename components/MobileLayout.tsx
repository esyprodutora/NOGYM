import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AppScreen } from '../types';

export const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScreen, setScreen, user, theme } = useAppStore();
  const [logoError, setLogoError] = useState(false);

  const isAuth = currentScreen === AppScreen.AUTH;
  const isFullScreen = currentScreen === AppScreen.WORKOUT_DETAILS || currentScreen === AppScreen.UPSELL;
  
  // Use absolute path for public asset instead of import
  const logo = '/assets/logo.png';

  return (
    <div className={`min-h-screen w-full bg-neutral-900 flex items-center justify-center p-0 md:p-8 ${theme}`}>
      {/* Mobile Device Simulator Container */}
      <div className="w-full max-w-[400px] h-[100vh] md:h-[850px] bg-brand-light dark:bg-brand-dark transition-colors duration-300 md:rounded-[3rem] md:border-8 md:border-[#333] overflow-hidden flex flex-col relative shadow-2xl">
        
        {/* Status Bar Area */}
        <div className="h-12 w-full bg-transparent absolute top-0 left-0 right-0 z-[60] flex items-end justify-between px-6 pb-2 select-none pointer-events-none">
            <span className="text-black dark:text-white text-xs font-medium">9:41</span>
            <div className="flex gap-1.5">
                <div className="w-4 h-4 bg-black/20 dark:bg-white/20 rounded-full"></div>
                <div className="w-4 h-4 bg-black/20 dark:bg-white/20 rounded-full"></div>
            </div>
        </div>

        {/* HEADER (Logo & Greeting) - Visible on main screens */}
        {!isAuth && !isFullScreen && (
          <header className="pt-14 pb-2 px-6 bg-brand-light dark:bg-brand-dark flex items-center justify-between shrink-0 transition-colors duration-300">
             <div className="flex flex-col">
                {/* LOGO */}
                <div className="h-8 flex items-center">
                    <div className="flex items-center gap-2">
                         {!logoError ? (
                             <img 
                                src={logo} 
                                alt="NO Gym Logo" 
                                className="h-8 w-auto object-contain" 
                                onError={() => setLogoError(true)}
                             />
                         ) : (
                             // Fallback to Text Logo if no image is provided
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
                                <span className="text-xl font-bold tracking-tighter text-brand-accent">NO <span className="text-black dark:text-white">Gym</span></span>
                             </div>
                         )}
                    </div>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                     <span className="block text-xs text-gray-500 dark:text-brand-muted">Bem-vinda,</span>
                     <span className="block text-sm font-bold text-black dark:text-white leading-none">{user?.full_name.split(' ')[0]}</span>
                 </div>
                 <div 
                    onClick={() => setScreen(AppScreen.PROFILE)}
                    className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 p-0.5 cursor-pointer"
                 >
                    <img src="https://i.pravatar.cc/150?u=ana" className="w-full h-full rounded-full object-cover" />
                 </div>
             </div>
          </header>
        )}

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto no-scrollbar relative ${isAuth || isFullScreen ? '' : ''}`}>
            {children}
        </div>

        {/* Bottom Navigation */}
        {!isAuth && !isFullScreen && (
          <div className="h-20 bg-white dark:bg-[#161616] border-t border-gray-200 dark:border-brand-border flex items-center justify-between px-4 shrink-0 z-50 pb-2 transition-colors duration-300">
             <NavButton 
                active={currentScreen === AppScreen.DASHBOARD} 
                onClick={() => setScreen(AppScreen.DASHBOARD)}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>}
                label="Painel"
             />
             <NavButton 
                active={currentScreen === AppScreen.PROGRAM} 
                onClick={() => setScreen(AppScreen.PROGRAM)}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                label="Treinos"
             />
             <NavButton 
                active={currentScreen === AppScreen.RECIPES} 
                onClick={() => setScreen(AppScreen.RECIPES)}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>}
                label="Receitas"
             />
             <NavButton 
                active={currentScreen === AppScreen.MINDSET} 
                onClick={() => setScreen(AppScreen.MINDSET)}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>}
                label="Mindset"
             />
              <NavButton 
                active={currentScreen === AppScreen.PROFILE} 
                onClick={() => setScreen(AppScreen.PROFILE)}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                label="Config"
             />
          </div>
        )}
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors duration-200 ${active ? 'text-brand-accent' : 'text-gray-400 dark:text-brand-muted/60 hover:text-brand-accent'}`}
  >
    <div className={`relative ${active ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
        {icon}
        {active && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-accent rounded-full"></span>}
    </div>
    <span className="text-[9px] font-medium tracking-wide">{label}</span>
  </button>
);