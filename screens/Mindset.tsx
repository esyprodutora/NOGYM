import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Button } from '../components/Button';
import { MindsetItem } from '../types';

export const Mindset: React.FC = () => {
  const { mindsetItems, toggleCompleteMindset } = useAppStore();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const activeItem = mindsetItems.find(m => m.id === activeVideoId);

  // Helper logic for YouTube (Shared with WorkoutDetails)
  const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- PLAYER VIEW ---
  if (activeItem) {
      const videoId = getYouTubeId(activeItem.video_url);
      
      return (
        <div className="min-h-full bg-brand-dark flex flex-col animate-in fade-in duration-300">
            {/* Header / Back Button */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button 
                    onClick={() => setActiveVideoId(null)}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-black/60 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
            </div>

            {/* Video Player Area */}
            <div className="w-full aspect-video bg-gray-900 relative flex items-center justify-center border-b border-brand-border">
                {videoId ? (
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} 
                        title={activeItem.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0 z-10"
                    ></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center text-brand-muted">
                        <p className="mb-2">Vídeo Indisponível</p>
                        <p className="text-xs">O link ainda não foi configurado.</p>
                    </div>
                )}
            </div>

            {/* Content Details */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">
                        MENTALIDADE
                    </span>
                    <span className="text-xs text-brand-muted flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {activeItem.duration}
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-white mb-4">{activeItem.title}</h1>
                <p className="text-brand-muted leading-relaxed mb-8">
                    {activeItem.description}
                </p>

                <div className="mt-auto">
                    <Button 
                        variant={activeItem.completed ? "outline" : "primary"} 
                        fullWidth 
                        onClick={() => {
                            toggleCompleteMindset(activeItem.id);
                            setActiveVideoId(null); // Go back after completing
                        }}
                    >
                        {activeItem.completed ? "Marcar como Não Visto" : "Concluir Aula"}
                    </Button>
                </div>
            </div>
        </div>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="pb-24 animate-in fade-in duration-300">
        <div className="p-6 pt-8 bg-brand-surface/50 border-b border-brand-border backdrop-blur-sm sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-white mb-2">Mindset</h1>
            <p className="text-brand-muted text-sm">A resiliência mental é tão treinável quanto a força física.</p>
        </div>

        <div className="p-6 space-y-4">
            {mindsetItems.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setActiveVideoId(item.id)}
                    className={`group relative overflow-hidden rounded-xl border transition-all active:scale-[0.98] cursor-pointer hover:border-brand-accent/50 hover:shadow-lg ${item.completed ? 'border-brand-accent/30 bg-brand-accent/5' : 'border-gray-800 bg-brand-surface'}`}
                >
                    <div className="flex p-3 gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-900 shrink-0">
                            <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                             {/* Play Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                {item.completed ? (
                                    <div className="bg-brand-accent rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-accent/80 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 flex flex-col justify-center py-1">
                            <h3 className={`font-semibold text-sm leading-snug mb-1 ${item.completed ? 'text-brand-accent' : 'text-white group-hover:text-brand-accent transition-colors'}`}>
                                {item.title}
                            </h3>
                            <p className="text-xs text-brand-muted line-clamp-2 mb-2">
                                {item.description}
                            </p>
                            <span className="text-[10px] text-gray-500 font-medium bg-white/5 self-start px-2 py-0.5 rounded">
                                {item.duration}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};