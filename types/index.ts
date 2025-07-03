// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer not to say';
  height?: number; // in cm
  weight?: number; // in kg
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoal?: 'lose_weight' | 'build_muscle' | 'maintain' | 'improve_endurance' | 'improve_strength';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  dietaryPreferences?: string[];
  allergies?: string[];
  createdAt: string;
  updatedAt: string;
}

// Workout Types
export type BodyRegion = 'upper_body' | 'lower_body' | 'core' | 'full_body';
export type MuscleGroup = 
  'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms' | 
  'quadriceps' | 'hamstrings' | 'glutes' | 'calves' | 'abs' | 'obliques' | 
  'lower_back' | 'traps' | 'lats' | 'deltoids';

export type EquipmentType = 
  'bodyweight' | 'dumbbell' | 'barbell' | 'kettlebell' | 'resistance_band' | 
  'cable_machine' | 'smith_machine' | 'leg_press' | 'bench' | 'pull_up_bar' | 
  'medicine_ball' | 'stability_ball' | 'foam_roller' | 'trx' | 'machine';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  muscleGroups: MuscleGroup[];
  bodyRegion: BodyRegion;
  equipment: EquipmentType[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
  tips?: string[];
  variations?: string[];
  isCustom?: boolean;
}

export interface WorkoutExercise {
  id: string; // Exercise ID
  sets: number;
  reps: number;
  restTime?: number; // in seconds
  weight?: number; // in kg
  duration?: number; // in seconds (for timed exercises)
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., 'strength', 'cardio', 'hiit', 'yoga', etc.
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  intensity: 'low' | 'medium' | 'high';
  estimatedDuration: number; // in minutes
  exercises: WorkoutExercise[];
  imageUrl?: string;
  isCustom?: boolean;
  createdAt?: string;
  goalAlignment?: string[]; // e.g., ['lose_weight', 'build_muscle']
  duration?: number; // Actual duration in minutes
}

export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes: string;
}

export interface WorkoutRating {
  rating: number; // 1-5
  feedback?: string;
  energy?: number; // 1-5
  difficulty?: number; // 1-5
  enjoyment?: number; // 1-5
}

export interface WorkoutMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number; // in minutes
  exercises: ExerciseLog[];
  notes: string;
  completed: boolean;
  rating: WorkoutRating | null;
  media: WorkoutMedia[];
}

export interface ScheduledWorkout {
  id: string;
  workoutId: string;
  workoutName?: string; // Added for easier display
  
  // Scheduling type
  scheduleType: 'recurring' | 'one-time';
  
  // For recurring workouts
  dayOfWeek?: number; // 0-6, where 0 is Sunday
  
  // For one-time workouts
  scheduledDate?: string; // ISO string for specific date
  
  time: string; // formatted time string like "8:30 AM"
  notes: string;
  reminder: boolean;
  reminderTime: number; // minutes before workout
  createdAt?: string; // Added timestamp
  
  // For recurring workouts
  recurrenceEndDate?: string; // Optional end date for recurring workouts
  recurrenceFrequency?: 'weekly' | 'biweekly' | 'monthly'; // Default is weekly
}

export interface TimerSettings {
  defaultRestTime: number; // in seconds
  autoStartRest: boolean;
  voicePrompts: boolean;
  countdownBeep: boolean;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimatedOneRepMax: number;
  date: string;
  previousBest: number;
  improvement: number;
}

// Nutrition Types
export interface Macros {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
}

export interface NutritionGoals {
  dailyCalories: number;
  macroSplit: {
    protein: number; // percentage
    carbs: number; // percentage
    fat: number; // percentage
  };
  waterIntake: number; // in ml
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  macros: Macros;
  category?: string;
  imageUrl?: string;
  barcode?: string;
  isCustom?: boolean;
}

export interface Meal {
  id: string;
  name: string;
  foods: {
    foodId: string;
    quantity: number; // number of servings
  }[];
  totalMacros: Macros;
  imageUrl?: string;
  isCustom?: boolean;
  tags?: string[];
}

export interface FoodLog {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: {
    foodId: string;
    quantity: number;
    customName?: string;
  }[];
  notes?: string;
  imageUrl?: string;
}

export interface WaterLog {
  id: string;
  date: string;
  amount: number; // in ml
  timestamp: string;
}

// Health Tracking Types
export interface WeightLog {
  id: string;
  date: string;
  weight: number; // in kg
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
    shoulders?: number;
    calves?: number;
    neck?: number;
  };
  notes?: string;
}

export interface SleepLog {
  id: string;
  date: string;
  duration: number; // in minutes
  quality: number; // 1-5
  notes?: string;
}

export interface StepLog {
  id: string;
  date: string;
  steps: number;
  distance?: number; // in km
  calories?: number;
  source?: string; // e.g., 'Apple Health', 'Fitbit', 'Device Pedometer'
  deviceId?: string; // ID of the device that provided the data
}

export interface CardioLog {
  id: string;
  date: string;
  type: string; // e.g., 'running', 'cycling', 'swimming'
  duration: number; // in minutes
  distance?: number; // in km
  calories?: number;
  avgHeartRate?: number;
  notes?: string;
}

// Progress Photo Types
export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'front' | 'back' | 'side' | 'other';
  notes?: string;
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'workout' | 'nutrition' | 'weight' | 'measurement' | 'habit' | 'other';
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate: string;
  targetDate?: string;
  completed: boolean;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
}

// Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'nutrition' | 'consistency' | 'special';
  icon: string;
  requiredProgress: number;
  currentProgress: number;
  completed: boolean;
  completedDate?: string;
  pointsAwarded: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'nutrition' | 'steps' | 'water' | 'sleep';
  startDate: string;
  endDate: string;
  target: number;
  progress: number;
  unit: string;
  completed: boolean;
  completedDate?: string;
  pointsAwarded: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'nutrition' | 'steps' | 'water' | 'sleep';
  date: string;
  completed: boolean;
  completedDate?: string;
  pointsAwarded: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl?: string;
  redeemed: boolean;
  redeemedDate?: string;
}

// AI and Recommendation Types
export interface AiWorkoutRecommendation {
  workoutId: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface AiNutritionRecommendation {
  mealId: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface AiInsight {
  id: string;
  category: 'workout' | 'nutrition' | 'health' | 'sleep' | 'recovery';
  title: string;
  description: string;
  actionItems?: string[];
  timestamp: string;
  dismissed: boolean;
}

// Notification Types
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'workout' | 'nutrition' | 'goal' | 'achievement' | 'system';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationSettings {
  workoutReminders: boolean;
  nutritionReminders: boolean;
  achievementNotifications: boolean;
  goalNotifications: boolean;
  systemNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:MM format
  quietHoursEnd?: string; // HH:MM format
}

// App Settings Types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  language: string;
  privacySettings: {
    shareWorkoutData: boolean;
    shareNutritionData: boolean;
    shareHealthData: boolean;
    analyticsEnabled: boolean;
  };
}

// Device Connection Types
export interface HealthDevice {
  id: string;
  name: string;
  type: 'appleWatch' | 'fitbit' | 'garmin' | 'samsung' | 'whoop' | 'xiaomi' | 'other';
  model?: string;
  connected: boolean;
  lastSynced?: string;
  capabilities?: string[];
  batteryLevel?: number;
}

export interface DeviceSync {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  dataTypes: string[];
  recordCount: number;
}

export interface DeviceData {
  deviceId: string;
  deviceType: string;
  steps?: {
    date: string;
    steps: number;
    distance?: number;
    calories?: number;
  }[];
  activities?: {
    externalId: string;
    type: string;
    date: string;
    duration: number;
    distance: number;
    calories: number;
    notes?: string;
    isOutdoor?: boolean;
    location?: string;
    heartRate?: {
      avg: number;
      max: number;
      min: number;
    };
    elevationGain?: number;
    route?: {
      lat: number;
      lng: number;
      timestamp: string;
    }[];
  }[];
}

// Health Goals
export interface HealthGoals {
  dailySteps: number;
  weeklyWorkouts: number;
  targetWeight: number;
  targetDate: string;
}

// Water Intake
export interface WaterIntake {
  id: string;
  date: string;
  amount: number;
}

// Export all types
export type {
  // Add any additional types here
};