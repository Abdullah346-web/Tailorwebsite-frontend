# 📁 Project Restructuring Guide - Frontend/Backend Separation

## Current Structure ❌
```
TAILOR WEBSITE/
├── src/
├── public/
├── backend/
├── package.json
├── vite.config.js
└── ...
```

## Target Structure ✅
```
TAILOR WEBSITE/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── .gitignore
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── controllers/
│   └── ...
├── package.json (root)
└── README.md
```

---

## Step-by-Step Guide

### Step 1: Create Frontend Folder
```bash
mkdir frontend
```

### Step 2: Move Frontend Files to `frontend/` folder

**Move these files TO `frontend/`:**
- `src/` → `frontend/src/`
- `public/` → `frontend/public/`
- `index.html` → `frontend/index.html`
- `package.json` → `frontend/package.json`
- `vite.config.js` → `frontend/vite.config.js`
- `tailwind.config.js` → `frontend/tailwind.config.js`
- `postcss.config.js` → `frontend/postcss.config.js`
- `eslint.config.js` → `frontend/eslint.config.js`
- `.env` → `frontend/.env` (if exists)
- `App.css`, `App.jsx` (already in src/, so will be moved with src/)

### Step 3: Create Root `package.json`
Create new file: `/package.json` (in root, not in frontend)

```json
{
  "name": "tailor-website",
  "version": "1.0.0",
  "description": "Tailor website - React frontend + Node backend",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\"",
    "build": "npm run build --prefix frontend && npm run build --prefix backend",
    "start": "npm run dev",
    "frontend": "npm run dev --prefix frontend",
    "backend": "npm run dev --prefix backend",
    "seed": "npm run seed --prefix backend"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### Step 4: Update `frontend/vite.config.js`
Make sure it looks like this:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### Step 5: Remove Duplicate Files from Root
After moving everything, delete from root:
- `src/` (moved to frontend/src/)
- `public/` (moved to frontend/public/)
- `index.html` (moved to frontend/)
- `vite.config.js` (moved to frontend/)
- `tailwind.config.js` (moved to frontend/)
- `postcss.config.js` (moved to frontend/)
- `eslint.config.js` (moved to frontend/)
- `App.css`, `App.jsx` (moved with src/)

### Step 6: Install Dependencies
```bash
# Install root dependencies (for monorepo tooling)
npm install

# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
npm install --prefix backend
```

### Step 7: Update `.gitignore`
Make sure root `.gitignore` has:
```
frontend/.env
frontend/.env.local
backend/.env
backend/.env.local
frontend/dist
frontend/node_modules
backend/node_modules
.DS_Store
```

---

## Quick Commands After Restructuring

```bash
# Start both frontend and backend together
npm run dev

# Start only frontend
npm run frontend

# Start only backend
npm run backend

# Build frontend
npm run build --prefix frontend

# Seed admin
npm run seed --prefix backend
```

---

## Git Commands (After Moving)

```bash
git add .gitignore
git add -A
git commit -m "refactor: reorganize project structure - separate frontend and backend"
```

---

## Deployment Changes

### Frontend (Vercel)
- Deploy `frontend/` folder
- Environment: `VITE_API_URL=https://your-backend.vercel.app`

### Backend (Vercel/Render)
- Deploy `backend/` folder
- Set environment variables as usual

---

## Verification

After restructuring, run:

```bash
# Check structure
ls -la

# Should show:
# frontend/
# backend/
# package.json
# .gitignore
# etc.

# Test frontend startup
npm run frontend
# Should start on http://localhost:5173

# Test backend startup (in new terminal)
npm run backend
# Should start on http://localhost:5000
```

---

## Quick Bash Commands (Execute Together)

If you want to do it via command line:

```bash
# Create frontend folder
mkdir -p frontend

# Move files (Windows PowerShell)
Move-Item -Path src -Destination frontend/
Move-Item -Path public -Destination frontend/
Move-Item -Path index.html -Destination frontend/
Move-Item -Path package.json -Destination frontend/
Move-Item -Path vite.config.js -Destination frontend/
Move-Item -Path tailwind.config.js -Destination frontend/
Move-Item -Path postcss.config.js -Destination frontend/
Move-Item -Path eslint.config.js -Destination frontend/
Move-Item -Path .env -Destination frontend/ -ErrorAction SilentlyContinue
```

---

## Notes

✅ This structure is perfect for:
- Scaling the project
- Separate frontend/backend deployments
- Clear separation of concerns
- Monorepo management
- Team workflow (frontend devs work on frontend/ folder)

❌ Avoid:
- Committing without `.gitignore` updates
- Forgetting to update build paths
- Not installing dependencies in new folders

