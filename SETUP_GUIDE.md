# 🔧 Setup & Configuration Guide

## Prerequisites

Before running the application, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Firebase project created
- Environment variables configured

---

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Enter project name and create

### 2. Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get Started"
3. Enable Email/Password authentication
4. Set password requirements (if desired)

### 3. Create Realtime Database
1. In Firebase Console → Realtime Database
2. Click "Create Database"
3. Choose location
4. Start in test mode (development only)
5. **For production:** Set up proper security rules

### 4. Enable Storage (Optional)
1. In Firebase Console → Storage
2. Click "Get Started"
3. Choose location

### 5. Get Firebase Config
1. Project Settings → General
2. Scroll to "Your apps"
3. Select web app (create if needed)
4. Copy Firebase config

---

## Environment Variables

Create `.env.local` in project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

### How to Find These Values

1. Go to Firebase Console
2. Project Settings → General
3. Under "Your apps" → Web app
4. Click on the config code block
5. Copy each value to `.env.local`

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",                          // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "myproject.firebaseapp.com",      // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  databaseURL: "https://myproject.firebaseio.com", // NEXT_PUBLIC_FIREBASE_DATABASE_URL
  projectId: "myproject",                        // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "myproject.appspot.com",       // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",                // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123",              // NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-ABC123"                      // NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

---

## Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

---

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## Firebase Security Rules

### Development (Test Mode)
⚠️ **Not for production!** Allows all reads/writes.

### Production (Recommended)

#### Authentication Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child($uid).child('isAdmin').val() === true",
        ".write": "$uid === auth.uid || root.child('users').child($uid).child('isAdmin').val() === true",
        "email": {
          ".read": true,
          ".write": false
        },
        "isAdmin": {
          ".write": false
        }
      }
    },
    "workouts": {
      ".read": "auth !== null",
      ".write": "auth !== null"
    },
    "programs": {
      ".read": "auth !== null",
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "onboarding": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "analytics": {
      ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    },
    "uploadHistory": {
      ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    }
  }
}
```

### To Update Rules:
1. Firebase Console → Realtime Database → Rules
2. Paste rules above
3. Click "Publish"

---

## Initial Data Setup

### Create Admin User

After Firebase is configured, create an admin user by:

#### Method 1: Firebase Console
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter admin email and password
4. Click "Add user"

Then via API:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ADMIN_UID",
    "email": "admin@example.com",
    "displayName": "Admin",
    "isAdmin": true,
    "subscription": {
      "plan": "premium",
      "active": true,
      "startDate": "2026-01-09"
    }
  }'
```

Replace `ADMIN_UID` with the Firebase UID of the user.

#### Method 2: Through Signup
1. Go to `/signup`
2. Create account
3. Update user in Firebase to set `isAdmin: true`

---

## Database Initialization

### Auto-initialization
Databases initialize automatically on first API call.

### Manual Initialization
If needed, create base paths:

```javascript
// In Firebase Console Realtime Database
/users = {}
/workouts = {}
/programs = {}
/onboarding = []
/analytics = {}
/uploadHistory = []
```

---

## Testing Signup/Login

### 1. Test Signup
```bash
# Navigate to signup page
http://localhost:3000/signup

# Or test via API
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signup",
    "email": "testuser@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "displayName": "Test User"
  }'
```

### 2. Test Login
```bash
# Navigate to login page
http://localhost:3000/login

# Enter email and password from signup
```

### 3. Test Password Reset
```bash
# Navigate to forgot password page
http://localhost:3000/forgot-password

# Enter email address
# Check email for reset link
```

---

## Troubleshooting

### Connection Issues

**Error:** "Cannot read properties of undefined"
- Check `.env.local` has all Firebase variables
- Ensure Firebase project is active
- Verify Realtime Database is enabled

**Error:** "Permission denied"
- Check Firebase Security Rules
- Ensure user is authenticated
- For development, use test mode rules

### Authentication Issues

**Error:** "auth/invalid-email"
- Email format is invalid
- Check email address format

**Error:** "auth/user-not-found"
- User doesn't exist in Firebase
- Check email spelling

**Error:** "auth/wrong-password"
- Password is incorrect
- Try "Forgot password" flow

### CORS Issues

**Error:** "CORS policy: No 'Access-Control-Allow-Origin'"
- Ensure API calls go through Next.js `/api` routes
- Don't call Firebase directly from browser in production

---

## Performance Tips

### 1. Database Queries
- Use query parameters to filter results
- Example: `/api/workouts?bodyPart=chest`

### 2. Pagination
- For large user/workout lists, implement pagination
- Limit results in API response

### 3. Caching
- Use browser cache for read-heavy operations
- Implement Redis for backend caching

### 4. Database Indexes
- Add indexes for frequently queried fields:
  - `users.email`
  - `workouts.bodyPart`
  - `workouts.category`

---

## Monitoring

### Firebase Console
Monitor app health:
- Usage reports
- Authentication metrics
- Database size
- Storage usage

### Application Logs
```javascript
// Server logs available in terminal
npm run dev  // Shows API logs
```

---

## Deployment

### Prerequisites
- GitHub account (for GitHub integration)
- Firebase hosting enabled
- Environment variables configured

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build project
npm run build

# Deploy
firebase deploy
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

## Backup & Recovery

### Backup Realtime Database
1. Firebase Console → Realtime Database → Backups
2. Click "Create backup"
3. Choose backup retention

### Export Data
```bash
firebase database:get / --pretty > backup.json
```

### Restore Data
```bash
firebase database:set / < backup.json
```

---

## Security Checklist

- [ ] Set strong `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] Enable production Security Rules
- [ ] Set password requirements in Firebase
- [ ] Enable email verification (optional)
- [ ] Enable two-factor authentication (optional)
- [ ] Set up account lockout policy
- [ ] Monitor failed login attempts
- [ ] Regularly backup database
- [ ] Use HTTPS for all connections
- [ ] Rotate secrets periodically

---

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)

---

**Last Updated:** January 9, 2026
