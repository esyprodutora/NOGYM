import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, MindsetItem, JournalEntry, RecipeCategory } from '../types';

// --- CONSTANTS ---
const BADGES: Badge[] = [
  // Fase 1: Início Rápido
  { id: 'start', title: 'O Início', description: 'Criou sua conta e começou', icon: '🚀', color: 'bg-blue-500' },
  { id: 'first_workout', title: 'Primeiro Suor', description: 'Concluiu o treino do Dia 1', icon: '💦', color: 'bg-indigo-500' },
  { id: 'mindset_1', title: 'Mente Blindada', description: 'Assistiu à primeira aula de Mindset', icon: '🧠', color: 'bg-purple-500' },
  
  // Fase 2: Consistência (Médio)
  { id: 'week_1', title: 'Semana 1', description: 'Concluiu 7 dias do programa', icon: '🔥', color: 'bg-orange-500' },
  { id: 'loss_1', title: 'Primeiro Quilo', description: 'Perdeu 1kg na balança', icon: '⚖️', color: 'bg-cyan-500' },
  { id: 'hydration_streak', title: 'Hidratada', description: 'Registrou água por 3 dias seguidos', icon: '💧', color: 'bg-blue-400' },
  { id: 'journal_3', title: 'Diário Pessoal', description: 'Fez 3 registros no diário', icon: '📓', color: 'bg-pink-400' },

  // Fase 3: Resultados (Difícil)
  { id: 'loss_5', title: 'Imparável', description: 'Eliminou 5kg totais', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'halfway', title: 'Metade do Caminho', description: 'Chegou no dia 14 do programa', icon: '🚩', color: 'bg-green-500' },
  { id: 'social', title: 'Influenciadora', description: 'Salvou 5 fotos na galeria', icon: '📸', color: 'bg-rose-500' },

  // Fase 4: Elite (Hard)
  { id: 'loss_10', title: 'Nova Mulher', description: 'Eliminou 10kg! Incrível!', icon: '💎', color: 'bg-fuchsia-500' },
  { id: 'program_done', title: 'Graduada', description: 'Concluiu os 28 dias do programa', icon: '🏆', color: 'bg-brand-accent' },
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
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800"
    },
    { 
        id: 'm2', 
        title: "Superando a Ansiedade", 
        description: "Técnicas práticas para reduzir a ansiedade e evitar que o estresse atrapalhe seu progresso físico.",
        duration: "12 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1499209974431-276138d71626?q=80&w=800"
    },
    { 
        id: 'm3', 
        title: "A Disciplina do Descanso", 
        description: "Por que dormir e descansar é tão importante quanto treinar para a queima de gordura.",
        duration: "8 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1511295742362-92c96b50484a?q=80&w=800"
    },
    { 
        id: 'm4', 
        title: "Por que não precisamos de academia?", 
        description: "Entenda a ciência por trás do treino com peso do corpo e como ter resultados superiores em casa.",
        duration: "15 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800"
    },
];

// --- WORKOUTS (28 DAYS GENERATOR) ---
const generateMockWorkouts = (): Workout[] => {
    return Array.from({ length: 28 }, (_, i) => {
        const day = i + 1;
        const difficulty = day <= 7 ? 'Iniciante' : day <= 21 ? 'Intermediário' : 'Avançado';
        return {
            id: `workout-${day}`,
            day_number: day,
            title: `Treino Dia ${day}`,
            description: 'Foco em força e estabilidade.',
            duration_minutes: 20 + (i % 10), 
            difficulty: difficulty,
            video_url: '',
            thumbnail_url: `https://picsum.photos/seed/${100 + day}/800/600`,
            is_locked: day > 3, 
            completed: false
        };
    });
};

const MOCK_WORKOUTS: Workout[] = generateMockWorkouts();

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
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: AppScreen.AUTH,
  user: null,
  workouts: MOCK_WORKOUTS,
  recipes: [], // Will be populated in initialize
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
    // Populate recipes on init
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
                  start_photo_url: profile.start_photo_url,
                  current_photo_url: profile.current_photo_url,
                  progress_photos: progressPhotos,
                  weight_history: weightHistory,
                  earned_badges: ['start', 'first_workout'] // Mock earned for demo
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
    const { user, workouts } = get();
    if (!user) return;
    set({ workouts: workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w) });
    const workout = workouts.find(w => w.id === id);
    if (!workout?.completed) {
        try {
            await supabase.from('user_workout_progress').insert({ user_id: user.id, workout_id: id });
            get().logJournal(`Concluí o treino: ${workout?.title} 🔥`);
        } catch (e) {}
    }
  },

  toggleCompleteMindset: async (id) => {
      const { user, mindsetItems } = get();
      if (!user) return;
      set({ mindsetItems: mindsetItems.map(m => m.id === id ? { ...m, completed: !m.completed } : m) });
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
      try { await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: amountL * 1000 }); } catch(e) {}
  },

  logJournal: async (text) => {
      const { user, journal } = get();
      if (!user) return;
      const newEntry: JournalEntry = { id: Date.now().toString(), date: new Date().toLocaleDateString('pt-BR'), content: text };
      set({ journal: [newEntry, ...journal] });
      try { await supabase.from('journal_entries').insert({ user_id: user.id, content: text }); } catch(e) {}
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

// --- RECIPE GENERATOR ---
function generateRecipesFull(): Recipe[] {
    let allRecipes: Recipe[] = [];
    let idCounter = 1;

    const modifiers = ['Delicioso', 'Rápido', 'Nutritivo', 'Fit', 'Especial', 'da Casa', 'Supremo', 'Leve', 'Energético', 'Funcional'];
    
    // TEMPLATES
    // BREAKFAST
    const breakfastTemplates = [
        { t: 'Panqueca de Banana', cal: 280, tags: ['Vegetariano', 'Sem Glúten'], baseIng: ['1 banana prata', '2 ovos', '2 colheres de aveia'], baseInst: ['Amasse a banana', 'Misture com ovos e aveia', 'Grelhe em frigideira untada'] },
        { t: 'Ovos Mexidos Cremosos', cal: 220, tags: ['Low Carb', 'Sem Glúten', 'Proteico'], baseIng: ['2 ovos', '1 colher de requeijão light', 'Cebolinha'], baseInst: ['Bata os ovos com sal', 'Mexa na frigideira em fogo baixo', 'Adicione requeijão no final'] },
        { t: 'Mingau de Aveia', cal: 300, tags: ['Vegano', 'Fibras'], baseIng: ['3 colheres de aveia', '200ml de leite vegetal', 'Canela'], baseInst: ['Cozinhe a aveia com leite', 'Mexa até engrossar', 'Polvilhe canela'] },
        { t: 'Tostada de Abacate', cal: 250, tags: ['Vegetariano'], baseIng: ['1 fatia pão integral', '1/4 abacate', '1 ovo cozido'], baseInst: ['Toste o pão', 'Amasse o abacate e tempere', 'Coloque o ovo fatiado por cima'] },
        { t: 'Smoothie Bowl Vermelho', cal: 200, tags: ['Vegano', 'Sem Lactose'], baseIng: ['1 xícara frutas vermelhas', '1 banana congelada', '50ml água'], baseInst: ['Bata tudo no liquidificador até ficar cremoso', 'Sirva com granola'] },
        { t: 'Crepioca Recheada', cal: 260, tags: ['Sem Glúten', 'Prático'], baseIng: ['1 ovo', '2 colheres goma de tapioca', 'Queijo cotage'], baseInst: ['Misture ovo e goma', 'Faça o disco na frigideira', 'Recheie com queijo'] }
    ];

    // MEALS (Lunch/Dinner)
    const mealTemplates = [
        { t: 'Filé de Frango Grelhado', cal: 350, tags: ['Proteico', 'Low Carb', 'Sem Glúten'], baseIng: ['150g peito de frango', 'Limão', 'Mix de folhas'], baseInst: ['Tempere o frango com limão e sal', 'Grelhe até dourar', 'Sirva com salada variada'] },
        { t: 'Salada de Grão de Bico', cal: 320, tags: ['Vegano', 'Sem Glúten', 'Fibras'], baseIng: ['1 xícara grão de bico cozido', 'Tomate cereja', 'Pepino'], baseInst: ['Misture todos os vegetais', 'Tempere com azeite, limão e sal'] },
        { t: 'Tilápia ao Forno', cal: 300, tags: ['Proteico', 'Leve'], baseIng: ['Filé de tilápia', 'Ervas finas', 'Brócolis cozido'], baseInst: ['Tempere o peixe com ervas', 'Asse por 20min a 180ºC', 'Sirva com brócolis'] },
        { t: 'Risoto de Couve-Flor', cal: 250, tags: ['Low Carb', 'Vegetariano'], baseIng: ['Couve-flor triturada', 'Queijo parmesão', 'Caldo de legumes'], baseInst: ['Refogue a couve-flor no azeite', 'Adicione o caldo aos poucos', 'Finalize com queijo ralado'] },
        { t: 'Wrap de Atum', cal: 380, tags: ['Prático', 'Proteico'], baseIng: ['1 pão folha integral', '1 lata de atum', 'Alface e tomate'], baseInst: ['Misture atum com 1 colher de maionese light', 'Espalhe no pão', 'Enrole com salada'] },
        { t: 'Escondidinho Fit', cal: 400, tags: ['Sem Glúten', 'Pré-Treino'], baseIng: ['Batata doce cozida', 'Carne moída magra', 'Cheiro verde'], baseInst: ['Faça um purê com a batata', 'Refogue a carne', 'Monte camadas e asse por 15min'] },
        { t: 'Macarrão de Abobrinha', cal: 180, tags: ['Low Carb', 'Vegano'], baseIng: ['1 abobrinha fatiada fina', 'Molho de tomate caseiro', 'Manjericão'], baseInst: ['Fatie a abobrinha como espaguete', 'Refogue por 2 min', 'Adicione o molho quente'] }
    ];

    // SNACKS
    const snackTemplates = [
        { t: 'Chips de Batata Doce', cal: 150, tags: ['Vegano', 'Sem Glúten'], baseIng: ['1 batata doce', 'Azeite', 'Alecrim'], baseInst: ['Fatie a batata bem fina', 'Tempere com azeite', 'Asse até ficar crocante'] },
        { t: 'Muffin Proteico', cal: 180, tags: ['Proteico', 'Vegetariano'], baseIng: ['2 ovos', '1 scoop Whey protein', '1 banana'], baseInst: ['Misture todos os ingredientes', 'Coloque em forminhas', 'Asse por 15min'] },
        { t: 'Iogurte com Chia', cal: 160, tags: ['Vegetariano', 'Probiótico'], baseIng: ['1 pote iogurte natural', '1 colher chia', 'Fio de mel'], baseInst: ['Misture a chia no iogurte', 'Deixe hidratar por 10min', 'Adoce com mel'] },
        { t: 'Mix de Castanhas', cal: 200, tags: ['Vegano', 'Gorduras Boas'], baseIng: ['2 nozes', '2 castanhas do Pará', '5 amêndoas'], baseInst: ['Separe as porções em potinhos', 'Consuma nos lanches'] },
        { t: 'Ovo de Codorna Temperado', cal: 140, tags: ['Low Carb', 'Proteico'], baseIng: ['6 ovos de codorna', 'Orégano', 'Azeite'], baseInst: ['Cozinhe os ovos', 'Descasque e tempere'] }
    ];

    // DRINKS
    const drinkTemplates = [
        { t: 'Suco Verde Detox', cal: 80, tags: ['Vegano', 'Detox'], baseIng: ['1 folha de couve', 'Suco de 1 limão', 'Gengibre', '200ml água'], baseInst: ['Bata tudo no liquidificador', 'Coe se preferir', 'Sirva gelado'] },
        { t: 'Chá de Hibisco Gelado', cal: 5, tags: ['Vegano', 'Diurético'], baseIng: ['1 colher hibisco seco', '500ml água quente', 'Gelo'], baseInst: ['Faça a infusão por 5 min', 'Deixe esfriar', 'Sirva com muito gelo'] },
        { t: 'Shake de Cacau', cal: 220, tags: ['Vegetariano', 'Proteico'], baseIng: ['200ml leite desnatado', '1 colher cacau 100%', '1 scoop Whey'], baseInst: ['Bata no liquidificador com gelo', 'Beba pós-treino'] },
        { t: 'Água Aromatizada', cal: 0, tags: ['Vegano', 'Hidratação'], baseIng: ['1 litro água', 'Rodelas de limão', 'Ramos de hortelã'], baseInst: ['Coloque tudo numa jarra', 'Deixe curtir por 1h na geladeira'] },
        { t: 'Golden Milk', cal: 120, tags: ['Anti-inflamatório', 'Vegetariano'], baseIng: ['200ml leite vegetal', '1 colher cúrcuma', 'Pimenta preta'], baseInst: ['Aqueça o leite', 'Misture as especiarias', 'Beba morno antes de dormir'] }
    ];

    // Generator Helper
    const createVariations = (baseList: any[], category: string, count: number) => {
        const result = [];
        let i = 0;
        
        while(result.length < count) {
            const template = baseList[i % baseList.length];
            const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
            
            // Image Logic (Placeholders by Category)
            let img = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800'; 
            if(category === 'Café da Manhã') img = 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800';
            if(category === 'Almoço') img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800';
            if(category === 'Jantar') img = 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800';
            if(category === 'Lanche') img = 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800';
            if(category === 'Bebidas') img = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=800';

            // Create Recipe Object
            result.push({
                id: `rec_${category.substring(0,3)}_${idCounter++}`,
                title: `${template.t} ${modifier}`,
                calories: template.cal + Math.floor(Math.random() * 40 - 20),
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
        ...createVariations(mealTemplates, 'Almoço', 30),
        ...createVariations(mealTemplates, 'Jantar', 30),
        ...createVariations(snackTemplates, 'Lanche', 30),
        ...createVariations(drinkTemplates, 'Bebidas', 30)
    ];

    return allRecipes;
}