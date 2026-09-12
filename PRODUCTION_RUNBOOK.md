# ColoAI-Polyp: Production & Live Deployment Runbook
> **STRICT SAFETY POLICY**: Production deployments or promotions to live environments will **NEVER** be executed automatically or by an agent without your explicit manual approval.

---

## 1. Environment Architecture & Isolation Overview

The system strictly isolates **Test/Staging** from **Production**:

| Parameter | Test / Staging Environment | Production Environment |
| :--- | :--- | :--- |
| **Git Branch** | `staging` | `main` |
| **MongoDB Atlas DB** | `coloai_test` | `coloai_prod` |
| **JWT Environment** | Dedicated Test Vault Key | Production Secret Key |
| **Node Mode** | `NODE_ENV=test` | `NODE_ENV=production` |
| **Purpose** | Team testing, feature validation, mock runs | Final evaluation, live clinical showcase |

---

## 2. Option A: 1-Click Local Production Launch (For Official Viva / Reviewers)

If you want to run the official **Production** environment on your machine (connected to the pristine `coloai_prod` database):

1. Close any running test command windows.
2. Double-click:
   ```cmd
   run-prod-env.bat
   ```
3. What this script does automatically:
   - Sets `server\.env` to use `coloai_prod`.
   - Boots up the Python AI microservice (port 8000).
   - Boots up the Express backend (port 5000).
   - Boots up the React Vite frontend (port 5173).
   - Automatically seeds pristine default accounts in `coloai_prod` on the first run:
     - **Admin**: `admin@coloaipoly.org` / `Password123!`
     - **Researcher**: `researcher@coloaipoly.org` / `Password123!`
     - **Clinician**: `clinician@coloaipoly.org` / `Password123!`

---

## 3. Option B: Git Promotion to Production (Code Release)

When your team has thoroughly tested on `staging` and is ready to promote code to `main`:

### Step 1: Ensure Staging is Clean
```bash
git checkout staging
git status
```
*(Make sure working tree is clean and all tests pass).*

### Step 2: Merge into Main (Production Branch)
```bash
git checkout main
git pull origin main
git merge staging
```

### Step 3: Push to GitHub (Only When You Approve)
```bash
git push origin main
```

### Step 4: Return to Staging for Ongoing Work
```bash
git checkout staging
```

---

## 4. Option C: Cloud / Live Web Hosting Deployment

To host ColoAI-Polyp on cloud hosting platforms (e.g. Render, Railway, DigitalOcean, AWS, or Azure):

### A. Environment Variables for Cloud Backend & AI Service
Configure these variables in your cloud hosting dashboard:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ksumanthyadav120:mongodb123@suman.1lwpnwk.mongodb.net/coloai_prod?retryWrites=true&w=majority
JWT_SECRET=coloai_prod_super_secure_vault_secret_2026_medical
JWT_EXPIRES_IN=never
AI_SERVICE_URL=https://<your-deployed-ai-service-url>
CLIENT_URL=https://<your-deployed-frontend-url>
STORAGE_TYPE=local
UPLOAD_DIR=./uploads
```

### B. Deploy AI Microservice (Python FastAPI)
- **Runtime**: Python 3.10+
- **Build Command**: `pip install -r ai_service/requirements.txt`
- **Start Command**: `uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000`

### C. Deploy Backend (Node.js Express)
- **Runtime**: Node.js 18+
- **Build Command**: `cd server && npm install && npm run build`
- **Start Command**: `cd server && npm start`

### D. Deploy Frontend (React Vite)
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/dist`
- Set frontend environment variable (if needed for API target):
  ```env
  VITE_API_URL=https://<your-deployed-backend-url>/api
  ```

---

## 5. Option D: Docker Compose Live Deployment

For VPS / VM hosting (DigitalOcean Droplet, AWS EC2, or Azure VM):

```bash
# 1. Clone repository on server
git clone -b main https://github.com/Sumanth071/Nazma_Team_PRo.git
cd Nazma_Team_PRo

# 2. Build and launch all services in detached mode
docker-compose up -d --build

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

---

## 6. Pre-Flight Production Verification Checklist

Before presenting or declaring the deployment live, run this quick 5-point verification:

- [ ] **Health Endpoint Check**:
  - Backend: `GET https://<backend-domain>/api/health` returns `{"status":"healthy", "environment":"production"}`
  - AI Service: `GET https://<ai-domain>/health` returns `{"status":"healthy"}`
- [ ] **Database Verification**: Confirm records are saving to `coloai_prod` and not `coloai_test`.
- [ ] **1-Click Demo Login**: Test instant authentication for Administrator, Researcher, and Clinician.
- [ ] **Inference Pipeline**: Run a sample analysis on `Adenomatous Polyp` and confirm SHAP waterfall chart and attention heatmap render.
- [ ] **PDF Export**: Download a medical summary report to ensure styling and disclaimer banners generate properly.

---

## 7. Emergency Rollback Procedure

If any regression occurs in production, revert immediately to the previous stable release:

```bash
git checkout main
git revert HEAD --no-edit
git push origin main
```
And re-run `run-test-env.bat` locally to diagnose in the test environment without touching production.
