import { NextRequest, NextResponse } from 'next/server';
import {
  getAllExerciseCards,
  getExerciseCardById,
  createExerciseCard,
  updateExerciseCard,
  deleteExerciseCard,
} from '@/lib/firestore';
import { ExerciseCard } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const card = await getExerciseCardById(id);
      if (!card) {
        return NextResponse.json({ error: 'Exercise card not found' }, { status: 404 });
      }
      return NextResponse.json(card);
    }

    const cards = await getAllExerciseCards();
    return NextResponse.json(cards);
  } catch (error: any) {
    console.error('Exercise cards GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, workoutIds, order, imageUrl, color } = body;

    if (!name || !description || !workoutIds || order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const card: ExerciseCard = {
      id: cardId,
      name,
      description,
      workoutIds,
      order,
      imageUrl,
      color,
    };

    await createExerciseCard(card);
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    console.error('Exercise cards POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
    }

    await updateExerciseCard(id, data);
    const updated = await getExerciseCardById(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Exercise cards PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
    }

    await deleteExerciseCard(id);
    return NextResponse.json({ message: 'Exercise card deleted' });
  } catch (error: any) {
    console.error('Exercise cards DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
