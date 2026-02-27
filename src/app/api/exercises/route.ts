import { NextRequest, NextResponse } from 'next/server';
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getExercisesByBodyPart,
  getExercisesByCategory,
} from '@/lib/firestore';
import { Exercise } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const bodyPart = searchParams.get('bodyPart');
    const category = searchParams.get('category');

    if (id) {
      const exercise = await getExerciseById(id);
      if (!exercise) {
        return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
      }
      return NextResponse.json(exercise);
    }

    if (bodyPart) {
      const exercises = await getExercisesByBodyPart(bodyPart);
      return NextResponse.json(exercises);
    }

    if (category) {
      const exercises = await getExercisesByCategory(category);
      return NextResponse.json(exercises);
    }

    const exercises = await getAllExercises();
    return NextResponse.json(exercises);
  } catch (error: any) {
    console.error('Exercises GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bodyPart, category, equipment, level, preparation, execution } = body;

    if (!name || !bodyPart || !category || !equipment || !level || !preparation || !execution) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const exerciseId = `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exercise: Exercise = {
      id: exerciseId,
      name,
      bodyPart,
      category,
      equipment,
      level,
      preparation,
      execution,
    };

    const id = await createExercise(exercise);
    return NextResponse.json(exercise, { status: 201 });
  } catch (error: any) {
    console.error('Exercises POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID required' }, { status: 400 });
    }

    await updateExercise(id, data);
    const updated = await getExerciseById(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Exercises PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID required' }, { status: 400 });
    }

    await deleteExercise(id);
    return NextResponse.json({ message: 'Exercise deleted' });
  } catch (error: any) {
    console.error('Exercises DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
