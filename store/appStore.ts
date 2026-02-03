import { create } from 'zustand';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip } from '../types';

// Mock Data translated to PT-BR
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

const MOCK_RECIPES: Recipe[] = [
  { id: '1', title: 'Smoothie Verde Detox', calories: 210, time_minutes: 5, category: 'Café da Manhã', image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80' },
  { id: '2', title: 'Bowl de Quinoa e Abacate', calories: 450, time_minutes: 15, category: 'Almoço', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
  { id: '3', title: 'Salmão Assado com Ervas', calories: 520, time_minutes: 25, category: 'Jantar', image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=600&q=80' },
  { id: '4', title: 'Panqueca de Banana Fit', calories: 300, time_minutes: 10, category: 'Lanche', image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80' },
];

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
  dailyTip: DailyTip;
  selectedWorkoutId: string | null;
  theme: 'dark' | 'light';
  waterIntakeL: number;
  
  // Actions
  setScreen: (screen: AppScreen) => void;
  selectWorkout: (id: string) => void;
  toggleCompleteWorkout: (id: string) => void;
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
  refreshDailyTip: () => void;
  
  // Data Logging Actions
  logWeight: (weight: number) => void;
  logWater: (amountL: number) => void;
  updateProfileStats: (height: number, targetWeight: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentScreen: AppScreen.AUTH,
  user: null,
  workouts: MOCK_WORKOUTS,
  recipes: MOCK_RECIPES,
  dailyTip: DAILY_TIPS[0],
  selectedWorkoutId: null,
  theme: 'dark',
  waterIntakeL: 1.2, // Initial Mock Value

  setScreen: (screen) => set({ currentScreen: screen }),
  
  selectWorkout: (id) => set({ selectedWorkoutId: id, currentScreen: AppScreen.WORKOUT_DETAILS }),
  
  toggleCompleteWorkout: (id) => set((state) => ({
    workouts: state.workouts.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
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
    
    // Create new date label (e.g., "15 Fev")
    const today = new Date();
    const dateLabel = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    
    // Update history
    const newHistory = [...state.user.weight_history, { date: dateLabel, weight: newWeight }];
    
    return {
        user: {
            ...state.user,
            current_weight_kg: newWeight,
            weight_history: newHistory
        }
    };
  }),

  logWater: (amountL: number) => set((state) => ({
      waterIntakeL: Number((state.waterIntakeL + amountL).toFixed(1))
  })),

  updateProfileStats: (height: number, targetWeight: number) => set((state) => {
      if(!state.user) return state;
      return {
          user: {
              ...state.user,
              height_cm: height,
              target_weight_kg: targetWeight
          }
      };
  })
}));