-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    height_cm NUMERIC,
    current_weight_kg NUMERIC,
    target_weight_kg NUMERIC,
    streak_days INTEGER DEFAULT 0,
    last_completed_at TIMESTAMPTZ,
    is_premium BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKOUTS (Static Content)
CREATE TABLE public.workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    day_number INTEGER NOT NULL, -- 1 to 28
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration_minutes INTEGER NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    is_locked_initially BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER_WORKOUT_PROGRESS (Tracking)
CREATE TABLE public.user_workout_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    duration_watched_seconds INTEGER DEFAULT 0,
    UNIQUE(user_id, workout_id)
);

-- 4. WEIGHT_LOGS (Graph Data)
CREATE TABLE public.weight_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    weight_kg NUMERIC NOT NULL,
    photo_url TEXT, -- Progress photo path
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BADGES (Gamification)
CREATE TABLE public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    condition_logic JSONB -- e.g., {"streak": 7}
);

-- 6. USER_BADGES
CREATE TABLE public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workout_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Profiles: Users can read/update their own data
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Workouts: Readable by all authenticated users
CREATE POLICY "Workouts are viewable by everyone." ON public.workouts FOR SELECT USING (auth.role() = 'authenticated');

-- Progress: Only owner can manage
CREATE POLICY "Users can view own progress." ON public.user_workout_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress." ON public.user_workout_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Weight Logs: Only owner can manage
CREATE POLICY "Users can view own weight logs." ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weight logs." ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TRIGGER: Auto-update User Streak
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Logic to calculate streak would go here
  -- Simplified:
  UPDATE public.profiles 
  SET last_completed_at = NOW(),
      streak_days = streak_days + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workout_complete
  AFTER INSERT ON public.user_workout_progress
  FOR EACH ROW EXECUTE PROCEDURE update_streak();

-- TRIGGER: Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();