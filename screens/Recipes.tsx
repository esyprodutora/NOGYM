import React from 'react';
import { useAppStore } from '../store/appStore';

export const Recipes: React.FC = () => {
  const { recipes } = useAppStore();

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="p-6 pt-8">
        <h1 className="text-2xl font-bold text-white mb-2">Nutrição Inteligente</h1>
        <p className="text-brand-muted text-sm mb-6">Receitas simples, saudáveis e sem complicações.</p>

        <div className="grid grid-cols-1 gap-6">
          {recipes.map((recipe) => (
             <div key={recipe.id} className="group bg-brand-surface rounded-2xl overflow-hidden border border-brand-border active:scale-[0.98] transition-all cursor-pointer">
                <div className="h-40 w-full relative">
                    <img src={recipe.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={recipe.title} />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                        {recipe.category}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{recipe.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-brand-muted">
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            {recipe.time_minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                            {recipe.calories} kcal
                        </span>
                    </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};