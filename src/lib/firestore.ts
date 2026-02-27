import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  QueryConstraint,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { Workout, User, WorkoutProgram, OnboardingImage, UploadHistory, Analytics, Exercise, WorkoutSession, ExerciseCard } from '@/types';

// ============================================================================
// USERS COLLECTION
// ============================================================================

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((doc) => doc.data() as User);
  } catch (error: any) {
    console.error('Error getting users:', error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const userRef = doc(firestore, 'users', id);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? (snapshot.data() as User) : null;
  } catch (error: any) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null;
  } catch (error: any) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function createUser(user: User): Promise<string> {
  try {
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return user.uid;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  try {
    const userRef = doc(firestore, 'users', id);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const userRef = doc(firestore, 'users', id);
    await deleteDoc(userRef);
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// ============================================================================
// WORKOUTS COLLECTION
// ============================================================================

export async function getAllWorkouts(): Promise<Workout[]> {
  try {
    const workoutsRef = collection(firestore, 'workouts');
    const snapshot = await getDocs(workoutsRef);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Workout));
  } catch (error: any) {
    console.error('Error getting workouts:', error);
    return [];
  }
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  try {
    const workoutRef = doc(firestore, 'workouts', id);
    const snapshot = await getDoc(workoutRef);
    return snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as Workout) : null;
  } catch (error: any) {
    console.error('Error getting workout by ID:', error);
    return null;
  }
}

export async function getWorkoutsByCategory(category: string): Promise<Workout[]> {
  try {
    const workoutsRef = collection(firestore, 'workouts');
    const q = query(workoutsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Workout));
  } catch (error: any) {
    console.error('Error getting workouts by category:', error);
    return [];
  }
}

export async function getWorkoutsByBodyPart(bodyPart: string): Promise<Workout[]> {
  try {
    const workoutsRef = collection(firestore, 'workouts');
    const q = query(workoutsRef, where('bodyPart', '==', bodyPart));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Workout));
  } catch (error: any) {
    console.error('Error getting workouts by body part:', error);
    return [];
  }
}

export async function createWorkout(workout: Workout): Promise<string> {
  try {
    const workoutRef = doc(firestore, 'workouts', workout.id);
    await setDoc(workoutRef, {
      ...workout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return workout.id;
  } catch (error: any) {
    console.error('Error creating workout:', error);
    throw error;
  }
}

export async function updateWorkout(id: string, data: Partial<Workout>): Promise<void> {
  try {
    const workoutRef = doc(firestore, 'workouts', id);
    await updateDoc(workoutRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating workout:', error);
    throw error;
  }
}

export async function deleteWorkout(id: string): Promise<void> {
  try {
    const workoutRef = doc(firestore, 'workouts', id);
    await deleteDoc(workoutRef);
  } catch (error: any) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}

// ============================================================================
// PROGRAMS COLLECTION (Keep for reference)
// ============================================================================

export async function getAllPrograms(): Promise<WorkoutProgram[]> {
  try {
    const programsRef = collection(firestore, 'programs');
    const snapshot = await getDocs(programsRef);
    return snapshot.docs.map((doc) => doc.data() as WorkoutProgram);
  } catch (error: any) {
    console.error('Error getting programs:', error);
    return [];
  }
}

export async function getProgramById(id: string): Promise<WorkoutProgram | null> {
  try {
    const programRef = doc(firestore, 'programs', id);
    const snapshot = await getDoc(programRef);
    return snapshot.exists() ? (snapshot.data() as WorkoutProgram) : null;
  } catch (error: any) {
    console.error('Error getting program by ID:', error);
    return null;
  }
}

export async function createProgram(program: WorkoutProgram): Promise<string> {
  try {
    const programRef = doc(firestore, 'programs', program.id);
    await setDoc(programRef, {
      ...program,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return program.id;
  } catch (error: any) {
    console.error('Error creating program:', error);
    throw error;
  }
}

export async function updateProgram(id: string, data: Partial<WorkoutProgram>): Promise<void> {
  try {
    const programRef = doc(firestore, 'programs', id);
    await updateDoc(programRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating program:', error);
    throw error;
  }
}

export async function deleteProgram(id: string): Promise<void> {
  try {
    const programRef = doc(firestore, 'programs', id);
    await deleteDoc(programRef);
  } catch (error: any) {
    console.error('Error deleting program:', error);
    throw error;
  }
}

// ============================================================================
// ONBOARDING IMAGES COLLECTION
// ============================================================================

export async function getAllOnboardingImages(): Promise<OnboardingImage[]> {
  try {
    const imagesRef = collection(firestore, 'onboarding');
    const snapshot = await getDocs(imagesRef);
    const images = snapshot.docs.map((doc) => doc.data() as OnboardingImage);
    return images.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error('Error getting onboarding images:', error);
    return [];
  }
}

export async function createOnboardingImage(image: OnboardingImage): Promise<string> {
  try {
    const imageRef = doc(firestore, 'onboarding', image.id);
    await setDoc(imageRef, {
      ...image,
      uploadedAt: new Date().toISOString(),
    });
    return image.id;
  } catch (error: any) {
    console.error('Error creating onboarding image:', error);
    throw error;
  }
}

export async function updateOnboardingImage(
  id: string,
  data: Partial<OnboardingImage>
): Promise<void> {
  try {
    const imageRef = doc(firestore, 'onboarding', id);
    await updateDoc(imageRef, data);
  } catch (error: any) {
    console.error('Error updating onboarding image:', error);
    throw error;
  }
}

export async function deleteOnboardingImage(id: string): Promise<void> {
  try {
    const imageRef = doc(firestore, 'onboarding', id);
    await deleteDoc(imageRef);
  } catch (error: any) {
    console.error('Error deleting onboarding image:', error);
    throw error;
  }
}

// ============================================================================
// UPLOAD HISTORY COLLECTION
// ============================================================================

export async function getAllUploadHistory(): Promise<UploadHistory[]> {
  try {
    const historyRef = collection(firestore, 'uploadHistory');
    const snapshot = await getDocs(historyRef);
    const history = snapshot.docs.map((doc) => doc.data() as UploadHistory);
    return history.reverse();
  } catch (error: any) {
    console.error('Error getting upload history:', error);
    return [];
  }
}

export async function createUploadHistory(record: UploadHistory): Promise<string> {
  try {
    const recordRef = doc(firestore, 'uploadHistory', record.id);
    await setDoc(recordRef, {
      ...record,
      timestamp: new Date().toISOString(),
    });
    return record.id;
  } catch (error: any) {
    console.error('Error creating upload history record:', error);
    throw error;
  }
}

// ============================================================================
// ANALYTICS COLLECTION
// ============================================================================

export async function getAnalytics(date?: string): Promise<Analytics | null> {
  try {
    const analyticsDate = date || new Date().toISOString().split('T')[0];
    const analyticsRef = doc(firestore, 'analytics', analyticsDate);
    const snapshot = await getDoc(analyticsRef);
    return snapshot.exists() ? (snapshot.data() as Analytics) : null;
  } catch (error: any) {
    console.error('Error getting analytics:', error);
    return null;
  }
}

export async function updateAnalytics(date: string, data: Partial<Analytics>): Promise<void> {
  try {
    const analyticsRef = doc(firestore, 'analytics', date);
    await updateDoc(analyticsRef, data);
  } catch (error: any) {
    console.error('Error updating analytics:', error);
    throw error;
  }
}

export async function getAnalyticsHistory(days: number = 30): Promise<Analytics[]> {
  try {
    const analyticsRef = collection(firestore, 'analytics');
    const snapshot = await getDocs(analyticsRef);
    const analytics = snapshot.docs.map((doc) => doc.data() as Analytics);
    return analytics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, days);
  } catch (error: any) {
    console.error('Error getting analytics history:', error);
    return [];
  }
}

// ============================================================================
// EXERCISES COLLECTION
// ============================================================================

export async function getAllExercises(): Promise<Exercise[]> {
  try {
    const exercisesRef = collection(firestore, 'exercises');
    const snapshot = await getDocs(exercisesRef);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Exercise));
  } catch (error: any) {
    console.error('Error getting exercises:', error);
    return [];
  }
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  try {
    const exerciseRef = doc(firestore, 'exercises', id);
    const snapshot = await getDoc(exerciseRef);
    return snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as Exercise) : null;
  } catch (error: any) {
    console.error('Error getting exercise by ID:', error);
    return null;
  }
}

export async function getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
  try {
    const exercisesRef = collection(firestore, 'exercises');
    const q = query(exercisesRef, where('bodyPart', '==', bodyPart));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Exercise));
  } catch (error: any) {
    console.error('Error getting exercises by body part:', error);
    return [];
  }
}

export async function getExercisesByCategory(category: string): Promise<Exercise[]> {
  try {
    const exercisesRef = collection(firestore, 'exercises');
    const q = query(exercisesRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as Exercise));
  } catch (error: any) {
    console.error('Error getting exercises by category:', error);
    return [];
  }
}

export async function createExercise(exercise: Exercise): Promise<string> {
  try {
    const exerciseRef = doc(firestore, 'exercises', exercise.id);
    await setDoc(exerciseRef, {
      ...exercise,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return exercise.id;
  } catch (error: any) {
    console.error('Error creating exercise:', error);
    throw error;
  }
}

export async function updateExercise(id: string, data: Partial<Exercise>): Promise<void> {
  try {
    const exerciseRef = doc(firestore, 'exercises', id);
    await updateDoc(exerciseRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating exercise:', error);
    throw error;
  }
}

export async function deleteExercise(id: string): Promise<void> {
  try {
    const exerciseRef = doc(firestore, 'exercises', id);
    await deleteDoc(exerciseRef);
  } catch (error: any) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
}

// ============================================================================
// WORKOUT SESSIONS COLLECTION
// ============================================================================

export async function getAllWorkoutSessions(): Promise<WorkoutSession[]> {
  try {
    const sessionsRef = collection(firestore, 'workoutSessions');
    const snapshot = await getDocs(sessionsRef);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as WorkoutSession));
  } catch (error: any) {
    console.error('Error getting workout sessions:', error);
    return [];
  }
}

export async function getWorkoutSessionById(id: string): Promise<WorkoutSession | null> {
  try {
    const sessionRef = doc(firestore, 'workoutSessions', id);
    const snapshot = await getDoc(sessionRef);
    return snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as WorkoutSession) : null;
  } catch (error: any) {
    console.error('Error getting workout session by ID:', error);
    return null;
  }
}

export async function getWorkoutSessionsByUserId(userId: string): Promise<WorkoutSession[]> {
  try {
    const sessionsRef = collection(firestore, 'workoutSessions');
    const q = query(sessionsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      } as WorkoutSession))
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  } catch (error: any) {
    console.error('Error getting workout sessions by user:', error);
    return [];
  }
}

export async function createWorkoutSession(session: WorkoutSession): Promise<string> {
  try {
    const sessionRef = doc(firestore, 'workoutSessions', session.id);
    await setDoc(sessionRef, {
      ...session,
      startedAt: new Date().toISOString(),
    });
    return session.id;
  } catch (error: any) {
    console.error('Error creating workout session:', error);
    throw error;
  }
}

export async function updateWorkoutSession(
  id: string,
  data: Partial<WorkoutSession>
): Promise<void> {
  try {
    const sessionRef = doc(firestore, 'workoutSessions', id);
    await updateDoc(sessionRef, data);
  } catch (error: any) {
    console.error('Error updating workout session:', error);
    throw error;
  }
}

export async function deleteWorkoutSession(id: string): Promise<void> {
  try {
    const sessionRef = doc(firestore, 'workoutSessions', id);
    await deleteDoc(sessionRef);
  } catch (error: any) {
    console.error('Error deleting workout session:', error);
    throw error;
  }
}

// ============================================================================
// EXERCISE CARDS COLLECTION (Warm Up, Super Set, etc.)
// ============================================================================

export async function getAllExerciseCards(): Promise<ExerciseCard[]> {
  try {
    const cardsRef = collection(firestore, 'exerciseCards');
    const q = query(cardsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as ExerciseCard));
  } catch (error: any) {
    console.error('Error getting exercise cards:', error);
    return [];
  }
}

export async function getExerciseCardById(id: string): Promise<ExerciseCard | null> {
  try {
    const cardRef = doc(firestore, 'exerciseCards', id);
    const snapshot = await getDoc(cardRef);
    return snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as ExerciseCard) : null;
  } catch (error: any) {
    console.error('Error getting exercise card by ID:', error);
    return null;
  }
}

export async function createExerciseCard(card: ExerciseCard): Promise<string> {
  try {
    const cardRef = doc(firestore, 'exerciseCards', card.id);
    await setDoc(cardRef, {
      ...card,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return card.id;
  } catch (error: any) {
    console.error('Error creating exercise card:', error);
    throw error;
  }
}

export async function updateExerciseCard(id: string, data: Partial<ExerciseCard>): Promise<void> {
  try {
    const cardRef = doc(firestore, 'exerciseCards', id);
    await updateDoc(cardRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating exercise card:', error);
    throw error;
  }
}

export async function deleteExerciseCard(id: string): Promise<void> {
  try {
    const cardRef = doc(firestore, 'exerciseCards', id);
    await deleteDoc(cardRef);
  } catch (error: any) {
    console.error('Error deleting exercise card:', error);
    throw error;
  }
}
