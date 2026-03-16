# Button Flow & Navigation

## Overview

The application now has three main views with proper button mappings:

1. **Landing Page** - Marketing page with signup/login
2. **Demo View** - Brief preview without authentication
3. **Dashboard** - Full authenticated experience

## Button Mappings

### Landing Page Buttons

| Button | Action | Destination |
|--------|--------|-------------|
| **Login** (Nav) | Opens login modal | → Dashboard (after auth) |
| **START TRIAL** (Nav) | Opens signup modal | → Dashboard (after auth) |
| **Start Free Trial** (Hero) | Opens signup modal | → Dashboard (after auth) |
| **See Live Demo** (Hero) | Shows demo view | → Demo View (no auth) |
| **Start Free Trial** (Pricing) | Scrolls to top & opens signup | → Dashboard (after auth) |

### Demo View Buttons

| Button | Action | Destination |
|--------|--------|-------------|
| **← Back to Home** | Returns to landing | → Landing Page |
| **Start Free Trial** (Bottom CTA) | Returns to landing | → Landing Page |

### Dashboard Buttons

| Button | Action | Destination |
|--------|--------|-------------|
| **Logout** | Signs out user | → Landing Page |

## Authentication Flow

### Sign Up Flow
1. User clicks "START TRIAL" or "Start Free Trial"
2. Signup modal opens
3. User enters: Full Name, Company Name, Email, Password
4. On submit:
   - Creates Supabase auth account
   - Creates user profile in `user_profiles` table
   - Sets 14-day trial period
5. App.js detects auth state change
6. **Automatically redirects to Dashboard**

### Login Flow
1. User clicks "Login"
2. Login modal opens
3. User enters: Email, Password
4. On submit:
   - Authenticates with Supabase
5. App.js detects auth state change
6. **Automatically redirects to Dashboard**

### Demo Flow
1. User clicks "See Live Demo"
2. Shows DemoView component
3. Displays:
   - Proprietary indexes (RPI, LSI, CPI)
   - Sample alerts (5 recent)
   - CTA to start trial
4. No authentication required
5. User can return to landing page anytime

## Key Features

### ✅ Automatic Navigation
- No manual navigation needed in modals
- App.js handles all auth state changes
- Seamless redirect to dashboard after login/signup

### ✅ Demo Access
- Users can preview the platform without signing up
- Shows real sample data
- Encourages conversion with CTA

### ✅ Persistent Sessions
- Users stay logged in across page refreshes
- Supabase handles session management
- Auto-logout on session expiry

## Component Structure

```
App.js (Main Router)
├── LandingPage
│   ├── SignupModal
│   └── LoginModal
├── DemoView
└── DashboardNew
    ├── Signals
    ├── Analytics
    ├── Alerts
    ├── RiskCheck
    └── CorridorPage
        └── CorridorBriefing
```

## State Management

### App.js State
- `view`: "landing" | "demo" | "dashboard"
- `userData`: User profile data from Supabase

### Auth State Listener
- Monitors Supabase auth changes
- Loads user profile on login
- Clears state on logout
- Handles session restoration

## User Experience

### First-Time Visitor
1. Lands on marketing page
2. Can explore via "See Live Demo"
3. Signs up when ready
4. Immediately sees full dashboard

### Returning User
1. Automatically logged in (if session valid)
2. Directly sees dashboard
3. Can logout anytime

### Trial User
- 14-day trial starts on signup
- Trial status shown in dashboard sidebar
- Full access to all features during trial

## Technical Notes

- Authentication handled by Supabase Auth
- User profiles stored in `user_profiles` table
- Real-time updates via Supabase subscriptions
- No manual token management needed
- Secure by default with RLS policies
