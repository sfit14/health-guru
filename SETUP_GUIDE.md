# Health Guru — Setup Guide
## Get your app live on your phone in ~20 minutes

---

## STEP 1 — Upload to GitHub (5 min)

1. Go to **github.com** and log in
2. Click the **+** icon (top right) → **New repository**
3. Name it `health-guru`
4. Set to **Public**
5. Click **Create repository**
6. On the next page, click **uploading an existing file**
7. Drag and drop the entire `health-guru` folder contents
8. Click **Commit changes**

---

## STEP 2 — Deploy on Vercel (3 min)

1. Go to **vercel.com** and log in with GitHub
2. Click **Add New → Project**
3. Find `health-guru` in your GitHub repos → click **Import**
4. Leave all settings as default
5. Click **Deploy**
6. Wait ~60 seconds — Vercel gives you a live URL like `health-guru-xxx.vercel.app`
7. **Copy this URL** — you'll need it for OneSignal

---

## STEP 3 — Set up OneSignal notifications (10 min)

1. Go to **onesignal.com** and log in
2. Click **New App / Website**
3. Name it `Health Guru` → click **Next**
4. Choose **Web** as your platform
5. Fill in:
   - **Site Name:** Health Guru
   - **Site URL:** your Vercel URL (e.g. `https://health-guru-xxx.vercel.app`)
6. Click **Save & Continue** through the setup
7. You'll get an **App ID** — it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
8. **Copy this App ID**

---

## STEP 4 — Add your OneSignal App ID to the code (2 min)

1. Go back to your GitHub repo
2. Open the file `index.html`
3. Click the **pencil icon** (Edit)
4. Find this line:
   ```
   appId: "YOUR_ONESIGNAL_APP_ID",
   ```
5. Replace `YOUR_ONESIGNAL_APP_ID` with your actual App ID
6. Click **Commit changes**
7. Vercel will automatically redeploy in ~60 seconds

---

## STEP 5 — Schedule your daily notifications (5 min)

In OneSignal:
1. Go to **Messages → New Push**
2. Set up 3 scheduled notifications:

### Morning Affirmation (8:00 AM daily)
- Title: `Health Guru 🔥`
- Message: `Your morning affirmation is waiting. Open up and lock in.`
- Schedule: Daily at 8:00 AM

### Eating Window Reminder (12:45 PM daily)
- Title: `Window opens in 15 mins ⏱`
- Message: `Almost 1pm. Choose your first meal wisely. Make it protein.`
- Schedule: Daily at 12:45 PM

### Evening Check-in (8:30 PM daily)
- Title: `Log your day 📋`
- Message: `30 mins left in your window. Check in and close strong.`
- Schedule: Daily at 8:30 PM

---

## STEP 6 — Install on your phone (2 min)

### iPhone (Safari only — must use Safari):
1. Open Safari and go to your Vercel URL
2. Tap the **Share** button (box with arrow pointing up)
3. Scroll down → tap **Add to Home Screen**
4. Tap **Add**
5. Health Guru now lives on your home screen like a real app
6. Open it and tap **Enable Daily Notifications** when prompted

### Android (Chrome):
1. Open Chrome and go to your Vercel URL
2. Tap the **three dots** menu (top right)
3. Tap **Add to Home screen**
4. Tap **Add**
5. Open the app → tap **Enable Daily Notifications**

---

## UPDATING THE APP IN FUTURE

Whenever you want changes made:
1. Tell Claude what you want updated
2. Claude gives you updated code
3. Go to GitHub → find the changed file → click pencil → paste new code → commit
4. Vercel redeploys automatically in 60 seconds
5. Done ✓

---

**Your live URL:** `https://health-guru-xxx.vercel.app` (replace with yours)
