import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, MindsetItem, JournalEntry, RecipeCategory } from '../types';

// --- CONSTANTS ---
const BADGES: Badge[] = [
  { id: 'start', title: 'O Início', description: 'Começou sua jornada', icon: '🚀', color: 'bg-blue-500' },
  { id: 'loss_1', title: 'Primeiro Passo', description: 'Perdeu 1kg', icon: '💧', color: 'bg-cyan-500' },
  { id: 'loss_5', title: 'Imparável', description: 'Perdeu 5kg', icon: '🔥', color: 'bg-orange-500' },
  { id: 'loss_10', title: 'Transformação', description: 'Perdeu 10kg', icon: '💎', color: 'bg-pink-500' },
  { id: 'goal', title: 'Meta Atingida', description: 'Alcançou o peso ideal', icon: '🏆', color: 'bg-yellow-500' },
];

const DAILY_TIPS: DailyTip[] = [
    { id: '1', category: 'Mindset', title: 'Consistência > Intensidade', content: 'Não tente fazer tudo perfeito hoje. Apenas apareça.' },
    { id: '2', category: 'Nutrição', title: 'O poder da Proteína', content: 'Incluir proteína no café da manhã reduz os desejos de açúcar em até 60%.' },
    { id: '3', category: 'Hidratação', title: 'Beba antes de comer', content: 'Muitas vezes confundimos sede com fome. Beba água antes das refeições.' },
];

const MOCK_MINDSET: MindsetItem[] = [
    { id: 'm1', title: "Visualizando Seu Sucesso", duration: "5 min", type: "Áudio", completed: false },
    { id: 'm2', title: "Superando a Ansiedade do Platô", duration: "8 min", type: "Áudio", completed: false },
    { id: 'm3', title: "A Disciplina do Descanso", duration: "3 min", type: "Leitura", completed: false },
    { id: 'm4', title: "Por que não precisamos de academias", duration: "10 min", type: "Áudio", completed: false },
];

// --- RECIPE GENERATOR ---
const generateRecipes = (): Recipe[] => {
    const categories: { cat: RecipeCategory; baseImg: string; templates: any[] }[] = [
        { 
            cat: 'Café da Manhã', 
            baseImg: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800',
            templates: [
                { t: 'Panqueca de Banana e Aveia', cal: 280, tags: ['Vegetariano', 'Sem Glúten'], ing: ['1 banana madura', '2 ovos', '3 colheres de aveia', 'Canela a gosto'] },
                { t: 'Ovos Mexidos Cremosos', cal: 220, tags: ['Low Carb', 'Sem Glúten'], ing: ['2 ovos', '1 colher de requeijão light', 'Cebolinha', 'Sal e Pimenta'] },
                { t: 'Smoothie Verde Detox', cal: 150, tags: ['Vegano', 'Sem Lactose'], ing: ['1 folha de couve', '1 maçã', 'Gengibre', '200ml água de coco'] },
                { t: 'Mingau de Aveia Proteico', cal: 320, tags: ['Vegetariano'], ing: ['30g aveia', '1 scoop whey protein', 'Leite desnatado', 'Frutas vermelhas'] },
                { t: 'Tostada de Abacate', cal: 290, tags: ['Vegano'], ing: ['1 fatia pão integral', '1/2 abacate amassado', 'Limão', 'Pimenta calabresa'] },
                { t: 'Omelete de Espinafre', cal: 200, tags: ['Low Carb', 'Sem Glúten'], ing: ['2 ovos', '1 xícara espinafre', 'Tomate cereja', 'Orégano'] },
                { t: 'Iogurte com Chia e Frutas', cal: 180, tags: ['Vegetariano', 'Sem Glúten'], ing: ['Iogurte natural', '1 colher chia', 'Morangos picados'] },
                { t: 'Crepioca de Frango', cal: 310, tags: ['Sem Glúten'], ing: ['1 ovo', '2 colheres goma de tapioca', 'Frango desfiado', 'Ricota'] },
                { t: 'Pão de Queijo de Frigideira', cal: 250, tags: ['Sem Glúten'], ing: ['1 ovo', '2 colheres tapioca', '1 colher queijo cottage', 'Sal'] },
                { t: 'Salada de Frutas com Granola', cal: 200, tags: ['Vegano', 'Sem Lactose'], ing: ['Mamão', 'Melão', 'Banana', 'Granola sem açúcar'] },
            ]
        },
        { 
            cat: 'Almoço', 
            baseImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
            templates: [
                { t: 'Salada Caesar com Frango', cal: 350, tags: ['Low Carb'], ing: ['Alface americana', 'Peito de frango grelhado', 'Parmesão ralado', 'Molho de iogurte'] },
                { t: 'Bowl de Quinoa e Legumes', cal: 320, tags: ['Vegano', 'Sem Glúten'], ing: ['Quinoa cozida', 'Brócolis', 'Cenoura', 'Grão de bico'] },
                { t: 'Filé de Tilápia com Purê', cal: 300, tags: ['Sem Glúten'], ing: ['Filé de tilápia', 'Limão', 'Purê de abóbora', 'Salada verde'] },
                { t: 'Escondidinho de Batata Doce', cal: 380, tags: ['Sem Glúten'], ing: ['Batata doce cozida', 'Carne moída magra', 'Cebola', 'Alho'] },
                { t: 'Macarrão de Abobrinha', cal: 220, tags: ['Low Carb', 'Vegano'], ing: ['Abobrinha fatiada', 'Molho de tomate caseiro', 'Manjericão'] },
                { t: 'Strogonoff de Grão de Bico', cal: 310, tags: ['Vegano', 'Sem Lactose'], ing: ['Grão de bico cozido', 'Leite de coco', 'Molho de tomate', 'Cogumelos'] },
                { t: 'Frango com Quiabo', cal: 340, tags: ['Low Carb'], ing: ['Coxa de frango', 'Quiabo', 'Cebola', 'Pimentão'] },
                { t: 'Salada de Atum e Feijão Branco', cal: 290, tags: ['Sem Glúten'], ing: ['Atum em água', 'Feijão branco', 'Cebola roxa', 'Salsinha'] },
                { t: 'Risoto de Couve-Flor', cal: 200, tags: ['Low Carb'], ing: ['Couve-flor triturada', 'Queijo parmesão', 'Caldo de legumes', 'Frango em cubos'] },
                { t: 'Wrap de Alface com Carne', cal: 250, tags: ['Low Carb', 'Sem Lactose'], ing: ['Folhas de alface grandes', 'Carne moída refogada', 'Tomate', 'Cenoura ralada'] },
            ]
        },
        { 
            cat: 'Jantar', 
            baseImg: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
            templates: [
                { t: 'Sopa Creme de Abóbora', cal: 180, tags: ['Vegano', 'Low Carb'], ing: ['Abóbora cabotiá', 'Gengibre', 'Cebola', 'Azeite'] },
                { t: 'Omelete de Forno com Legumes', cal: 220, tags: ['Vegetariano', 'Low Carb'], ing: ['3 ovos', 'Abobrinha', 'Cenoura', 'Queijo branco'] },
                { t: 'Salmão Grelhado com Aspargos', cal: 350, tags: ['Low Carb', 'Sem Glúten'], ing: ['Posta de salmão', 'Aspargos', 'Limão siciliano', 'Ervas finas'] },
                { t: 'Salada Caprese', cal: 250, tags: ['Vegetariano'], ing: ['Tomate', 'Muçarela de búfala', 'Manjericão', 'Azeite balsâmico'] },
                { t: 'Canja de Galinha Low Carb', cal: 200, tags: ['Low Carb'], ing: ['Peito de frango', 'Couve-flor picada (arroz falso)', 'Cenoura', 'Salsão'] },
                { t: 'Berinjela Recheada', cal: 280, tags: ['Low Carb'], ing: ['Berinjela', 'Carne moída magra', 'Tomate', 'Queijo ralado'] },
                { t: 'Tofu Grelhado com Legumes', cal: 210, tags: ['Vegano'], ing: ['Tofu firme', 'Shoyu light', 'Brotos de feijão', 'Pimentão'] },
                { t: 'Ceviche de Tilápia', cal: 190, tags: ['Low Carb', 'Sem Lactose'], ing: ['Tilápia fresca', 'Limão', 'Cebola roxa', 'Coentro', 'Pimenta'] },
                { t: 'Wrap Integral de Hummus', cal: 300, tags: ['Vegano'], ing: ['Pão folha integral', 'Hummus', 'Rúcula', 'Pepino'] },
                { t: 'Sopa Verde Detox', cal: 150, tags: ['Vegano', 'Low Carb'], ing: ['Espinafre', 'Chuchu', 'Abobrinha', 'Hortelã'] },
            ]
        },
        { 
            cat: 'Lanche', 
            baseImg: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800',
            templates: [
                { t: 'Mix de Castanhas', cal: 180, tags: ['Vegano', 'Low Carb'], ing: ['Castanha do Pará', 'Nozes', 'Amêndoas'] },
                { t: 'Chips de Coco', cal: 150, tags: ['Vegano', 'Low Carb'], ing: ['Lâminas de coco seco', 'Canela (opcional)'] },
                { t: 'Ovo de Codorna Temperado', cal: 140, tags: ['Low Carb'], ing: ['Ovos de codorna', 'Orégano', 'Azeite'] },
                { t: 'Palitos de Cenoura com Hummus', cal: 160, tags: ['Vegano', 'Sem Glúten'], ing: ['Cenoura em tiras', 'Pasta de grão de bico'] },
                { t: 'Muffin de Banana (Sem farinha)', cal: 190, tags: ['Sem Glúten'], ing: ['Banana', 'Ovo', 'Cacau em pó', 'Fermento'] },
                { t: 'Biscoito de Arroz com Pasta de Amendoim', cal: 200, tags: ['Vegano'], ing: ['2 biscoitos de arroz', 'Pasta de amendoim integral'] },
                { t: 'Queijo Coalho Assado', cal: 220, tags: ['Vegetariano'], ing: ['Espeto de queijo coalho', 'Orégano'] },
                { t: 'Chips de Batata Doce (Airfryer)', cal: 170, tags: ['Vegano'], ing: ['Batata doce fatiada fina', 'Sal', 'Paprica'] },
                { t: 'Iogurte Grego com Mel', cal: 180, tags: ['Vegetariano'], ing: ['Iogurte grego natural', 'Fio de mel'] },
                { t: 'Barra de Proteína Caseira', cal: 250, tags: ['Sem Glúten'], ing: ['Aveia', 'Pasta de amendoim', 'Whey protein', 'Mel'] },
            ]
        },
        { 
            cat: 'Bebidas', 
            baseImg: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800',
            templates: [
                { t: 'Suco Verde Clássico', cal: 80, tags: ['Vegano', 'Detox'], ing: ['Couve', 'Limão', 'Maçã', 'Gengibre'] },
                { t: 'Chá de Hibisco com Canela', cal: 5, tags: ['Vegano', 'Zero Cal'], ing: ['Flor de hibisco', 'Pau de canela', 'Água quente'] },
                { t: 'Suchá de Abacaxi', cal: 90, tags: ['Vegano'], ing: ['Chá verde', 'Abacaxi', 'Hortelã'] },
                { t: 'Golden Milk (Leite Dourado)', cal: 120, tags: ['Vegano', 'Anti-inflamatório'], ing: ['Leite de amêndoas', 'Cúrcuma', 'Pimenta preta', 'Canela'] },
                { t: 'Água Aromatizada Cítrica', cal: 0, tags: ['Vegano', 'Hidratação'], ing: ['Água com gás', 'Rodelas de limão', 'Rodelas de laranja'] },
                { t: 'Shake de Cacau e Banana', cal: 250, tags: ['Vegetariano', 'Proteico'], ing: ['Banana congelada', 'Leite', 'Cacau 100%', 'Whey (opcional)'] },
                { t: 'Suco de Melancia com Gengibre', cal: 100, tags: ['Vegano'], ing: ['Melancia', 'Gengibre ralado'] },
                { t: 'Chá de Camomila e Maracujá', cal: 10, tags: ['Vegano', 'Relaxante'], ing: ['Camomila', 'Polpa de maracujá'] },
                { t: 'Limonada Suíça Fit', cal: 40, tags: ['Vegano'], ing: ['Limão com casca', 'Água', 'Adoçante Stevia'] },
                { t: 'Café Bulletproof', cal: 180, tags: ['Low Carb', 'Energia'], ing: ['Café preto', 'Óleo de coco', 'Manteiga ghee'] },
            ]
        }
    ];

    const allRecipes: Recipe[] = [];
    let idCounter = 1;

    // Expand templates to reach ~20 per category
    categories.forEach(cat => {
        cat.templates.forEach(t => {
            allRecipes.push({
                id: `rec-${idCounter++}`,
                title: t.t,
                calories: t.cal,
                time_minutes: Math.floor(Math.random() * 20) + 5,
                category: cat.cat,
                image_url: cat.baseImg,
                ingredients: t.ing,
                instructions: ['Lave e prepare os ingredientes.', 'Misture tudo conforme a necessidade.', 'Cozinhe ou sirva gelado dependendo do prato.', 'Aproveite sua refeição saudável!'],
                tags: t.tags
            });
        });
        cat.templates.forEach(t => {
            allRecipes.push({
                id: `rec-${idCounter++}`,
                title: `${t.t} (Variação)`,
                calories: t.cal + 20,
                time_minutes: Math.floor(Math.random() * 20) + 5,
                category: cat.cat,
                image_url: cat.baseImg,
                ingredients: [...t.ing, 'Ingrediente extra a gosto'],
                instructions: ['Versão alternativa.', 'Siga o preparo base.', 'Adicione o ingrediente extra no final.'],
                tags: t.tags
            });
        });
    });

    return allRecipes;
}

const MOCK_RECIPES = generateRecipes();

// --- WORKOUTS (28 DAYS) ---
// IMPORTANT: Paste your YouTube Links in the 'video_url' field below.
// Example: video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
const MOCK_WORKOUTS: Workout[] = [
    { id: 'workout-1',  day_number: 1,  title: 'Treino Dia 1',  description: 'Foco em força e estabilidade.', duration_minutes: 20, difficulty: 'Iniciante', is_locked: false, completed: false, thumbnail_url: 'https://picsum.photos/seed/101/800/600', video_url: '' },
    { id: 'workout-2',  day_number: 2,  title: 'Treino Dia 2',  description: 'Foco em força e estabilidade.', duration_minutes: 21, difficulty: 'Iniciante', is_locked: false, completed: false, thumbnail_url: 'https://picsum.photos/seed/102/800/600', video_url: '' },
    { id: 'workout-3',  day_number: 3,  title: 'Treino Dia 3',  description: 'Foco em força e estabilidade.', duration_minutes: 22, difficulty: 'Iniciante', is_locked: false, completed: false, thumbnail_url: 'https://picsum.photos/seed/103/800/600', video_url: '' },
    { id: 'workout-4',  day_number: 4,  title: 'Treino Dia 4',  description: 'Foco em força e estabilidade.', duration_minutes: 23, difficulty: 'Iniciante', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/104/800/600', video_url: '' },
    { id: 'workout-5',  day_number: 5,  title: 'Treino Dia 5',  description: 'Foco em força e estabilidade.', duration_minutes: 24, difficulty: 'Iniciante', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/105/800/600', video_url: '' },
    { id: 'workout-6',  day_number: 6,  title: 'Treino Dia 6',  description: 'Foco em força e estabilidade.', duration_minutes: 25, difficulty: 'Iniciante', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/106/800/600', video_url: '' },
    { id: 'workout-7',  day_number: 7,  title: 'Treino Dia 7',  description: 'Foco em força e estabilidade.', duration_minutes: 26, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/107/800/600', video_url: '' },
    { id: 'workout-8',  day_number: 8,  title: 'Treino Dia 8',  description: 'Foco em força e estabilidade.', duration_minutes: 27, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/108/800/600', video_url: '' },
    { id: 'workout-9',  day_number: 9,  title: 'Treino Dia 9',  description: 'Foco em força e estabilidade.', duration_minutes: 28, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/109/800/600', video_url: '' },
    { id: 'workout-10', day_number: 10, title: 'Treino Dia 10', description: 'Foco em força e estabilidade.', duration_minutes: 29, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/110/800/600', video_url: '' },
    { id: 'workout-11', day_number: 11, title: 'Treino Dia 11', description: 'Foco em força e estabilidade.', duration_minutes: 20, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/111/800/600', video_url: '' },
    { id: 'workout-12', day_number: 12, title: 'Treino Dia 12', description: 'Foco em força e estabilidade.', duration_minutes: 21, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/112/800/600', video_url: '' },
    { id: 'workout-13', day_number: 13, title: 'Treino Dia 13', description: 'Foco em força e estabilidade.', duration_minutes: 22, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/113/800/600', video_url: '' },
    { id: 'workout-14', day_number: 14, title: 'Treino Dia 14', description: 'Foco em força e estabilidade.', duration_minutes: 23, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/114/800/600', video_url: '' },
    { id: 'workout-15', day_number: 15, title: 'Treino Dia 15', description: 'Foco em força e estabilidade.', duration_minutes: 24, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/115/800/600', video_url: '' },
    { id: 'workout-16', day_number: 16, title: 'Treino Dia 16', description: 'Foco em força e estabilidade.', duration_minutes: 25, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/116/800/600', video_url: '' },
    { id: 'workout-17', day_number: 17, title: 'Treino Dia 17', description: 'Foco em força e estabilidade.', duration_minutes: 26, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/117/800/600', video_url: '' },
    { id: 'workout-18', day_number: 18, title: 'Treino Dia 18', description: 'Foco em força e estabilidade.', duration_minutes: 27, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/118/800/600', video_url: '' },
    { id: 'workout-19', day_number: 19, title: 'Treino Dia 19', description: 'Foco em força e estabilidade.', duration_minutes: 28, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/119/800/600', video_url: '' },
    { id: 'workout-20', day_number: 20, title: 'Treino Dia 20', description: 'Foco em força e estabilidade.', duration_minutes: 29, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/120/800/600', video_url: '' },
    { id: 'workout-21', day_number: 21, title: 'Treino Dia 21', description: 'Foco em força e estabilidade.', duration_minutes: 20, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/121/800/600', video_url: '' },
    { id: 'workout-22', day_number: 22, title: 'Treino Dia 22', description: 'Foco em força e estabilidade.', duration_minutes: 21, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/122/800/600', video_url: '' },
    { id: 'workout-23', day_number: 23, title: 'Treino Dia 23', description: 'Foco em força e estabilidade.', duration_minutes: 22, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/123/800/600', video_url: '' },
    { id: 'workout-24', day_number: 24, title: 'Treino Dia 24', description: 'Foco em força e estabilidade.', duration_minutes: 23, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/124/800/600', video_url: '' },
    { id: 'workout-25', day_number: 25, title: 'Treino Dia 25', description: 'Foco em força e estabilidade.', duration_minutes: 24, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/125/800/600', video_url: '' },
    { id: 'workout-26', day_number: 26, title: 'Treino Dia 26', description: 'Foco em força e estabilidade.', duration_minutes: 25, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/126/800/600', video_url: '' },
    { id: 'workout-27', day_number: 27, title: 'Treino Dia 27', description: 'Foco em força e estabilidade.', duration_minutes: 26, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/127/800/600', video_url: '' },
    { id: 'workout-28', day_number: 28, title: 'Treino Dia 28', description: 'Foco em força e estabilidade.', duration_minutes: 27, difficulty: 'Intermediário', is_locked: true,  completed: false, thumbnail_url: 'https://picsum.photos/seed/128/800/600', video_url: '' },
];

interface AppState {
  currentScreen: AppScreen;
  user: UserProfile | null;
  workouts: Workout[];
  recipes: Recipe[];
  badges: Badge[];
  dailyTip: DailyTip;
  mindsetItems: MindsetItem[];
  journal: JournalEntry[];
  selectedWorkoutId: string | null;
  theme: 'dark' | 'light';
  waterIntakeL: number;
  newBadgeUnlocked: Badge | null;
  
  // Actions
  setScreen: (screen: AppScreen) => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  selectWorkout: (id: string) => void;
  toggleCompleteWorkout: (id: string) => void;
  toggleCompleteMindset: (id: string) => void;
  toggleTheme: () => void;
  
  // Data Logging
  logWeight: (weight: number) => Promise<void>;
  logWater: (amountL: number) => Promise<void>;
  logJournal: (text: string) => Promise<void>;
  updateProfileStats: (height: number, targetWeight: number, currentWeight: number) => Promise<void>;
  updateAvatar: (url: string) => Promise<void>;
  clearNewBadge: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: AppScreen.AUTH,
  user: null,
  workouts: MOCK_WORKOUTS,
  recipes: MOCK_RECIPES,
  badges: BADGES,
  dailyTip: DAILY_TIPS[0],
  mindsetItems: MOCK_MINDSET,
  journal: [],
  selectedWorkoutId: null,
  theme: 'dark',
  waterIntakeL: 0,
  newBadgeUnlocked: null,

  setScreen: (screen) => set({ currentScreen: screen }),

  initialize: async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
            await get().fetchUserData(session.user.id);
            set({ currentScreen: AppScreen.DASHBOARD });
        }
    } catch (e) {
        console.log("Inicialização: Sem sessão ativa ou offline.");
    }
  },

  fetchUserData: async (userId: string) => {
      try {
          // 1. Fetch Profile
          let { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (error || !profile) {
              // Self-healing for missing profiles (common during dev)
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                   const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({
                        id: userId,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || 'Usuário',
                        current_weight_kg: 60,
                        target_weight_kg: 55,
                        height_cm: 160
                   }).select().single();
                   
                   if (!insertError && newProfile) {
                       profile = newProfile;
                   } else {
                       return;
                   }
              } else {
                  return;
              }
          }

          // 2. Fetch Weight History
          const { data: weightLogs } = await supabase
            .from('weight_logs')
            .select('created_at, weight_kg')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

          const weightHistory = weightLogs?.map(log => ({
              date: new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
              weight: log.weight_kg
          })) || [];

          // 3. Fetch Water Today
          const today = new Date().toISOString().split('T')[0];
          const { data: waterLogs } = await supabase
            .from('water_logs')
            .select('amount_ml')
            .eq('user_id', userId)
            .gte('created_at', `${today}T00:00:00`);
          
          const totalWaterL = (waterLogs?.reduce((acc, curr) => acc + curr.amount_ml, 0) || 0) / 1000;

          // 4. Fetch Journal
          const { data: journalEntries } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          const journal = journalEntries?.map(j => ({
              id: j.id,
              date: new Date(j.created_at).toLocaleDateString('pt-BR'),
              content: j.content
          })) || [];

          // 5. Fetch Completed Workouts
          const { data: progress } = await supabase.from('user_workout_progress').select('workout_id').eq('user_id', userId);
          const completedIds = progress?.map(p => p.workout_id) || [];
          
          // Update State
          set((state) => ({
              user: {
                  id: userId,
                  email: profile.email,
                  full_name: profile.full_name || 'Usuário',
                  phone: profile.phone,
                  current_weight_kg: profile.current_weight_kg || 60,
                  starting_weight_kg: weightHistory[0]?.weight || profile.current_weight_kg || 60,
                  target_weight_kg: profile.target_weight_kg || 55,
                  height_cm: profile.height_cm || 160,
                  streak_days: profile.streak_days || 0,
                  is_premium: profile.is_premium,
                  avatar_url: profile.avatar_url,
                  weight_history: weightHistory,
                  earned_badges: [] 
              },
              waterIntakeL: totalWaterL,
              journal: journal,
              workouts: state.workouts.map(w => ({
                  ...w,
                  completed: completedIds.includes(w.id) 
              }))
          }));
      } catch (e) {
          console.error("Erro crítico ao carregar dados:", e);
      }
  },

  login: async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;

        if (data.user) {
            await get().fetchUserData(data.user.id);
            set({ currentScreen: AppScreen.DASHBOARD });
            return true;
        }
    } catch (e: any) {
        console.error("Login Error:", e.message);
        throw e;
    }
    return false;
  },

  register: async (email, password, fullName, phone) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            if (data.session) {
                // Ensure profile exists
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: email,
                    full_name: fullName,
                    current_weight_kg: 60,
                    target_weight_kg: 55,
                    height_cm: 160
                }).select();
                
                await get().fetchUserData(data.user.id);
                set({ currentScreen: AppScreen.DASHBOARD });
                return true;
            } else {
                return true; 
            }
        }
    } catch (e: any) {
         console.error("Register Error:", e.message);
         throw e;
    }
    return false;
  },

  resetPassword: async (email) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin, 
        });
        return !error;
      } catch(e) {
          return false;
      }
  },
  
  logout: async () => {
      try {
        await supabase.auth.signOut();
      } catch(e) {}
      set({ user: null, currentScreen: AppScreen.AUTH });
  },

  selectWorkout: (id) => set({ selectedWorkoutId: id, currentScreen: AppScreen.WORKOUT_DETAILS }),
  
  toggleCompleteWorkout: async (id) => {
    const { user, workouts } = get();
    if (!user) return;
    
    // Optimistic UI Update
    set({
        workouts: workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w)
    });

    const workout = workouts.find(w => w.id === id);
    if (!workout) return;

    if (!workout.completed) {
        try {
            await supabase.from('user_workout_progress').insert({
                user_id: user.id,
                workout_id: id 
            });
            get().logJournal(`Concluí o treino: ${workout.title} 🔥`);
        } catch (e) {}
    }
  },

  toggleCompleteMindset: async (id) => {
      const { user, mindsetItems } = get();
      if (!user) return;

      set({
          mindsetItems: mindsetItems.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
      });

      const item = mindsetItems.find(i => i.id === id);
      if(!item) return;

      if (!item.completed) {
           try {
              await supabase.from('user_mindset_progress').insert({
                  user_id: user.id,
                  item_id: id 
              });
           } catch(e) {}
      }
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  
  logWeight: async (newWeight) => {
      const { user } = get();
      if (!user) return;

      const today = new Date();
      const dateLabel = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      
      set((state) => ({
          user: state.user ? {
              ...state.user,
              current_weight_kg: newWeight,
              weight_history: [...state.user.weight_history, { date: dateLabel, weight: newWeight }]
          } : null
      }));

      try {
        await supabase.from('weight_logs').insert({ user_id: user.id, weight_kg: newWeight });
        await supabase.from('profiles').update({ current_weight_kg: newWeight }).eq('id', user.id);
      } catch(e) {}
  },

  logWater: async (amountL) => {
      const { user, waterIntakeL } = get();
      if (!user) return;

      set({ waterIntakeL: Number((waterIntakeL + amountL).toFixed(1)) });

      try {
          await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: amountL * 1000 });
      } catch(e) {}
  },

  logJournal: async (text) => {
      const { user, journal } = get();
      if (!user) return;

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        content: text
      };
      set({ journal: [newEntry, ...journal] });

      try {
          await supabase.from('journal_entries').insert({ user_id: user.id, content: text });
      } catch(e) {}
  },

  updateProfileStats: async (height, targetWeight, currentWeight) => {
      const { user } = get();
      if (!user) return;

      set((state) => ({
          user: state.user ? {
              ...state.user,
              height_cm: height,
              target_weight_kg: targetWeight,
              current_weight_kg: currentWeight
          } : null
      }));

      try {
          await supabase.from('profiles').update({
              height_cm: height,
              target_weight_kg: targetWeight,
              current_weight_kg: currentWeight
          }).eq('id', user.id);
      } catch(e) {}
  },

  updateAvatar: async (url: string) => {
      const { user } = get();
      if (!user) return;

      set((state) => ({
          user: state.user ? { ...state.user, avatar_url: url } : null
      }));

      try {
          await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      } catch(e) {}
  },

  clearNewBadge: () => set({ newBadgeUnlocked: null })
}));