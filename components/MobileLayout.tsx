import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AppScreen } from '../types';

export const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScreen, setScreen, user, theme, logout } = useAppStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isAuth = currentScreen === AppScreen.AUTH;
  const isFullScreen = currentScreen === AppScreen.WORKOUT_DETAILS || currentScreen === AppScreen.UPSELL;
  
  // If Auth or FullScreen mode (like active workout), render without main layout structure
  if (isAuth) {
      return <div className="w-full h-screen bg-brand-dark overflow-hidden">{children}</div>;
  }

  if (isFullScreen) {
      return <div className="w-full h-screen bg-brand-dark overflow-hidden">{children}</div>;
  }

  const handleMobileNav = (screen: AppScreen) => {
      setScreen(screen);
      setSidebarOpen(false);
  };

  // Reusable Icons
  const icons = {
      dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
      program: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
      recipes: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>,
      mindset: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
      gallery: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
      reports: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
      settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  };

  return (
    <div className={`flex h-screen w-full bg-white dark:bg-brand-dark text-black dark:text-white transition-colors duration-300 overflow-hidden ${theme}`}>
      
      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#121212] z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-white/5 flex flex-col md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
                <span className="text-xl font-bold tracking-tighter text-brand-accent">NO <span className="text-black dark:text-white">Gym</span></span>
             </div>
             <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-brand-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
           </div>
           
           <nav className="flex-1 overflow-y-auto p-4 space-y-1">
             <SidebarItem active={currentScreen === AppScreen.DASHBOARD} onClick={() => handleMobileNav(AppScreen.DASHBOARD)} icon={icons.dashboard} label="Painel" />
             <SidebarItem active={currentScreen === AppScreen.PROGRAM} onClick={() => handleMobileNav(AppScreen.PROGRAM)} icon={icons.program} label="Seu Programa" />
             <SidebarItem active={currentScreen === AppScreen.RECIPES} onClick={() => handleMobileNav(AppScreen.RECIPES)} icon={icons.recipes} label="Receitas & Nutrição" />
             <SidebarItem active={currentScreen === AppScreen.MINDSET} onClick={() => handleMobileNav(AppScreen.MINDSET)} icon={icons.mindset} label="Mindset" />
             <SidebarItem active={currentScreen === AppScreen.TRANSFORMATION} onClick={() => handleMobileNav(AppScreen.TRANSFORMATION)} icon={icons.gallery} label="Galeria" />
             <SidebarItem active={currentScreen === AppScreen.WEEKLY_REPORT} onClick={() => handleMobileNav(AppScreen.WEEKLY_REPORT)} icon={icons.reports} label="Relatórios" />
             <div className="my-4 h-[1px] bg-gray-200 dark:bg-white/5 mx-2"></div>
             <SidebarItem active={currentScreen === AppScreen.PROFILE} onClick={() => handleMobileNav(AppScreen.PROFILE)} icon={icons.settings} label="Configurações" />
           </nav>

           <div className="p-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 mb-3">
                    <img src={user?.avatar_url || "https://i.pravatar.cc/150?u=ana"} className="w-10 h-10 rounded-full object-cover" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-black dark:text-white">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 dark:text-brand-muted truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-brand-muted hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span className="font-medium text-sm">Sair</span>
                </button>
           </div>
      </div>

      {/* --- DESKTOP SIDEBAR (Visible on md+) --- */}
      <aside className="hidden md:flex w-72 flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#121212] shrink-0 transition-colors">
        <div className="p-8 pb-4">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(164,0,109,0.3)]">N</div>
                <span className="text-2xl font-bold tracking-tighter text-brand-accent">NO <span className="text-black dark:text-white">Gym</span></span>
            </div>
            <div 
                onClick={() => setScreen(AppScreen.PROFILE)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-brand-accent/50 transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img src={user?.avatar_url || "https://i.pravatar.cc/150?u=ana"} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-black dark:text-white">{user?.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-brand-muted truncate">Ver Perfil</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
             <SidebarItem active={currentScreen === AppScreen.DASHBOARD} onClick={() => setScreen(AppScreen.DASHBOARD)} icon={icons.dashboard} label="Painel" />
             <SidebarItem active={currentScreen === AppScreen.PROGRAM} onClick={() => setScreen(AppScreen.PROGRAM)} icon={icons.program} label="Seu Programa" />
             <SidebarItem active={currentScreen === AppScreen.RECIPES} onClick={() => setScreen(AppScreen.RECIPES)} icon={icons.recipes} label="Receitas & Nutrição" />
             <SidebarItem active={currentScreen === AppScreen.MINDSET} onClick={() => setScreen(AppScreen.MINDSET)} icon={icons.mindset} label="Mindset" />
             <SidebarItem active={currentScreen === AppScreen.TRANSFORMATION} onClick={() => setScreen(AppScreen.TRANSFORMATION)} icon={icons.gallery} label="Galeria" />
             <SidebarItem active={currentScreen === AppScreen.WEEKLY_REPORT} onClick={() => setScreen(AppScreen.WEEKLY_REPORT)} icon={icons.reports} label="Relatórios" />
             <div className="my-4 h-[1px] bg-gray-200 dark:bg-white/5 mx-2"></div>
             <SidebarItem active={currentScreen === AppScreen.PROFILE} onClick={() => setScreen(AppScreen.PROFILE)} icon={icons.settings} label="Configurações" />
        </nav>

        <div className="p-4">
             <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-brand-muted hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span className="font-medium text-sm">Sair</span>
             </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-brand-dark">
        
        {/* MOBILE HEADER (md:hidden) */}
        <header className="md:hidden h-16 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 shrink-0 z-30">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
                <span className="text-xl font-bold tracking-tighter text-brand-accent">NO <span className="text-black dark:text-white">Gym</span></span>
             </div>
             
             <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-black dark:text-white hover:text-brand-accent transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="w-full max-w-6xl mx-auto md:p-8">
                {children}
            </div>
        </div>

      </main>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 ${
            active 
            ? 'bg-brand-accent/10 text-brand-accent font-bold' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
        }`}
    >
        <div className={active ? 'text-brand-accent' : ''}>{icon}</div>
        <span className="text-sm">{label}</span>
    </button>
);