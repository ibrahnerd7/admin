import { NextRequest, NextResponse } from 'next/server';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  createUser,
} from '@/lib/firestore';
import { User, SubscriptionStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const id = searchParams.get('id'); // Support legacy id param
    const email = searchParams.get('email');

    const userId = uid || id;

    if (userId) {
      const user = await getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    if (email) {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, displayName, preferences, healthProfile, weeklyStats } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'User UID and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserById(uid);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const newUser: User = {
      uid,
      email,
      displayName: displayName || 'User',
      photoURL: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: preferences || {
        notifications: {
          progressUpdates: true,
          workoutReminders: true,
          achievements: true,
        },
        units: 'metric',
      },
      healthProfile: healthProfile || {
        age: 0,
        height: 0,
        weight: 0,
        activityLevel: 'Moderate',
        fitnessGoals: '',
        updatedAt: new Date().toISOString(),
      },
      weeklyStats: weeklyStats || {
        exercisesCompleted: 0,
        totalTime: '0h 0m',
        caloriesBurned: 0,
        weekStartDate: new Date().toISOString(),
      },
    };

    await createUser(newUser);

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Users POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, ...data } = body;

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    const user = await getUserById(uid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate updatable fields
    const updatableFields = ['displayName', 'photoURL', 'preferences', 'healthProfile', 'weeklyStats'];
    const filteredData: Record<string, any> = {};

    updatableFields.forEach((field) => {
      if (field in data) {
        filteredData[field] = data[field];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    await updateUser(uid, filteredData);

    const updatedUser = await getUserById(uid);
    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Users PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const id = searchParams.get('id'); // Support legacy id param

    const userId = uid || id;

    if (!userId) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Users DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
