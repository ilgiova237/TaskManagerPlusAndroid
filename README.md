# ⚡ TaskManager+ for Android
**Lightweight Android system monitor — by G23**

> Also check out: [G23-GetSysInfo](https://g23dev.vercel.app/project/getsysinfo) · [g23dev.vercel.app](https://g23dev.vercel.app/)

---

## Features
- **Performance** — Battery level/status, total RAM, device info
- **Apps** — Installed apps list, filter by name, show/hide system apps
- **Cache** — Scan and clear this app's own cache
- **About** — App info, links to G23 projects

> No root required. Android restricts killing other apps or clearing their cache — this app works within those limits.

---

## How to get the APK (step by step, no Android Studio needed)

### Step 1 — Create a GitHub account
1. Go to [github.com](https://github.com)
2. Click **Sign up** and create a free account
3. Verify your email

### Step 2 — Create a new repository
1. Click the **+** button (top right) → **New repository**
2. Name it: `TaskManagerPlusAndroid`
3. Set it to **Public**
4. **Do NOT** check "Add a README" — leave it empty
5. Click **Create repository**

### Step 3 — Upload the files
1. On the empty repo page, click **uploading an existing file**
2. Upload ALL the files you downloaded, keeping the folder structure:
   ```
   App.js
   app.json
   babel.config.js
   eas.json
   package.json
   .gitignore
   src/
     theme.js
     screens/
       PerformanceScreen.js
       AppsScreen.js
       CacheScreen.js
       AboutScreen.js
   .github/
     workflows/
       build.yml
   ```
   > **Important:** GitHub's web uploader doesn't create folders automatically.
   > You need to type the path manually when uploading, e.g. type `src/theme.js` in the filename field.
   > Or use the method below.

### Step 3 (easier alternative) — Use GitHub Desktop
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Clone your new empty repo to your PC
4. Copy all the project files into the cloned folder (keeping folder structure)
5. In GitHub Desktop: write a commit message → click **Commit** → click **Push**

### Step 4 — Watch the build
1. Go to your repo on github.com
2. Click the **Actions** tab
3. You'll see a workflow called **"Build Android APK"** running
4. Wait 5–10 minutes for it to finish (green checkmark = success)

### Step 5 — Download the APK
1. Click on the completed workflow run
2. Scroll down to **Artifacts**
3. Click **TaskManagerPlus-APK** to download a `.zip`
4. Unzip it — inside is `app-release.apk`

### Step 6 — Install on your phone
1. Send the APK to your phone (WhatsApp, Google Drive, USB cable, etc.)
2. Open it on your phone
3. Android will ask to **"Allow from this source"** — tap Allow
4. Install and open TaskManager+

---

## Project structure
```
TaskManagerPlusAndroid/
├── App.js                          # Entry point, navigation
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── eas.json                        # Build config
├── babel.config.js
├── .gitignore
├── src/
│   ├── theme.js                    # Colors and fonts
│   └── screens/
│       ├── PerformanceScreen.js    # Battery, RAM, device info
│       ├── AppsScreen.js           # Installed apps list
│       ├── CacheScreen.js          # Cache cleaner
│       └── AboutScreen.js          # About + G23 links
└── .github/
    └── workflows/
        └── build.yml               # GitHub Actions APK builder
```

---

## Limitations (Android without root)
- Cannot kill other apps' processes
- Cannot clear other apps' cache
- Process list with CPU% per app is blocked by Android
- GPU stats not available (no standard API)

---

*© 2025 G23 · TaskManager+ Android is open source*
