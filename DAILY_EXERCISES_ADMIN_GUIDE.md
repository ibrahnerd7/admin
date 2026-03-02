# Admin Daily Exercises Management Feature

## Overview
Admin dashboard feature to view and manage all users' daily exercise routines. This allows admins to:
- See all users and their created daily exercise cards
- View exercises in each card with full details (sets, reps, body part, etc.)
- Remove exercises from user routines
- Track exercise creation dates
- Search and filter users

## Architecture

### Database Structure
```
users/{userId}/
  └── dailyExercises/{cardId}/
      ├── name: string
      ├── description: string
      └── exercises/{exerciseId}/
          ├── workoutId: string
          ├── workoutName: string
          ├── bodyPart: string
          ├── level: string
          ├── sets: number
          ├── reps: number
          ├── equipment: string
          ├── order: number
          ├── createdAt: timestamp
          └── updatedAt: timestamp
```

## Files Created

### 1. API Endpoint: `/admin/src/app/api/users/daily-exercises/route.ts`
**Purpose**: Backend service to fetch and manage user daily exercises

**Methods**:
- `GET`: Fetch daily exercises for a user
  - Query params:
    - `userId` (required): User ID
    - `cardId` (optional): Specific exercise card ID
  - Returns: User data, all exercise cards, and exercises within each card

- `DELETE`: Remove an exercise from a user's daily routine
  - Query params:
    - `userId` (required)
    - `cardId` (required)
    - `exerciseId` (required)
  - Returns: Success confirmation

### 2. Admin Page: `/admin/src/app/dashboard/daily-exercises/page.tsx`
**Purpose**: Main admin dashboard for managing user daily exercises

**Features**:
- Search users by name or email
- Click to expand user and view their exercise cards
- Shows user subscription status (Active/Inactive)
- Collapsible user rows with expandable exercise cards
- User avatar with initials
- Exercise card summary (e.g., "5 exercises")

**State Management**:
- `users`: All users loaded on mount
- `selectedUser`: Currently viewed user's daily exercises
- `expandedUsers`: Set of expanded user IDs
- `searchTerm`: Current search filter

### 3. Detail Component: `/admin/src/components/admin/UserDailyExercisesDetail.tsx`
**Purpose**: Display detailed exercise information for a selected user

**Features**:
- Show all exercise cards for a user
- Collapsible exercise cards
- For each exercise shows:
  - Workout name and order
  - Body part, difficulty level, sets × reps, equipment
  - Creation date
  - Delete button
- Color-coded difficulty levels:
  - Beginner: Green
  - Intermediate: Yellow
  - Advanced: Red
- Sorted by exercise order

### 4. Sidebar Update: `/admin/src/components/dashboard/Sidebar.tsx`
**Changes**:
- Added Calendar icon import
- Added new menu item:
  ```
  {
    href: '/dashboard/daily-exercises',
    label: 'Daily Exercises',
    icon: Calendar,
  }
  ```
- Positioned after Users menu item for logical grouping

## UI/UX Flow

### 1. Access Point
Navigate to: **Admin Dashboard → Daily Exercises** (new menu item)

### 2. User Selection
- View list of all users with search capability
- Click any user row to expand
- Avatar shows user's first initial
- Subscription status badge shows if active

### 3. View Exercise Cards
When user expanded, see:
- All exercise cards created by user
- Exercise count per card
- Click to expand individual cards

### 4. View Exercises
When card expanded, see:
- All exercises in the card, sorted by order
- Full metadata for each exercise
- Creation date
- Delete button for each exercise

## Usage Examples

### Viewing a User's Daily Exercises
1. Go to Admin → Daily Exercises
2. Search for user by name or email
3. Click user row to expand
4. Click exercise card to see all exercises
5. View full exercise details

### Removing an Exercise
1. Find user and expand their data
2. Expand desired exercise card
3. Click trash icon on exercise
4. Confirm deletion
5. Exercise removed from user's routine

### Searching Users
1. Use search box at top of page
2. Type user name or email
3. List filters in real-time
4. Results show matching users only

## API Response Examples

### GET /api/users/daily-exercises?userId=user123
```json
{
  "userId": "user123",
  "user": {
    "displayName": "John Doe",
    "email": "john@example.com",
    "subscription": { "active": true }
  },
  "cards": [
    {
      "id": "card1",
      "name": "Upper Body Strength",
      "description": "Focused on upper body",
      "exerciseCount": 3,
      "exercises": [
        {
          "id": "ex1",
          "workoutName": "Push-Up",
          "bodyPart": "chest",
          "level": "beginner",
          "sets": 3,
          "reps": 10,
          "equipment": "none",
          "order": 1,
          "createdAt": "2024-01-18T10:30:00Z"
        }
      ]
    }
  ],
  "totalCards": 1
}
```

### DELETE /api/users/daily-exercises?userId=user123&cardId=card1&exerciseId=ex1
```json
{
  "message": "Exercise deleted successfully"
}
```

## Security Considerations

1. **Authentication**: Admin-only access (requires admin role verification)
2. **Authorization**: Can only view/edit users' data, not modify their accounts
3. **Data Validation**: Query params validated before database operations
4. **Error Handling**: Proper error messages and status codes
5. **Audit Trail**: Timestamps tracked for all exercises

## Future Enhancements

1. **Bulk Operations**: Delete multiple exercises at once
2. **Reorder Management**: Admin ability to reorder exercises
3. **Exercise Editing**: Edit exercise details directly from admin panel
4. **Export**: Export user exercise routines as CSV/PDF
5. **Analytics**: Track exercise popularity across all users
6. **Recommendations**: Suggest exercises based on user's routine
7. **Activity Tracking**: View when exercises were added/modified
8. **Filtering**: Filter by exercise type, body part, difficulty across all users

## Integration with Mobile App

The admin panel reads from the same Firestore structure used by the mobile app:
- Mobile: `users/{userId}/dailyExercises/{cardId}/exercises/{workoutId}`
- Admin: Reads and manages the same collection structure
- All changes made in admin immediately reflect in mobile app (on next sync)

## Testing Checklist

- [ ] Admin can view all users
- [ ] Search filters users by name/email
- [ ] Expanding user loads their daily exercises
- [ ] Exercise cards display correct count
- [ ] Exercises display with all fields
- [ ] Difficulty badges show correct colors
- [ ] Delete exercise removes from user's routine
- [ ] Toast notifications work for success/error
- [ ] Loading states display properly
- [ ] Empty states handled correctly
