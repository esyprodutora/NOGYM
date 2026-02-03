export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  current_weight_kg: number;
  starting_weight_kg: number;
  target_weight_kg: number;
  height_cm: number;
  avatar_url?: string;
  streak_days: number;
  is_premium: boolean;
  weight_history: { date: string; weight: number }[];
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

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  time_minutes: number;
  image_url: string;
  category: string;
}

export interface DailyTip {
  id: string;
  category: 'Mindset' | 'Nutrição' | 'Hidratação' | 'Recuperação';
  title: string;
  content: string;
}

export enum AppScreen {
  AUTH = 'AUTH',            // Start/Login Screen
  PROFILE = 'PROFILE',      // Settings/Account
  DASHBOARD = 'DASHBOARD',  // Stats Overview
  PROGRAM = 'PROGRAM',      // The Course List
  RECIPES = 'RECIPES',      // Recipe List
  WORKOUT_DETAILS = 'WORKOUT_DETAILS',
  MINDSET = 'MINDSET',
  UPSELL = 'UPSELL'
}