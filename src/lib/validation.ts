import { Workout, WorkoutSet, Exercise } from '@/types';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateWorkout(workout: Partial<Workout>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!workout.name || workout.name.trim() === '') {
    errors.push('Workout name is required');
  }
  if (!workout.bodyPart || workout.bodyPart.trim() === '') {
    errors.push('Body part is required');
  }
  if (!workout.category || workout.category.trim() === '') {
    errors.push('Category is required');
  }
  if (!workout.level) {
    errors.push('Level is required');
  }
  if (!workout.equipment || workout.equipment.trim() === '') {
    errors.push('Equipment is required');
  }
  if (!workout.sets || workout.sets.length === 0) {
    errors.push('At least one set is required');
  } else {
    workout.sets.forEach((set, index) => {
      if (!set.numberOfReps || set.numberOfReps <= 0) {
        errors.push(`Set ${index + 1}: Number of reps must be greater than 0`);
      }
      if (set.weight < 0) {
        errors.push(`Set ${index + 1}: Weight cannot be negative`);
      }
    });
  }
  if (workout.duration && workout.duration < 0) {
    errors.push('Duration cannot be negative');
  }
  if (workout.restTime && workout.restTime < 0) {
    errors.push('Rest time cannot be negative');
  }
  if (workout.caloriesBurned && workout.caloriesBurned < 0) {
    errors.push('Calories burned cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateWorkoutSet(set: Partial<WorkoutSet>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!set.numberOfReps || set.numberOfReps <= 0) {
    errors.push('Number of reps must be greater than 0');
  }
  if (set.weight && set.weight < 0) {
    errors.push('Weight cannot be negative');
  }
  if (!set.status || !['pending', 'completed', 'skipped'].includes(set.status)) {
    errors.push('Invalid status');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCSVWorkoutData(
  data: any[]
): { valid: boolean; errors: string[]; processedData?: Workout[] } {
  const errors: string[] = [];
  const processedData: Workout[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push('CSV must contain at least one row');
    return { valid: false, errors };
  }

  data.forEach((row, index) => {
    const workout: Partial<Workout> = {
      id: String(index + 1),
      name: row.name,
      bodyPart: row.bodyPart,
      category: row.category,
      level: row.level || 'Beginner',
      equipment: row.equipment || 'None',
      preparation: row.preparation,
      execution: row.execution,
      sets: [
        {
          id: '1',
          numberOfReps: parseInt(row.numberOfReps) || 10,
          weight: parseInt(row.weight) || 0,
          status: 'pending' as const,
        },
      ],
    };

    const validation = validateWorkout(workout);
    if (!validation.valid) {
      errors.push(`Row ${index + 1}: ${validation.errors.join(', ')}`);
    } else {
      processedData.push(workout as Workout);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    processedData: errors.length === 0 ? processedData : undefined,
  };
}

// Validate CSV Exercise data from Google Sheets
export function validateExerciseCSV(data: any[]): { valid: boolean; errors: string[]; processedData?: Exercise[]; skippedCount?: number } {
  const errors: string[] = [];
  const processedData: Exercise[] = [];
  let skippedCount = 0;

  if (!Array.isArray(data) || data.length === 0) {
    errors.push('CSV must contain at least one row');
    return { valid: false, errors };
  }

  // Map exercise types to valid categories
  const categoryMap: Record<string, 'Strength' | 'Cardio' | 'Flexibility' | 'Balance'> = {
    'Strength': 'Strength',
    'Cardio': 'Cardio',
    'Mobility': 'Balance',
    'Flexibility': 'Flexibility',
    'Balance': 'Balance',
  };

  data.forEach((row, index) => {
    const errors_row: string[] = [];

    // Check for GIF Link first - skip if missing
    if (!row['GIF Link'] || row['GIF Link'].trim() === '') {
      skippedCount++;
      return;
    }

    // Required fields
    if (!row.Name || row.Name.trim() === '') {
      errors_row.push('Name is required');
    }
    if (!row.BodyPart || row.BodyPart.trim() === '') {
      errors_row.push('BodyPart is required');
    }
    if (!row.Equipment || row.Equipment.trim() === '') {
      errors_row.push('Equipment is required');
    }

    if (errors_row.length > 0) {
      errors.push(`Row ${index + 1}: ${errors_row.join(', ')}`);
      return;
    }

    // Normalize exercise type to category
    const exerciseType = (row['Exercise type'] || 'Strength').trim();
    const category = categoryMap[exerciseType] || 'Strength';

    // Parse muscle groups (comma-separated strings to arrays)
    const primaryMuscles = row.Target
      ? row.Target.split(',').map((m: string) => m.trim()).filter((m: string) => m)
      : [];
    
    const secondaryMuscles = row.Synergist
      ? row.Synergist.split(',').map((m: string) => m.trim()).filter((m: string) => m)
      : [];

    const exercise: Exercise = {
      id: `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: row.Name.trim(),
      bodyPart: row.BodyPart.trim(),
      equipment: row.Equipment.trim(),
      category,
      level: 'Beginner', // Default level (can be customized later)
      preparation: '', // Empty (can be filled manually)
      execution: '', // Empty (can be filled manually)
      imageUrl: row['GIF Link'].trim(),
      gender: (row.Gender || 'Unisex').trim() as 'Male' | 'Female' | 'Unisex',
      primaryMuscles,
      secondaryMuscles,
      createdAt: new Date().toISOString(),
    };

    processedData.push(exercise);
  });

  return {
    valid: errors.length === 0 && processedData.length > 0,
    errors,
    processedData: errors.length === 0 ? processedData : undefined,
    skippedCount,
  };
}
