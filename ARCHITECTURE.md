# NO Gym - Technical Architecture Strategy

## 1. Architecture Overview
This application follows a **feature-first, offline-first** architecture designed for scalability and premium performance on mobile devices.

### Layers
1.  **UI Layer (React Native / Expo):**
    *   Uses **Reanimated** for 60fps animations (critical for "premium" feel).
    *   Uses **FlashList** for workout lists to handle memory efficiently.
    *   Tailwind (via NativeWind) for styling to maintain design system consistency.
2.  **State Management Layer:**
    *   **Zustand:** Used for synchronous client-state (Session, Theme, Unlocked Status, UI Triggers). Lightweight, no boilerplate.
    *   **TanStack Query (React Query):** Used for server-state (Workouts, History, Profile). Handles caching, optimistic updates, and background refetching.
3.  **Service Layer:**
    *   **Supabase SDK:** Direct interaction with Postgres via Supabase Client.
4.  **Backend (Supabase):**
    *   Auth, Database, Storage, and Edge Functions (for payment processing integration).

## 2. Gamification Logic
The gamification is "Mature" - no cartoons, no annoying popups.
*   **Streaks:** Calculated on the backend via Postgres Triggers (`on_workout_complete`). Logic checks if `last_completed_at` was yesterday.
*   **Visuals:** Subtle glow effects using Reanimated shared values on the Dashboard progress ring.
*   **Haptics:** `expo-haptics` used on "Complete Workout" button press (Light impact).

## 3. Upsell Strategy
*   **Freemium Model:**
    *   Workouts 1-3: Free.
    *   Workouts 4-28: Locked.
*   **Implementation:**
    *   Locked items are rendered with a `BlurView` overlay.
    *   Tapping a locked item triggers a `Modal` (React Native Modal) with a soft transition.
    *   Flag checks: `user.is_premium`.

## 4. Performance Optimization
*   **List Rendering:**
    *   Using `FlashList` instead of `FlatList` for the workout feed.
    *   `estimatedItemSize` is strictly defined.
*   **Images:**
    *   Using `expo-image` with memory caching.
    *   Thumbnails are pre-processed to exact aspect ratios on Supabase Storage.
*   **Code Splitting:**
    *   Heavy components (Video Player, Charts) are lazy-loaded.
*   **Memoization:**
    *   `WorkoutCard` is wrapped in `React.memo` and uses `useCallback` for press handlers to prevent re-renders during parent state updates (e.g., scroll events).

## 5. Folder Structure
```
/app                # Expo Router pages
/components         # Reusable UI (Button, Card, Input)
  /ui               # Primitives
  /business         # Complex domain components (WorkoutCard)
/hooks              # Custom hooks (useWorkout, useAuth)
/services           # API calls
  supabase.ts
/store              # Zustand stores
/types              # TypeScript interfaces
/assets             # Fonts, Images
```