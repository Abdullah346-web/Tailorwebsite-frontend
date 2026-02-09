# 🚀 DEPLOYMENT GUIDE - VERCEL

## Pre-Deployment Checklist ✅

### 1. Security - Rotate Credentials

#### Step 1: Generate New JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and save it - you'll need this for environment variables.

#### Step 2: Create MongoDB Atlas Cluster (if not done)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Get connection string: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/tailordb`

#### Step 3: Gmail App Password (for emails)
1. Enable 2FA on Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Select Mail & Windows App
4. Copy the 16-character password

---

## Deploy to Vercel

### Method 1: CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd "c:\Users\This PC\OneDrive\Desktop\PROJECTS\REACT + TAILWIND + BACKEND\TAILOR WEBSITE"
vercel
```

### Method 2: GitHub Integration

1. Push code to GitHub (with .gitignore protecting .env)
2. Connect GitHub to Vercel: https://vercel.com
3. Import repository
4. Add environment variables in Vercel dashboard

---

## Configure Environment Variables in Vercel

**In Vercel Dashboard → Settings → Environment Variables:**

```
MONGODB_URI = mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/tailordb
JWT_SECRET = (paste generated secret from above)
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = (16-char app password)
SENDER_EMAIL = your-email@gmail.com
FRONTEND_URL = https://your-domain.vercel.app
PORT = 5000
NODE_ENV = production
```

---

## Special Configuration for Vercel

### Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build --prefix . && npm install --prefix backend",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

---

## Important: Split Frontend & Backend (Recommended for Vercel)

**Option A: Frontend on Vercel, Backend on Vercel (Serverless)**
- Frontend: Vercel → /api/* routes
- Backend: Vercel Functions → /api endpoints
- Database: MongoDB Atlas

**Option B: Frontend on Vercel, Backend on Render/Railway**
- Frontend: Vercel
- Backend: Separate service (Render.com or Railway.app)
- Update API_BASE in vite.config.js to point to backend URL

### Recommended: Split Setup

**Step 1: Update vite.config.js**
```javascript
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Step 2: Deploy Backend to Render.com (Free)**
1. Push code to GitHub
2. Connect Render: https://render.com
3. New → Web Service
4. Select GitHub repo
5. Set environment variables
6. Deploy
7. Copy backend URL: `https://your-backend.onrender.com`

**Step 3: Deploy Frontend to Vercel**
1. Set VITE_API_URL environment variable to backend URL
2. Deploy

---

## Post-Deployment Verification

**Checklist:**

- [ ] Visit deployed frontend URL
- [ ] Try signup → check email verification works
- [ ] Try login with approved admin
- [ ] Check Ctrl+Shift+A opens admin panel
- [ ] Create order and verify it appears
- [ ] Check database (MongoDB Atlas) has new data

---

## Important Security Notes

✅ **ALWAYS DO:**
- Never commit .env files
- Always use .gitignore
- Rotate credentials regularly
- Use strong passwords
- Keep dependencies updated

❌ **NEVER DO:**
- Hardcode API keys in code
- Share credentials in public repos
- Use same password everywhere
- Skip environment variables

---

## Troubleshooting

**Error: CORS blocked**
→ Check FRONTEND_URL in backend .env matches actual frontend domain

**Error: MongoDB connection failed**
→ Check MONGODB_URI is correct and IP whitelist is set in Atlas

**Error: Emails not sending**
→ Check SMTP credentials and Gmail app password is correct

**Error: Admin login fails**
→ Run backend seed script: `npm run seed --prefix backend`

---

## Next Steps After Deployment

1. **Monitor Performance** - Use Vercel Analytics
2. **Setup Error Tracking** - Consider Sentry.io
3. **Database Backup** - Enable MongoDB backups
4. **SSL Certificate** - Vercel handles this automatically
5. **Domain Setup** - Connect custom domain in Vercel dashboard

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com

