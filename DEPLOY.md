# 🚀 Deploying HackVote to the Internet

This makes your voting system accessible from **any phone, any network, anywhere**.

Stack:
- **MongoDB Atlas** — free cloud database
- **Render** — free Node.js backend hosting
- **Vercel** — free React frontend hosting

Total time: ~15 minutes. All free.

---

## Step 1 — MongoDB Atlas (Database)

1. Go to https://mongodb.com/atlas → **Sign up free**
2. Create a free **M0 cluster** (pick any region)
3. When asked to create a user:
   - Username: `hackvote`
   - Password: something strong — **save it**
4. When asked about network access → click **"Allow access from anywhere"** → `0.0.0.0/0`
5. Click **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://hackvote:<password>@cluster0.xxxxx.mongodb.net/hackvote
   ```
   Replace `<password>` with your actual password.

---

## Step 2 — Deploy Backend to Render

1. Go to https://render.com → **Sign up free** (use GitHub)
2. Push your project to GitHub first:
   ```bash
   cd hackvote
   git init
   git add .
   git commit -m "initial"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/hackvote.git
   git push -u origin main
   ```
3. In Render → **New** → **Web Service** → connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Add **Environment Variables** (in Render dashboard → Environment tab):
   | Key | Value |
   |-----|-------|
   | `MONGO_URI` | your Atlas connection string |
   | `ADMIN_PIN` | `1234` (or change it) |
   | `FRONTEND_URL` | leave blank for now, fill in after Step 3 |
6. Click **Deploy** → wait ~2 minutes
7. Copy your backend URL: `https://hackvote-backend.onrender.com`

---

## Step 3 — Deploy Frontend to Vercel

1. Go to https://vercel.com → **Sign up free** (use GitHub)
2. **New Project** → Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://hackvote-backend.onrender.com` |
5. Click **Deploy** → wait ~1 minute
6. Copy your frontend URL: `https://hackvote.vercel.app`

---

## Step 4 — Connect Everything

Go back to **Render** → your backend → **Environment** → update:
```
FRONTEND_URL = https://hackvote.vercel.app
```
Click **Save** → Render will redeploy automatically.

---

## Done! Your URLs:

| Screen | URL |
|--------|-----|
| 🗳 Vote (QR target) | `https://hackvote.vercel.app/` |
| 📊 Leaderboard | `https://hackvote.vercel.app/board` |
| 🔐 Admin | `https://hackvote.vercel.app/admin` |

The QR code in the Admin panel will automatically point to your Vercel URL.
Anyone on **any network, any phone** can scan it and vote.

---

## Seeding Teams After Deploy

Once deployed, run the seed script once to load all 41 teams:

Option A — From your local machine:
```bash
cd backend
MONGO_URI="your-atlas-uri" node seed.js
```

Option B — The teams auto-seed when the backend first starts (already built in).

---

## ⚠️ Free Tier Notes

- **Render free tier** spins down after 15 min of inactivity → first request after idle takes ~30 sec to wake up. This is fine for a hackathon — just open the admin page a minute before voting starts.
- **MongoDB Atlas M0** is free forever, 512MB storage — more than enough.
- **Vercel** is free forever for personal projects.
