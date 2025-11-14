# 🚀 Easy Vercel Deployment Guide

## Quick Overview

You'll deploy this project in 2 parts:
1. **Backend** (Express API) → Render.com or Railway.app (Free tier)
2. **Frontend** (Next.js) → Vercel (Free tier)

**Total Time:** ~15-20 minutes  
**Cost:** $0 (using free tiers)

---

## Part 1: Deploy Backend to Render.com (5-10 minutes)

### Step 1: Prepare Backend for Deployment

**1.1 Create a start script in `backend/package.json`:**

Check if you have this in your backend package.json:
```json
"scripts": {
  "start": "node dist/server.js",
  "build": "tsc",
  "dev": "nodemon --exec ts-node src/server.ts"
}
```

**1.2 Create `backend/.gitignore` (if not exists):**
```
node_modules/
dist/
.env
uploads/
*.log
```

### Step 2: Push Code to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: ATS Resume Optimizer"

# Create a new repository on GitHub (go to github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/ats-resume-optimizer.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend on Render.com

**3.1 Go to [Render.com](https://render.com) and sign up/login**

**3.2 Click "New +" → "Web Service"**

**3.3 Connect your GitHub repository:**
- Grant Render access to your GitHub
- Select your `ats-resume-optimizer` repository

**3.4 Configure the service:**
```
Name: ats-resume-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

**3.5 Select Free Instance Type:**
- Click "Free" plan
- Note: Free tier spins down after 15 minutes of inactivity

**3.6 Add Environment Variables:**
Click "Advanced" → "Add Environment Variable":
```
PORT = 5000
NODE_ENV = production
OPENROUTER_API_KEY = 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
CORS_ORIGIN = https://YOUR-VERCEL-URL.vercel.app
MAX_FILE_SIZE = 10485760
ALLOWED_EXTENSIONS = pdf,docx
```
*(We'll update CORS_ORIGIN after deploying frontend)*

**3.7 Click "Create Web Service"**

Wait 5-10 minutes for deployment. You'll get a URL like:
```
https://ats-resume-backend.onrender.com
```

**Save this URL! You'll need it for the frontend.**

---

## Part 2: Deploy Frontend to Vercel (5-10 minutes)

### Step 1: Install Vercel CLI (Optional but Recommended)

```powershell
# Install Vercel globally
pnpm install -g vercel

# Or use npx (no installation needed)
# We'll use npx in the steps below
```

### Step 2: Update Frontend Environment Variable

**2.1 Create `vercel.json` in project root:**
```powershell
# In project root (not in backend folder)
cd "C:\Users\Ojas Neve\OneDrive\ドキュメント\personal\Projects\Ai resume"
```

Create `vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://ats-resume-backend.onrender.com/api"
  }
}
```

**2.2 Update `.env.local` for local development:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Deploy to Vercel

**Option A: Deploy via Vercel CLI (Recommended)**

```powershell
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod
```

Follow the prompts:
```
? Set up and deploy "~/Projects/Ai resume"? [Y/n] Y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] N
? What's your project's name? ats-resume-optimizer
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Option B: Deploy via Vercel Dashboard (Easier for beginners)**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```
5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = https://ats-resume-backend.onrender.com/api
   ```
6. Click "Deploy"

**You'll get a URL like:**
```
https://ats-resume-optimizer.vercel.app
```

### Step 4: Update Backend CORS Settings

**4.1 Go back to Render.com dashboard**

**4.2 Navigate to your backend service → Environment**

**4.3 Update `CORS_ORIGIN` variable:**
```
CORS_ORIGIN = https://ats-resume-optimizer.vercel.app
```

**4.4 Save changes** (Render will auto-redeploy)

---

## Part 3: Verify Deployment (2 minutes)

### Test Your Live Application

**3.1 Open your Vercel URL:**
```
https://ats-resume-optimizer.vercel.app
```

**3.2 Test file upload:**
- Upload a sample PDF or DOCX resume
- Verify it processes correctly

**3.3 Test manual entry:**
- Fill out the manual entry form
- Submit and check if ATS scoring works

**3.4 Test AI enhancement:**
- Check if OpenRouter API responds
- Verify suggestions appear

**3.5 Test document generation:**
- Download DOCX file
- Download PDF file (if LaTeX is installed)

### Common Issues & Fixes

**Issue 1: CORS Error**
```
Access to fetch at 'https://...' has been blocked by CORS policy
```
**Fix:** Double-check `CORS_ORIGIN` in Render matches your Vercel URL exactly

**Issue 2: API Not Responding**
```
Failed to fetch or Network Error
```
**Fix:** 
- Render free tier spins down after inactivity
- First request takes 30-60 seconds to wake up
- Wait and retry

**Issue 3: Environment Variables Not Working**
```
API key missing or undefined
```
**Fix:**
- Go to Render → Environment → verify all variables are set
- Go to Vercel → Settings → Environment Variables → verify NEXT_PUBLIC_API_URL
- Redeploy both services

**Issue 4: PDF Generation Fails**
```
LaTeX command not found
```
**Fix:**
- On Render, add a Dockerfile or use Build Command:
  ```bash
  apt-get update && apt-get install -y texlive-xetex && npm install && npm run build
  ```
- Or disable PDF generation for now (DOCX still works)

---

## Part 4: Custom Domain (Optional, 5 minutes)

### Add Custom Domain to Vercel

**4.1 Go to Vercel Dashboard → Your Project → Settings → Domains**

**4.2 Add your domain:**
```
example.com
www.example.com
```

**4.3 Update DNS records at your domain registrar:**

For `example.com`:
```
Type: A
Name: @
Value: 76.76.21.21
```

For `www.example.com`:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**4.4 Wait for DNS propagation (5-60 minutes)**

**4.5 Update Backend CORS:**
```
CORS_ORIGIN = https://example.com
```

---

## Part 5: Continuous Deployment (Auto-Deploy)

### Setup Auto-Deploy on Git Push

Both Vercel and Render auto-deploy when you push to GitHub!

**To deploy changes:**
```powershell
# Make your changes
git add .
git commit -m "Updated features"
git push origin main
```

**What happens:**
1. Vercel automatically detects push → builds → deploys frontend (~2 min)
2. Render automatically detects push → builds → deploys backend (~5 min)

**View deployment status:**
- Vercel: Dashboard → Deployments tab
- Render: Dashboard → Events tab

---

## Part 6: Monitor Your Application

### Vercel Analytics (Free)

**6.1 Enable Analytics:**
- Go to Vercel Dashboard → Your Project → Analytics
- Click "Enable Analytics"

**6.2 View metrics:**
- Page views
- Performance scores
- Error tracking

### Render Logs

**6.1 View real-time logs:**
- Go to Render Dashboard → Your Service → Logs tab
- See all API requests, errors, and console.log output

**6.2 Monitor service health:**
- Dashboard shows uptime, CPU, memory usage
- Free tier: 512MB RAM, 0.1 CPU

---

## Quick Reference Commands

```powershell
# Deploy frontend to Vercel
npx vercel --prod

# View deployment logs
npx vercel logs

# Check Vercel projects
npx vercel ls

# Remove deployment
npx vercel rm PROJECT_NAME

# Push code updates
git add .
git commit -m "Your message"
git push origin main
```

---

## Cost Breakdown (Free Tier Limits)

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions (100GB-hours/month)

### Render Free Tier
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ 512MB RAM
- ✅ Auto-sleep after 15 min inactivity
- ✅ Automatic HTTPS
- ⚠️ Slow cold starts (30-60 seconds)

**Upgrade if needed:**
- Render Starter Plan: $7/month (no sleep, better performance)
- Vercel Pro: $20/month (team features, more bandwidth)

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Backend deployed successfully on Render
- [ ] Backend URL is accessible (open in browser, should see JSON response)
- [ ] Frontend deployed successfully on Vercel
- [ ] `NEXT_PUBLIC_API_URL` in Vercel matches backend URL
- [ ] `CORS_ORIGIN` in Render matches frontend URL
- [ ] OpenRouter API key is set in Render environment variables
- [ ] Git repository is up to date
- [ ] No build errors in deployment logs

---

## Alternative: Deploy Backend to Railway.app

If Render doesn't work, try Railway:

**1. Go to [railway.app](https://railway.app)**

**2. Click "Start a New Project" → "Deploy from GitHub repo"**

**3. Select your repository and configure:**
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

**4. Add environment variables (same as Render)**

**5. Get your Railway URL:**
```
https://your-project.railway.app
```

**6. Update Vercel's NEXT_PUBLIC_API_URL**

Railway advantages:
- ✅ No cold starts (stays awake)
- ✅ Free $5 credit/month
- ✅ Better performance than Render free tier

---

## Success! 🎉

Your ATS Resume Optimizer is now live at:
- **Frontend:** https://ats-resume-optimizer.vercel.app
- **Backend:** https://ats-resume-backend.onrender.com

Share it on LinkedIn, add it to your portfolio, and start getting feedback!

---

## Next Steps

1. **Test thoroughly** with different resume formats
2. **Monitor errors** in Vercel and Render dashboards
3. **Gather feedback** from friends/colleagues
4. **Iterate** based on user feedback
5. **Add features** from PROJECT_DOCUMENTATION.md Phase 2
6. **Consider upgrading** to paid tiers if you get traffic

---

**Need Help?**

- Vercel Documentation: https://vercel.com/docs
- Render Documentation: https://render.com/docs
- Railway Documentation: https://docs.railway.app

**Common Questions:**

**Q: Why is my first request slow?**  
A: Render free tier spins down. First request takes 30-60 seconds to wake up.

**Q: Can I use a different backend host?**  
A: Yes! Try Railway.app, Heroku, DigitalOcean App Platform, or AWS Elastic Beanstalk.

**Q: Do I need to pay for anything?**  
A: No, everything works on free tiers. Only upgrade if you need better performance.

**Q: How do I update my deployed app?**  
A: Just push to GitHub. Both services auto-deploy. Or run `npx vercel --prod` for frontend.

**Q: Can I deploy without GitHub?**  
A: Yes, use Vercel CLI: `npx vercel --prod` from your project directory.

---

**End of Deployment Guide**
