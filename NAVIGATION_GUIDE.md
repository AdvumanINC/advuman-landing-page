# Quick Navigation Reference

## 🎯 Button Actions Summary

### Landing Page → Dashboard (Full Access)
- Click **"Login"** → Enter credentials → **Auto-redirect to Dashboard**
- Click **"START TRIAL"** → Fill signup form → **Auto-redirect to Dashboard**
- Click **"Start Free Trial"** → Fill signup form → **Auto-redirect to Dashboard**

### Landing Page → Demo (Preview Only)
- Click **"See Live Demo"** → **Shows Demo View**
  - View sample indexes (RPI, LSI, CPI)
  - View sample alerts
  - No login required

### Demo View → Landing Page
- Click **"← Back to Home"** → **Returns to Landing**
- Click **"Start Free Trial"** → **Returns to Landing**

### Dashboard → Landing Page
- Click **"Logout"** → **Signs out & returns to Landing**

## 🔐 Authentication Behavior

### After Signup:
✅ Account created  
✅ 14-day trial activated  
✅ **Automatically logged in**  
✅ **Redirected to Dashboard**  

### After Login:
✅ Session restored  
✅ **Automatically logged in**  
✅ **Redirected to Dashboard**  

### Session Persistence:
✅ Stay logged in across page refreshes  
✅ Auto-logout when session expires  
✅ No manual token handling needed  

## 📊 What Users See

### Demo View (No Auth)
- ✅ Proprietary indexes with charts
- ✅ 5 sample alerts
- ✅ CTA to start trial
- ❌ No real-time updates
- ❌ No personalization
- ❌ No full alert details

### Dashboard (Authenticated)
- ✅ Full access to all features
- ✅ Real-time updates
- ✅ Personalized data
- ✅ All modules (Signals, Analytics, Alerts, Risk Check)
- ✅ Corridor intelligence
- ✅ Trial status tracking

## 🚀 Quick Test Flow

1. **Test Demo**: Click "See Live Demo" → View sample data → Click "Back to Home"
2. **Test Signup**: Click "START TRIAL" → Fill form → See Dashboard
3. **Test Logout**: Click "Logout" → Return to Landing
4. **Test Login**: Click "Login" → Enter credentials → See Dashboard
