export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  current_weight_kg: number;
  starting_weight_kg: number;
  target_weight_kg: number;
  height_cm: number;
  avatar_url?: string;
  start_photo_url?: string;   // New
  current_photo_url?: string; // New
  streak_days: number;
  is_premium: boolean;
  weight_history: { date: string; weight: number }[];
  earned_badges: string[]; // IDs of earned badges
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  color: string;
}

export interface Workout {
  id: string;
  day_number: number;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  video_url: string;
  thumbnail_url: string;
  is_locked: boolean;
  completed: boolean;
}

export type RecipeCategory = 'Café da Manhã' | 'Almoço' | 'Jantar' | 'Lanche' | 'Bebidas';

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  time_minutes: number;
  image_url: string;
  category: RecipeCategory;
  ingredients: string[];
  instructions: string[];
  tags?: string[]; // New field for dietary tags (Vegano, Sem Lactose, etc)
}

export interface DailyTip {
  id: string;
  category: 'Mindset' | 'Nutrição' | 'Hidratação' | 'Recuperação';
  title: string;
  content: string;
}

export interface MindsetItem {
  id: string;
  title: string;
  duration: string;
  type: 'Áudio' | 'Leitura' | 'Vídeo';
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export enum AppScreen {
  AUTH = 'AUTH',            // Start/Login Screen
  PROFILE = 'PROFILE',      // Settings/Account
  DASHBOARD = 'DASHBOARD',
  PROGRAM = 'PROGRAM',
  RECIPES = 'RECIPES',
  WORKOUT_DETAILS = 'WORKOUT_DETAILS',
  MINDSET = 'MINDSET',
  JOURNAL_HISTORY = 'JOURNAL_HISTORY', // New Screen
  UPSELL = 'UPSELL'
}