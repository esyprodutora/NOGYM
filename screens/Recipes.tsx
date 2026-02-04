import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Recipe, RecipeCategory } from '../types';

const CATEGORY_DATA: { id: RecipeCategory; title: string; image: string; subtitle: string }[] = [
    { id: 'Café da Manhã', title: 'Café da Manhã', image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800', subtitle: 'Comece o dia com energia' },
    { id: 'Almoço', title: 'Almoço', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800', subtitle: 'Refeições completas e saciantes' },
    { id: 'Jantar', title: 'Jantar', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800', subtitle: 'Leve e nutritivo para a noite' },
    { id: 'Lanche', title: 'Lanches', image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800', subtitle: 'Snacks rápidos e saudáveis' },
    { id: 'Bebidas', title: 'Bebidas', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800', subtitle: 'Hidratação e detox' },
];

export const Recipes: React.FC = () => {
  const { recipes } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  // Filter Logic
  const filteredRecipes = recipes.filter(r => {
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (activeFilter !== 'Todos' && !r.tags?.includes(activeFilter)) return false;
      return true;
  });

  // Extract available tags for the current category to make dynamic filters
  const availableTags: string[] = ['Todos', ...Array.from(new Set<string>(
      recipes
      .filter(r => r.category === selectedCategory)
      .flatMap(r => r.tags || [])
  ))].sort();

  return (
    <div className="pb-24 md:pb-8 animate-in fade-in duration-500 min-h-full">
      
      {/* --- LEVEL 1: CATEGORY SELECTION VIEW --- */}
      {!selectedCategory && (
          <div className="p-6 pt-8 md:p-0">
             <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Nutrição Inteligente</h1>
             <p className="text-gray-500 dark:text-brand-muted text-sm mb-6">Escolha o momento do seu dia.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {CATEGORY_DATA.map((cat) => (
                     <div 
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setActiveFilter('Todos'); }}
                        className="group relative h-40 md:h-56 rounded-3xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-all"
                     >
                         <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.title} />
                         <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                         <div className="absolute inset-0 flex flex-col justify-end p-6">
                             <h3 className="text-2xl font-bold text-white mb-1">{cat.title}</h3>
                             <p className="text-gray-200 text-xs">{cat.subtitle}</p>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      )}

      {/* --- LEVEL 2: RECIPE LIST VIEW --- */}
      {selectedCategory && (
          <div className="p-6 pt-4 md:p-0 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-black dark:text-white hover:bg-brand-accent hover:text-white transition-colors"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div>
                      <h2 className="text-2xl font-bold text-black dark:text-white">{selectedCategory}</h2>
                      <p className="text-xs text-gray-500 dark:text-brand-muted">{filteredRecipes.length} receitas encontradas</p>
                  </div>
              </div>

              {/* Dietary Filters */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                  {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveFilter(tag)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                            activeFilter === tag 
                            ? 'bg-brand-accent border-brand-accent text-white' 
                            : 'bg-transparent border-gray-200 dark:border-white/20 text-gray-500 dark:text-gray-300 hover:border-brand-accent'
                        }`}
                      >
                          {tag}
                      </button>
                  ))}
              </div>

              {/* List with Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecipes.map((recipe) => (
                      <div 
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="flex flex-col bg-white dark:bg-brand-surface rounded-2xl border border-gray-100 dark:border-brand-border cursor-pointer hover:border-brand-accent/50 transition-all active:scale-[0.99] shadow-sm overflow-hidden"
                      >
                          {/* Card Image */}
                          <div className="h-32 w-full relative">
                              <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                  {recipe.calories} kcal
                              </div>
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-black dark:text-white leading-tight text-lg line-clamp-1 mb-2">{recipe.title}</h3>
                                
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {recipe.tags?.slice(0, 3).map(t => (
                                        <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-md font-medium uppercase tracking-wide">{t}</span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-brand-muted mt-auto pt-2 border-t border-gray-100 dark:border-white/5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    <span>Preparo: {recipe.time_minutes} min</span>
                                </div>
                          </div>
                      </div>
                  ))}
              </div>
              
              {filteredRecipes.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-brand-muted">
                      Nenhuma receita encontrada com este filtro.
                  </div>
              )}
          </div>
      )}

      {/* --- LEVEL 3: RECIPE DETAIL MODAL --- */}
      {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)}></div>
              <div className="relative bg-brand-dark md:bg-brand-surface w-full md:max-w-2xl h-[85vh] md:h-auto md:max-h-[90vh] md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl border border-white/10">
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>

                  {/* Header Image */}
                  <div className="h-48 md:h-56 w-full relative">
                      <img src={selectedRecipe.image_url} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark md:from-brand-surface to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                           <div className="flex flex-wrap gap-2 mb-2">
                               {selectedRecipe.tags?.map(t => (
                                   <span key={t} className="px-2 py-1 rounded bg-brand-accent/90 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">{t}</span>
                               ))}
                           </div>
                           <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">{selectedRecipe.title}</h2>
                           <span className="text-sm text-gray-300">{selectedRecipe.category}</span>
                      </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-brand-dark md:bg-transparent">
                      
                      {/* Stats Row */}
                      <div className="flex justify-between bg-white/5 p-5 rounded-2xl border border-white/10">
                          <div className="text-center flex-1">
                              <span className="block text-[10px] text-brand-muted uppercase mb-1">Tempo</span>
                              <span className="font-bold text-white text-lg">{selectedRecipe.time_minutes}m</span>
                          </div>
                          <div className="w-[1px] bg-white/10"></div>
                          <div className="text-center flex-1">
                              <span className="block text-[10px] text-brand-muted uppercase mb-1">Calorias</span>
                              <span className="font-bold text-white text-lg">{selectedRecipe.calories}</span>
                          </div>
                          <div className="w-[1px] bg-white/10"></div>
                          <div className="text-center flex-1">
                              <span className="block text-[10px] text-brand-muted uppercase mb-1">Nível</span>
                              <span className="font-bold text-white text-lg">Fácil</span>
                          </div>
                      </div>

                      <div className="md:grid md:grid-cols-2 md:gap-8">
                        {/* Ingredients */}
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3"></path></svg>
                                Ingredientes
                            </h3>
                            <ul className="space-y-3">
                                {selectedRecipe.ingredients?.map((ing, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 p-2 rounded hover:bg-white/5 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0"></div>
                                        <span className="leading-relaxed">{ing}</span>
                                    </li>
                                )) || <p className="text-brand-muted text-sm">Ingredientes não listados.</p>}
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Modo de Preparo
                            </h3>
                            <div className="space-y-6">
                                {selectedRecipe.instructions?.map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-bold shrink-0 border border-brand-accent/20">
                                                {i + 1}
                                            </span>
                                            {i !== (selectedRecipe.instructions?.length || 0) - 1 && (
                                                <div className="w-[1px] h-full bg-brand-border/50 my-1"></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed pt-0.5">{step}</p>
                                    </div>
                                )) || <p className="text-brand-muted text-sm">Instruções não disponíveis.</p>}
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};