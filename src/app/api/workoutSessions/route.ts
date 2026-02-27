import { NextRequest, NextResponse } from 'next/server';
import {
  getAllWorkoutSessions,
  getWorkoutSessionById,
  getWorkoutSessionsByUserId,
  createWorkoutSession,
  updateWorkoutSession,
  deleteWorkoutSession,
} from '@/lib/firestore';
import { WorkoutSession } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (id) {
      const session = await getWorkoutSessionById(id);
      if (!session) {
        return NextResponse.json({ error: 'Workout session not found' }, { status: 404 });
      }
      return NextResponse.json(session);
    }

    if (userId) {
      const sessions = await getWorkoutSessionsByUserId(userId);
      return NextResponse.json(sessions);
    }

    const sessions = await getAllWorkoutSessions();
    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Workout sessions GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, workoutId, workoutName, exercises } = body;

    if (!userId || !workoutId || !workoutName || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: WorkoutSession = {
      id: sessionId,
      userId,
      workoutId,
      workoutName,
      exercises,
      startedAt: new Date().toISOString(),
      status: 'in-progress',
    };

    const id = await createWorkoutSession(session);
    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    console.error('Workout sessions POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await updateWorkoutSession(id, data);
    const updated = await getWorkoutSessionById(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Workout sessions PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    await deleteWorkoutSession(id);
    return NextResponse.json({ message: 'Workout session deleted' });
  } catch (error: any) {
    console.error('Workout sessions DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
