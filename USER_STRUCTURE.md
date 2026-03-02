# Updated User Structure Documentation

## Overview
The User schema has been updated to match your actual Firestore structure with comprehensive health, preferences, and activity tracking.

---

## User Type Structure

```typescript
interface User {
  uid: string;                    // Firebase UID (document ID)
  email: string;                  // User email
  displayName: string;            // User's display name
  photoURL?: string;              // Profile photo URL
  createdAt: string | any;        // Account creation timestamp
  updatedAt: string | any;        // Last update timestamp
  preferences: UserPreferences;   // App preferences
  healthProfile: HealthProfile;   // Health and fitness info
  weeklyStats: WeeklyStats;       // Weekly activity statistics
}
```

---

## User Preferences

```typescript
interface UserPreferences {
  notifications: {
    progressUpdates: boolean;     // Get progress notifications
    workoutReminders: boolean;    // Get workout reminder notifications
    achievements: boolean;        // Get achievement notifications
  };
  units: 'metric' | 'imperial';   // Preferred measurement units
}
```

**Default Values:**
```json
{
  "notifications": {
    "progressUpdates": true,
    "workoutReminders": true,
    "achievements": true
  },
  "units": "metric"
}
```

---

## Health Profile

```typescript
interface HealthProfile {
  age: number;                              // Age in years
  height: number;                           // Height in cm
  weight: number;                           // Weight in kg
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  fitnessGoals: string;                     // e.g., "Weight Loss", "Muscle Gain"
  updatedAt: string | any;                  // Last update timestamp
}
```

**Activity Levels:**
- `Sedentary` - Little or no exercise
- `Light` - 1-3 days/week light exercise
- `Moderate` - 3-5 days/week moderate exercise
- `Active` - 6-7 days/week intense exercise
- `Very Active` - Physical job or intense training

**Fitness Goals Examples:**
- Weight Loss
- Muscle Gain
- General Fitness
- Strength Building
- Endurance
- Flexibility

---

## Weekly Stats

```typescript
interface WeeklyStats {
  exercisesCompleted: number;     // Number of workouts completed this week
  totalTime: string;              // Total workout time (format: "0h 0m")
  caloriesBurned: number;         // Estimated calories burned
  weekStartDate: string | any;    // Week start date timestamp
}
```

---

## Example User Document

```json
{
  "uid": "2ZaKtqLPH0fUdHl0lW497WsMYkp1",
  "email": "newme@gmail.com",
  "displayName": "New Me",
  "photoURL": "",
  "createdAt": "2024-01-20T10:15:39.709Z",
  "updatedAt": "2025-01-09T13:28:37.108Z",
  "preferences": {
    "notifications": {
      "progressUpdates": true,
      "workoutReminders": true,
      "achievements": true
    },
    "units": "metric"
  },
  "healthProfile": {
    "age": 25,
    "height": 100,
    "weight": 80,
    "activityLevel": "Moderate",
    "fitnessGoals": "Weight Loss",
    "updatedAt": "2024-01-20T10:16:51.912Z"
  },
  "weeklyStats": {
    "exercisesCompleted": 5,
    "totalTime": "2h 30m",
    "caloriesBurned": 1500,
    "weekStartDate": "2025-01-06T10:15:39.709Z"
  }
}
```

---

## API Endpoints

### Get All Users
```bash
GET /api/users
```

**Response:**
```json
[
  {
    "uid": "user1",
    "email": "user1@example.com",
    "displayName": "User One",
    ...
  },
  {
    "uid": "user2",
    "email": "user2@example.com",
    "displayName": "User Two",
    ...
  }
]
```

---

### Get User by UID
```bash
GET /api/users?uid=2ZaKtqLPH0fUdHl0lW497WsMYkp1
```

**Legacy Support:**
```bash
GET /api/users?id=2ZaKtqLPH0fUdHl0lW497WsMYkp1
```

---

### Get User by Email
```bash
GET /api/users?email=newme@gmail.com
```

---

### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "uid": "firebase-uid-here",
  "email": "user@example.com",
  "displayName": "User Name",
  "preferences": {
    "notifications": {
      "progressUpdates": true,
      "workoutReminders": true,
      "achievements": true
    },
    "units": "metric"
  },
  "healthProfile": {
    "age": 25,
    "height": 180,
    "weight": 75,
    "activityLevel": "Moderate",
    "fitnessGoals": "Weight Loss"
  },
  "weeklyStats": {
    "exercisesCompleted": 0,
    "totalTime": "0h 0m",
    "caloriesBurned": 0,
    "weekStartDate": "2025-01-09T00:00:00Z"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "user": { ...user object... }
}
```

---

### Update User
```bash
PUT /api/users
Content-Type: application/json

{
  "uid": "2ZaKtqLPH0fUdHl0lW497WsMYkp1",
  "displayName": "Updated Name",
  "healthProfile": {
    "age": 26,
    "height": 180,
    "weight": 70,
    "activityLevel": "Active",
    "fitnessGoals": "Muscle Gain"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { ...updated user object... }
}
```

---

### Delete User
```bash
DELETE /api/users?uid=2ZaKtqLPH0fUdHl0lW497WsMYkp1
```

**Legacy Support:**
```bash
DELETE /api/users?id=2ZaKtqLPH0fUdHl0lW497WsMYkp1
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Dashboard Updates

The Users page now displays:
- **Total Users** - Total registered users
- **Active This Week** - Users with exercises completed this week
- **Weight Loss Goal** - Users with weight loss as their fitness goal
- **Metric Users** - Users preferring metric units

**Table Columns:**
- Name (displayName)
- Email
- Age
- Fitness Goal
- Weekly Exercises (exercisesCompleted)
- Created At
- Actions (view, delete)

---

## Creating a User on Signup

When a user signs up via `/signup`, they are automatically created with:

```typescript
const newUser: User = {
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: displayName || 'User',
  photoURL: '',
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
```

Users can later update their health profile and preferences through the app.

---

## Firestore Collection Structure

**Path:** `/users/{uid}`

```
/users
├── {uid1}
│   ├── uid: string
│   ├── email: string
│   ├── displayName: string
│   ├── photoURL: string
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   ├── preferences: object
│   │   ├── notifications: object
│   │   └── units: string
│   ├── healthProfile: object
│   │   ├── age: number
│   │   ├── height: number
│   │   ├── weight: number
│   │   ├── activityLevel: string
│   │   ├── fitnessGoals: string
│   │   └── updatedAt: timestamp
│   └── weeklyStats: object
│       ├── exercisesCompleted: number
│       ├── totalTime: string
│       ├── caloriesBurned: number
│       └── weekStartDate: timestamp
└── {uid2}
    └── ...
```

---

## Backward Compatibility

The User type still supports optional legacy fields for backward compatibility:

```typescript
interface User {
  // ... new fields ...
  
  // Legacy fields (optional)
  subscription?: SubscriptionStatus;
  isAdmin?: boolean;
  id?: string;
  lastLogin?: string;
}
```

This allows old code to continue working with the new structure.

---

## Migration from Old Structure

If migrating existing users from the old structure:

```bash
# Old structure
{
  "id": "user123",
  "email": "user@example.com",
  "displayName": "User",
  "createdAt": "2024-01-01T00:00:00Z",
  "subscription": { "plan": "free", ... },
  "isAdmin": false
}

# New structure
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "displayName": "User",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2025-01-09T00:00:00Z",
  "preferences": { ... },
  "healthProfile": { ... },
  "weeklyStats": { ... }
}
```

---

## Database Rules

**Development (Test Mode):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Production:**
```json
{
  "rules": {
    "users/{uid}": {
      ".read": "request.auth.uid == uid || userIsAdmin()",
      ".write": "request.auth.uid == uid || userIsAdmin()",
      "healthProfile": {
        ".read": "request.auth.uid == uid || userIsAdmin()",
        ".write": "request.auth.uid == uid"
      }
    }
  }
}
```

---

## Summary

✅ User structure now includes:
- Health profile (age, height, weight, activity level, fitness goals)
- User preferences (notifications, units)
- Weekly statistics (exercises, time, calories)
- Profile information (photo, display name)

✅ API routes updated for new structure
✅ Dashboard displays new user metrics
✅ Backward compatible with legacy code
✅ Better health tracking capabilities

**Update Date:** January 9, 2026
