import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const cardId = searchParams.get('cardId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If specific cardId requested, get exercises for that card
    if (cardId) {
      const exercisesRef = collection(
        firestore,
        'users',
        userId,
        'dailyExercises',
        cardId,
        'exercises'
      );

      const exercisesSnap = await getDocs(exercisesRef);
      const exercises = exercisesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        userId,
        cardId,
        exercises,
      });
    }

    // Otherwise, get all daily exercise cards for user
    const dailyExercisesRef = collection(firestore, 'users', userId, 'dailyExercises');
    const cardsSnap = await getDocs(dailyExercisesRef);

    const cards = await Promise.all(
      cardsSnap.docs.map(async (cardDoc) => {
        const exercisesRef = collection(
          firestore,
          'users',
          userId,
          'dailyExercises',
          cardDoc.id,
          'exercises'
        );
        const exercisesSnap = await getDocs(exercisesRef);
        const exercises = exercisesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return {
          id: cardDoc.id,
          ...cardDoc.data(),
          exerciseCount: exercises.length,
          exercises,
        };
      })
    );

    return NextResponse.json({
      userId,
      user: userDoc.data(),
      cards,
      totalCards: cards.length,
    });
  } catch (error: any) {
    console.error('Error fetching daily exercises:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch daily exercises' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const cardId = searchParams.get('cardId');
    const exerciseId = searchParams.get('exerciseId');

    if (!userId || !cardId || !exerciseId) {
      return NextResponse.json(
        { error: 'userId, cardId, and exerciseId are required' },
        { status: 400 }
      );
    }

    const exerciseRef = doc(
      firestore,
      'users',
      userId,
      'dailyExercises',
      cardId,
      'exercises',
      exerciseId
    );

    await deleteDoc(exerciseRef);

    return NextResponse.json(
      { message: 'Exercise deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete exercise' },
      { status: 500 }
    );
  }
}
