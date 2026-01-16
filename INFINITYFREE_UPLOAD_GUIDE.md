# InfinityFree Upload Guide - Fix "Directory creation" Error

## ❌ The Error

**"Upload failed: Directory creation is only allowed in htdocs folders for security reasons"**

This happens when you try to:
- Upload the `dist` folder itself (instead of its contents)
- Create folders outside `htdocs`
- Upload to the wrong directory

---

## ✅ Correct Upload Method

### **Important Rules:**
1. ✅ Upload files **directly to `htdocs`** folder
2. ✅ Upload the **contents** of `dist` folder, NOT the `dist` folder itself
3. ✅ The `assets` folder is allowed (it will be created inside `htdocs`)

---

## 📋 Step-by-Step Upload (cPanel File Manager)

### **Step 1: Prepare Your Files**

First, make sure you have the `.htaccess` file:

```bash
npm run build:infinityfree
```

This creates:
- `dist/index.html`
- `dist/assets/` (folder with CSS and JS)
- `dist/.htaccess`
- Other files (videos, etc.)

### **Step 2: Open cPanel File Manager**

1. Log in to InfinityFree dashboard
2. Click **"Manage"** next to your website
3. Click **"Login to cPanel"**
4. Open **"File Manager"**

### **Step 3: Navigate to htdocs**

1. In File Manager, you should see folders like:
   - `domains`
   - `htdocs` ← **This is where you upload!**
   - `logs`
   - etc.

2. **Click on `htdocs` folder** to open it
3. This is your website root directory

### **Step 4: Clean htdocs (if needed)**

1. Select all existing files in `htdocs` (if any)
2. Delete them (to avoid conflicts)

### **Step 5: Upload Files**

**Method A: Upload Individual Files**

1. Click **"Upload"** button in File Manager
2. Navigate to your `dist` folder on your computer
3. **Select ALL files and folders** from `dist`:
   - `index.html`
   - `.htaccess`
   - `assets` folder (select the entire folder)
   - `RehabBotIdle2.mp4`
   - `RehabBotSpeaking3.mp4`
   - `VoiceProf.ogg`
4. Click **"Upload"**
5. Wait for upload to complete

**Method B: Upload via Drag & Drop**

1. Open your `dist` folder in Windows Explorer
2. Select all files and folders
3. Drag and drop them into the `htdocs` folder in File Manager
4. Wait for upload to complete

### **Step 6: Verify Structure**

After upload, your `htdocs` folder should look like:

```
htdocs/
├── index.html          ← Main file
├── .htaccess           ← Routing config
├── assets/             ← CSS and JS files
│   ├── index-xxxxx.css
│   └── index-xxxxx.js
├── RehabBotIdle2.mp4
├── RehabBotSpeaking3.mp4
└── VoiceProf.ogg
```

**Important:** `index.html` should be directly in `htdocs`, NOT in a subfolder!

---

## 📋 Step-by-Step Upload (FTP Client)

### **Step 1: Get FTP Credentials**

1. In cPanel, go to **"FTP Accounts"**
2. Note down:
   - **FTP Server:** (e.g., `ftpupload.net`)
   - **Username:** (your FTP username)
   - **Password:** (your FTP password)
   - **Port:** 21

### **Step 2: Connect with FileZilla**

1. Open FileZilla
2. Enter your FTP credentials:
   - **Host:** Your FTP server
   - **Username:** Your FTP username
   - **Password:** Your FTP password
   - **Port:** 21
3. Click **"Quickconnect"**

### **Step 3: Navigate to htdocs**

1. On the **right side** (remote server), navigate to:
   - `/htdocs` or `/domains/yourdomain.com/public_html`
2. This is your website root

### **Step 4: Upload Files**

1. On the **left side** (local computer), navigate to your `dist` folder
2. **Select all files and folders** in `dist`:
   - `index.html`
   - `.htaccess`
   - `assets` folder
   - All video/audio files
3. **Drag and drop** them to the right side (`htdocs` folder)
4. Wait for upload to complete

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This:
- ❌ Upload the `dist` folder itself
- ❌ Try to create folders outside `htdocs`
- ❌ Upload to `domains` or other folders
- ❌ Create a subfolder inside `htdocs` for your app

### ✅ Do This:
- ✅ Upload files directly to `htdocs` root
- ✅ Keep the `assets` folder structure (it's allowed)
- ✅ Make sure `index.html` is in `htdocs` root

---

## 🔍 Verify Your Upload

After uploading, check:

1. **File Structure:**
   - `htdocs/index.html` exists
   - `htdocs/.htaccess` exists
   - `htdocs/assets/` folder exists

2. **Visit Your Site:**
   - Go to: `https://your-site.infinityfreeapp.com`
   - Should see your landing page

3. **Check Browser Console:**
   - Press F12
   - Check for any 404 errors
   - Assets should load from `/assets/` path

---

## 🐛 Still Having Issues?

### Issue: "Cannot create folder"
- Make sure you're in `htdocs` folder
- Don't try to create folders manually - upload the `assets` folder directly

### Issue: Files not showing
- Refresh File Manager
- Check file permissions (should be 644 for files, 755 for folders)

### Issue: 404 errors
- Verify `index.html` is in `htdocs` root (not in a subfolder)
- Check `.htaccess` file exists
- Clear browser cache

---

## 📝 Quick Checklist

- [ ] Built the app: `npm run build:infinityfree`
- [ ] Opened `htdocs` folder in cPanel
- [ ] Uploaded `index.html` to `htdocs` root
- [ ] Uploaded `.htaccess` to `htdocs` root
- [ ] Uploaded `assets` folder to `htdocs`
- [ ] Uploaded all video/audio files
- [ ] Verified `index.html` is in `htdocs` root (not subfolder)
- [ ] Tested the website URL

---

**Follow these steps and your upload should work! 🚀**







