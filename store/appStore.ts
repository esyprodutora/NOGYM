import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, MindsetItem, JournalEntry, RecipeCategory } from '../types';

// --- CONSTANTS ---
const BADGES: Badge[] = [
  // Fase 1: Início
  { id: 'start', title: 'A Decisão', description: 'Você aceitou o desafio!', icon: '🔥', color: 'bg-orange-500' },
  { id: 'first_workout', title: 'Primeiro Passo', description: 'Concluiu o treino do Dia 1', icon: '💦', color: 'bg-red-500' },
  { id: 'mindset_1', title: 'Mente Blindada', description: 'Assistiu à primeira aula de Mindset', icon: '🧠', color: 'bg-purple-500' },
  
  // Fase 2: Consistência (Meio do Desafio)
  { id: 'week_1', title: 'Metade do Caminho', description: 'Concluiu 7 dias do desafio', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'loss_1', title: 'Primeiro Quilo', description: 'Perdeu 1kg na balança', icon: '⚖️', color: 'bg-cyan-500' },
  { id: 'hydration_streak', title: 'Hidratada', description: 'Registrou água por 3 dias seguidos', icon: '💧', color: 'bg-blue-400' },
  
  // Fase 3: Conclusão
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

// --- WORKOUTS (15 DAYS GENERATOR) ---
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

    // Modifiers to create variations without losing core quality
    const modifiers = ['Clássico', 'Especial', 'da Casa', 'Supremo', 'Rústico', 'Premium'];
    
    // --- TEMPLATES COMPLETOS E DETALHADOS ---

    // CAFÉ DA MANHÃ
    const breakfastTemplates = [
        { 
            t: 'Panqueca de Banana Funcional', 
            cal: 280, 
            tags: ['Vegetariano', 'Sem Glúten', 'Pré-Treino'], 
            baseIng: [
                '1 banana prata bem madura (amassada)', 
                '2 ovos médios', 
                '2 colheres (sopa) de farelo de aveia', 
                '1 colher (chá) de canela em pó',
                'Óleo de coco para untar'
            ], 
            baseInst: [
                '1. Em um bowl, amasse bem a banana com um garfo até virar um purê.',
                '2. Adicione os ovos e bata vigorosamente com um garfo ou fouet até aerar.',
                '3. Incorpore a aveia e a canela, misturando até obter uma massa homogênea.',
                '4. Aqueça uma frigideira antiaderente em fogo baixo e unte levemente com óleo de coco.',
                '5. Despeje pequenas porções da massa. Quando surgirem bolhas na superfície, vire com cuidado.',
                '6. Deixe dourar o outro lado por cerca de 1 minuto e sirva quente.'
            ] 
        },
        { 
            t: 'Ovos Mexidos Cremosos de Hotel', 
            cal: 240, 
            tags: ['Low Carb', 'Sem Glúten', 'Proteico'], 
            baseIng: [
                '3 ovos grandes', 
                '1 colher (sopa) de requeijão light ou creme de ricota', 
                '1 colher (chá) de manteiga ghee',
                'Sal e pimenta do reino a gosto',
                'Cebolinha fresca picada para finalizar'
            ], 
            baseInst: [
                '1. Quebre os ovos em uma tigela e bata levemente com um garfo, apenas para misturar as gemas e claras.',
                '2. Tempere com uma pitada de sal e pimenta.',
                '3. Aqueça a frigideira em fogo *muito baixo* e derreta a manteiga.',
                '4. Despeje os ovos e mexa constantemente com uma espátula de silicone, raspando as bordas para o centro.',
                '5. Quando os ovos estiverem quase cozidos mas ainda úmidos, desligue o fogo.',
                '6. Adicione o requeijão imediatamente e misture (o calor residual cozinha o resto). Finalize com cebolinha.'
            ] 
        },
        { 
            t: 'Mingau de Aveia Proteico', 
            cal: 320, 
            tags: ['Vegetariano', 'Fibras', 'Pós-Treino'], 
            baseIng: [
                '3 colheres (sopa) de aveia em flocos grossos', 
                '200ml de leite desnatado ou vegetal (amêndoa)', 
                '1 scoop de Whey Protein sabor Baunilha',
                '1/2 maçã picada em cubos pequenos',
                'Canela em pau e em pó'
            ], 
            baseInst: [
                '1. Em uma panela pequena, coloque o leite, a aveia e a canela em pau.',
                '2. Cozinhe em fogo médio, mexendo sempre, por cerca de 5 a 8 minutos até engrossar.',
                '3. Quando atingir a consistência desejada, desligue o fogo e retire a canela em pau.',
                '4. Espere amornar por 1 minuto e misture o Whey Protein vigorosamente para não empelotar.',
                '5. Sirva em uma tigela, adicione a maçã picada e polvilhe canela em pó por cima.'
            ] 
        },
        { 
            t: 'Avocado Toast Perfeita', 
            cal: 350, 
            tags: ['Vegetariano', 'Gorduras Boas'], 
            baseIng: [
                '2 fatias de pão integral ou fermentação natural', 
                '1/2 abacate maduro', 
                'Suco de 1/2 limão',
                '2 ovos',
                'Pimenta calabresa (opcional)'
            ], 
            baseInst: [
                '1. Toste as fatias de pão na torradeira ou frigideira até ficarem crocantes.',
                '2. Amasse o abacate grosseiramente, temperando com sal, limão e pimenta.',
                '3. Para os ovos: Cozinhe-os em água fervente por 6 minutos (gema mole) ou frite-os com pouco azeite.',
                '4. Monte a torrada espalhando a pasta de abacate generosamente.',
                '5. Coloque o ovo por cima. Faça um corte na gema antes de servir.'
            ] 
        },
        { 
            t: 'Overnight Oats de Frutas Vermelhas', 
            cal: 290, 
            tags: ['Vegano', 'Sem Lactose', 'Prático'], 
            baseIng: [
                '4 colheres (sopa) de aveia em flocos', 
                '1 colher (sopa) de sementes de chia', 
                '150ml de leite de coco',
                '1/2 xícara de mix de frutas vermelhas (frescas ou congeladas)',
                '1 fio de mel ou agave'
            ], 
            baseInst: [
                '1. Em um pote de vidro com tampa, misture a aveia e a chia.',
                '2. Adicione o leite de coco e o mel, mexendo bem para a chia não grudar no fundo.',
                '3. Coloque as frutas vermelhas por cima sem misturar.',
                '4. Tampe e leve à geladeira por no mínimo 4 horas (ideal fazer na noite anterior).',
                '5. Consuma gelado pela manhã.'
            ] 
        }
    ];

    // ALMOÇO
    const lunchTemplates = [
        { 
            t: 'Filé de Frango Grelhado ao Limão', 
            cal: 320, 
            tags: ['Proteico', 'Low Carb', 'Sem Glúten'], 
            baseIng: [
                '2 filés de peito de frango médios (150g cada)', 
                'Suco de 1 limão tahiti', 
                '1 dente de alho amassado',
                '1 colher (chá) de páprica defumada',
                'Azeite de oliva'
            ], 
            baseInst: [
                '1. Tempere os filés com o limão, alho, páprica, sal e pimenta. Deixe marinar por 15 minutos.',
                '2. Aqueça bem uma frigideira antiaderente. Adicione um fio de azeite.',
                '3. Coloque os filés (sem amontoar) e não mexa por 4 minutos para criar uma crosta dourada.',
                '4. Vire e grelhe por mais 3-4 minutos até o centro estar cozido.',
                '5. Retire do fogo e deixe a carne "descansar" por 2 minutos antes de cortar para manter a suculência.'
            ] 
        },
        { 
            t: 'Tilápia Assada com Crosta de Ervas', 
            cal: 280, 
            tags: ['Proteico', 'Leve', 'Ômega 3'], 
            baseIng: [
                '2 filés de tilápia', 
                '2 colheres (sopa) de farelo de aveia', 
                '1 colher (sopa) de ervas finas secas',
                'Raspas de limão siciliano',
                'Brócolis e cenoura para acompanhar'
            ], 
            baseInst: [
                '1. Pré-aqueça o forno a 200°C.',
                '2. Misture o farelo de aveia com as ervas, as raspas de limão e uma pitada de sal.',
                '3. Seque os peixes com papel toalha e pincele azeite.',
                '4. Pressione a mistura de ervas sobre a parte de cima dos filés.',
                '5. Disponha em uma assadeira junto com os legumes. Asse por 15 a 20 minutos até a crosta dourar.'
            ] 
        },
        { 
            t: 'Risoto Fake de Couve-Flor', 
            cal: 250, 
            tags: ['Low Carb', 'Vegetariano', 'Fibras'], 
            baseIng: [
                '1/2 couve-flor média limpa', 
                '1/2 cebola picada', 
                '1 colher (sopa) de requeijão light',
                '2 colheres (sopa) de queijo parmesão ralado',
                'Caldo de legumes caseiro (ou água quente)'
            ], 
            baseInst: [
                '1. Triture a couve-flor crua no processador ou liquidificador (modo pulsar) até ficar parecida com grãos de arroz.',
                '2. Refogue a cebola no azeite até ficar transparente.',
                '3. Adicione a couve-flor e refogue por 3 minutos. Acrescente um pouco de caldo (não precisa cobrir) e cozinhe até secar.',
                '4. Quando estiver macia (al dente), desligue o fogo.',
                '5. Misture o requeijão e o parmesão vigorosamente para dar a cremosidade de risoto.'
            ] 
        },
        { 
            t: 'Bowl de Salada Completa', 
            cal: 380, 
            tags: ['Sem Glúten', 'Fibras', 'Detox'], 
            baseIng: [
                'Mix de folhas verdes (alface, rúcula, agrião)', 
                '1/2 xícara de grão de bico cozido', 
                '1/2 pepino japonês fatiado',
                '1 ovo cozido fatiado',
                'Molho: 1 colher mostarda, 1 colher mel, azeite e limão'
            ], 
            baseInst: [
                '1. Lave e seque bem as folhas. Rasgue-as com a mão para a base do prato.',
                '2. Disponha o grão de bico, o pepino e o ovo em "seções" sobre as folhas.',
                '3. Para o molho: Em um potinho, bata a mostarda, mel, azeite e limão com um garfo até emulsionar (ficar grosso).',
                '4. Despeje o molho apenas na hora de comer para não murchar as folhas.'
            ] 
        },
        { 
            t: 'Escondidinho de Batata Doce e Carne', 
            cal: 420, 
            tags: ['Pré-Treino', 'Sem Glúten'], 
            baseIng: [
                '200g de batata doce cozida e descascada', 
                '150g de patinho moído', 
                '1/2 tomate picado',
                'Cebola e alho',
                '1 fatia de queijo mussarela light'
            ], 
            baseInst: [
                '1. Amasse a batata doce quente com um garfo, adicione um pouco de leite desnatado se precisar para formar um purê rústico.',
                '2. Refogue a carne moída com cebola, alho e tomate até ficar bem sequinha.',
                '3. Em um refratário individual, faça uma camada com a carne moída.',
                '4. Cubra com o purê de batata doce.',
                '5. Coloque o queijo por cima e leve ao forno ou airfryer por 10 min a 200°C para gratinar.'
            ] 
        }
    ];

    // JANTAR (Similar to Lunch but lighter)
    const dinnerTemplates = [
        { 
            t: 'Omelete de Forno com Legumes', 
            cal: 220, 
            tags: ['Low Carb', 'Vegetariano', 'Prático'], 
            baseIng: [
                '2 ovos inteiros + 1 clara', 
                '1/2 abobrinha ralada', 
                '1/2 cenoura ralada',
                '1 colher (café) de fermento químico',
                'Orégano'
            ], 
            baseInst: [
                '1. Pré-aqueça o forno a 180°C.',
                '2. Em uma tigela, bata os ovos com sal e orégano.',
                '3. Adicione os legumes ralados (esprema a abobrinha para tirar o excesso de água) e o fermento.',
                '4. Despeje em forminhas de silicone ou um refratário pequeno untado.',
                '5. Asse por cerca de 20 minutos ou até ficar firme e dourado.'
            ] 
        },
        { 
            t: 'Sopa Creme de Abóbora com Gengibre', 
            cal: 180, 
            tags: ['Vegano', 'Detox', 'Leve'], 
            baseIng: [
                '300g de abóbora cabotiá descascada e picada', 
                '1 pedaço de 2cm de gengibre fresco', 
                '1/2 cebola',
                'Água ou caldo de legumes',
                'Sementes de abóbora para finalizar'
            ], 
            baseInst: [
                '1. Refogue a cebola no azeite. Adicione a abóbora e o gengibre ralado.',
                '2. Cubra com água fervente e cozinhe até a abóbora desmanchar (aprox. 20 min).',
                '3. Bata tudo no liquidificador ou com um mixer na própria panela até virar um creme liso.',
                '4. Volte ao fogo, acerte o sal e deixe ferver por mais 2 minutos.',
                '5. Sirva com as sementes tostadas por cima.'
            ] 
        },
        { 
            t: 'Espaguete de Abobrinha à Bolonhesa', 
            cal: 260, 
            tags: ['Low Carb', 'Sem Glúten'], 
            baseIng: [
                '1 abobrinha grande', 
                '150g de carne moída magra pronta (com molho de tomate)', 
                'Manjericão fresco',
                'Queijo parmesão ralado na hora'
            ], 
            baseInst: [
                '1. Lave a abobrinha e use um fatiador espiral (ou descascador) para fazer tiras longas como macarrão.',
                '2. Aqueça uma frigideira com um fio de azeite. Refogue a abobrinha rapidamente (2 minutos) para não soltar muita água.',
                '3. Tempere a abobrinha com sal apenas no final.',
                '4. Sirva a abobrinha no prato e cubra com o molho de carne bem quente.',
                '5. Decore com manjericão e parmesão.'
            ] 
        },
        { 
            t: 'Salada de Atum com Feijão Branco', 
            cal: 310, 
            tags: ['Sem Glúten', 'Proteico', 'Frio'], 
            baseIng: [
                '1 lata de atum sólido em água (escorrido)', 
                '1/2 xícara de feijão branco cozido (sem caldo)', 
                'Cebola roxa picadinha',
                'Salsinha picada',
                'Azeite e vinagre de maçã'
            ], 
            baseInst: [
                '1. Em uma tigela, desfaça as lascas do atum delicadamente.',
                '2. Misture o feijão branco, a cebola roxa e a salsinha.',
                '3. Tempere com bastante azeite, vinagre, sal e pimenta do reino.',
                '4. Deixe na geladeira por 10 minutos antes de servir para apurar o sabor.',
                '5. Pode ser servido sobre folhas de alface.'
            ] 
        },
        { 
            t: 'Wrap de Couve (Sem Massa)', 
            cal: 150, 
            tags: ['Low Carb', 'Vegano Opção', 'Leve'], 
            baseIng: [
                '2 folhas grandes de couve-manteiga (inteiras)', 
                'Frango desfiado ou Hummus', 
                'Cenoura ralada',
                'Tomate picado'
            ], 
            baseInst: [
                '1. Lave as folhas de couve e corte o talo grosso da base (sem separar a folha).',
                '2. Passe as folhas rapidamente em água fervente (30 segundos) apenas para amolecer, e depois em água gelada (branqueamento). Seque bem.',
                '3. Coloque o recheio (frango ou hummus) no centro da folha.',
                '4. Adicione a cenoura e o tomate.',
                '5. Enrole como um charuto, dobrando as laterais para dentro. Corte ao meio e sirva.'
            ] 
        }
    ];

    // LANCHES
    const snackTemplates = [
        { 
            t: 'Muffin de Banana com Cacau', 
            cal: 160, 
            tags: ['Vegetariano', 'Sem Glúten'], 
            baseIng: [
                '2 bananas maduras', 
                '2 ovos', 
                '2 colheres (sopa) de cacau em pó 100%', 
                '1 colher (chá) de fermento',
                'Gotas de chocolate 70% (opcional)'
            ], 
            baseInst: [
                '1. Bata todos os ingredientes no liquidificador, exceto o fermento e as gotas de chocolate.',
                '2. Misture o fermento delicadamente com uma colher.',
                '3. Distribua em forminhas de cupcake (silicone é melhor) preenchendo 3/4 da forma.',
                '4. Coloque as gotas de chocolate por cima.',
                '5. Asse em forno pré-aquecido a 180°C por 15 a 20 minutos.'
            ] 
        },
        { 
            t: 'Chips de Batata Doce Caseiro', 
            cal: 140, 
            tags: ['Vegano', 'Crocante', 'Sem Glúten'], 
            baseIng: [
                '1 batata doce média', 
                '1 colher (sopa) de azeite', 
                'Alecrim seco',
                'Sal grosso moído'
            ], 
            baseInst: [
                '1. Lave bem a batata e fatie o mais fino possível (use um mandolim se tiver).',
                '2. Deixe as fatias de molho em água gelada por 10 minutos (isso deixa mais crocante). Seque-as muito bem com pano.',
                '3. Em uma tigela, envolva as fatias no azeite e alecrim.',
                '4. Distribua na assadeira sem sobrepor (essencial).',
                '5. Asse a 200°C por cerca de 15-20 minutos, virando na metade do tempo. Fique de olho para não queimar.'
            ] 
        },
        { 
            t: 'Iogurte Grego com Calda de Frutas', 
            cal: 180, 
            tags: ['Vegetariano', 'Proteico', 'Probiótico'], 
            baseIng: [
                '1 pote de iogurte natural desnatado ou grego zero', 
                '1/2 xícara de morangos picados', 
                '1 colher (chá) de sementes de chia',
                'Adoçante natural (stevia ou xilitol)'
            ], 
            baseInst: [
                '1. Para a calda rápida: Leve os morangos e o adoçante ao micro-ondas por 1 minuto. Amasse com um garfo.',
                '2. Deixe a calda esfriar um pouco.',
                '3. Misture a chia no iogurte.',
                '4. Em um copo, alterne camadas de iogurte e da calda de morango.',
                '5. Leve à geladeira por 10 minutos antes de comer.'
            ] 
        },
        { 
            t: 'Pasta de Grão de Bico (Homus) com Vegetais', 
            cal: 200, 
            tags: ['Vegano', 'Proteico', 'Fibras'], 
            baseIng: [
                '1 xícara de grão de bico cozido', 
                '1 colher (sopa) de tahine (pasta de gergelim)', 
                'Suco de 1/2 limão', 
                '1 dente de alho pequeno',
                'Cenoura e pepino em palitos para acompanhar'
            ], 
            baseInst: [
                '1. No processador, bata o grão de bico, tahine, limão, alho e uma pitada de sal.',
                '2. Adicione água gelada aos poucos enquanto bate, até atingir uma textura cremosa e clara.',
                '3. Transfira para um pote e regue com azeite.',
                '4. Corte a cenoura e o pepino em bastões.',
                '5. Use os vegetais para "dippar" na pasta.'
            ] 
        }
    ];

    // BEBIDAS
    const drinkTemplates = [
        { 
            t: 'Suco Verde Anti-Inchaço', 
            cal: 60, 
            tags: ['Vegano', 'Detox', 'Diurético'], 
            baseIng: [
                '1 folha grande de couve (sem o talo)', 
                'Suco de 1 limão', 
                '1 fatia grossa de abacaxi', 
                '1 pedaço pequeno de gengibre',
                '200ml de água de coco gelada'
            ], 
            baseInst: [
                '1. Lave bem a couve.',
                '2. Coloque todos os ingredientes no liquidificador.',
                '3. Bata na potência máxima por 2 minutos para triturar bem a couve.',
                '4. Se preferir, coe (mas beber com as fibras é melhor).',
                '5. Sirva imediatamente com gelo.'
            ] 
        },
        { 
            t: 'Golden Milk (Leite Dourado)', 
            cal: 110, 
            tags: ['Vegetariano', 'Anti-inflamatório', 'Relaxante'], 
            baseIng: [
                '200ml de leite vegetal (amêndoa ou coco)', 
                '1 colher (chá) de cúrcuma em pó (açafrão)', 
                '1 pitada de pimenta do reino preta (ativa a cúrcuma)', 
                '1 pitada de canela',
                'Mel a gosto'
            ], 
            baseInst: [
                '1. Em uma panela pequena, aqueça o leite (não deixe ferver completamente).',
                '2. Adicione a cúrcuma, pimenta e canela.',
                '3. Misture bem com um fouet ou colher até dissolver os pós.',
                '4. Desligue o fogo e adoce com mel.',
                '5. Beba morno, preferencialmente antes de dormir.'
            ] 
        },
        { 
            t: 'Chá Gelado de Hibisco com Laranja', 
            cal: 15, 
            tags: ['Vegano', 'Hidratação', 'Zero Açúcar'], 
            baseIng: [
                '1 colher (sopa) de hibisco seco', 
                '500ml de água', 
                'Rodelas de laranja com casca', 
                'Pau de canela'
            ], 
            baseInst: [
                '1. Ferva a água. Desligue o fogo.',
                '2. Adicione o hibisco e a canela. Tampe e deixe em infusão por 5 a 8 minutos.',
                '3. Coe o chá e deixe esfriar.',
                '4. Em uma jarra com muito gelo, coloque as rodelas de laranja.',
                '5. Despeje o chá sobre o gelo e sirva.'
            ] 
        }
    ];

    // Generator Helper
    const createVariations = (baseList: any[], category: string, count: number) => {
        const result = [];
        let i = 0;
        
        while(result.length < count) {
            const template = baseList[i % baseList.length];
            const modifier = modifiers[i % modifiers.length]; // Cycle modifiers sequentially
            
            // Image Logic (Fixed to match category cards exactly)
            let img = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800'; 
            if(category === 'Café da Manhã') img = 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800';
            if(category === 'Almoço') img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800';
            if(category === 'Jantar') img = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800'; // Updated to match card
            if(category === 'Lanche') img = 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800';
            if(category === 'Bebidas') img = 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800'; // Updated to match card

            // Create Recipe Object
            result.push({
                id: `rec_${category.substring(0,3)}_${idCounter++}`,
                title: i < baseList.length ? template.t : `${template.t} ${modifier}`, // Only add modifier if looping
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