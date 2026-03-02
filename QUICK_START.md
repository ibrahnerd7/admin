# Quick Start Guide - Authentication & CRUD Implementation

## 🚀 What's New

Your admin dashboard now has complete authentication and CRUD functionality:

### Authentication
- ✅ **Login** - Sign in with email/password
- ✅ **Signup** - Create new accounts with strong password requirements
- ✅ **Forgot Password** - Reset password via email

### CRUD Operations
- ✅ **Users** - Create, read, update, delete user accounts
- ✅ **Workouts** - Create, read, update, delete workout exercises

---

## 📍 File Locations

### New Files Created
```
src/app/api/auth/route.ts              # Authentication endpoint
src/app/(auth)/signup/page.tsx         # Signup page
src/app/(auth)/forgot-password/page.tsx # Password reset page
```

### Modified Files
```
src/lib/auth.ts                    # Added signUp() and resetPassword()
src/lib/db.ts                      # Added deleteUser() and getUserByEmail()
src/app/api/users/route.ts         # Enhanced with full CRUD + DELETE
src/app/api/workouts/route.ts      # Enhanced with validation
src/app/(auth)/login/page.tsx      # Added links to signup and forgot password
```

---

## 🌐 Available Routes

### Authentication Routes
| Route | Type | Purpose |
|-------|------|---------|
| `/login` | GET | Login page |
| `/signup` | GET | Signup page |
| `/forgot-password` | GET | Password reset page |
| `/api/auth` | POST | Auth operations (signup, forgot password) |

### User Routes
| Route | Type | Query/Body | Purpose |
|-------|------|-----------|---------|
| `/api/users` | GET | - | List all users |
| `/api/users` | GET | `?id=userId` | Get specific user |
| `/api/users` | GET | `?email=user@email.com` | Find user by email |
| `/api/users` | POST | User object | Create new user |
| `/api/users` | PUT | User object with id | Update user |
| `/api/users` | DELETE | `?id=userId` | Delete user |

### Workout Routes
| Route | Type | Query/Body | Purpose |
|-------|------|-----------|---------|
| `/api/workouts` | GET | - | List all workouts |
| `/api/workouts` | GET | `?id=workoutId` | Get specific workout |
| `/api/workouts` | GET | `?category=chest` | Filter by category |
| `/api/workouts` | GET | `?bodyPart=chest` | Filter by body part |
| `/api/workouts` | POST | Workout object | Create workout |
| `/api/workouts` | PUT | Workout object with id | Update workout |
| `/api/workouts` | DELETE | `?id=workoutId` | Delete workout |

---

## 💻 API Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signup",
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "displayName": "John Doe"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "forgotPassword",
    "email": "user@example.com"
  }'
```

### Create User (Admin)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user123",
    "email": "user@example.com",
    "displayName": "John",
    "subscription": {
      "plan": "premium",
      "active": true,
      "startDate": "2026-01-09"
    }
  }'
```

### Get User by Email
```bash
curl http://localhost:3000/api/users?email=user@example.com
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user123",
    "displayName": "Jane Doe",
    "subscription": {
      "plan": "premium",
      "active": true,
      "startDate": "2026-01-09"
    }
  }'
```

### Create Workout
```bash
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Push-ups",
    "bodyPart": "Chest",
    "category": "Strength",
    "level": "Beginner",
    "equipment": "Body weight",
    "sets": [
      {
        "id": "set1",
        "numberOfReps": 10,
        "weight": 0,
        "status": "pending"
      }
    ],
    "createdBy": "admin"
  }'
```

### Get Workouts by Body Part
```bash
curl http://localhost:3000/api/workouts?bodyPart=chest
```

### Update Workout
```bash
curl -X PUT http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "id": "workout123",
    "name": "Push-ups Modified",
    "sets": [
      {
        "id": "set1",
        "numberOfReps": 15,
        "weight": 0,
        "status": "pending"
      }
    ]
  }'
```

### Delete Workout
```bash
curl -X DELETE "http://localhost:3000/api/workouts?id=workout123"
```

### Delete User
```bash
curl -X DELETE "http://localhost:3000/api/users?id=user123"
```

---

## 🔐 Password Requirements

When signing up, passwords must contain:
- ✓ At least 8 characters
- ✓ At least one uppercase letter (A-Z)
- ✓ At least one number (0-9)
- ✓ At least one special character (!@#$%^&*)

Example valid password: `MyPassword123!`

---

## 📊 User Subscription Levels

```typescript
interface SubscriptionStatus {
  plan: 'free' | 'basic' | 'premium'    // Tier
  active: boolean                         // Active status
  startDate: string                       // ISO string
  endDate?: string                        // ISO string (optional)
}
```

New users default to:
```json
{
  "plan": "free",
  "active": true,
  "startDate": "2026-01-09T..."
}
```

---

## 🔍 User Response Example

```json
{
  "id": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "createdAt": "2026-01-09T10:00:00.000Z",
  "lastLogin": "2026-01-09T10:30:00.000Z",
  "subscription": {
    "plan": "free",
    "active": true,
    "startDate": "2026-01-09T10:00:00.000Z"
  },
  "isAdmin": false
}
```

---

## 💡 Common Workflows

### Create a New Admin User
```javascript
// Via API
POST /api/users with {
  id: "admin_new",
  email: "admin@example.com",
  displayName: "Admin",
  isAdmin: true
}
```

### Upgrade User to Premium
```javascript
PUT /api/users with {
  id: "user123",
  subscription: {
    plan: "premium",
    active: true,
    startDate: "2026-01-09T..."
  }
}
```

### Add Workout to Database
```javascript
POST /api/workouts with {
  name: "Dumbbell Bench Press",
  bodyPart: "Chest",
  category: "Strength",
  level: "Intermediate",
  equipment: "Dumbbell",
  sets: [
    { id: "1", numberOfReps: 8, weight: 45, status: "pending" },
    { id: "2", numberOfReps: 8, weight: 45, status: "pending" },
    { id: "3", numberOfReps: 8, weight: 45, status: "pending" }
  ]
}
```

---

## 🛠️ Troubleshooting

### "User already exists"
- A user with that email is already registered
- Use `/api/users?email=...` to check
- Or try signing up with a different email

### "Password does not meet requirements"
- Password must be 8+ characters with uppercase, number, and special char
- Example: `SecurePass123!`

### "Workout validation failed"
- Check all required fields are provided
- Ensure at least one set exists
- Verify reps > 0 and weight >= 0

### "Cannot update email"
- Email cannot be changed via API for security
- User must verify with Firebase directly

---

## 🎯 Next Steps

1. **Test the flows**
   - Try signing up at `/signup`
   - Test login at `/login`
   - Try password reset at `/forgot-password`

2. **Create admin users**
   - Use POST `/api/users` to create admin accounts
   - Set `isAdmin: true`

3. **Populate workouts**
   - Add workout exercises via POST `/api/workouts`
   - Organize by body part and category

4. **Monitor users**
   - GET `/api/users` to see all registered users
   - Track subscriptions and activity

---

## 📝 Notes

- All timestamps use ISO 8601 format
- Firebase handles all password hashing securely
- Email confirmations sent automatically for password resets
- User IDs are Firebase UIDs (auto-generated on signup)
- Admin users can manage other users via API
- Workouts can be created by any authenticated user

---

For more details, see `IMPLEMENTATION_COMPLETE.md`
