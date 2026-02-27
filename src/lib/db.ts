import {
  ref,
  get,
  set,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  push,
  DatabaseReference,
} from 'firebase/database';
import { database } from './firebase';
import { Workout, User, WorkoutProgram, OnboardingImage, UploadHistory, Analytics } from '@/types';

// Generic database operations
export async function getFromDatabase<T>(path: string): Promise<T | null> {
  const dbRef = ref(database, path);
  const snapshot = await get(dbRef);
  return snapshot.exists() ? (snapshot.val() as T) : null;
}

export async function setInDatabase<T>(path: string, data: T): Promise<void> {
  const dbRef = ref(database, path);
  await set(dbRef, data);
}

export async function updateInDatabase(path: string, data: Record<string, any>): Promise<void> {
  const dbRef = ref(database, path);
  await update(dbRef, data);
}

export async function deleteFromDatabase(path: string): Promise<void> {
  const dbRef = ref(database, path);
  await remove(dbRef);
}

// Workout operations
export async function getAllWorkouts(): Promise<Workout[]> {
  const workouts = await getFromDatabase<Record<string, Workout>>('workouts');
  return workouts ? Object.values(workouts) : [];
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  return getFromDatabase<Workout>(`workouts/${id}`);
}

export async function createWorkout(workout: Workout): Promise<string> {
  const newRef = push(ref(database, 'workouts'));
  const id = newRef.key!;
  await set(newRef, { ...workout, id });
  return id;
}

export async function updateWorkout(id: string, data: Partial<Workout>): Promise<void> {
  await updateInDatabase(`workouts/${id}`, data);
}

export async function deleteWorkout(id: string): Promise<void> {
  await deleteFromDatabase(`workouts/${id}`);
}

export async function getWorkoutsByCategory(category: string): Promise<Workout[]> {
  const workouts = await getAllWorkouts();
  return workouts.filter((w) => w.category === category);
}

export async function getWorkoutsByBodyPart(bodyPart: string): Promise<Workout[]> {
  const workouts = await getAllWorkouts();
  return workouts.filter((w) => w.bodyPart === bodyPart);
}

// User operations
export async function getAllUsers(): Promise<User[]> {
  const users = await getFromDatabase<Record<string, User>>('users');
  return users ? Object.values(users) : [];
}

export async function getUserById(id: string): Promise<User | null> {
  return getFromDatabase<User>(`users/${id}`);
}

export async function createUser(user: User): Promise<void> {
  await setInDatabase(`users/${user.id}`, user);
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  await updateInDatabase(`users/${id}`, data);
}

export async function deleteUser(id: string): Promise<void> {
  await deleteFromDatabase(`users/${id}`);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers();
  return users.find((u) => u.email === email) || null;
}

// Workout Program operations
export async function getAllPrograms(): Promise<WorkoutProgram[]> {
  const programs = await getFromDatabase<Record<string, WorkoutProgram>>('programs');
  return programs ? Object.values(programs) : [];
}

export async function getProgramById(id: string): Promise<WorkoutProgram | null> {
  return getFromDatabase<WorkoutProgram>(`programs/${id}`);
}

export async function createProgram(program: WorkoutProgram): Promise<string> {
  const newRef = push(ref(database, 'programs'));
  const id = newRef.key!;
  await set(newRef, { ...program, id });
  return id;
}

export async function updateProgram(id: string, data: Partial<WorkoutProgram>): Promise<void> {
  await updateInDatabase(`programs/${id}`, data);
}

export async function deleteProgram(id: string): Promise<void> {
  await deleteFromDatabase(`programs/${id}`);
}

// Onboarding Image operations
export async function getAllOnboardingImages(): Promise<OnboardingImage[]> {
  const images = await getFromDatabase<Record<string, OnboardingImage>>('onboarding');
  return images ? Object.values(images).sort((a, b) => a.order - b.order) : [];
}

export async function createOnboardingImage(image: OnboardingImage): Promise<string> {
  const newRef = push(ref(database, 'onboarding'));
  const id = newRef.key!;
  await set(newRef, { ...image, id });
  return id;
}

export async function updateOnboardingImage(
  id: string,
  data: Partial<OnboardingImage>
): Promise<void> {
  await updateInDatabase(`onboarding/${id}`, data);
}

export async function deleteOnboardingImage(id: string): Promise<void> {
  await deleteFromDatabase(`onboarding/${id}`);
}

// Upload History operations
export async function getAllUploadHistory(): Promise<UploadHistory[]> {
  const history = await getFromDatabase<Record<string, UploadHistory>>('uploadHistory');
  return history ? Object.values(history).reverse() : [];
}

export async function createUploadHistory(record: UploadHistory): Promise<string> {
  const newRef = push(ref(database, 'uploadHistory'));
  const id = newRef.key!;
  await set(newRef, { ...record, id });
  return id;
}

// Analytics operations
export async function getAnalytics(date?: string): Promise<Analytics | null> {
  const analyticsDate = date || new Date().toISOString().split('T')[0];
  return getFromDatabase<Analytics>(`analytics/${analyticsDate}`);
}

export async function updateAnalytics(date: string, data: Partial<Analytics>): Promise<void> {
  await updateInDatabase(`analytics/${date}`, data);
}

export async function getAnalyticsHistory(days: number = 30): Promise<Analytics[]> {
  const analytics = await getFromDatabase<Record<string, Analytics>>('analytics');
  if (!analytics) return [];

  const sortedDates = Object.keys(analytics)
    .sort()
    .reverse()
    .slice(0, days);

  return sortedDates.map((date) => analytics[date]);
}
