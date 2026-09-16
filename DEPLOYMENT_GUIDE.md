# 🚀 Complete Cloud Deployment Guide: Vercel & Render
### Access ColoAI / PolypAI From Anywhere on Any Device (Mobile, Laptop, Tablet)

This guide walks you through deploying your fullstack application to the cloud using industry-standard platforms:
- **Frontend (React Vite PWA)**: Hosted on **[Vercel](https://vercel.com)** (Free, Ultra-fast Global Edge CDN)
- **Backend (Node.js Express API)**: Hosted on **[Render](https://render.com)** (Free 24/7 Web Service)
- **Database (MongoDB Atlas)**: Already hosted in the cloud (`coloai_prod`)

---

## 📋 Prerequisites Checklist

1. A **[GitHub](https://github.com)** account containing your repository:
   - Repo URL: `https://github.com/Sumanth071/Nazma_Team_PRo`
2. A free account on **[Render.com](https://render.com)**
3. A free account on **[Vercel.com](https://vercel.com)**
4. **MongoDB Atlas Network Access**:
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com) ➜ **Network Access**.
   - Ensure IP Access List contains `0.0.0.0/0` (Allow access from anywhere). This allows Render's cloud servers to connect to your database.

---

## 1️⃣ STEP 1: Push Latest Changes to GitHub

Run these commands in your terminal or VS Code to ensure GitHub has all the new cloud deployment configs:

```bash
# 1. Switch to main (or staging)
git add .
git commit -m "feat(deploy): Add Vercel and Render deployment configurations"
git push origin main
```
*(If your default branch on GitHub is `main`, push to `main`. If you use `staging`, push to `staging`).*

---

## 2️⃣ STEP 2: Deploy Backend to Render

Render will host your Express API server and connect to MongoDB Atlas.

### Option A: 1-Click Blueprint Deployment (Recommended)
1. Go to your **[Render Dashboard](https://dashboard.render.com)**.
2. Click **New +** (top right) ➜ Select **Blueprint**.
3. Connect your GitHub repository: `Sumanth071/Nazma_Team_PRo`.
4. Render will automatically detect the `render.yaml` file in your repository!
5. Click **Apply**. Render will automatically provision the `coloai-backend` service.

---

### Option B: Manual Web Service Deployment
If you prefer configuring it manually:
1. On Render Dashboard, click **New +** ➜ **Web Service**.
2. Select **Build and deploy from a Git repository** ➜ Connect `Sumanth071/Nazma_Team_PRo`.
3. Fill in the following settings:
   - **Name**: `coloai-backend`
   - **Region**: Oregon (US West) or any nearby region
   - **Branch**: `main` (or `staging`)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **Environment Variables** and add the following keys:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://ksumanthyadav120:mongodb123@suman.1lwpnwk.mongodb.net/coloai_prod?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `coloai_prod_super_secure_vault_secret_2026_medical` |
   | `JWT_EXPIRES_IN` | `never` |
   | `STORAGE_TYPE` | `local` |
   | `UPLOAD_DIR` | `./uploads` |
5. Click **Deploy Web Service**.

---

### Verify Backend Deployment
Once the deployment finishes (usually 2–3 minutes):
1. Render will provide you a public URL (e.g., `https://coloai-backend-xxxx.onrender.com`).
2. Open that URL with `/api/health` in your browser:
   ```
   https://coloai-backend-xxxx.onrender.com/api/health
   ```
3. You should see a JSON response confirming it is online:
   ```json
   {
     "status": "healthy",
     "system": "ColoAI-Polyp Express API",
     "version": "1.0.0",
     "environment": "production"
   }
   ```
4. **Copy this Render URL** — you will need it for Step 3!

---

## 3️⃣ STEP 3: Deploy Frontend to Vercel

Vercel will host your fast React Vite frontend with full PWA and mobile support.

1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** ➜ Select **Project**.
3. Find and import your repository: `Sumanth071/Nazma_Team_PRo`.
4. In the **Configure Project** screen:
   - **Project Name**: `coloai-polyp` (or your preferred name)
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click **Edit** and select `client` (or leave default since root `vercel.json` is configured)
   - **Build and Output Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist`
5. Expand the **Environment Variables** section and add:
   | Name | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://coloai-backend-xxxx.onrender.com/api` |
   *(⚠️ Be sure to include `/api` at the end of your Render backend URL!)*
6. Click **Deploy**.

---

## 4️⃣ STEP 4: Access From Any Device & Present!

When Vercel completes the build (under 1 minute):
1. Vercel will show confetti and provide your official live link:
   ```
   https://coloai-polyp-xxxx.vercel.app
   ```
2. **Open this link on any computer, tablet, or phone anywhere in the world!**

### 🔑 Demo Login Accounts (Pre-Seeded in `coloai_prod`)
| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@coloaipoly.org` | `Password123!` | System Settings, User & Role Management, Audit Logs |
| **Researcher** | `researcher@coloaipoly.org` | `Password123!` | New Polyp Analysis, Explainable AI (SHAP), Reports |
| **Clinician** | `clinician@coloaipoly.org` | `Password123!` | Clinical Review Queue, Triage & Validation |

*(You can also use the 1-click **Quick Demo Login** buttons on the login screen!)*

---

## 📱 Mobile App (PWA) Installation

When accessing your Vercel link on mobile:
- **Android (Chrome)**: Tap the bottom banner "Install App" or tap the three dots `⋮` ➜ **Add to Home screen**.
- **iPhone / iPad (Safari)**: Tap the **Share** button ➜ **Add to Home Screen**.
- ColoAI will launch with a native app icon, fullscreen interface, and zero browser URL bars!

---

## 💡 Important Cloud Tips & Troubleshooting

### 1. Render Free Tier Wake-Up (Spin-Down)
- On Render's free tier, services go to sleep if there are no requests for 15 minutes.
- When you first visit your Vercel app after a period of inactivity, the first login or API call might take **30 to 50 seconds** while Render spins up the container.
- Subsequent clicks will be blazing fast!
- *Viva / Presentation Tip*: Open your app 5 minutes before presenting to ensure Render is already awake.

### 2. Updating Your Code in the Future
- Both Vercel and Render have continuous deployment enabled.
- Whenever you push new commits to GitHub (`git push origin main`), both platforms will automatically rebuild and deploy your latest code without downtime!
