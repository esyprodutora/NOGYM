import { create } from 'zustand';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, RecipeCategory, MindsetItem, JournalEntry } from '../types';

// --- MOCK DATA ---

const BADGES: Badge[] = [
  { id: 'start', title: 'O Início', description: 'Começou sua jornada', icon: '🚀', color: 'bg-blue-500' },
  { id: 'loss_1', title: 'Primeiro Passo', description: 'Perdeu 1kg', icon: '💧', color: 'bg-cyan-500' },
  { id: 'loss_5', title: 'Imparável', description: 'Perdeu 5kg', icon: '🔥', color: 'bg-orange-500' },
  { id: 'loss_10', title: 'Transformação', description: 'Perdeu 10kg', icon: '💎', color: 'bg-pink-500' },
  { id: 'goal', title: 'Meta Atingida', description: 'Alcançou o peso ideal', icon: '🏆', color: 'bg-yellow-500' },
  { id: 'streak_7', title: 'Consistência', description: '7 dias seguidos', icon: '⚡', color: 'bg-purple-500' },
  { id: 'streak_30', title: 'Hábito de Ferro', description: '30 dias seguidos', icon: '🛡️', color: 'bg-red-500' },
];

const MOCK_USER: UserProfile = {
  id: '123-uuid',
  email: 'ana@exemplo.com',
  full_name: 'Ana Silva',
  starting_weight_kg: 72.5,
  current_weight_kg: 68.5,
  target_weight_kg: 62.0,
  height_cm: 165,
  streak_days: 12,
  is_premium: false,
  earned_badges: ['start', 'loss_1'],
  weight_history: [
    { date: '01 Jan', weight: 72.5 },
    { date: '08 Jan', weight: 71.8 },
    { date: '15 Jan', weight: 71.0 },
    { date: '22 Jan', weight: 70.2 },
    { date: '29 Jan', weight: 69.5 },
    { date: '05 Fev', weight: 68.9 },
    { date: '12 Fev', weight: 68.5 },
  ]
};

const MOCK_MINDSET: MindsetItem[] = [
    { id: 'm1', title: "Visualizando Seu Sucesso", duration: "5 min", type: "Áudio", completed: true },
    { id: 'm2', title: "Superando a Ansiedade do Platô", duration: "8 min", type: "Áudio", completed: false },
    { id: 'm3', title: "A Disciplina do Descanso", duration: "3 min", type: "Leitura", completed: false },
    { id: 'm4', title: "Por que não precisamos de academias", duration: "10 min", type: "Áudio", completed: false },
    { id: 'm5', title: "Afirmações Matinais", duration: "4 min", type: "Áudio", completed: false },
];

// Expanded Recipe Database with Premium Photography
const MOCK_RECIPES: Recipe[] = [
  // --- CAFÉ DA MANHÃ (BREAKFAST) ---
  { 
    id: 'b1', title: 'Panqueca de Banana Fit', calories: 300, time_minutes: 10, category: 'Café da Manhã', 
    image_url: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 banana madura', '2 ovos', '1 colher de aveia', 'Canela a gosto'],
    instructions: ['Amasse a banana.', 'Misture com os ovos e a aveia.', 'Faça discos em uma frigideira antiaderente.', 'Vire quando dourar.']
  },
  { 
    id: 'b2', title: 'Ovos Mexidos Cremosos', calories: 250, time_minutes: 5, category: 'Café da Manhã', 
    image_url: 'https://images.unsplash.com/photo-1616035047805-728b75e7a9dd?q=80&w=800&auto=format&fit=crop',
    ingredients: ['3 ovos', '1 colher de requeijão light', 'Cebolinha', 'Sal e pimenta'],
    instructions: ['Bata os ovos levemente.', 'Leve ao fogo baixo mexendo sempre.', 'Adicione o requeijão antes de secar totalmente.']
  },
  { 
    id: 'b3', title: 'Overnight Oats de Frutas Vermelhas', calories: 320, time_minutes: 5, category: 'Café da Manhã', 
    image_url: 'https://images.unsplash.com/photo-1596568853139-497676e828a2?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Aveia em flocos', 'Iogurte grego', 'Morangos e mirtilos', 'Mel'],
    instructions: ['Misture a aveia e o iogurte.', 'Monte em camadas num pote.', 'Deixe na geladeira durante a noite.']
  },
  { 
    id: 'b4', title: 'Torrada de Abacate e Ovo', calories: 350, time_minutes: 8, category: 'Café da Manhã', 
    image_url: 'https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 fatia pão integral', '1/2 abacate amassado', '1 ovo poché', 'Pimenta calabresa'],
    instructions: ['Toste o pão.', 'Espalhe o abacate.', 'Coloque o ovo por cima e tempere.']
  },
  
  // --- ALMOÇO (LUNCH) ---
  { 
    id: 'l1', title: 'Bowl de Quinoa e Abacate', calories: 450, time_minutes: 15, category: 'Almoço', 
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 xícara quinoa cozida', '1/2 abacate', 'Tomates cereja', 'Grão de bico', 'Azeite e limão'],
    instructions: ['Cozinhe a quinoa.', 'Monte o bowl com a quinoa na base.', 'Adicione os vegetais e o grão de bico.', 'Finalize com azeite, sal e limão.']
  },
  { 
    id: 'l2', title: 'Filé de Frango Grelhado', calories: 380, time_minutes: 20, category: 'Almoço', 
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Filé de peito de frango', 'Brócolis', 'Cenoura', 'Abobrinha', 'Limão pepper'],
    instructions: ['Grelhe o frango temperado.', 'Cozinhe os legumes no vapor.', 'Sirva juntos com azeite.']
  },
  { 
    id: 'l3', title: 'Salada de Atum Fresco', calories: 400, time_minutes: 10, category: 'Almoço', 
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 lata atum em água', 'Feijão branco cozido', 'Cebola roxa', 'Salsinha'],
    instructions: ['Escorra o atum.', 'Misture com o feijão e a cebola picada.', 'Tempere com muito limão e azeite.']
  },

  // --- JANTAR (DINNER) ---
  { 
    id: 'd1', title: 'Salmão Assado com Ervas', calories: 520, time_minutes: 25, category: 'Jantar', 
    image_url: 'https://images.unsplash.com/photo-1560717845-968823efbee1?q=80&w=800&auto=format&fit=crop',
    ingredients: ['200g filé de salmão', 'Alecrim fresco', 'Alho picado', 'Azeite de oliva', 'Aspargos'],
    instructions: ['Tempere o salmão com alho, sal e limão.', 'Coloque em uma assadeira com os aspargos.', 'Regue com azeite e ervas.', 'Asse por 20 min a 200°C.']
  },
  { 
    id: 'd2', title: 'Sopa Creme de Abóbora', calories: 250, time_minutes: 30, category: 'Jantar', 
    image_url: 'https://images.unsplash.com/photo-1547592166-23acbe346499?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Abóbora Cabotiá', 'Gengibre ralado', 'Cebola e alho', 'Caldo de legumes'],
    instructions: ['Cozinhe a abóbora no caldo.', 'Bata no liquidificador com gengibre.', 'Refogue alho e cebola e misture o creme.']
  },

  // --- LANCHE (SNACK) ---
  { 
    id: 's1', title: 'Mix de Castanhas', calories: 150, time_minutes: 1, category: 'Lanche', 
    image_url: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800&auto=format&fit=crop',
    ingredients: ['3 castanhas do pará', '5 amêndoas', '2 nozes'],
    instructions: ['Misture tudo em um pote pequeno.', 'Ideal para lanche da tarde.']
  },
  { 
    id: 's2', title: 'Maçã com Pasta de Amendoim', calories: 200, time_minutes: 2, category: 'Lanche', 
    image_url: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 maçã fatiada', '1 colher de pasta de amendoim integral'],
    instructions: ['Corte a maçã.', 'Sirva com a pasta.']
  },

  // --- BEBIDAS (DRINKS) ---
  { 
    id: 'dr1', title: 'Smoothie Verde Detox', calories: 210, time_minutes: 5, category: 'Bebidas', 
    image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop',
    ingredients: ['1 maçã verde', '1 folha de couve', '200ml água de coco', 'Suco de 1/2 limão', 'Gengibre a gosto'],
    instructions: ['Lave bem os ingredientes.', 'Retire as sementes da maçã.', 'Bata tudo no liquidificador com gelo.', 'Beba sem coar para aproveitar as fibras.']
  },
  { 
    id: 'dr2', title: 'Chá de Hibisco Gelado', calories: 5, time_minutes: 8, category: 'Bebidas', 
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop',
    ingredients: ['2 colheres hibisco seco', '500ml água', '1 pau de canela'],
    instructions: ['Ferva a água com a canela.', 'Desligue o fogo e adicione o hibisco.', 'Tampe e deixe em infusão por 5 min.', 'Coe e beba quente ou gelado.']
  }
];

const MOCK_WORKOUTS: Workout[] = Array.from({ length: 28 }, (_, i) => ({
  id: `workout-${i + 1}`,
  day_number: i + 1,
  title: i % 7 === 6 ? 'Recuperação Ativa & Flow' : `Fundamentos da Força ${i + 1}`,
  description: 'Baixo impacto, movimentos de alta eficiência desenhados para tonificar sem volume excessivo.',
  duration_minutes: 20 + (i % 10),
  difficulty: i < 7 ? 'Iniciante' : 'Intermediário',
  video_url: '#',
  thumbnail_url: `https://picsum.photos/seed/${i + 100}/800/600`,
  is_locked: i > 2, 
  completed: i < 2,
}));

const DAILY_TIPS: DailyTip[] = [
    { id: '1', category: 'Mindset', title: 'Consistência > Intensidade', content: 'Não tente fazer tudo perfeito hoje. Apenas apareça. 20 minutos "mal feitos" valem mais que zero minutos.' },
    { id: '2', category: 'Nutrição', title: 'O poder da Proteína', content: 'Incluir proteína no café da manhã reduz os desejos de açúcar em até 60% ao longo do dia.' },
    { id: '3', category: 'Hidratação', title: 'Beba antes de comer', content: 'Muitas vezes confundimos sede com fome. Beba um copo d\'água 20 min antes das refeições.' },
    { id: '4', category: 'Recuperação', title: 'Sono é treino', content: 'Seus músculos se regeneram enquanto você dorme. Dormir menos de 7h pode atrapalhar seus resultados.' },
    { id: '5', category: 'Mindset', title: 'Celebre pequenas vitórias', content: 'Conseguiu fazer mais uma repetição? Sentiu-se mais disposta? Isso conta tanto quanto o número na balança.' },
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
  newBadgeUnlocked: Badge | null; // For modal
  
  // Actions
  setScreen: (screen: AppScreen) => void;
  selectWorkout: (id: string) => void;
  toggleCompleteWorkout: (id: string) => void;
  toggleCompleteMindset: (id: string) => void;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  refreshDailyTip: () => void;
  
  // Data Logging Actions
  logWeight: (weight: number) => void;
  logWater: (amountL: number) => void;
  logJournal: (text: string) => void;
  updateProfileStats: (height: number, targetWeight: number, currentWeight: number) => void;
  clearNewBadge: () => void;
}

export const useAppStore = create<AppState>((set) => ({
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
  waterIntakeL: 1.2,
  newBadgeUnlocked: null,

  setScreen: (screen) => set({ currentScreen: screen }),
  
  selectWorkout: (id) => set({ selectedWorkoutId: id, currentScreen: AppScreen.WORKOUT_DETAILS }),
  
  toggleCompleteWorkout: (id) => set((state) => ({
    workouts: state.workouts.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    )
  })),

  toggleCompleteMindset: (id) => set((state) => ({
      mindsetItems: state.mindsetItems.map(m =>
        m.id === id ? { ...m, completed: !m.completed } : m
      )
  })),

  login: () => {
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    set({ user: MOCK_USER, currentScreen: AppScreen.DASHBOARD, dailyTip: randomTip });
  },
  
  logout: () => set({ user: null, currentScreen: AppScreen.AUTH }),
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  
  refreshDailyTip: () => {
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    set({ dailyTip: randomTip });
  },

  logWeight: (newWeight: number) => set((state) => {
    if (!state.user) return state;
    
    // Create new date label
    const today = new Date();
    const dateLabel = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    
    // Update history
    const newHistory = [...state.user.weight_history, { date: dateLabel, weight: newWeight }];
    
    // Check for Badges (Gamification)
    const earned = [...state.user.earned_badges];
    let justUnlocked: Badge | null = null;
    const totalLost = state.user.starting_weight_kg - newWeight;

    // Logic: Lost 5kg
    if (totalLost >= 5 && !earned.includes('loss_5')) {
        earned.push('loss_5');
        justUnlocked = BADGES.find(b => b.id === 'loss_5') || null;
    } 
    // Logic: Lost 10kg
    if (totalLost >= 10 && !earned.includes('loss_10')) {
        earned.push('loss_10');
        justUnlocked = BADGES.find(b => b.id === 'loss_10') || null;
    } 
    // Logic: Goal Reached
    if (newWeight <= state.user.target_weight_kg && !earned.includes('goal')) {
        earned.push('goal');
        justUnlocked = BADGES.find(b => b.id === 'goal') || null;
    }

    return {
        newBadgeUnlocked: justUnlocked,
        user: {
            ...state.user,
            current_weight_kg: newWeight,
            weight_history: newHistory,
            earned_badges: earned
        }
    };
  }),

  logWater: (amountL: number) => set((state) => ({
      waterIntakeL: Number((state.waterIntakeL + amountL).toFixed(1))
  })),

  logJournal: (text: string) => set((state) => {
      const newEntry: JournalEntry = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('pt-BR'),
          content: text
      };
      return { journal: [newEntry, ...state.journal] };
  }),

  updateProfileStats: (height: number, targetWeight: number, currentWeight: number) => set((state) => {
      if(!state.user) return state;
      return {
          user: {
              ...state.user,
              height_cm: height,
              target_weight_kg: targetWeight,
              current_weight_kg: currentWeight
          }
      };
  }),

  clearNewBadge: () => set({ newBadgeUnlocked: null })
}));