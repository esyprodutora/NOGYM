import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, MindsetItem, JournalEntry } from '../types';

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

const MOCK_RECIPES: Recipe[] = [
  { id: 'b1', title: 'Panqueca de Banana Fit', calories: 300, time_minutes: 10, category: 'Café da Manhã', image_url: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?q=80&w=800', ingredients: ['Banana', 'Ovo', 'Aveia'], instructions: ['Misturar e fritar'] },
  { id: 'l1', title: 'Bowl de Quinoa', calories: 450, time_minutes: 15, category: 'Almoço', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800', ingredients: ['Quinoa', 'Abacate'], instructions: ['Cozinhar e montar'] },
  { id: 'd1', title: 'Salmão Assado', calories: 520, time_minutes: 25, category: 'Jantar', image_url: 'https://images.unsplash.com/photo-1560717845-968823efbee1?q=80&w=800', ingredients: ['Salmão', 'Ervas'], instructions: ['Assar no forno'] },
  { id: 's1', title: 'Mix de Castanhas', calories: 150, time_minutes: 1, category: 'Lanche', image_url: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800', ingredients: ['Castanhas'], instructions: ['Servir'] },
  { id: 'dr1', title: 'Suco Verde', calories: 120, time_minutes: 5, category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800', ingredients: ['Couve', 'Limão'], instructions: ['Bater tudo'] },
];

const MOCK_WORKOUTS: Workout[] = Array.from({ length: 28 }, (_, i) => ({
  id: `workout-${i + 1}`,
  day_number: i + 1,
  title: `Treino Dia ${i + 1}`,
  description: 'Foco em força e estabilidade.',
  duration_minutes: 20 + (i % 10),
  difficulty: i < 7 ? 'Iniciante' : 'Intermediário',
  video_url: '#',
  thumbnail_url: `https://picsum.photos/seed/${i + 100}/800/600`,
  is_locked: i > 2, 
  completed: false,
}));

// DEMO USER DATA for Fallback
const DEMO_USER: UserProfile = {
  id: 'demo-user-123',
  email: 'admin@nogym.com',
  full_name: 'Usuário Demo',
  phone: '11999999999',
  current_weight_kg: 68.5,
  starting_weight_kg: 72.0,
  target_weight_kg: 60.0,
  height_cm: 165,
  streak_days: 12,
  is_premium: true,
  weight_history: [
      { date: '01 Out', weight: 72.0 },
      { date: '15 Out', weight: 70.5 },
      { date: '01 Nov', weight: 69.2 },
      { date: 'Hoje', weight: 68.5 }
  ],
  earned_badges: ['start', 'loss_1']
};

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
      // Demo Check
      if (userId === DEMO_USER.id) return;

      try {
          // 1. Fetch Profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (error || !profile) {
              console.warn("Perfil não encontrado, tentando criar...", error);
              // Opcional: Criar perfil on-the-fly se não existir (para robustez)
              return;
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
          console.error("Erro ao buscar dados do usuário:", e);
      }
  },

  login: async (email, password) => {
    // 1. Force Demo Mode
    if (email === 'admin@nogym.com' && password === '123456') {
        set({ user: DEMO_USER, currentScreen: AppScreen.DASHBOARD });
        return true;
    }

    // 2. Real Login
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;

        if (data.user) {
            await get().fetchUserData(data.user.id);
            set({ currentScreen: AppScreen.DASHBOARD });
            return true;
        }
    } catch (e) {
        console.error("Login Error:", e);
        return false;
    }

    return false;
  },

  register: async (email, password, fullName, phone) => {
    // Demo Fallback
    if (email.includes('test')) {
         set({ 
            user: { ...DEMO_USER, email, full_name: fullName },
            currentScreen: AppScreen.DASHBOARD 
        });
        return true;
    }

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
            // Se o login automático ocorrer (email confirmation off)
            if (data.session) {
                // Tenta inserir o perfil manualmente se a trigger falhar ou demorar
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
                // Caso exija confirmação de e-mail
                return true; 
            }
        }
    } catch (e) {
         console.error("Register Error:", e);
         return false;
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

    if (user.id === DEMO_USER.id) return; 

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

      if (user.id === DEMO_USER.id) return;

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

      if (user.id === DEMO_USER.id) return;

      try {
        await supabase.from('weight_logs').insert({ user_id: user.id, weight_kg: newWeight });
        await supabase.from('profiles').update({ current_weight_kg: newWeight }).eq('id', user.id);
      } catch(e) {}
  },

  logWater: async (amountL) => {
      const { user, waterIntakeL } = get();
      if (!user) return;

      set({ waterIntakeL: Number((waterIntakeL + amountL).toFixed(1)) });

      if (user.id === DEMO_USER.id) return;
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

      if (user.id === DEMO_USER.id) return;
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

      if (user.id === DEMO_USER.id) return;
      try {
          await supabase.from('profiles').update({
              height_cm: height,
              target_weight_kg: targetWeight,
              current_weight_kg: currentWeight
          }).eq('id', user.id);
      } catch(e) {}
  },

  clearNewBadge: () => set({ newBadgeUnlocked: null })
}));