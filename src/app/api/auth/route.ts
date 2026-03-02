import { NextRequest, NextResponse } from 'next/server';
import { signUp, resetPassword } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';
import { validateEmail, validatePassword } from '@/lib/validation';
import { User, SubscriptionStatus } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'signup') {
      return handleSignup(body);
    } else if (action === 'forgotPassword') {
      return handleForgotPassword(body);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleSignup(body: any) {
  const { email, password, confirmPassword, displayName } = body;

  // Validation
  if (!email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: 'Email, password, and confirm password are required' },
      { status: 400 }
    );
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return NextResponse.json({ error: passwordValidation.errors.join(', ') }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
  }

  // Create Firebase user
  const firebaseUser = await signUp(email, password, displayName);

  // Create user in database
  const newUser: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || email,
    displayName: displayName || firebaseUser.displayName || 'User',
    photoURL: firebaseUser.photoURL || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      notifications: {
        progressUpdates: true,
        workoutReminders: true,
        achievements: true,
      },
      units: 'metric',
    },
    healthProfile: {
      age: 0,
      height: 0,
      weight: 0,
      activityLevel: 'Moderate',
      fitnessGoals: '',
      updatedAt: new Date().toISOString(),
    },
    weeklyStats: {
      exercisesCompleted: 0,
      totalTime: '0h 0m',
      caloriesBurned: 0,
      weekStartDate: new Date().toISOString(),
    },
  };

  await createUser(newUser);

  return NextResponse.json(
    {
      success: true,
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      },
    },
    { status: 201 }
  );
}

async function handleForgotPassword(body: any) {
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  try {
    await resetPassword(email);
    return NextResponse.json({
      success: true,
      message: 'Password reset email sent. Check your email for instructions.',
    });
  } catch (error: any) {
    // Firebase returns auth/user-not-found for non-existent users
    // We don't want to reveal whether an email is registered or not
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  }
}
