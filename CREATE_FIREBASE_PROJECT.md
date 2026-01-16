# Create Firebase Project - Step by Step

## Method 1: Web Console (Easiest) ✅

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Sign in with your Google account

2. **Create New Project:**
   - Click **"Add project"** or **"Create a project"**
   - Enter project name: `rehabserve` (or any name you prefer)
   - Click **"Continue"**

3. **Google Analytics (Optional):**
   - You can disable Google Analytics if you don't need it
   - Click **"Continue"** or **"Create project"**

4. **Wait for Creation:**
   - Firebase will create your project (takes ~30 seconds)
   - Click **"Continue"** when done

5. **Copy Your Project ID:**
   - On the project overview page, you'll see your **Project ID**
   - It looks like: `rehabserve-12345` or `rehabserve-abcde`
   - **Copy this Project ID**

6. **Update .firebaserc:**
   - Open `.firebaserc` file
   - Replace `your-firebase-project-id` with your actual Project ID
   - Save the file

7. **Continue with Initialization:**
   ```bash
   npm run firebase:init
   ```

---

## Method 2: CLI (Alternative)

If you prefer command line:

```bash
# Create project (will prompt for name)
npx firebase-tools projects:create rehabserve

# After creation, update .firebaserc with the project ID shown
```

---

## After Creating Project

Once you have your Project ID, update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-actual-project-id-here"
  }
}
```

Then run:
```bash
npm run firebase:init
```







