# Cloudflare Pages Deployment Guide

## ✅ Yes, Cloudflare Pages is Perfect for Your Project!

Cloudflare Pages is **excellent** for your React/Vite RehabServE application. It offers:
- ✅ **FREE** hosting with generous limits
- ✅ Fast global CDN (faster than Firebase in many regions)
- ✅ Automatic HTTPS/SSL
- ✅ Custom domain support
- ✅ Git-based automatic deployments
- ✅ Environment variables support
- ✅ Better free tier than Firebase Hosting

---

## 📋 Prerequisites

1. **Cloudflare Account** (FREE - sign up at https://dash.cloudflare.com/sign-up)
2. **GitHub/GitLab Account** (for automatic deployments)
3. **Your project pushed to a Git repository**

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub/GitLab

If you haven't already, create a repository and push your code:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a GitHub repository, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### Step 2: Create a Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Workers & Pages"** in the sidebar
3. Click **"Create application"** → **"Pages"** → **"Connect to Git"**
4. Authorize Cloudflare to access your GitHub/GitLab account
5. Select your repository

### Step 3: Configure Build Settings

**Build Configuration:**
- **Framework preset:** `Vite` (or `None` if Vite not listed)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave as default)


### Step 4: Deploy

Click **"Save and Deploy"** - Cloudflare will:
1. Install dependencies (`npm install`)
2. Build your app (`npm run build`)
3. Deploy to Cloudflare's global CDN

🎉 **Done!** Your app will be live at: `https://your-project-name.pages.dev`

---

## 🔧 Required Configuration Files

### 1. Create `_redirects` file (for SPA routing)

This file is already created in the `public` folder. It ensures React Router works correctly.

### 2. Update `vite.config.ts` (already configured)

Your config uses `base: '/'` which works perfectly with Cloudflare Pages. This ensures assets load correctly with absolute paths.

---

## 🌐 Custom Domain Setup

1. In Cloudflare Pages dashboard, go to your project
2. Click **"Custom domains"** → **"Set up a custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Cloudflare automatically provisions SSL certificates

---

## 🔄 Automatic Deployments

Once connected to Git:
- **Every push to `main` branch** → Production deployment
- **Pull requests** → Preview deployments (for testing)
- **Deployments are instant** (usually < 2 minutes)

---

## 📝 Environment Variables

### Adding Environment Variables:

1. Go to your Cloudflare Pages project
2. Click **"Settings"** → **"Environment variables"**
3. Add variables:
   - `VITE_ELEVENLABS_API_KEY`
   - `VITE_ELEVENLABS_VOICE_ID`
4. Select environment (Production, Preview, or both)
5. Redeploy for changes to take effect

### Accessing in Code:

```typescript
const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
```

---

## 🎯 Cloudflare Pages Features

### ✅ What Works Perfectly:
- ✅ React SPA routing (via `_redirects` file)
- ✅ Static assets (images, videos, fonts)
- ✅ Google Sheets API calls (works from frontend)
- ✅ SessionStorage (client-side)
- ✅ All your charts and visualizations
- ✅ Chatbot functionality
- ✅ Video playback (RehabBot videos)

### ⚠️ Important Notes:
- **Backend:** Your backend folder isn't used, so you don't need to deploy it
- **Database:** You're using Google Sheets, which is already hosted
- **API Keys:** Store sensitive keys in Cloudflare Pages environment variables

---

## 🆓 Free Tier Limits

Cloudflare Pages **Free Plan** includes:
- ✅ **Unlimited** requests
- ✅ **500 builds/month** (more than enough)
- ✅ **Unlimited** bandwidth
- ✅ **100 GB** bandwidth/month
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Preview deployments

**This is more than enough for your RehabServE dashboard!**

---

## 🆚 Cloudflare Pages vs Firebase Hosting

| Feature | Cloudflare Pages | Firebase Hosting |
|---------|-----------------|-------------------|
| Free Bandwidth | 100 GB/month | 360 MB/day (~10.8 GB/month) |
| Builds | 500/month | Unlimited |
| CDN Speed | Very Fast | Fast |
| Git Integration | Built-in | Requires GitHub Actions |
| Preview Deployments | Automatic | Manual |
| **Winner** | ✅ **Cloudflare Pages** | |

---

## 🐛 Troubleshooting

### Issue: "Wrangler deploy error - Specify the path to the directory of assets"

**This error occurs when Cloudflare Pages tries to use Wrangler CLI instead of Pages deployment.**

**Solution 1: Use Cloudflare Pages Dashboard (Recommended)**
1. **Don't use Wrangler CLI** - Use the Cloudflare Dashboard instead
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Pages**
3. Click **"Create application"** → **"Connect to Git"**
4. Select your repository and configure build settings
5. Cloudflare Pages will handle deployment automatically

**Solution 2: If you must use CLI, use Pages CLI (not Wrangler)**

**⚠️ IMPORTANT: You must create the project in Cloudflare Dashboard FIRST!**

1. **Create project in Dashboard:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Pages**
   - Click **"Create application"** → **"Connect to Git"** OR **"Upload assets"**
   - Set project name (e.g., `rehabserve-project`)
   - Configure build settings if using Git

2. **Then deploy via CLI:**
```bash
# Install Cloudflare Pages CLI
npm install -g wrangler

# Login to Cloudflare first
npx wrangler login

# Build your app first
npm run build

# Deploy using Pages command (NOT wrangler deploy)
# Use --project-name flag (with a space, not equals sign)
npx wrangler pages deploy dist --project-name your-project-name

# Example:
# npx wrangler pages deploy dist --project-name rehabserve-project
```

**Important:** 
- The correct syntax is `--project-name your-project-name` (with a space)
- NOT `--project-name=your-project-name` 
- NOT `--your-project-name`
- Project must exist in Cloudflare Dashboard first!

**Solution 3: Check Build Settings in Dashboard**
1. Go to your Cloudflare Pages project
2. Click **"Settings"** → **"Builds & deployments"**
3. Verify:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or leave empty)
4. Make sure you're using **"Pages"** not **"Workers"**

**Why this happens:**
- You might have accidentally created a **Workers** project instead of **Pages** project
- Or Cloudflare is detecting your project as a Worker instead of a static site
- **Solution:** Delete the project and create a new **Pages** project (not Workers)

### Issue: "404 on page refresh"
✅ Fixed! The `public/_redirects` file handles SPA routing.

### Issue: "Project not found" error

**Error:** `Project not found. The specified project name does not match any of your existing projects.`

**Solution:**
1. Create the project in Cloudflare Dashboard first:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Pages**
   - Click **"Create application"** → Choose **"Upload assets"** or **"Connect to Git"**
   - Enter your project name (e.g., `rehabserve-project`)
   - Save the project
2. Then deploy using CLI with the exact project name

### Issue: "Build fails"
```bash
# Make sure build command is correct
npm run build

# Check that dist folder is created
ls dist  # or dir dist on Windows
```

### Issue: "Environment variables not working"
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check variable is set for correct environment (Production/Preview)

### Issue: "CORS errors with Google Sheets"
✅ Google Sheets API allows requests from any origin, so this shouldn't be an issue.

### Issue: "Something went wrong - The application encountered an error"

**This error page appears when the ErrorBoundary catches a JavaScript error.**

**Common causes and solutions:**

1. **Base path issue (most common):**
   - Check `vite.config.ts` - should use `base: '/'` for Cloudflare Pages
   - Rebuild: `npm run build`
   - Redeploy

2. **Google Sheets API error:**
   - Open browser console (F12) to see the actual error
   - Check if Google Sheet is publicly accessible
   - Verify the SHEET_ID in `src/App.tsx` is correct

3. **Missing assets:**
   - Check browser console for 404 errors
   - Verify all assets are in `dist` folder
   - Check that `_redirects` file is in `public` folder (copied to `dist`)

4. **Check browser console:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for red error messages
   - Share the error message for specific help

5. **Clear cache and reload:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or use "Clear Session & Reload" button on error page

---

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)

---

## ✨ Quick Comparison

**Cloudflare Pages Advantages:**
- ✅ More free bandwidth (100 GB vs 10.8 GB)
- ✅ Better CDN performance
- ✅ Built-in Git integration
- ✅ Preview deployments
- ✅ Faster deployments

**Firebase Hosting Advantages:**
- ✅ Integrated with Firebase services
- ✅ Simpler for Firebase ecosystem projects

**For your project:** Cloudflare Pages is the better choice! 🚀

---

## 🎯 Next Steps

1. ✅ Create `public/_redirects` file (already done)
2. ✅ Push code to GitHub/GitLab
3. ✅ Connect to Cloudflare Pages
4. ✅ Configure build settings
5. ✅ Deploy!

**Your RehabServE system is ready for Cloudflare Pages! 🚀**
