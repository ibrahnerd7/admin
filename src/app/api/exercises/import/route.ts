import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { validateExerciseCSV } from '@/lib/validation';
import { Workout } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvData, importType } = body;

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json(
        { error: 'Invalid CSV data provided' },
        { status: 400 }
      );
    }

    // Validate CSV data
    const validation = validateExerciseCSV(csvData);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
          validationErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    const exercises = validation.processedData || [];
    const workoutsCollection = collection(firestore, 'workouts');

    let successCount = 0;
    let failureCount = 0;
    let updatedCount = 0;
    const createdIds: string[] = [];
    const updatedIds: string[] = [];

    // Import exercises as workouts - create or update if exists
    for (const exercise of exercises) {
      try {
        // Check if workout with same name already exists
        const q = query(workoutsCollection, where('name', '==', exercise.name));
        const snapshot = await getDocs(q);

        if (snapshot.size > 0) {
          // Workout exists - update it
          const existingDoc = snapshot.docs[0];
          await updateDoc(doc(firestore, 'workouts', existingDoc.id), {
            ...exercise,
            updatedAt: Timestamp.now(),
          });
          updatedIds.push(existingDoc.id);
          updatedCount++;
        } else {
          // Workout doesn't exist - create it
          const docRef = await addDoc(workoutsCollection, {
            ...exercise,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          createdIds.push(docRef.id);
          successCount++;
        }
      } catch (error) {
        failureCount++;
        console.error(`Failed to import exercise: ${exercise.name}`, error);
      }
    }

    // Log import history
    try {
      const uploadsCollection = collection(firestore, 'uploads');
      await addDoc(uploadsCollection, {
        fileName: `exercises_import_${Date.now()}.csv`,
        fileSize: JSON.stringify(exercises).length,
        uploadedBy: 'admin',
        uploadedAt: Timestamp.now(),
        timestamp: new Date().toISOString(),
        status: failureCount === 0 ? 'success' : 'partial',
        recordsProcessed: exercises.length,
        recordsCreated: successCount,
        recordsUpdated: updatedCount,
        recordsFailed: failureCount,
        type: 'workout',
      });
    } catch (error) {
      console.error('Failed to log upload history:', error);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully imported ${successCount} exercises, updated ${updatedCount}${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
        data: {
          createdCount: successCount,
          updatedCount,
          failureCount,
          totalCount: exercises.length,
          createdIds,
          updatedIds,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Exercise import error:', error);
    return NextResponse.json(
      {
        error: 'Failed to import exercises',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
