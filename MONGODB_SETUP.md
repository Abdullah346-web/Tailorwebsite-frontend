# MongoDB Setup - Complete Guide

## Option 1: MongoDB Atlas (Cloud - سب سے آسان) ✅

### Step 1: MongoDB Atlas Account بنائیں
1. جاؤ: https://www.mongodb.com/cloud/atlas
2. Sign up کریں (Google سے ہو سکتے ہو)
3. "Create a free cluster" پر کلک کریں
4. M0 (Free) tier چنیں ✓

### Step 2: Connection String لیں
1. Cluster بننے کے بعد "Connect" پر کلک کریں
2. "Connect your application" چنیں
3. Driver: Node.js چنیں
4. Connection string کاپی کریں (کچھ یوں ہوگی):
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Step 3: .env فائل میں ڈالیں
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tailordb?retryWrites=true&w=majority
JWT_SECRET=bismillah_tailor_secret_key_2026_strong_secret
PORT=5000
NODE_ENV=development
```

### Step 4: Admin User Create کریں
```bash
cd backend
npm run seed
```

---

## Option 2: MongoDB Community (Local) - اگر Atlas نہیں چاہتے

### Windows میں Install:
1. Download: https://www.mongodb.com/try/download/community
2. Install کریں
3. MongoDB service شروع کریں

### .env میں:
```
MONGODB_URI=mongodb://localhost:27017/tailordb
```

### Seed کریں:
```bash
npm run seed
```

---

## اب کیا کریں؟

### 1. .env فائل میں صحیح MongoDB URI ڈالیں
- Atlas استعمال کر رہے ہو تو Atlas URI
- Local استعمال کر رہے ہو تو localhost URI

### 2. Admin user create کریں
```bash
npm run seed
```

✓ Admin کریڈ:
- Email: `admin123@gmail.com`
- Password: `abdullah12345`

### 3. Server شروع کریں
```bash
npm run dev
```

### 4. اب سب کام ہوگا!
- Signup requests MongoDB میں save ہوں گی
- Orders محفوظ رہیں گے
- Server restart پر data نہیں مٹے گا ✓

---

## Troubleshooting

### Error: `Cannot connect to MongoDB`
- ✓ MongoDB URI صحیح ہے؟
- ✓ اگر Atlas ہے تو IP whitelisted ہے؟ (Allow all: `0.0.0.0/0`)
- ✓ اگر Local ہے تو MongoDB running ہے؟

### Error: `ENOTFOUND`
- .env میں صحیح URI ڈالیں اور دوبارہ کریں

### Success! ✓
جب seed command یہ دکھائے:
```
✓ Connected to MongoDB
✓ Admin user created successfully
Email: admin123@gmail.com
Password: abdullah12345
```

---

## MongoDB Atlas - 5 منٹ میں Setup

1. https://www.mongodb.com/cloud/atlas پر جاؤ
2. Sign up (Gmail سے) ✓
3. Create Free Cluster ✓
4. Database Access میں username/password بنائیں
5. Network Access میں "Add IP Address" → Allow All (0.0.0.0/0)
6. Cluster connections میں "Connect" → "Connect your application"
7. Connection string کاپی کریں اور .env میں لگائیں
8. Username اور password enter کریں connection string میں
9. `npm run seed` کریں

**Done!** 🎉
