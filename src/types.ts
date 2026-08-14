export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'recomposition';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutCategory = 'beginner' | 'intermediate' | 'advanced' | 'home' | 'gym' | 'fat_loss' | 'muscle_gain' | 'strength' | 'cardio' | 'yoga' | 'stretching' | 'hiit';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title?: string;
  role?: string;
  age: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  targetWeight: number; // in kg
  goal: FitnessGoal;
  level: ExperienceLevel;
  dailyStepGoal: number;
  dailyWaterGoalMl: number;
  dailyCalorieGoal: number;
  proteinGoalG: number;
  streakDays: number;
  xpPoints: number;
  isAdmin?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  muscleGroup: string;
  difficulty: ExperienceLevel;
  sets: number;
  reps?: string;
  durationSeconds?: number;
  restSeconds: number;
  caloriesBurned: number;
  imageUrl: string;
  animationType: 'pushup' | 'squat' | 'plank' | 'jumping_jacks' | 'bicep_curl' | 'lunges' | 'yoga_downward_dog' | 'burpees' | 'crunches';
  videoUrl?: string;
  instructions: string[];
  tips: string[];
  equipmentNeeded: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  level: ExperienceLevel;
  durationMinutes: number;
  totalCalories: number;
  imageUrl: string;
  exercises: Exercise[];
  isFeatured?: boolean;
}

export interface Meal {
  id: string;
  title: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  prepTimeMinutes: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  waterMl: number;
  steps: number;
  caloriesBurned: number;
  caloriesConsumed: number;
  completedWorkoutIds: string[];
  weightKg: number;
  bodyMeasurements: {
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
    armsCm?: number;
    thighsCm?: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  targetCount: string;
  rewardXp: number;
  rewardBadge: string;
  iconName: string;
  completedDays: boolean[];
  category: 'pushup' | 'plank' | 'running' | '7day' | '30day';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'workout' | 'hydration' | 'social' | 'challenge';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  workoutTitle?: string;
  content: string;
  imageUrl?: string;
  likes: number;
  isLiked: boolean;
  comments: {
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timestamp: string;
  }[];
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number;
  streakDays: number;
  badge: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'update' | 'event';
}
