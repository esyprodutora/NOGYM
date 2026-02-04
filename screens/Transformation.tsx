import React, { useRef } from 'react';
import { useAppStore } from '../store/appStore';

export const Transformation: React.FC = () => {
  const { user, updateProgressPhoto, addGalleryPhoto } = useAppStore();
  
  const startPhotoInputRef = useRef<HTMLInputElement>(null);
  const currentPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'current' | 'gallery') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  const url = ev.target.result as string;
                  if (type === 'gallery') {
                      addGalleryPhoto(url);
                  } else {
                      updateProgressPhoto(type, url);
                  }
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const weightChange = (user?.starting_weight_kg || 0) - (user?.current_weight_kg || 0);

  return (
    <div className="pb-24 animate-in fade-in duration-300 min-h-full">
        {/* Header */}
        <div className="p-6 pt-8 bg-white dark:bg-brand-surface/50 border-b border-gray-200 dark:border-brand-border sticky top-0 z-10 backdrop-blur-md">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Arquivo de Transformação</h1>
            <p className="text-gray-500 dark:text-brand-muted text-sm">Registre cada etapa da sua evolução.</p>
        </div>

        <div className="p-6 space-y-8">
            
            {/* --- COMPARISON SECTION --- */}
            <section>
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-lg font-bold text-black dark:text-white">Antes & Depois</h2>
                    {weightChange > 0 && (
                        <span className="text-sm font-bold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                            -{weightChange.toFixed(1)} kg eliminados
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Start Photo */}
                    <div 
                        onClick={() => startPhotoInputRef.current?.click()}
                        className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-brand-surface border-2 border-dashed border-gray-300 dark:border-white/10 relative overflow-hidden cursor-pointer group hover:border-brand-accent/50 transition-colors"
                    >
                        <input type="file" ref={startPhotoInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'start')} />
                        {user?.start_photo_url ? (
                            <>
                                <img src={user.start_photo_url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-brand-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path><line x1="16" y1="5" x2="22" y2="5"></line><line x1="19" y1="2" x2="19" y2="8"></line><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                <span className="text-xs mt-2 font-medium">Foto Inicial</span>
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                            Início
                        </div>
                    </div>

                    {/* Current Photo */}
                    <div 
                        onClick={() => currentPhotoInputRef.current?.click()}
                        className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-brand-surface border-2 border-dashed border-gray-300 dark:border-white/10 relative overflow-hidden cursor-pointer group hover:border-brand-accent/50 transition-colors"
                    >
                        <input type="file" ref={currentPhotoInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'current')} />
                        {user?.current_photo_url ? (
                            <>
                                <img src={user.current_photo_url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-brand-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                <span className="text-xs mt-2 font-medium">Foto Atual</span>
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-brand-accent/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                            Hoje
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-black dark:text-white">Galeria do Processo</h2>
                    <button 
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-3 py-2 rounded-lg hover:bg-brand-accent/20 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        Adicionar Foto
                    </button>
                    <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'gallery')} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {user?.progress_photos && user.progress_photos.length > 0 ? (
                        user.progress_photos.map((photo) => (
                            <div key={photo.id} className="aspect-square rounded-xl bg-gray-800 overflow-hidden relative group">
                                <img src={photo.url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                    <span className="text-[10px] font-bold text-white">{photo.date}</span>
                                    {photo.weight && <span className="text-[9px] text-gray-300">{photo.weight}kg</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-8 text-center border-2 border-dashed border-gray-200 dark:border-white/5 rounded-xl">
                            <p className="text-gray-500 dark:text-brand-muted text-sm">Nenhuma foto salva no histórico ainda.</p>
                        </div>
                    )}
                </div>
            </section>

        </div>
    </div>
  );
};