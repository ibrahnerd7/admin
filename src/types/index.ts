// Workout Set Type
export interface WorkoutSet {
  id: string;
  numberOfReps: number;
  weight: number;
  status: 'pending' | 'completed' | 'skipped';
}

// Workout Type
export interface Workout {
  id: string;
  name: string;
  preparation?: string;
  execution?: string;
  bodyPart: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  category: 'Strength' | 'Cardio' | 'Mobility' | 'Flexibility';
  sets: WorkoutSet[];
  reps?: number; // recommended repetitions per set
  duration?: number; // typical time in seconds
  restTime?: number; // rest between sets in seconds
  caloriesBurned?: number; // estimated calories per set/session
  videoUrl?: string; // demo/tutorial video link
  imageUrl?: string; // form reference image
  musclesTargeted?: string[]; // primary and secondary muscles
  tips?: string; // form and efficiency advice
  contraindications?: string; // warnings/limitations
  recommendedWeight?: number; // default weight in kg for sets
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Workout Program Type
export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  duration: number; // in weeks
  workoutIds: string[];
  targetAudience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// User Preferences Type
export interface UserPreferences {
  notifications: {
    progressUpdates: boolean;
    workoutReminders: boolean;
    achievements: boolean;
  };
  units: 'metric' | 'imperial';
}

// Health Profile Type
export interface HealthProfile {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  fitnessGoals: string;
  updatedAt: string | any; // Firestore timestamp
}

// Weekly Stats Type
export interface WeeklyStats {
  exercisesCompleted: number;
  totalTime: string; // format: "0h 0m"
  caloriesBurned: number;
  weekStartDate: string | any; // Firestore timestamp
}

// User Type (Updated to match actual Firestore structure)
export interface User {
  uid: string; // Firebase UID (document ID)
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string | any; // Firestore timestamp
  updatedAt: string | any; // Firestore timestamp
  preferences: UserPreferences;
  healthProfile: HealthProfile;
  weeklyStats: WeeklyStats;
  subscription?: SubscriptionStatus; // Optional, for backward compatibility
  isAdmin?: boolean; // Optional, for backward compatibility
  id?: string; // Optional, for backward compatibility
  lastLogin?: string; // Optional, for backward compatibility
}

// Subscription Type
export interface SubscriptionStatus {
  plan: 'free' | 'basic' | 'premium';
  active: boolean;
  startDate: string;
  endDate?: string;
}

// Activity Log Type
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  workoutId?: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Onboarding Image Type
export interface OnboardingImage {
  id: string;
  order: number;
  title: string;
  description: string;
  imageUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Analytics Type
export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalWorkouts: number;
  completedWorkouts: number;
  totalPrograms: number;
  activeSubscriptions: number;
  newUsersToday: number;
  date: string;
}

// Upload History Type
export interface UploadHistory {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  timestamp: string;
  status: 'success' | 'failed';
  recordsProcessed?: number;
  errorMessage?: string;
}

// Exercise Type (reusable exercise library)
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  category: 'Strength' | 'Cardio' | 'Flexibility' | 'Balance';
  equipment: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  preparation: string;
  execution: string;
  imageUrl?: string; // GIF/image URL from CSV
  gender?: 'Male' | 'Female' | 'Unisex'; // Target gender
  primaryMuscles?: string[]; // Muscles targeted (from CSV "Target")
  secondaryMuscles?: string[]; // Secondary muscles (from CSV "Synergist")
  createdAt?: string;
  updatedAt?: string;
}

// Workout Exercise (Exercise with sets configuration)
export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

// Workout Session Set (tracks actual performance)
export interface WorkoutSessionSet {
  id: string;
  reps: number;
  weight: number;
  status: 'pending' | 'completed' | 'skipped';
  completedAt?: string;
  notes?: string;
}

// Workout Session Exercise (Exercise within a session)
export interface WorkoutSessionExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSessionSet[];
}

// Workout Session (tracks user's workout execution)
export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  workoutName: string;
  exercises: WorkoutSessionExercise[];
  startedAt: string;
  completedAt?: string;
  totalTime?: string; // "45m 30s"
  caloriesBurned?: number;
  notes?: string;
  status: 'in-progress' | 'completed' | 'abandoned';
}

// Exercise Card (groups of workouts like "Warm Up" or "Super Set")
export interface ExerciseCard {
  id: string;
  name: string; // "Warm Up", "Super Set", etc.
  description: string;
  workoutIds: string[]; // array of workout IDs
  order: number; // control display order on homepage
  imageUrl?: string;
  color?: string; // hex color for card styling
  estimatedMinutes?: number; // total estimated duration in minutes
  createdAt?: string;
  updatedAt?: string;
}
