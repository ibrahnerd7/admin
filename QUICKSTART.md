# Quick Start Guide - Workout Admin Dashboard

## 🚀 Getting Started

### Initial Setup (5 minutes)

1. **Navigate to project folder:**
   ```bash
   cd /Users/ibrahim/Desktop/admin
   ```

2. **Install dependencies (already done):**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Go to http://localhost:3000
   - You'll be redirected to login page

### 🔐 Login

- **Email:** admin@admin.com
- **Password:** Admin@123

After login, you'll see the main dashboard with all features.

## 📋 Features Overview

### 1. Dashboard Home (`/dashboard`)
- Overview metrics
- Quick action buttons
- Recent activity log
- System statistics

### 2. Workouts (`/dashboard/workouts`)
- View all workouts
- Search by name or body part
- Filter by category
- Edit/Delete exercises
- Add new workouts (button ready for implementation)

### 3. Users (`/dashboard/users`)
- View all registered users
- Track subscription status
- See user activity metrics
- Search by email

### 4. Analytics (`/dashboard/analytics`)
- User growth chart (last 7 days)
- Workout completion trends
- Active vs total users
- Subscription metrics
- Historical data visualization

### 5. Upload Data (`/dashboard/uploads`)
- Import workouts from CSV
- Import from JSON files
- View upload history
- Track successful imports and errors

**Supported Formats:**

CSV:
```
name,bodyPart,category,level,equipment,numberOfReps,weight
Push-Up,Chest,Strength,Beginner,None,12,0
```

JSON:
```json
[{
  "name": "Push-Up",
  "bodyPart": "Chest",
  "category": "Strength",
  "level": "Beginner",
  "equipment": "None",
  "numberOfReps": 12,
  "weight": 0
}]
```

### 6. Workout Programs (`/dashboard/programs`)
- Create workout programs
- Assign workouts to programs
- Set difficulty and duration
- Manage program lifecycle

### 7. Onboarding (`/dashboard/onboarding`)
- Upload onboarding images
- Arrange screens in order
- Add titles and descriptions
- Manage app first-time UX

### 8. Subscriptions (`/dashboard/subscriptions`)
- Manage subscription tiers (Free, Basic, Premium)
- View user subscriptions
- Track subscription metrics
- Filter by plan type

### 9. Settings (`/dashboard/settings`)
- App configuration
- Database info
- Backup options
- System information

## 🔧 Development Workflow

### Making Changes

1. **Edit source files** in `src/` directory
2. **Changes auto-reload** in browser (HMR)
3. **Check console** for any build errors
4. **View your changes** instantly

### Building for Production

```bash
npm run build
npm start
```

## 🗄️ Firebase Integration

All data is stored in Firebase Realtime Database at:
- **Project ID:** chat-165ca
- **Database URL:** https://chat-165ca.firebaseio.com

### Database Collections

- `/workouts` - All exercises
- `/users` - User profiles
- `/programs` - Workout programs
- `/onboarding` - Onboarding images
- `/analytics` - Historical metrics
- `/subscriptions` - Subscription data
- `/uploadHistory` - File upload records

## 🎨 UI Components Used

- **Layout:** Sidebar navigation, header
- **Forms:** Input fields, select dropdowns
- **Tables:** Searchable, filterable data tables
- **Cards:** Metric displays, content cards
- **Buttons:** Primary, outline, ghost variants
- **Badges:** Status indicators
- **Charts:** Line charts for analytics
- **Dialogs:** Confirmation modals

All components from **shadcn/ui** + **Tailwind CSS**

## 📝 Key Files

- `src/app/layout.tsx` - Root layout
- `src/app/(dashboard)/layout.tsx` - Dashboard wrapper
- `src/components/dashboard/Sidebar.tsx` - Navigation
- `src/lib/firebase.ts` - Firebase config
- `src/lib/db.ts` - Database operations
- `src/lib/auth.ts` - Authentication
- `src/lib/validation.ts` - Data validation
- `src/types/index.ts` - TypeScript types

## 🧪 Testing the Upload Feature

1. Go to `/dashboard/uploads`
2. Download sample CSV or create one with workout data
3. Click upload area or drag-drop file
4. File gets validated and saved to Firebase
5. Upload history shows success/failure

## 🔒 Security Notes

⚠️ **Development Only:** Demo credentials are hardcoded

**For Production:**
1. Remove demo credentials
2. Create real admin users in Firebase Auth
3. Enable Firebase Security Rules
4. Add rate limiting
5. Implement audit logging
6. Enable HTTPS
7. Add 2FA

## 📱 API Endpoints

All API routes use `/api/` prefix:

- `GET/POST /api/users` - User management
- `GET/POST/PUT/DELETE /api/workouts` - Workout CRUD
- `GET/POST/PUT/DELETE /api/programs` - Program CRUD
- `GET/POST/PUT/DELETE /api/onboarding` - Onboarding CRUD
- `POST /api/upload` - File uploads

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Use different port
npm run dev -- -p 3001
```

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**Firebase connection error:**
- Check `.env.local` credentials
- Verify Firebase project is active
- Check internet connection

**Import paths not working:**
- Verify `tsconfig.json` has correct path alias
- Clear `.next` folder
- Restart dev server

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Recharts Documentation](https://recharts.org)

## 🎯 Next Steps

1. **Connect to your own Firebase project:**
   - Create Firebase project
   - Update `.env.local` with your credentials
   - Enable Realtime Database
   - Set up security rules

2. **Create real admin users:**
   - Remove hardcoded demo credentials
   - Implement proper user creation flow

3. **Add missing features:**
   - Implement create/edit forms for workouts
   - Add drag-to-reorder for onboarding images
   - Complete subscription management UI
   - Add export/backup functionality

4. **Enhance security:**
   - Add role-based access control
   - Implement audit logging
   - Add two-factor authentication
   - Set up error tracking

## 📞 Support

For issues or questions:
1. Check the README.md file
2. Review component code in `src/`
3. Check browser console for errors
4. Check Next.js build output

Good luck! 🚀
