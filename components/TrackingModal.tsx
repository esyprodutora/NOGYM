import React, { useState } from 'react';
import { Button } from './Button';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'weight' | 'water' | 'journal';
  onSave: (value: string | number) => void;
  currentValue?: number | string;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ isOpen, onClose, title, type, onSave, currentValue }) => {
  const [value, setValue] = useState<string>(currentValue ? String(currentValue) : '');

  if (!isOpen) return null;

  const handleSave = () => {
      if (!value) return;
      onSave(type === 'journal' ? value : Number(value));
      onClose();
      setValue('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        {/* Modal Content */}
        <div className="relative bg-brand-surface border border-brand-border w-full max-w-md p-6 rounded-t-3xl md:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-brand-muted hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div className="space-y-6">
                {type === 'weight' && (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="flex items-end gap-2">
                            <input 
                                type="number" 
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="bg-transparent text-5xl font-bold text-white text-center border-b-2 border-brand-accent w-32 focus:outline-none"
                                placeholder="00.0"
                                autoFocus
                            />
                            <span className="text-xl text-brand-muted mb-2">kg</span>
                        </div>
                        <p className="text-xs text-brand-muted mt-4 text-center">
                            Acompanhe sua tendência. O progresso não é linear.
                        </p>
                    </div>
                )}

                {type === 'water' && (
                    <div className="grid grid-cols-3 gap-3">
                        {[0.25, 0.5, 1.0].map((amount) => (
                             <button 
                                key={amount}
                                onClick={() => { onSave(amount); onClose(); }}
                                className="bg-brand-dark border border-brand-border hover:border-blue-500 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors group"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 group-hover:scale-110 transition-transform"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                                <span className="text-white font-medium">+{amount}L</span>
                             </button>
                        ))}
                    </div>
                )}
                 
                 {type === 'journal' && (
                     <textarea 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Como você está se sentindo hoje?"
                        className="w-full h-32 bg-black/20 border border-brand-border rounded-xl p-4 text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-accent resize-none"
                     />
                 )}

                {type !== 'water' && (
                    <Button fullWidth onClick={handleSave}>
                        Salvar Registro
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
};