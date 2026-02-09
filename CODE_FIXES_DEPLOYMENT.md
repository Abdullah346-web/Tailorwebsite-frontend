# CODE FIXES & DEPLOYMENT GUIDE

## QUICK FIX SUMMARY

These are the exact code changes needed to make the project production-ready.

---

## 1. FIX: Remove Console.log Statements

### Backend - Order Controller
**File:** `backend/controllers/order.controller.js`

Find these lines and REMOVE them:
```javascript
// Line 9 - DELETE
console.log('🔴 CREATE ORDER CALLED');

// Line 10 - DELETE
console.log('📤 Received measurements:', JSON.stringify(measurements, null, 2));

// Line 40 - DELETE
console.log('✅ Order saved with measurements:', JSON.stringify(order.measurements, null, 2));

// Line 51 - DELETE
console.log(`📦 Returning ${orders.length} orders`);

// Line 53 - DELETE
console.log('📏 First order measurements:', JSON.stringify(orders[0].measurements, null, 2));

// Line 83 - DELETE
console.log('📏 Measurements updated:', JSON.stringify(measurements, null, 2));
```

### Frontend - UserDashboard
**File:** `src/pages/UserDashboard.jsx`

Find and REMOVE:
```javascript
// Line 86 - DELETE
console.log('Showing toast:', toastMsg);

// Line 89 - DELETE
console.log('Toast dismissed');
```

### Frontend - Booking Component
**File:** `src/components/Booking.jsx`

Find and REMOVE:
```javascript
// Line 22 - DELETE
console.log('Booking Data:', formData);
```

### Frontend - Contact Component
**File:** `src/components/Contact.jsx`

Find and REMOVE:
```javascript
// Line 19 - DELETE
console.log('Contact Form Data:', formData);
```

---

## 2. FIX: Fix CORS Configuration

**File:** `backend/server.js`

Replace this:
```javascript
// CORS config
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

With this:
```javascript
// CORS config
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

---

## 3. FIX: Add JWT Secret Validation

**File:** `backend/server.js`

Add this at the TOP after `dotenv.config()`:
```javascript
dotenv.config();

// Validate JWT_SECRET before starting server
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set');
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32 && process.env.NODE_ENV === 'production') {
  console.error('ERROR: JWT_SECRET must be at least 32 characters in production');
  process.exit(1);
}

// Connect to MongoDB
connectDB();
```

---

## 4. FIX: Create .env Files

### Backend - .env.development
**File:** `backend/.env.development`

```env
# Development Environment
MONGODB_URI=mongodb://localhost:27017/tailor-website
JWT_SECRET=dev-secret-key-only-for-development-change-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=debug
```

### Backend - .env.production (template)
**File:** `backend/.env.production.example`

```env
# Production Environment - FILL IN YOUR VALUES
MONGODB_URI=mongodb+srv://NEW_USERNAME:NEW_PASSWORD@cluster0.xyz.mongodb.net/tailordb?retryWrites=true&w=majority
JWT_SECRET=GENERATE_USING_node_command_in_terminal
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=production-email@gmail.com
SMTP_PASSWORD=production-app-password
SENDER_EMAIL=production-email@gmail.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
LOG_LEVEL=error
MONGODB_POOL_SIZE=10
```

### Frontend - .env.development
**File:** `src/.env.development`

```env
VITE_API_BASE=http://localhost:5000/api
VITE_ENV=development
```

### Frontend - .env.production
**File:** `src/.env.production`

```env
VITE_API_BASE=https://YOUR_DOMAIN_HERE.com/api
VITE_ENV=production
```

---

## 5. FIX: Update .gitignore

**Backend** - Create/Update `backend/.gitignore`:
```ignore
# Environment
.env
.env.local
.env.*.local
.env.production
.env.staging

# Secrets
secrets.json
credentials.json
oauth.json

# Dependencies
node_modules
package-lock.json

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Temp
tmp/
temp/
dist/
build/
```

**Root** - Update `.gitignore`:
```ignore
# Existing entries...

# Environment files
.env
.env.local
.env.*.local
backend/.env
backend/.env.local
backend/.env.production

# Secrets
secrets.json
credentials.json

# IDE
.vscode/*
!.vscode/extensions.json

# OS
.DS_Store
Thumbs.db
```

---

## 6. FIX: Update vite.config.js for Multiple Environments

**File:** `vite.config.js`

Replace entire file with:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for production debugging
  },
  preview: {
    port: 4173,
  },
})
```

---

## 7. FIX: Add Environment Check to Frontend

**File:** `src/context/AuthContext.jsx`

Add this at the TOP of the file:
```javascript
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Validate API base URL
if (!import.meta.env.VITE_API_BASE) {
  console.warn('⚠️ VITE_API_BASE not configured. Using /api as fallback.');
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Rest of the code stays the same...
```

---

## 8. OPTIONAL FIX: Add Error Boundaries

**Create new file:** `src/components/ErrorBoundary.jsx`

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-900/20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Update** `src/App.jsx`:
```jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // ... existing code ...

  return (
    <ErrorBoundary>
      <div className="bg-[#0b0b12] text-white">
        {/* Rest of JSX */}
      </div>
    </ErrorBoundary>
  );
}
```

---

## 9. CREATE: vercel.json for Deployment

**File:** `vercel.json` (in root directory)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE": "@vite_api_base",
    "VITE_ENV": "@vite_env"
  },
  "functions": {
    "backend/server.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "backend/server.js"
    }
  ]
}
```

---

## 10. PACKAGE.JSON SCRIPTS

**Update** `package.json` scripts:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "type-check": "tsc --noEmit"  // if using TypeScript
}
```

**Update** `backend/package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node scripts/seedAdmin.js",
  "build": "echo 'No build needed for Node.js'"
}
```

---

## DEPLOYMENT STEPS FOR VERCEL

### Step 1: Prepare Code
```bash
# 1. Make all code fixes above
# 2. Remove .env from git history (see SECURITY_FIXES_REQUIRED.md)
# 3. Commit changes
git add .
git commit -m "Production: Fix security issues, add env files, remove console logs"
```

### Step 2: Push to GitHub
```bash
git push origin main
```

### Step 3: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 4: Set Environment Variables on Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:

```
MONGODB_URI = mongodb+srv://NEW_USERNAME:NEW_PASSWORD@...
JWT_SECRET = <generated-32-char-secret>
NODE_ENV = production
FRONTEND_URL = https://yourdomain.com
ALLOWED_ORIGINS = https://yourdomain.com,https://www.yourdomain.com
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-production-email@gmail.com
SMTP_PASSWORD = your-app-password
SENDER_EMAIL = your-production-email@gmail.com
PORT = 5000
VITE_API_BASE = https://yourdomain.com/api
VITE_ENV = production
LOG_LEVEL = error
MONGODB_POOL_SIZE = 10
```

### Step 5: Redeploy
```bash
vercel --prod
```

---

## POST-DEPLOYMENT CHECKLIST

- [ ] Signup form works and sends OTP email
- [ ] Email verification (check spam folder)
- [ ] OTP verification completes
- [ ] Pending signup appears in admin dashboard
- [ ] Admin can approve/reject signups
- [ ] Approved user can login
- [ ] Password reset works
- [ ] Admin can create orders for users
- [ ] Users can view their orders in dashboard
- [ ] Order status updates appear in user dashboard
- [ ] Measurements are correctly displayed
- [ ] Tracking number search works
- [ ] No console errors in browser DevTools
- [ ] No console errors on server logs: `vercel logs`
- [ ] HTTPS warning appears in browser (if using https://)

---

## MONITORING SETUP

### Recommended Tools:

1. **Error Tracking:** Sentry
```bash
npm install @sentry/react
```

2. **Logs:** Vercel built-in
```bash
vercel logs
```

3. **Uptime Monitoring:** UptimeRobot (free)
   - Monitor https://yourdomain.com
   - Alert if down for 5+ minutes

---

## ROLLBACK PLAN

If something breaks after deployment:

```bash
# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback

# Or redeploy specific version
vercel deploy --target production <deployment-id>
```

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Week 1:** Monitor for errors, respond to user feedback
2. **Week 2:** Analyze metrics, optimize if needed
3. **Month 1:** Add payment processing (optional)
4. **Month 2:** Add real-time notifications (optional)

---

## SUPPORT

If you encounter issues:

1. Check YOUR Vercel logs: `vercel logs`
2. Check browser console (F12 → Console)
3. Check MongoDB Atlas connection
4. Verify all environment variables set correctly
5. Test locally before redeploying: `npm run build && npm run preview`

---

**Ready to deploy?** Follow the steps above and your project will be live! 🚀
