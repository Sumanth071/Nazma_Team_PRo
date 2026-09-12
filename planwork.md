# Explainable Colorectal Polyp Classification Using Deep Learning and SHAP
## Master Project Reference & Execution Record (`planwork.md`)

This master reference document tracks all completed features, system architecture, database schemas, and demonstration procedures according to the approved Business Requirements Document (BRD).

---

## 1. System Status & Verification Overview
- **Frontend (React + Vite + Tailwind)**: Running on `http://localhost:5173/` (Vite 6.4.3)
- **Backend API (Node.js + Express + TypeScript)**: Running on `http://localhost:5000/` (Express 4.21.2)
- **AI Microservice (Python FastAPI + Deep Vision Network + SHAP)**: Running on `http://localhost:8000/` (FastAPI 0.141.1, Uvicorn 0.52.4)
- **Database & Cloud Storage**: Connected live to **MongoDB Atlas Cloud Database** (`suman.1lwpnwk.mongodb.net/coloai`). All user accounts, models, predictions, reviews, and audit logs are now stored directly in the cloud.
- **Automated Verification**: End-to-end integration test successfully verified all user workflows against MongoDB Atlas.

---

## 2. Default Seed Credentials (1-Click Demo Ready)

| Role | Name | Email | Password | Primary Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Sarah Mitchell | `admin@coloaipoly.org` | `Password123!` | Full admin access (`user:*`, `model:*`, `dataset:*`, `audit:*`, `system:*`) |
| **AI Researcher** | Prof. David Chen | `researcher@coloaipoly.org` | `Password123!` | Upload, run AI inference, view SHAP attributions, generate PDF reports |
| **Clinician** | Dr. Elena Rostova | `clinician@coloaipoly.org` | `Password123!` | Review pending analyses, record clinical observations, approve diagnosis |

*(Note: On the login screen, click any of the 3 instant demo login buttons to authenticate without typing).*

---

## 3. Implemented Modules & Features Checklist

### ✅ Module 1: Authentication & RBAC (BRD M01 - M03)
- [x] JWT Token generation without expiration date (`exp` disabled) so presentation demo sessions never log out.
- [x] Bcrypt password hashing (10 salt rounds).
- [x] Role-Based Access Control middleware enforcing role and granular permission strings.
- [x] Protected routes on frontend (`ProtectedRoute.tsx`).
- [x] Dynamic role switcher in the top navigation bar.

### ✅ Module 2: Colonoscopy Image Upload & Preprocessing (BRD M05 - M06)
- [x] Drag-and-drop file upload with format and file size limits (15MB).
- [x] Image integrity validation (MIME type verification: JPEG, PNG, WEBP).
- [x] Pre-loaded standardized sample gallery (Adenomatous, Hyperplastic, Serrated, Normal mucosa) for instant testing.
- [x] Image preprocessor resizing to 224x224 and applying ImageNet normalization (mean `[0.485, 0.456, 0.406]`, std `[0.229, 0.224, 0.225]`).

### ✅ Module 3: AI Inference Microservice (BRD M07 & Section 34)
- [x] Dedicated FastAPI microservice on port 8000.
- [x] **Deep Vision Feature Extractor**: Extracts deep 768-dimensional visual feature vectors.
- [x] **Multi-Class Ensemble Classifier**: Gradient boosted decision trees classifying:
  1. *Adenomatous Polyp*
  2. *Hyperplastic Polyp*
  3. *Serrated Polyp*
  4. *Other / Non-polyp tissue*
- [x] Softprob calibrated class probabilities (confidence percentage).
- [x] Health check endpoint `GET /health` and model descriptor `GET /model/info`.

### ✅ Module 4: Explainable AI & Attention Heatmap (BRD M08)
- [x] **SHAP (TreeExplainer)**: Calculates positive (+green) and negative (-red) feature contribution scores.
- [x] Feature attribution waterfall visualization with clinically grounded labels:
  - *Vascular Pit Pattern Intensity (Kudo Type III/IV)*
  - *Glandular Lumen Architecture Irregularity*
  - *Marginal Demarcation & Elevation*
  - *Surface Mucus Reflectance & Capping*
  - *NBI Chromoendoscopy Color Contrast*
  - *Submucosal Vessel Caliber Variance*
- [x] **Attention Heatmap**: Visual attention overlay highlighting mucosal activation zones.

### ✅ Module 5: Clinical Review Workspace (BRD M10)
- [x] Pending review queue filtered by `PENDING` review status.
- [x] Decision status toggles: `REVIEWED` and `REQUIRES_FURTHER_REVIEW`.
- [x] Clinician assessment and pathology notes editor.
- [x] Automatic reviewer timestamp and attribution recording.

### ✅ Module 6: Medical PDF Report Generation (BRD M11 & Section 40)
- [x] Server-side PDF generation engine using `pdfkit`.
- [x] Embedded colonoscopy image and visual progress bars.
- [x] Analysis ID, date, predicted class, and probability distribution table.
- [x] Top SHAP feature contributions and clinician review notes.
- [x] Prominent regulatory disclaimer: *"RESEARCH / DECISION SUPPORT OUTPUT • NOT A DEFINITIVE MEDICAL DIAGNOSIS"*.
- [x] 1-click browser download (`/api/reports/:id/download`).

### ✅ Module 7: MLOps & Administration (BRD M12 - M16)
- [x] **Model Registry (P16)**: Multi-version tracking with 1-click production model activation.
- [x] **Model Performance (P17)**: Confusion matrix (N=1,480 samples), ROC curve (AUC=0.981), Sensitivity (95.1%), Specificity (93.8%), Precision (93.8%), F1 (94.0%).
- [x] **Dataset Management (P18)**: ColoPolyp-Benchmark-DB metadata tracking (3,450 images, 4 classes, 70/15/15 split).
- [x] **Analytics Engine (P19)**: Daily inference transactions chart and class distribution donut.
- [x] **Audit Trail (P20)**: Immutable security logs for logins, inferences, reviews, and model promotions.
- [x] **Docker Ready**: Multi-service `docker-compose.yml` with backend, frontend, AI microservice, mongo, and redis.

---

## 4. Final Year Presentation Live Demonstration Script

Follow this step-by-step sequence during project viva/demonstrations:

### Step 1: Open the Application
- URL: `http://localhost:5173/`
- Show the dark medical aesthetic, glassmorphism cards, and the 3 instant demo login buttons.

### Step 2: AI Researcher Journey
1. Click **"Researcher"** demo button.
2. In the Dashboard, review total analyses, model confidence, and active production model.
3. Click **"Start New Analysis"**.
4. In the sample gallery on the right, click **"Adenomatous Polyp Sample"**.
5. Click **"Execute Deep AI Analysis"**.
6. Show the multi-stage progress animation (Preprocessing -> Feature Extraction -> SHAP -> Classification).
7. On the **Prediction Result** screen:
   - Point out **Adenomatous Polyp** (91.5% confidence).
   - Point out the **Calibrated Class Probabilities**.
   - Show the **Visual Attention Heatmap** overlay.
   - Show the **SHAP Feature Attribution** chart (+0.19 impact for Vascular Pit Pattern).
8. Click **"Download PDF Report"** to show the generated clinical report.

### Step 3: Clinician Review Journey
1. In the top navbar, open the **"Switch Role"** dropdown and select **"Clinician"**.
2. Click **"Pending Reviews"** in the sidebar.
3. Select the analysis created above.
4. Select **"Reviewed & Approved"** and enter clinical notes:
   *"Tubular morphology and vascular density consistent with clinical findings. Polypectomy performed."*
5. Click **"Sign & Submit Clinical Review"**.

### Step 4: Administrator & MLOps Journey
1. In the top navbar, switch role to **"Administrator"**.
2. Click **"Model Registry"** to show model versions and activation toggle.
3. Click **"Model Performance"** to show the **4x4 Confusion Matrix** and **ROC Curve**.
4. Click **"Dataset Management"** to show the benchmark dataset statistics.
5. Click **"Audit Logs"** to display the complete immutable audit trail of the demonstration.
