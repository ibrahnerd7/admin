import { NextRequest, NextResponse } from 'next/server';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutsByCategory,
  getWorkoutsByBodyPart,
} from '@/lib/firestore';
import { validateWorkout } from '@/lib/validation';
import { Workout } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const bodyPart = searchParams.get('bodyPart');

    if (id) {
      const workout = await getWorkoutById(id);
      if (!workout) {
        return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
      }
      return NextResponse.json(workout);
    }

    if (category) {
      const workouts = await getWorkoutsByCategory(category);
      return NextResponse.json(workouts);
    }

    if (bodyPart) {
      const workouts = await getWorkoutsByBodyPart(bodyPart);
      return NextResponse.json(workouts);
    }

    const workouts = await getAllWorkouts();
    return NextResponse.json(workouts);
  } catch (error: any) {
    console.error('Workouts GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validation = validateWorkout(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Add timestamps and default values
    const workout: Workout = {
      ...body,
      id: body.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'admin',
    };

    const id = await createWorkout(workout);
    return NextResponse.json(
      { success: true, id, workout: { ...workout, id } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Workouts POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 });
    }

    // Check if workout exists
    const workout = await getWorkoutById(id);
    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    // Validate if updating full workout data
    if (data.name || data.bodyPart || data.category || data.level || data.equipment || data.sets) {
      const updatedWorkout = { ...workout, ...data };
      const validation = validateWorkout(updatedWorkout);
      if (!validation.valid) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.errors },
          { status: 400 }
        );
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await updateWorkout(id, updateData);

    const updatedWorkout = await getWorkoutById(id);
    return NextResponse.json({
      success: true,
      workout: updatedWorkout,
    });
  } catch (error: any) {
    console.error('Workouts PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 });
    }

    const workout = await getWorkoutById(id);
    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    await deleteWorkout(id);
    return NextResponse.json({
      success: true,
      message: 'Workout deleted successfully',
    });
  } catch (error: any) {
    console.error('Workouts DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
