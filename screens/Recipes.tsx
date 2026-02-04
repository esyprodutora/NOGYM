import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Recipe, RecipeCategory } from '../types';

export const Recipes: React.FC = () => {
  const { recipes } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'Todas'>('Todas');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const categories: (RecipeCategory | 'Todas')[] = ['Todas', 'Café da Manhã', 'Almoço', 'Jantar', 'Lanche', 'Bebidas'];

  const filteredRecipes = selectedCategory === 'Todas' 
    ? recipes 
    : recipes.filter(r => r.category === selectedCategory);

  return (
    <div className="pb-24 md:pb-8 animate-in fade-in duration-500 min-h-full">
      <div className="p-6 pt-8 md:p-0">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Nutrição Inteligente</h1>
        <p className="text-gray-500 dark:text-brand-muted text-sm mb-6">Receitas simples, saudáveis e sem complicações.</p>

        {/* Category Filter - Edge to Edge Scroll on Mobile, Standard on Desktop */}
        <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto no-scrollbar mb-6 pb-2">
            <div className="flex gap-2 w-max">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                            selectedCategory === cat 
                            ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                            : 'bg-white dark:bg-brand-surface border border-gray-200 dark:border-brand-border text-gray-500 dark:text-brand-muted'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
             <div 
                key={recipe.id} 
                onClick={() => setSelectedRecipe(recipe)}
                className="group bg-white dark:bg-brand-surface rounded-2xl overflow-hidden border border-gray-100 dark:border-brand-border active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow-xl hover:border-brand-accent/30"
             >
                <div className="h-48 w-full relative overflow-hidden">
                    <img src={recipe.image_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={recipe.title} />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                        {recipe.category}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-4 relative -mt-12">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md line-clamp-1">{recipe.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-300">
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

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)}></div>
              <div className="relative bg-brand-dark md:bg-brand-surface w-full md:max-w-2xl h-[85vh] md:h-auto md:max-h-[90vh] md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>

                  {/* Header Image */}
                  <div className="h-64 md:h-72 relative shrink-0">
                      <img src={selectedRecipe.image_url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent md:from-brand-surface"></div>
                      <div className="absolute bottom-4 left-6">
                           <span className="inline-block px-2 py-1 mb-2 rounded bg-brand-accent text-[10px] font-bold text-white uppercase">{selectedRecipe.category}</span>
                           <h2 className="text-3xl font-bold text-white leading-tight">{selectedRecipe.title}</h2>
                      </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
                      
                      {/* Left Col: Stats & Ingredients */}
                      <div className="md:col-span-1 space-y-6">
                           {/* Stats */}
                           <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] text-brand-muted uppercase">Tempo</span>
                                    <span className="font-bold text-white text-sm">{selectedRecipe.time_minutes} min</span>
                                </div>
                                <div className="hidden md:block h-[1px] bg-white/10"></div>
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] text-brand-muted uppercase">Calorias</span>
                                    <span className="font-bold text-white text-sm">{selectedRecipe.calories}</span>
                                </div>
                                <div className="hidden md:block h-[1px] bg-white/10"></div>
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] text-brand-muted uppercase">Nível</span>
                                    <span className="font-bold text-white text-sm">Fácil</span>
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
                                    Ingredientes
                                </h3>
                                <ul className="space-y-2">
                                    {selectedRecipe.ingredients?.map((ing, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0"></div>
                                            {ing}
                                        </li>
                                    )) || <p className="text-brand-muted text-sm">Ingredientes não listados.</p>}
                                ul>
                            </div>
                      </div>

                      {/* Right Col: Instructions */}
                      <div className="md:col-span-2 pb-10 md:pb-0">
                          <h3 className="text-lg font-bold text-white mb-4">Modo de Preparo</h3>
                          <div className="space-y-6">
                              {selectedRecipe.instructions?.map((step, i) => (
                                  <div key={i} className="flex gap-4">
                                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-brand-accent shrink-0 border border-white/10">
                                          {i + 1}
                                      </div>
                                      <p className="text-sm text-gray-300 leading-relaxed pt-1.5">{step}</p>
                                  </div>
                              )) || <p className="text-brand-muted text-sm">Instruções não disponíveis.</p>}
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};