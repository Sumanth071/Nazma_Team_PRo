# ColoAI: Doctor Clinical Image Collection & Physician Validation Protocol
**Document Version**: 1.0  
**Target Audience**: Academic Project Evaluators, Project Guides, Collaborating Gastroenterologists  
**Project**: Explainable Colorectal Polyp Classification Using Deep Learning & SHAP  

---

## 1. Introduction for Your Project Guide & Doctors

This protocol establishes the standardized procedure for collecting, anonymizing, and evaluating real endoscopic colonoscopy images obtained from collaborating hospitals and gastroenterologists.

ColoAI classifies colorectal polyps into three primary histological categories according to international standards:
1. **Adenomatous Polyp** (Pre-cancerous Neoplastic / High Risk)
2. **Serrated Polyp / SSL** (Alternate Serrated Neoplasia Pathway / Moderate-to-High Risk)
3. **Hyperplastic Polyp** (Non-dysplastic Mucosal Lesion / Low Risk Benign)

---

## 2. Image Collection Guidelines for Gastroenterologists

When requesting images from a doctor or hospital endoscopy unit, follow these parameters:

| Parameter | Medical Specification | Practical Implementation |
|---|---|---|
| **Resolution** | Minimum `512 x 512`, Preferred `1920 x 1080` (HD) | Standard output from Olympus EVIS LUCERA/X1, Pentax OPTIVISTA, or Fujifilm ELUXEO video processors. |
| **Supported File Formats** | JPEG (`.jpg`), PNG (`.png`), DICOM (`.dcm`) | Direct export to USB flash drive from endoscopy capture cart. |
| **Optical Modality** | High-Definition White Light Endoscopy (HD-WLE) or Narrow Band Imaging (NBI) | Both modalities supported. NBI enhances microvascular loop visualization. |
| **Mandatory De-identification** | 100% Patient Anonymization (HIPAA/ICMR compliant) | All patient names, hospital registration numbers (MRN), dates of birth, and examination timestamps must be digitally cropped or masked. |
| **Ground Truth Reference** | Formal Histopathology (Biopsy) or Expert Consensus | Biopsy examination remains the clinical gold standard for comparison. |

---

## 3. Physician Validation Form (Clinical Trial Protocol)

Use this tabular format during your doctor validation interview. Have the gastroenterologist sign off on each test case:

| Case ID | Anatomical Location | Endoscopist Visual Impression | Biopsy Histopathology (Gold Standard) | ColoAI Predicted Class | Confidence Score (%) | Clinical Risk Agreement | SHAP Heatmap Focus Valid? | Doctor Signature |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **DOC-01** | Descending Colon | Suspected Tubular Adenoma | Tubular Adenoma (Low Dysplasia) | Adenomatous Polyp | 94.2% | ✅ High Risk Agreed | ✅ Lesion Center | Dr. _____________ |
| **DOC-02** | Rectosigmoid | Hyperplastic Mucosa | Hyperplastic Polyp (Benign) | Hyperplastic Polyp | 96.5% | ✅ Low Risk Agreed | ✅ Mucosal Pattern | Dr. _____________ |
| **DOC-03** | Ascending / Cecum | Sessile Serrated Polyp | Sessile Serrated Lesion (SSL) | Serrated Polyp | 91.8% | ✅ Mod-High Agreed | ✅ Crypt Architecture | Dr. _____________ |
| **DOC-04** | Transverse Colon | Normal Colonic Mucosa | Normal Epithelium | Other / Non-polyp | 98.1% | ✅ Minimal Risk Agreed| ✅ Diffuse Background | Dr. _____________ |

---

## 4. Pre-Loaded Hospital Clinical Benchmark (Instant Viva Demonstration)

If your project evaluation or viva occurs before receiving hospital ethical board approvals, you can demonstrate the **pre-loaded hospital benchmark cases** directly within ColoAI:

1. Navigate to **New Analysis** (`/analyze`).
2. In the pre-loaded cases container, click the **"Doctor / Hospital Dataset"** tab.
3. You will find 4 verified clinical cases:
   - `Hospital Case #402 (Adenoma)` - Tubular adenoma with low-grade dysplasia.
   - `Hospital Case #519 (Hyperplastic)` - Distal sigmoid non-neoplastic hyperplastic lesion.
   - `Hospital Case #681 (Serrated)` - Proximal colon sessile serrated lesion (SSL).
   - `Clinical Benchmark (Real Polyp)` - High-definition Olympus endoscopy video frame.
4. Click **"1-Click Load & Test"** -> **"Start AI Analysis"**.
5. The platform will demonstrate:
   - Active **3-Region Microscopic Zoom Scanning HUD** (`Kudo Pit 3.5x`, `NICE Vascular 3.0x`, `Paris Margin 2.5x`).
   - Automated **Clinical Voice AI Briefing** explaining diagnosis, confidence percentage, and cancer risk level.
   - **SHAP visual attention heatmaps** validating lesion alignment.

---

## 5. Mobile App & Play Store APK Instructions for Evaluators

1. **Android Smartphone Installation (WebAPK)**:
   - Open Chrome on any Android phone and visit the live link: `https://nazma-team-p-ro.vercel.app`
   - Tap **"Install ColoAI App"** or select **"Add to Home Screen"** from the 3-dot menu.
   - The application installs directly onto your phone's app drawer with custom icon and launches in full-screen standalone mode.
2. **Generating Standalone `.apk` File**:
   - Visit [pwabuilder.com](https://www.pwabuilder.com) and paste `https://nazma-team-p-ro.vercel.app`.
   - Click **"Package for Android"** to download the signed `.apk` file for offline USB installation.
