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

// Content Data (In a real app, these could also come from DB, but keeping static for simplicity/speed)
const MOCK_MINDSET: MindsetItem[] = [
    { id: 'm1', title: "Visualizando Seu Sucesso", duration: "5 min", type: "Áudio", completed: false },
    { id: 'm2', title: "Superando a Ansiedade do Platô", duration: "8 min", type: "Áudio", completed: false },
    { id: 'm3', title: "A Disciplina do Descanso", duration: "3 min", type: "Leitura", completed: false },
    { id: 'm4', title: "Por que não precisamos de academias", duration: "10 min", type: "Áudio", completed: false },
];

const MOCK_RECIPES: Recipe[] = [
  // Keeping the static recipes for UI speed, assuming images are updated as requested previously
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
    // Check active session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        await get().fetchUserData(session.user.id);
        set({ currentScreen: AppScreen.DASHBOARD });
    }
  },

  fetchUserData: async (userId: string) => {
      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!profile) return;

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
              full_name: profile.full_name,
              phone: profile.phone,
              current_weight_kg: profile.current_weight_kg || 0,
              starting_weight_kg: weightHistory[0]?.weight || profile.current_weight_kg,
              target_weight_kg: profile.target_weight_kg || 0,
              height_cm: profile.height_cm || 0,
              streak_days: profile.streak_days || 0,
              is_premium: profile.is_premium,
              weight_history: weightHistory,
              earned_badges: [] // Implement badge fetching logic if needed
          },
          waterIntakeL: totalWaterL,
          journal: journal,
          workouts: state.workouts.map(w => ({
              ...w,
              completed: completedIds.includes(w.id) // Note: This assumes workout IDs match DB. For now using mock IDs but ideally DB has workouts.
          }))
      }));
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error("Login failed", error);
        return false;
    }
    if (data.user) {
        await get().fetchUserData(data.user.id);
        set({ currentScreen: AppScreen.DASHBOARD });
        return true;
    }
    return false;
  },

  register: async (email, password, fullName, phone) => {
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

    if (error) {
        console.error("Signup failed", error);
        return false;
    }

    if (data.user) {
        // Automatically login/fetch user data if session is created immediately (no email confirm)
        await get().fetchUserData(data.user.id);
        set({ currentScreen: AppScreen.DASHBOARD });
        return true;
    }
    return false;
  },

  resetPassword: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin, // Redirect back to app after click
      });
      return !error;
  },
  
  logout: async () => {
      await supabase.auth.signOut();
      set({ user: null, currentScreen: AppScreen.AUTH });
  },

  selectWorkout: (id) => set({ selectedWorkoutId: id, currentScreen: AppScreen.WORKOUT_DETAILS }),
  
  toggleCompleteWorkout: async (id) => {
    const { user, workouts } = get();
    if (!user) return;
    
    const workout = workouts.find(w => w.id === id);
    if (!workout) return;
    
    // Toggle in UI immediately (Optimistic)
    set({
        workouts: workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w)
    });

    // Sync to DB
    if (!workout.completed) {
        // Mark as complete
        await supabase.from('user_workout_progress').insert({
            user_id: user.id,
            workout_id: id // Assuming ID matches logic or using a mapping
        });
        
        // Also log to Journal automatically as requested
        get().logJournal(`Concluí o treino: ${workout.title} 🔥`);
        
    } else {
        // Remove completion (optional, maybe delete row)
        // await supabase.from('user_workout_progress').delete().match({ user_id: user.id, workout_id: id });
    }
  },

  toggleCompleteMindset: async (id) => {
      const { user, mindsetItems } = get();
      if (!user) return;

      const item = mindsetItems.find(i => i.id === id);
      if(!item) return;

      // Toggle UI
      set({
          mindsetItems: mindsetItems.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
      });

      // Sync DB (assuming user_mindset_progress table)
      if (!item.completed) {
          await supabase.from('user_mindset_progress').insert({
              user_id: user.id,
              item_id: id // In real app, make sure IDs correspond to DB UUIDs
          });
      }
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  
  logWeight: async (newWeight) => {
      const { user } = get();
      if (!user) return;

      // 1. Insert Log
      const { error } = await supabase.from('weight_logs').insert({
          user_id: user.id,
          weight_kg: newWeight
      });
      if (error) return;

      // 2. Update Profile Current Weight
      await supabase.from('profiles').update({ current_weight_kg: newWeight }).eq('id', user.id);

      // 3. Update Local State (Graph)
      const today = new Date();
      const dateLabel = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      
      set((state) => ({
          user: state.user ? {
              ...state.user,
              current_weight_kg: newWeight,
              weight_history: [...state.user.weight_history, { date: dateLabel, weight: newWeight }]
          } : null
      }));
  },

  logWater: async (amountL) => {
      const { user, waterIntakeL } = get();
      if (!user) return;

      const amountMl = amountL * 1000;
      await supabase.from('water_logs').insert({
          user_id: user.id,
          amount_ml: amountMl
      });

      set({ waterIntakeL: Number((waterIntakeL + amountL).toFixed(1)) });
  },

  logJournal: async (text) => {
      const { user, journal } = get();
      if (!user) return;

      const { data, error } = await supabase.from('journal_entries').insert({
          user_id: user.id,
          content: text
      }).select().single();

      if (data) {
          const newEntry: JournalEntry = {
              id: data.id,
              date: new Date(data.created_at).toLocaleDateString('pt-BR'),
              content: data.content
          };
          set({ journal: [newEntry, ...journal] });
      }
  },

  updateProfileStats: async (height, targetWeight, currentWeight) => {
      const { user } = get();
      if (!user) return;

      await supabase.from('profiles').update({
          height_cm: height,
          target_weight_kg: targetWeight,
          current_weight_kg: currentWeight
      }).eq('id', user.id);

      set((state) => ({
          user: state.user ? {
              ...state.user,
              height_cm: height,
              target_weight_kg: targetWeight,
              current_weight_kg: currentWeight
          } : null
      }));
  },

  clearNewBadge: () => set({ newBadgeUnlocked: null })
}));