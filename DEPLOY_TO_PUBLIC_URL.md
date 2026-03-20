# Deploy Holy Angels Substitution to Public URL

## 🎯 Goal: Get a Shareable Public Link (Not localhost)

You need a URL like `https://holy-angels-substitution.onrender.com` that anyone can access from anywhere!

---

## ✅ Option 1: Render.com (RECOMMENDED - Free & Easy)

### Why Render.com?
- ✅ **FREE tier** available
- ✅ **Automatic HTTPS** (secure)
- ✅ **Public URL** that works everywhere
- ✅ **Easy deployment** from GitHub
- ✅ **PostgreSQL database** included
- ⏱️ **Setup time:** 10-15 minutes

### Step-by-Step Deployment:

#### Step 1: Push Code to GitHub

1. Create GitHub account: https://github.com
2. Create new repository: "holy-angels-substitution"
3. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/holy-angels-substitution.git
   git push -u origin main
   ```

#### Step 2: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub (easier)
3. Connect your GitHub account

#### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your repository: `holy-angels-substitution`
3. Configure:
   - **Name:** `holy-angels-substitution` (or any name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

#### Step 4: Add PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Name: `holy-angels-db`
3. Region: Same as web service
4. Plan: Free
5. Click **"Create Database"**

#### Step 5: Configure Environment Variables

In your Web Service settings → Environment:
```
PORT=10000
DB_HOST=YOUR_DATABASE_HOST (copy from PostgreSQL dashboard)
DB_PORT=5432
DB_NAME=YOUR_DATABASE_NAME
DB_USER=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
```

**Get database credentials from:**
- PostgreSQL dashboard → Connection String or Internal Database URL

#### Step 6: Initialize Database

1. Go to PostgreSQL dashboard
2. Click **"Connect"** → **"psql"** or use **"Shell"**
3. Run database schema:
   ```bash
   psql $DATABASE_URL -f database/schema.sql
   ```
   
   OR manually:
   ```sql
   -- Copy contents of database/schema.sql and run in psql
   ```

#### Step 7: Deploy!

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait 2-3 minutes for deployment
3. **Get your public URL:** `https://holy-angels-substitution.onrender.com`

#### Step 8: Share Your Link! 🎉

```
https://holy-angels-substitution.onrender.com
```

**Anyone can access this from anywhere in the world!** ✅

---

## ✅ Option 2: Railway.app (Free Tier Available)

### Step 1: Push to GitHub
(Same as Render Step 1)

### Step 2: Deploy to Railway

1. Go to: https://railway.app
2. Sign up with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository

### Step 3: Add PostgreSQL

1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically provides connection variables

### Step 4: Set Environment Variables

Railway auto-detects, but add manually if needed:
- `JWT_SECRET` - Your secret key
- `NODE_ENV=production`

### Step 5: Generate Public Domain

1. Click on your service
2. **"Settings"** → **"Generate Domain"**
3. Get URL: `https://holy-angels-substitution.up.railway.app`

---

## ✅ Option 3: Fly.io (Good for Custom Domains)

1. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Sign up: `fly auth signup`
3. Launch: `fly launch`
4. Get URL: `https://holy-angels-substitution.fly.dev`

---

## ✅ Option 4: Vercel (If using Node.js without database complexity)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Get URL: `https://holy-angels-substitution.vercel.app`

---

## 🚀 Quick Deploy Script (Render.com)

Create this file to help with deployment:

```bash
# deploy-render.sh
echo "🚀 Deploying Holy Angels Substitution to Render.com..."
echo ""
echo "Step 1: Make sure your code is pushed to GitHub"
echo "Step 2: Go to https://render.com"
echo "Step 3: Create Web Service + PostgreSQL"
echo "Step 4: Add environment variables"
echo "Step 5: Deploy!"
echo ""
echo "Your public URL will be: https://your-app-name.onrender.com"
```

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Code pushed to GitHub
- [ ] `.env` file removed from git (use `.gitignore`)
- [ ] Database schema ready (`database/schema.sql`)
- [ ] Environment variables documented
- [ ] Server listens on correct port (Render uses 10000 or env PORT)

---

## 🔧 Update Server for Cloud

Your `server.js` already works! But if using Render, make sure:

```javascript
const PORT = process.env.PORT || 3000; // Render sets PORT automatically
```

✅ Already configured correctly!

---

## 🌐 After Deployment

### Your Public URLs:

**Render:**
```
https://holy-angels-substitution.onrender.com
```

**Railway:**
```
https://holy-angels-substitution.up.railway.app
```

**Custom Domain (Optional):**
```
https://holyangels-substitution.com
```

### Share With Anyone:

Just send them the link! They can:
- ✅ Access from anywhere
- ✅ Use on mobile, tablet, desktop
- ✅ No localhost needed
- ✅ HTTPS secure connection

---

## 📱 Test Your Public URL

1. Open in browser from any device
2. Test login/signup
3. Verify all features work
4. Share with your team!

---

## 🔐 Security Notes

- ✅ Always use HTTPS (automatic on Render/Railway)
- ✅ Use strong JWT_SECRET in production
- ✅ Keep database credentials secret
- ✅ Regular backups recommended

---

## 💡 Recommendation

**Use Render.com** - It's the easiest and most reliable free option with PostgreSQL included!

**Deployment Time:** ~15 minutes
**Free Tier:** Yes (with some limitations)
**Public URL:** Yes ✅
**HTTPS:** Automatic ✅
**Database:** Included ✅

---

## 🆘 Need Help?

If you get stuck:
1. Check Render/Railway logs in dashboard
2. Verify environment variables
3. Check database connection
4. Test API endpoints: `https://your-url.com/api/health`

---

**Once deployed, you'll have a public link that anyone can use!** 🎉