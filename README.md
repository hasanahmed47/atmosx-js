# AtmosX Weather App 
> Dynamic weather with live atmospheric effects — rain, clouds, snow, sun animations

---

##  Local Setup

### 1. Install
```bash
npm install
```

### 2. Add API Key
Open `.env.local`:
```
OWM_KEY=your_openweathermap_key_here
```
Get free key at → https://openweathermap.org/api
> ⚠️ New keys activate in ~2 hours. App shows demo data until then.

### 3. Run
```bash
npm run dev
```
Open → http://localhost:3000

---

##  API Key Security
The key uses `OWM_KEY` (no `NEXT_PUBLIC_` prefix).
This means it **only exists on the server** — never sent to the browser.
All weather API calls go through `/api/weather` route internally.

---

## ☁️ Deploy to Vercel (Free)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "AtmosX weather app"
# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/atmosx.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to → https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your `atmosx` repository
5. Click **Deploy** (Next.js auto-detected)

### Step 3 — Add Environment Variable
1. Go to your project on Vercel
2. **Settings → Environment Variables**
3. Add:
   - Name: `OWM_KEY`
   - Value: `your_actual_api_key`
4. Click **Save**
5. Go to **Deployments → Redeploy**

 Your app is live at `https://your-project.vercel.app`

---

## 🌦️ Dynamic Backgrounds
| Weather | Background | Effect |
|---------|-----------|--------|
| ☀️ Clear Day | Sky blue → orange | Animated sun with rays |
| 🌙 Clear Night | Deep navy → indigo | Stars + moon |
| ☁️ Cloudy | Slate gray | Drifting clouds |
| 🌧️ Rain | Deep blue | Falling raindrops + ripples |
| ⛈️ Thunder | Dark navy | Lightning flash + rain |
| 🌨️ Snow | Light blue-gray | Falling snowflakes |
| 🌫️ Fog | Gray | Drifting fog layers |

---

## 🧠 Technical Features
- **Debounce** — 400ms delay on search input
- **Throttle** — Max 1 API call/second
- **Lazy Loading** — Components load on demand via `next/dynamic`
- **Server-side API** — Key never exposed to browser
- **Mock fallback** — Demo data when API key inactive
- **Geolocation** — Auto-detects on load

---

Made by Muhammad Hasan — CS @ UBIT Karachi 🇵🇰
