<div align="center">
  <h1>AuraMatch ---> Frontend</h1>
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/28326939-cc78-4005-be8a-55f041c96262" alt="Logo">
</div><br>

**AuraMatch** is a modern, responsive dating app built with Next.js, TypeScript, and Tailwind CSS.

View app here (Hosted on Vercel): https://auramatch-frontend.vercel.app/

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Key Components](#key-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling & Theming](#styling--theming)
- [Browser Notifications](#browser-notifications)
- [Location Services](#location-services)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Features

- 🌓 **Day/Night Theme**: Toggle between light and dark modes
  ![day-night-theme](https://github.com/user-attachments/assets/54fb116a-5d6e-4802-b406-876ce000f8f2)

- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
  ![responsiveness](https://github.com/user-attachments/assets/56ca8067-d6df-4323-a203-cbae8fca4065)

- 🔐 **Authentication**: Secure sign up and sign in
  ![sign-in](https://github.com/user-attachments/assets/cbde6750-328a-4fdd-bea0-5aef759c029e)

  ![sign-up](https://github.com/user-attachments/assets/14613ed4-ea1c-493d-8570-73fbe257a8a0)

- 👤 **Profile Management**: Update user profile information and pictures
  ![profile-management](https://github.com/user-attachments/assets/ca492084-0af8-4fa3-a59f-504e2448cda4)

- 💫 **User Discovery and Matching**: Match other users with swipeable cards
  ![user-discovery-and-matching](https://github.com/user-attachments/assets/58e7e3a4-a43f-4f87-a3a6-e4056657c8dd)

Other Features:
- ✅ **Match List**: View all users you currently matched with
- 🔍 **Advanced Filters**: Filter by age, distance, and gender
- 💬 **Real-time Messaging**: Chat with your matches
- 🔔 **Browser-based Push Notifications**: Get notified of new matches and messages

---

## Tech Stack

- **Framework/s**: [Next.js](https://nextjs.org/), [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks (useState, useEffect)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** / **pnpm**
- **AuraMatch Backend** running on `http://localhost:5000` (see backend README)

---

## Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/m3mentomor1/AuraMatch.git
cd AuraMatch

# Switch to the frontend branch (if separate) or navigate to frontend folder
cd frontend
```

### 2. Install Dependencies

**This step is required!** Install all project dependencies:

```bash
npm install
```

This will install all packages listed in `package.json`:

- `next` - Next.js framework
- `react` & `react-dom` - React library
- `typescript` - TypeScript support
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `@radix-ui/*` - Headless UI components
- `class-variance-authority` - CVA for component variants
- `clsx` & `tailwind-merge` - Utility for merging Tailwind classes

If `package.json` doesn't exist or you need to install packages manually:

```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom
npm install tailwindcss postcss autoprefixer
npm install framer-motion lucide-react
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

---

## Environment Configuration

Create a `.env.local` file in the `frontend` directory:

```bash
touch .env.local
```

Add the following configuration:

```properties
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important Notes:**

- `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser
- Update the URL if your backend runs on a different port
- Never commit `.env.local` to version control (already in `.gitignore`)

---

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start on `http://localhost:3000`

You should see:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

### Production Build

Build the application for production:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

---

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── home/
│   │   └── page.tsx             # Main home page (discover, matches, messages)
│   ├── profile/
│   │   └── page.tsx             # User profile management
│   ├── signin/
│   │   └── page.tsx             # Sign in page
│   ├── signup/
│   │   └── page.tsx             # Sign up page
│   ├── favicon.ico              # App favicon
│   ├── globals.css              # Global styles & Tailwind imports
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
│   ├── auth-components/
│   │   ├── AuthContainer.tsx   # Auth page wrapper
│   │   └── AuthHeader.tsx      # Auth page header
│   ├── home/
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   ├── AgeFilterModal.tsx  # Age filter component
│   │   ├── BackgroundOrbs.tsx  # Animated background
│   │   ├── ChatView.tsx        # Chat interface
│   │   ├── ConversationList.tsx # Message list
│   │   ├── DiscoverTab.tsx     # Swipe interface
│   │   ├── DistanceFilterModal.tsx # Distance filter
│   │   ├── GenderFilterModal.tsx # Gender filter
│   │   ├── Header.tsx          # Main app header
│   │   ├── LocationPickerModal.tsx # Location selector
│   │   ├── MatchesTab.tsx      # Matches grid
│   │   ├── MatchPopup.tsx      # Match notification popup
│   │   ├── MessagesTab.tsx     # Messages container
│   │   ├── TabNavigation.tsx   # Tab switcher
│   │   └── UnmatchDialog.tsx   # Unmatch confirmation
│   ├── profile/
│   │   ├── ProfileForm.tsx     # Profile edit form
│   │   ├── ProfileHeader.tsx   # Profile page header
│   │   └── ProfilePicture.tsx  # Profile picture component
│   ├── signin/
│   │   └── SignInForm.tsx      # Sign in form
│   ├── signup/
│   │   └── SignUpForm.tsx      # Sign up form
│   └── ui/                      # Base UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── lib/                         # Utility functions & services
│   ├── locationService.ts      # Location API wrapper
│   ├── notifications.ts        # Browser notifications
│   └── utils.ts                # Helper functions
├── public/                      # Static assets
├── .env.local                  # Environment variables (not in repo)
├── .gitignore                  # Git ignore rules
├── components.json             # shadcn/ui config
├── eslint.config.mjs           # ESLint configuration
├── next-env.d.ts               # Next.js TypeScript declarations
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── package-lock.json           # Lockfile
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # This file
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Pages & Routes

### Public Routes

#### `/` - Landing Page

- **File**: `app/page.tsx`
- **Features**:
  - Hero section with CTA
  - Feature highlights
  - Responsive navigation
  - Day/night theme toggle
  - Auto-detects if user is logged in

#### `/signin` - Sign In

- **File**: `app/signin/page.tsx`
- **Features**:
  - Email/password authentication
  - Show/hide password toggle
  - Redirects to `/home` on success

#### `/signup` - Sign Up

- **File**: `app/signup/page.tsx`
- **Features**:
  - Multi-field registration form
  - Profile picture upload
  - Gender selection
  - Bio input
  - Form validation

### Protected Routes

#### `/home` - Main Application

- **File**: `app/home/page.tsx`
- **Features**:
  - Three tabs: Discover, Matches, Messages
  - User discovery with swipe interface
  - Match notifications
  - Real-time message updates
  - Filter controls (age, distance, gender)
  - Location picker

#### `/profile` - User Profile

- **File**: `app/profile/page.tsx`
- **Features**:
  - View/edit profile information
  - Update profile picture
  - Change bio, age, gender
  - Read-only email display

---

## Key Components

### Authentication Flow

1. **Landing Page** → Checks if user is authenticated
2. **Sign Up/Sign In** → Stores JWT token and user data in localStorage
3. **Protected Pages** → Redirect to signin if no token found

### Main Application Components

#### `HomePage` (`app/home/page.tsx`)

- **State Management**:
  - Theme state (day/night)
  - User authentication
  - Users list for discovery
  - Matches list
  - Messages
  - Active tab
  - Filter settings
- **Key Hooks**:
  - `useEffect` for initial data fetching
  - `useEffect` for real-time message polling
  - `useEffect` for notification checking
- **Event Handlers**:
  - Swipe handling (like/pass)
  - Message sending
  - Filter application
  - Location setting

#### Filter Modals

- **AgeFilterModal**: Dual slider for min/max age
- **DistanceFilterModal**: Distance slider with location check
- **GenderFilterModal**: Multi-select for gender preferences
- **LocationPickerModal**: GPS or manual location selection

---

## State Management

The application uses React's built-in state management:

### Local Storage

Persists across sessions:

```typescript
// Authentication
localStorage.setItem("token", jwt_token);
localStorage.setItem("user", JSON.stringify(user));

// Filter preferences
localStorage.setItem("minAge", minAge.toString());
localStorage.setItem("maxAge", maxAge.toString());
localStorage.setItem("maxDistance", maxDistance.toString());
localStorage.setItem("selectedGenders", JSON.stringify(genders));
```

### Component State

```typescript
// Theme
const [isDay, setIsDay] = useState(false);

// User data
const [currentUser, setCurrentUser] = useState<any>(null);
const [users, setUsers] = useState<User[]>([]);

// Messaging
const [messages, setMessages] = useState<Message[]>([]);
const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
```

---

## API Integration

All API calls use the native Fetch API:

### Authentication

```typescript
// Sign Up
const response = await fetch(`${API_URL}/api/auth/signup`, {
  method: "POST",
  body: formData, // multipart/form-data
});

// Sign In
const response = await fetch(`${API_URL}/api/auth/signin`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### Protected Endpoints

```typescript
// Get available users
const response = await fetch(
  `${API_URL}/api/users?minAge=${min}&maxAge=${max}&maxDistance=${dist}&genders=${genders}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

// Send message
const response = await fetch(`${API_URL}/api/matches/${matchId}/messages`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ message }),
});
```

### Error Handling

```typescript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  // Handle success
} catch (error) {
  console.error("Error:", error);
  setError(error.message);
}
```

---

## Styling & Theming

### Tailwind CSS

The app uses Tailwind's utility classes with custom theme extensions:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      // ... custom color system
    },
  },
}
```

### Day/Night Theme

Implemented via state and conditional classes:

```tsx
<div className={`min-h-screen transition-all duration-1000 ${
  isDay
    ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
    : "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
}`}>
```

### Custom Scrollbar

Defined in `globals.css`:

```css
/* Webkit browsers */
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 4px;
}
```

### Animations

Using Framer Motion for smooth transitions:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

---

## Browser Notifications

### Notification Service (`lib/notifications.ts`)

#### Request Permission

```typescript
const granted = await notificationService.requestPermission();
```

#### Show Match Notification

```typescript
notificationService.showMatchNotification(userName, userImage);
```

#### Show Message Notification

```typescript
notificationService.showMessageNotification(userName, message, userImage);
```

#### Features

- Browser notifications (if permission granted)
- Fallback in-app notifications (always shown)
- Auto-dismiss after 5 seconds
- Click to navigate

---

## Location Services

### Location Service (`lib/locationService.ts`)

#### Request GPS Location

```typescript
const location = await locationService.requestLocation();
// Returns: { latitude, longitude, city?, country? }
```

#### Save Location

```typescript
const success = await locationService.saveLocation(token, locationData);
```

#### Check if User Has Location

```typescript
const hasLocation = await locationService.hasLocation(token);
```

#### Features

- GPS-based location
- Manual map selection
- City/country reverse geocoding via Nominatim (OpenStreetMap)
- Search for location by address

---

## Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in `.next/` folder.

### Start Production Server

```bash
npm start
```

Runs the production server on `http://localhost:3000`

### Environment Variables for Production

Create a `.env.production` file:

```properties
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

### Static Export (Optional)

If you want to deploy as static files:

1. Update `next.config.ts`:

```typescript
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};
```

2. Build:

```bash
npm run build
```

3. Deploy the `out/` folder to any static hosting service.

---

## Troubleshooting

### Port Already in Use

**Error: "Port 3000 is already in use"**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### API Connection Issues

**Error: "Failed to fetch" or CORS errors**

1. Ensure backend is running on `http://localhost:5000`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Verify backend has CORS enabled for `http://localhost:3000`

### TypeScript Errors

**Error: "Cannot find module" or type errors**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Image Not Loading

**Profile pictures not displaying**

1. Check Supabase configuration in backend
2. Verify image URLs are accessible
3. Check browser console for CORS errors

### Notifications Not Working

**Browser notifications not showing**

1. Check browser notification permissions
2. Use in-app fallback notifications (always work)
3. Test in different browsers (Chrome, Firefox, Safari)

### Location Not Detecting

**GPS location not working**

1. Ensure HTTPS (required for geolocation in production)
2. Grant location permission in browser
3. Use manual map selection as fallback

---

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files:

- Page changes reflect instantly
- Component changes update without full refresh
- State is preserved when possible

### TypeScript

Use TypeScript for type safety:

```typescript
// Define interfaces in components/home/types/index.ts
interface User {
  id: number;
  firstName: string;
  // ...
}

// Use in components
const [users, setUsers] = useState<User[]>([]);
```

### Component Organization

Follow this structure:

1. Imports
2. TypeScript interfaces (if not in separate file)
3. Component function
4. State declarations
5. Effects
6. Event handlers
7. Render logic

### Debugging

```typescript
// Use console.log for debugging
console.log("Current user:", currentUser);

// Use React DevTools browser extension
// Network tab for API calls
// Application tab for localStorage
```

---

## Browser Support

- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (iOS 15+)
- **Mobile browsers**: ✅ Responsive design

---

## Performance Optimization

### Image Optimization

Next.js automatically optimizes images:

```tsx
// Use Next Image component for local images
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={200} height={200} />;
```

### Code Splitting

Next.js automatically splits code by route:

- Each page is a separate bundle
- Components are lazy-loaded
- Shared code is in common chunks

### Caching

- Static assets cached automatically
- API responses can be cached with SWR (optional enhancement)

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy automatically on push

### Other Platforms

**Netlify, AWS, Railway, etc.**

1. Build the project:

```bash
npm run build
```

2. Deploy the `.next` folder with Node.js

3. Set environment variables on the platform

---

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Create production build
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---
