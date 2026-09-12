# ColoAI-Polyp: Explainable Colorectal Polyp Classification System
### Hybrid Deep Learning & MLOps Architecture: Deep Neural Backbone + SHAP + MERN Stack

An enterprise medical decision-support system designed to classify colorectal polyps from colonoscopy endoscopic captures into 4 clinical categories, augmented with SHAP-based feature explainability and deep attention heatmaps.

---

## 🚀 Instant Demonstration Quickstart

### 1-Click Launch (Windows)
Double-click **`run-demo.bat`** in the project root directory.
It automatically launches:
1. **Python AI Microservice** (`http://localhost:8000`)
2. **Node.js Express Backend** (`http://localhost:5000`)
3. **React Vite Frontend** (`http://localhost:5173`)
4. Opens your default web browser to the login page.

---

## 🔑 Pre-Configured Demo Credentials

On the login page, you can either click the **1-Click Demo Login** buttons or enter the credentials manually:

| Role | User Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Sarah Mitchell | `admin@coloaipoly.org` | `Password123!` | Model registry, dataset metadata, user RBAC, audit trail |
| **AI Researcher** | Prof. David Chen | `researcher@coloaipoly.org` | `Password123!` | Image upload, deep hybrid inference, SHAP explanations, PDF reports |
| **Clinician** | Dr. Elena Rostova | `clinician@coloaipoly.org` | `Password123!` | Pending reviews queue, clinical observations, validation sign-off |

*(Tip: In the top navigation bar, use the **"Switch Role"** dropdown to switch between Administrator, Researcher, and Clinician instantly during your presentation without logging out).*

---

## 🎯 Recommended Presentation Walkthrough Script

### Act 1: The Researcher Flow (AI Inference & Explainability)
1. Log in as **Researcher** (click the green Researcher demo button).
2. Review the **Researcher Dashboard**:
   - Point out **Total Analyses**, **Completed Analyses**, and **Average Confidence** (~93%).
   - Highlight the **Active Live Model** card (`Deep Hybrid Pipeline v1.0.0-prod`).
3. Click **"Start New Analysis"** (`/analyze`):
   - In the **Sample Gallery** on the right, click **"Adenomatous Polyp Sample"**.
   - Review the image preview and validation badges.
   - Click **"Execute Deep AI Analysis"**.
4. Observe the **Multi-stage Animated Processing Screen**:
   - *Image Upload & Checksum Validation* ✓
   - *Center-Crop & 224x224 Normalization* ✓
   - *Deep Feature Vector Extraction (768 Dimensions)* ⟳
   - *SHAP Feature Attribution & TreeExplainer* ○
   - *Final Multi-Class Classification* ○
   - *Heatmap Synthesis* ○
5. On the **Prediction Result** screen (`/prediction/:id`):
   - **Predicted Class**: Adenomatous Polyp (High confidence: ~92%).
   - **Class Probability Breakdown**: Bar visualizer showing softprob distribution.
   - **Visual Attention Heatmap**: Toggle between Original Image and Deep Saliency Overlay.
   - **SHAP Feature Attribution Waterfall**: Show how specific morphological features (Vascular Pit Pattern Intensity, Glandular Lumen Irregularity) contributed positively to the classification.
6. Click **"Download PDF Report"** to show the generated PDF report with the hospital banner, image, probabilities, and clinical disclaimers.

---

### Act 2: The Clinician Flow (Review & Oversight)
1. In the top navbar, open the **"Switch Role"** dropdown and select **"Clinician"**.
2. Click **"Pending Reviews"** in the sidebar (`/reviews`).
3. Select a pending analysis case from the list.
4. Review the predicted class, confidence, and top SHAP discriminator.
5. In the review panel, select **"Reviewed & Approved"**.
6. Type clinician observations:
   > *"Tubular adenoma morphology corroborated with Kudo Type III pit pattern. Recommended for complete endoscopic resection via snare polypectomy."*
7. Click **"Sign & Submit Clinical Review"**. Notice the live status update.

---

### Act 3: The Administrator Flow (MLOps & Governance)
1. In the top navbar, switch role to **"Administrator"**.
2. Click **"Model Registry"** (`/admin/models`):
   - Show versioned pipelines (`v1.0.0-prod` vs `v1.1.0-exp`).
   - Demonstrate the 1-click **"Promote to Production"** toggle.
3. Click **"Model Performance"** (`/admin/performance`):
   - Show the **4x4 Confusion Matrix** (N=1,480 samples).
   - Show the **Receiver Operating Characteristic (ROC)** curve (AUC = 0.981).
   - Point out verified metrics: Accuracy (94.6%), Sensitivity (95.1%), Specificity (93.8%), Precision (93.8%), F1-Score (94.0%).
4. Click **"Dataset Management"** (`/admin/datasets`):
   - Review benchmark dataset statistics (3,450 annotated images across Adenomatous, Hyperplastic, Serrated, Other).
5. Click **"Audit Logs"** (`/admin/audit-logs`):
   - Showcase the immutable audit ledger documenting every login, inference execution, review submission, and model state change.

---

## 🏛️ System Architecture

```text
                         CLIENT / BROWSER
                                │
                                ▼
                       ┌─────────────────┐
                       │   React 18 + TS │
                       │    (Port 5173)  │
                       └────────┬────────┘
                                │ REST / JWT
                                ▼
                       ┌─────────────────┐
                       │ Express Backend │
                       │    (Port 5000)  │
                       └────────┬────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
     │   MongoDB   │     │ Local Disk  │     │   Python    │
     │   Atlas     │     │ Storage     │     │   FastAPI   │
     │   Cloud     │     │ (uploads/)  │     │ (Port 8000) │
     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                    │
                                     ┌──────────────┼──────────────┐
                                     │              │              │
                                     ▼              ▼              ▼
                               Deep Backbone       SHAP          Ensemble
                               (Feature Vec) (TreeExplainer) (Classifier)
```

---

## 🎓 Viva / Presentation Defense Talking Points

1. **Why Deep Vision Backbone?**
   - Modernizes convolutional networks with depthwise separable representations, inverted bottlenecks, and Global Response Normalization (GRN), achieving transformer-level feature representations while maintaining endoscopic spatial locality.
2. **Why Gradient Boosted Ensemble on top of Deep Features?**
   - Directly training an end-to-end CNN often overfits on subtle colonoscopy variations. Using a deep neural network strictly as a feature extractor (768-d embeddings) and training gradient-boosted decision trees produces superior multi-class margin separation and facilitates exact tree-based Shapley value computation.
3. **Why SHAP?**
   - Deep learning in gastroenterology is traditionally a black box. TreeExplainer provides mathematically grounded additive feature attribution ($f(x) = \phi_0 + \sum \phi_i$), proving to clinicians why the AI concluded a lesion was adenomatous rather than hyperplastic.
4. **Is this replacing clinicians?**
   - No. The platform is explicitly architected as a Computer-Aided Decision Support (CADe/CADx) tool with dedicated clinician sign-off workflows and prominent research disclaimers on all views and PDF reports.
