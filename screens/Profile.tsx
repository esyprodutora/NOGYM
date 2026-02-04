import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const { user, logout, theme, toggleTheme, updateProfileStats, updateAvatar, updatePassword, badges } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editHeight, setEditHeight] = useState(user?.height_cm || 165);
  const [editTarget, setEditTarget] = useState(user?.target_weight_kg || 60);
  const [editCurrent, setEditCurrent] = useState(user?.current_weight_kg || 65);

  // Settings Modals State
  const [activeSetting, setActiveSetting] = useState<'password' | 'privacy' | 'notifications' | null>(null);
  
  // Settings Form State
  const [newPassword, setNewPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({ workouts: true, hydration: true, weekly: false });
  const [privacySettings, setPrivacySettings] = useState({ publicProfile: false, showWeight: true, analytics: true });

  // BMI Calculation Logic
  const calculateBMI = (weight: number, heightCm: number) => {
      const heightM = heightCm / 100;
      return (weight / (heightM * heightM)).toFixed(1);
  };

  const bmi = user ? calculateBMI(user.current_weight_kg, user.height_cm) : '0';
  
  const getBMICategory = (bmiVal: number) => {
      if (bmiVal < 18.5) return { label: 'Abaixo do Peso', color: 'text-blue-400' };
      if (bmiVal < 24.9) return { label: 'Peso Saudável', color: 'text-green-500' };
      if (bmiVal < 29.9) return { label: 'Sobrepeso', color: 'text-yellow-500' };
      return { label: 'Obesidade', color: 'text-red-500' };
  };

  const bmiInfo = getBMICategory(Number(bmi));

  const handleSaveProfile = () => {
      updateProfileStats(editHeight, editTarget, editCurrent);
      setIsEditing(false);
  };

  const handlePasswordUpdate = async () => {
      if(newPassword.length < 6) {
          alert("A senha deve ter pelo menos 6 caracteres.");
          return;
      }
      setPassLoading(true);
      const success = await updatePassword(newPassword);
      setPassLoading(false);
      if(success) {
          alert("Senha atualizada com sucesso!");
          setNewPassword('');
          setActiveSetting(null);
      } else {
          alert("Erro ao atualizar senha. Tente novamente.");
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (!file.type.startsWith('image/')) {
              alert('Por favor, selecione uma imagem válida.');
              return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target?.result) {
                  updateAvatar(event.target.result as string);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-right duration-300 min-h-full relative">
        
        {/* Settings Header */}
        <div className="p-6">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">Perfil</h1>
                <button onClick={() => setIsEditing(!isEditing)} className="text-brand-accent font-semibold text-sm">
                    {isEditing ? 'Cancelar' : 'Editar Dados'}
                </button>
             </div>

             <div className="bg-white dark:bg-brand-surface rounded-2xl p-6 border border-gray-200 dark:border-brand-border shadow-sm flex items-center gap-4 mb-6">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent to-black p-[2px] cursor-pointer group"
                >
                    <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden relative">
                         <img src={user?.avatar_url || "https://i.pravatar.cc/150?u=ana"} alt="Profile" className="w-full h-full object-cover transition-opacity group-hover:opacity-70" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                         </div>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="flex-1">
                    <h2 className="text-lg font-bold text-black dark:text-white">{user?.full_name}</h2>
                    <p className="text-sm text-gray-500 dark:text-brand-muted">{user?.email}</p>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-brand-accent font-semibold mt-1"
                    >
                        Alterar foto
                    </button>
                </div>
             </div>

             {/* Body Stats Section */}
             <div className="mb-6">
                 <h3 className="text-sm font-bold text-gray-500 dark:text-brand-muted uppercase tracking-wider mb-3 px-1">Dados Corporais</h3>
                 
                 {isEditing ? (
                     <div className="bg-brand-surface border border-brand-accent/30 rounded-2xl p-6 space-y-4 animate-in fade-in">
                         <div>
                             <label className="text-xs text-brand-muted block mb-1">Altura (cm)</label>
                             <input 
                                type="number" 
                                value={editHeight} 
                                onChange={(e) => setEditHeight(Number(e.target.value))}
                                className="w-full bg-black/20 border border-brand-border rounded-lg p-3 text-white focus:border-brand-accent outline-none"
                             />
                         </div>
                         <div>
                             <label className="text-xs text-brand-muted block mb-1">Peso Atual (kg)</label>
                             <input 
                                type="number" 
                                value={editCurrent} 
                                onChange={(e) => setEditCurrent(Number(e.target.value))}
                                className="w-full bg-black/20 border border-brand-border rounded-lg p-3 text-white focus:border-brand-accent outline-none"
                             />
                         </div>
                         <div>
                             <label className="text-xs text-brand-muted block mb-1">Meta de Peso (kg)</label>
                             <input 
                                type="number" 
                                value={editTarget} 
                                onChange={(e) => setEditTarget(Number(e.target.value))}
                                className="w-full bg-black/20 border border-brand-border rounded-lg p-3 text-white focus:border-brand-accent outline-none"
                             />
                         </div>
                         <Button fullWidth onClick={handleSaveProfile}>Salvar Alterações</Button>
                     </div>
                 ) : (
                    <div className="bg-white dark:bg-brand-surface rounded-2xl p-6 border border-gray-200 dark:border-brand-border shadow-sm grid grid-cols-2 gap-6">
                        <div>
                            <span className="block text-xs text-gray-400 dark:text-brand-muted mb-1">IMC Calculado</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-black dark:text-white">{bmi}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${bmiInfo.color}`}>{bmiInfo.label}</span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 dark:text-brand-muted mb-1">Altura</span>
                            <span className="text-2xl font-bold text-black dark:text-white">{user?.height_cm} <span className="text-sm font-normal text-gray-500">cm</span></span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 dark:text-brand-muted mb-1">Peso Atual</span>
                            <span className="text-2xl font-bold text-black dark:text-white">{user?.current_weight_kg} <span className="text-sm font-normal text-gray-500">kg</span></span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-400 dark:text-brand-muted mb-1">Meta</span>
                            <span className="text-2xl font-bold text-brand-accent">{user?.target_weight_kg} <span className="text-sm font-normal text-gray-500">kg</span></span>
                        </div>
                    </div>
                 )}
             </div>

             {/* Gamification: Badges Section (Expanded) */}
             <div className="mb-6">
                <div className="flex justify-between items-end mb-3 px-1">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-brand-muted uppercase tracking-wider">Sua Evolução</h3>
                    <span className="text-xs text-brand-accent">{user?.earned_badges.length || 0} de {badges.length}</span>
                </div>
                
                <div className="bg-white dark:bg-brand-surface border border-gray-200 dark:border-brand-border rounded-2xl p-4">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-y-6 gap-x-2">
                        {badges.map((badge) => {
                            const isUnlocked = user?.earned_badges.includes(badge.id);
                            return (
                                <div key={badge.id} className="flex flex-col items-center group relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 border transition-all duration-300 ${isUnlocked ? `border-transparent ${badge.color} text-white shadow-md scale-100` : 'bg-gray-100 dark:bg-black/30 border-gray-300 dark:border-brand-border text-gray-400 grayscale opacity-40'}`}>
                                        {badge.icon}
                                    </div>
                                    <span className={`text-[8px] text-center font-bold leading-tight line-clamp-2 w-full px-1 ${isUnlocked ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                                        {badge.title}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
             </div>

             <div className="space-y-4">
                 {/* Theme Toggle */}
                 <div className="bg-white dark:bg-brand-surface rounded-xl overflow-hidden border border-gray-200 dark:border-brand-border shadow-sm">
                    <div 
                        onClick={toggleTheme}
                        className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-white/5"
                    >
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                )}
                             </div>
                             <span className="text-black dark:text-white font-medium">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-brand-accent' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                 </div>

                 {/* Account Actions */}
                 <div className="bg-white dark:bg-brand-surface rounded-xl overflow-hidden border border-gray-200 dark:border-brand-border shadow-sm">
                    <SettingItem 
                        icon="lock" 
                        label="Alterar Senha" 
                        onClick={() => setActiveSetting('password')} 
                    />
                    <div className="h-[1px] bg-gray-100 dark:bg-brand-border mx-4"></div>
                    <SettingItem 
                        icon="shield" 
                        label="Privacidade" 
                        onClick={() => setActiveSetting('privacy')} 
                    />
                    <div className="h-[1px] bg-gray-100 dark:bg-brand-border mx-4"></div>
                    <SettingItem 
                        icon="bell" 
                        label="Notificações" 
                        onClick={() => setActiveSetting('notifications')} 
                    />
                 </div>
                 
                 <div className="pt-4">
                     <Button variant="outline" fullWidth onClick={logout}>Sair da Conta</Button>
                 </div>
             </div>
        </div>

        {/* --- SETTINGS MODALS --- */}
        {activeSetting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveSetting(null)}></div>
                <div className="relative bg-brand-surface w-full max-w-sm rounded-2xl p-6 border border-brand-border shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">
                            {activeSetting === 'password' && "Alterar Senha"}
                            {activeSetting === 'privacy' && "Privacidade"}
                            {activeSetting === 'notifications' && "Notificações"}
                        </h3>
                        <button onClick={() => setActiveSetting(null)} className="text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Password Modal */}
                    {activeSetting === 'password' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-brand-muted block mb-1">Nova Senha</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full bg-black/20 border border-brand-border rounded-lg p-3 text-white focus:border-brand-accent outline-none"
                                />
                            </div>
                            <Button fullWidth onClick={handlePasswordUpdate} isLoading={passLoading}>Atualizar Senha</Button>
                        </div>
                    )}

                    {/* Privacy Modal */}
                    {activeSetting === 'privacy' && (
                        <div className="space-y-4">
                             <ToggleRow 
                                label="Perfil Público" 
                                active={privacySettings.publicProfile} 
                                onToggle={() => setPrivacySettings(s => ({...s, publicProfile: !s.publicProfile}))} 
                             />
                             <ToggleRow 
                                label="Mostrar Peso na Galeria" 
                                active={privacySettings.showWeight} 
                                onToggle={() => setPrivacySettings(s => ({...s, showWeight: !s.showWeight}))} 
                             />
                             <ToggleRow 
                                label="Permitir Análise de Dados" 
                                active={privacySettings.analytics} 
                                onToggle={() => setPrivacySettings(s => ({...s, analytics: !s.analytics}))} 
                             />
                             <p className="text-xs text-brand-muted mt-4">Seus dados são criptografados e nunca compartilhados com terceiros sem consentimento.</p>
                        </div>
                    )}

                    {/* Notifications Modal */}
                    {activeSetting === 'notifications' && (
                        <div className="space-y-4">
                             <ToggleRow 
                                label="Lembretes de Treino" 
                                active={notificationSettings.workouts} 
                                onToggle={() => setNotificationSettings(s => ({...s, workouts: !s.workouts}))} 
                             />
                             <ToggleRow 
                                label="Alertas de Hidratação" 
                                active={notificationSettings.hydration} 
                                onToggle={() => setNotificationSettings(s => ({...s, hydration: !s.hydration}))} 
                             />
                             <ToggleRow 
                                label="Relatório Semanal" 
                                active={notificationSettings.weekly} 
                                onToggle={() => setNotificationSettings(s => ({...s, weekly: !s.weekly}))} 
                             />
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

const SettingItem = ({ icon, label, onClick }: { icon: string, label: string, onClick?: () => void }) => {
    const getIcon = () => {
        switch(icon) {
            case 'lock': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
            case 'shield': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
            case 'bell': return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
            default: return null;
        }
    }

    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-gray-400 dark:text-brand-muted">
                    {getIcon()}
                </div>
                <span className="text-black dark:text-white font-medium">{label}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
    )
}

const ToggleRow = ({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between" onClick={onToggle}>
        <span className="text-white text-sm">{label}</span>
        <div className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${active ? 'bg-brand-accent' : 'bg-gray-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
    </div>
);
