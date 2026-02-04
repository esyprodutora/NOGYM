import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, MindsetItem, JournalEntry, RecipeCategory } from '../types';

// --- CONSTANTS ---
const BADGES: Badge[] = [
  { id: 'start', title: 'A Decisão', description: 'Você aceitou o desafio!', icon: '🔥', color: 'bg-orange-500' },
  { id: 'first_workout', title: 'Primeiro Passo', description: 'Concluiu o treino do Dia 1', icon: '💦', color: 'bg-red-500' },
  { id: 'mindset_1', title: 'Mente Blindada', description: 'Assistiu à primeira aula de Mindset', icon: '🧠', color: 'bg-purple-500' },
  { id: 'week_1', title: 'Metade do Caminho', description: 'Concluiu 7 dias do desafio', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'loss_1', title: 'Primeiro Quilo', description: 'Perdeu 1kg na balança', icon: '⚖️', color: 'bg-cyan-500' },
  { id: 'hydration_streak', title: 'Hidratada', description: 'Registrou água por 3 dias seguidos', icon: '💧', color: 'bg-blue-400' },
  { id: 'loss_3', title: 'Focada', description: 'Eliminou 3kg totais', icon: '💎', color: 'bg-fuchsia-500' },
  { id: 'social', title: 'Inspiradora', description: 'Salvou 5 fotos na galeria', icon: '📸', color: 'bg-pink-500' },
  { id: 'program_done', title: 'Vencedora do Desafio', description: 'Concluiu os 15 dias do programa Seca em Casa!', icon: '🏆', color: 'bg-brand-accent' },
];

const DAILY_TIPS: DailyTip[] = [
    { id: '1', category: 'Mindset', title: 'Consistência > Intensidade', content: 'Não tente fazer tudo perfeito hoje. Apenas apareça.' },
    { id: '2', category: 'Nutrição', title: 'O poder da Proteína', content: 'Incluir proteína no café da manhã reduz os desejos de açúcar em até 60%.' },
    { id: '3', category: 'Hidratação', title: 'Beba antes de comer', content: 'Muitas vezes confundimos sede com fome. Beba água antes das refeições.' },
];

const MOCK_MINDSET: MindsetItem[] = [
    { 
        id: 'm1', 
        title: "Mindset de Sucesso", 
        description: "Aprenda a configurar sua mente para vencer os obstáculos diários e manter o foco no longo prazo.",
        duration: "10 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "",
        thumbnail_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800"
    },
    { 
        id: 'm2', 
        title: "Superando a Ansiedade", 
        description: "Técnicas práticas para reduzir a ansiedade e evitar que o estresse atrapalhe seu progresso físico.",
        duration: "12 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "",
        thumbnail_url: "https://images.unsplash.com/photo-1499209974431-276138d71626?q=80&w=800"
    },
    { 
        id: 'm3', 
        title: "A Disciplina do Descanso", 
        description: "Por que dormir e descansar é tão importante quanto treinar para a queima de gordura.",
        duration: "8 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "",
        thumbnail_url: "https://images.unsplash.com/photo-1511295742362-92c96b50484a?q=80&w=800"
    },
    { 
        id: 'm4', 
        title: "Por que não precisamos de academia?", 
        description: "Entenda a ciência por trás do treino com peso do corpo e como ter resultados superiores em casa.",
        duration: "15 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "",
        thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800"
    },
];

const generateMockWorkouts = (): Workout[] => {
    return Array.from({ length: 15 }, (_, i) => {
        const day = i + 1;
        const difficulty = day <= 5 ? 'Iniciante' : day <= 10 ? 'Intermediário' : 'Avançado';
        return {
            id: `workout-${day}`,
            day_number: day,
            title: `Treino Dia ${day}`,
            description: 'Foco em queima de gordura e definição.',
            duration_minutes: 20 + (i % 5), 
            difficulty: difficulty,
            video_url: '',
            thumbnail_url: `https://picsum.photos/seed/${100 + day}/800/600`,
            is_locked: day > 3, 
            completed: false
        };
    });
};

const MOCK_WORKOUTS: Workout[] = generateMockWorkouts();

// XP Values
const XP_WORKOUT = 150;
const XP_WATER = 20;
const XP_WEIGHT = 50;
const XP_JOURNAL = 30;

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
  updatePassword: (password: string) => Promise<boolean>;
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
  updateProgressPhoto: (type: 'start' | 'current', url: string) => Promise<void>;
  addGalleryPhoto: (url: string) => Promise<void>; 
  clearNewBadge: () => void;
  
  // Helper
  addXP: (amount: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: AppScreen.AUTH,
  user: null,
  workouts: MOCK_WORKOUTS,
  recipes: [],
  badges: BADGES,
  dailyTip: DAILY_TIPS[0],
  mindsetItems: MOCK_MINDSET,
  journal: [],
  selectedWorkoutId: null,
  theme: 'dark',
  waterIntakeL: 0,
  newBadgeUnlocked: null,

  setScreen: (screen) => set({ currentScreen: screen }),

  addXP: (amount) => {
      set((state) => ({
          user: state.user ? { ...state.user, current_xp: (state.user.current_xp || 0) + amount } : null
      }));
  },

  initialize: async () => {
    const recipes = generateRecipesFull();
    set({ recipes });

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
          let { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
          
          if (!profile) {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                   const { data: newProfile } = await supabase.from('profiles').insert({
                        id: userId, email: user.email, full_name: user.user_metadata?.full_name || 'Usuário',
                        current_weight_kg: 60, target_weight_kg: 55, height_cm: 160
                   }).select().single();
                   if (newProfile) profile = newProfile;
              }
          }

          if(!profile) return;

          const { data: weightLogs } = await supabase.from('weight_logs').select('*').eq('user_id', userId).order('created_at', { ascending: true });
          
          const weightHistory = weightLogs?.map(log => ({
              date: new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
              weight: log.weight_kg
          })) || [];

           const progressPhotos = weightLogs?.filter(log => log.photo_url).map(log => ({
                id: log.id || Math.random().toString(),
                date: new Date(log.created_at).toLocaleDateString('pt-BR'),
                url: log.photo_url,
                weight: log.weight_kg
            })) || [];

          const today = new Date().toISOString().split('T')[0];
          const { data: waterLogs } = await supabase.from('water_logs').select('amount_ml').eq('user_id', userId).gte('created_at', `${today}T00:00:00`);
          const totalWaterL = (waterLogs?.reduce((acc, curr) => acc + curr.amount_ml, 0) || 0) / 1000;

          const { data: journalEntries } = await supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false });
          const journal = journalEntries?.map(j => ({ id: j.id, date: new Date(j.created_at).toLocaleDateString('pt-BR'), content: j.content })) || [];

          const { data: progress } = await supabase.from('user_workout_progress').select('workout_id').eq('user_id', userId);
          const completedIds = progress?.map(p => p.workout_id) || [];
          
          // Calculate initial XP based on history
          const xpFromWorkouts = completedIds.length * XP_WORKOUT;
          const xpFromWater = (waterLogs?.length || 0) * XP_WATER; // simplified
          const currentXp = xpFromWorkouts + xpFromWater;

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
                  current_xp: currentXp,
                  is_premium: profile.is_premium,
                  avatar_url: profile.avatar_url,
                  start_photo_url: profile.start_photo_url,
                  current_photo_url: profile.current_photo_url,
                  progress_photos: progressPhotos,
                  weight_history: weightHistory,
                  earned_badges: ['start', 'first_workout']
              },
              waterIntakeL: totalWaterL,
              journal: journal,
              workouts: state.workouts.map(w => ({ ...w, completed: completedIds.includes(w.id) }))
          }));
      } catch (e) { console.error("Error loading data", e); }
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
    } catch (e) { throw e; }
    return false;
  },

  register: async (email, password, fullName, phone) => {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, phone: phone } } });
        if (error) throw error;
        if (data.user) {
            if (data.session) {
                await supabase.from('profiles').insert({ id: data.user.id, email: email, full_name: fullName, current_weight_kg: 60, target_weight_kg: 55, height_cm: 160 });
                await get().fetchUserData(data.user.id);
                set({ currentScreen: AppScreen.DASHBOARD });
                return true;
            } else { return true; }
        }
    } catch (e) { throw e; }
    return false;
  },

  resetPassword: async (email) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        return !error;
      } catch(e) { return false; }
  },

  updatePassword: async (password) => {
      try {
          const { error } = await supabase.auth.updateUser({ password: password });
          if (error) throw error;
          return true;
      } catch(e) {
          console.error("Update password error", e);
          return false; 
      }
  },
  
  logout: async () => {
      try { await supabase.auth.signOut(); } catch(e) {}
      set({ user: null, currentScreen: AppScreen.AUTH });
  },

  selectWorkout: (id) => set({ selectedWorkoutId: id, currentScreen: AppScreen.WORKOUT_DETAILS }),
  
  toggleCompleteWorkout: async (id) => {
    const { user, workouts, addXP } = get();
    if (!user) return;
    set({ workouts: workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w) });
    const workout = workouts.find(w => w.id === id);
    if (!workout?.completed) {
        try {
            await supabase.from('user_workout_progress').insert({ user_id: user.id, workout_id: id });
            addXP(XP_WORKOUT);
            get().logJournal(`Concluí o treino: ${workout?.title} 🔥 +${XP_WORKOUT} XP`);
        } catch (e) {}
    }
  },

  toggleCompleteMindset: async (id) => {
      const { user, mindsetItems, addXP } = get();
      if (!user) return;
      set({ mindsetItems: mindsetItems.map(m => m.id === id ? { ...m, completed: !m.completed } : m) });
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  
  logWeight: async (newWeight) => {
      const { user, addXP } = get();
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
        addXP(XP_WEIGHT);
      } catch(e) {}
  },

  logWater: async (amountL) => {
      const { user, waterIntakeL, addXP } = get();
      if (!user) return;
      set({ waterIntakeL: Number((waterIntakeL + amountL).toFixed(1)) });
      try { 
          await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: amountL * 1000 }); 
          addXP(XP_WATER);
      } catch(e) {}
  },

  logJournal: async (text) => {
      const { user, journal, addXP } = get();
      if (!user) return;
      const newEntry: JournalEntry = { id: Date.now().toString(), date: new Date().toLocaleDateString('pt-BR'), content: text };
      set({ journal: [newEntry, ...journal] });
      try { 
          await supabase.from('journal_entries').insert({ user_id: user.id, content: text }); 
          addXP(XP_JOURNAL);
      } catch(e) {}
  },

  updateProfileStats: async (height, target, current) => {
      const { user } = get();
      if (!user) return;
      set((state) => ({ user: state.user ? { ...state.user, height_cm: height, target_weight_kg: target, current_weight_kg: current } : null }));
      try { await supabase.from('profiles').update({ height_cm: height, target_weight_kg: target, current_weight_kg: current }).eq('id', user.id); } catch(e) {}
  },

  updateAvatar: async (url) => {
      const { user } = get();
      if (!user) return;
      set((state) => ({ user: state.user ? { ...state.user, avatar_url: url } : null }));
      try { await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id); } catch(e) {}
  },

  updateProgressPhoto: async (type, url) => {
      const { user } = get();
      if (!user) return;
      set((state) => ({
          user: state.user ? {
              ...state.user,
              start_photo_url: type === 'start' ? url : state.user.start_photo_url,
              current_photo_url: type === 'current' ? url : state.user.current_photo_url
          } : null
      }));
      try { await supabase.from('profiles').update({ [type === 'start' ? 'start_photo_url' : 'current_photo_url']: url }).eq('id', user.id); } catch(e) {}
  },

  addGalleryPhoto: async (url) => {
      const { user } = get();
      if (!user) return;
      const newPhoto = { id: Date.now().toString(), date: new Date().toLocaleDateString('pt-BR'), url: url, weight: user.current_weight_kg };
      set((state) => ({ user: state.user ? { ...state.user, progress_photos: [newPhoto, ...state.user.progress_photos] } : null }));
      try { await supabase.from('weight_logs').insert({ user_id: user.id, weight_kg: user.current_weight_kg, photo_url: url, note: 'Galeria' }); } catch(e) {}
  },

  clearNewBadge: () => set({ newBadgeUnlocked: null })
}));

function generateRecipesFull(): Recipe[] {
    // ... existing recipe code ...
    let allRecipes: Recipe[] = [];
    let idCounter = 1;
    const modifiers = ['Clássico', 'Especial', 'da Casa', 'Supremo', 'Rústico', 'Premium'];
    const breakfastTemplates = [ { t: 'Panqueca de Banana Funcional', cal: 280, tags: ['Vegetariano', 'Sem Glúten', 'Pré-Treino'], baseIng: [ '1 banana prata bem madura (amassada)', '2 ovos médios', '2 colheres (sopa) de farelo de aveia', '1 colher (chá) de canela em pó', 'Óleo de coco para untar' ], baseInst: [ '1. Em um bowl, amasse bem a banana com um garfo até virar um purê.', '2. Adicione os ovos e bata vigorosamente com um garfo ou fouet até aerar.', '3. Incorpore a aveia e a canela, misturando até obter uma massa homogênea.', '4. Aqueça uma frigideira antiaderente em fogo baixo e unte levemente com óleo de coco.', '5. Despeje pequenas porções da massa. Quando surgirem bolhas na superfície, vire com cuidado.', '6. Deixe dourar o outro lado por cerca de 1 minuto e sirva quente.' ] } ];
    const lunchTemplates = [ { t: 'Filé de Frango Grelhado ao Limão', cal: 320, tags: ['Proteico', 'Low Carb', 'Sem Glúten'], baseIng: [ '2 filés de peito de frango médios (150g cada)', 'Suco de 1 limão tahiti', '1 dente de alho amassado', '1 colher (chá) de páprica defumada', 'Azeite de oliva' ], baseInst: [ '1. Tempere os filés com o limão, alho, páprica, sal e pimenta. Deixe marinar por 15 minutos.', '2. Aqueça bem uma frigideira antiaderente. Adicione um fio de azeite.', '3. Coloque os filés (sem amontoar) e não mexa por 4 minutos para criar uma crosta dourada.', '4. Vire e grelhe por mais 3-4 minutos até o centro estar cozido.', '5. Retire do fogo e deixe a carne "descansar" por 2 minutos antes de cortar para manter a suculência.' ] } ];
    const dinnerTemplates = [ { t: 'Omelete de Forno com Legumes', cal: 220, tags: ['Low Carb', 'Vegetariano', 'Prático'], baseIng: [ '2 ovos inteiros + 1 clara', '1/2 abobrinha ralada', '1/2 cenoura ralada', '1 colher (café) de fermento químico', 'Orégano' ], baseInst: [ '1. Pré-aqueça o forno a 180°C.', '2. Em uma tigela, bata os ovos com sal e orégano.', '3. Adicione os legumes ralados (esprema a abobrinha para tirar o excesso de água) e o fermento.', '4. Despeje em forminhas de silicone ou um refratário pequeno untado.', '5. Asse por cerca de 20 minutos ou até ficar firme e dourado.' ] } ];
    const snackTemplates = [ { t: 'Muffin de Banana com Cacau', cal: 160, tags: ['Vegetariano', 'Sem Glúten'], baseIng: [ '2 bananas maduras', '2 ovos', '2 colheres (sopa) de cacau em pó 100%', '1 colher (chá) de fermento', 'Gotas de chocolate 70% (opcional)' ], baseInst: [ '1. Bata todos os ingredientes no liquidificador, exceto o fermento e as gotas de chocolate.', '2. Misture o fermento delicadamente com uma colher.', '3. Distribua em forminhas de cupcake (silicone é melhor) preenchendo 3/4 da forma.', '4. Coloque as gotas de chocolate por cima.', '5. Asse em forno pré-aquecido a 180°C por 15 a 20 minutos.' ] } ];
    const drinkTemplates = [ { t: 'Suco Verde Anti-Inchaço', cal: 60, tags: ['Vegano', 'Detox', 'Diurético'], baseIng: [ '1 folha grande de couve (sem o talo)', 'Suco de 1 limão', '1 fatia grossa de abacaxi', '1 pedaço pequeno de gengibre', '200ml de água de coco gelada' ], baseInst: [ '1. Lave bem a couve.', '2. Coloque todos os ingredientes no liquidificador.', '3. Bata na potência máxima por 2 minutos para triturar bem a couve.', '4. Se preferir, coe (mas beber com as fibras é melhor).', '5. Sirva imediatamente com gelo.' ] } ];

    const createVariations = (baseList: any[], category: string, count: number) => {
        const result = [];
        let i = 0;
        while(result.length < count) {
            const template = baseList[i % baseList.length];
            const modifier = modifiers[i % modifiers.length]; 
            let img = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800'; 
            if(category === 'Café da Manhã') img = 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800';
            if(category === 'Almoço') img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800';
            if(category === 'Jantar') img = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800'; 
            if(category === 'Lanche') img = 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800';
            if(category === 'Bebidas') img = 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800'; 

            result.push({
                id: `rec_${category.substring(0,3)}_${idCounter++}`,
                title: i < baseList.length ? template.t : `${template.t} ${modifier}`, 
                calories: template.cal,
                time_minutes: 10 + Math.floor(Math.random() * 20),
                image_url: img,
                category: category as RecipeCategory,
                ingredients: template.baseIng,
                instructions: template.baseInst,
                tags: template.tags || []
            });
            i++;
        }
        return result;
    }
    allRecipes = [
        ...createVariations(breakfastTemplates, 'Café da Manhã', 30),
        ...createVariations(lunchTemplates, 'Almoço', 30),
        ...createVariations(dinnerTemplates, 'Jantar', 30),
        ...createVariations(snackTemplates, 'Lanche', 30),
        ...createVariations(drinkTemplates, 'Bebidas', 30)
    ];
    return allRecipes;
}
