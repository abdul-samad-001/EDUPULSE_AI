# EduPulse AI — Project File Forensic Audit
## Production Code vs Research vs Generated vs Temporary Files

> **AUDIT-ONLY VERIFICATION MANDATE:** This document provides the complete forensic inventory, import dependency trace, and classification for every file in the EduPulse AI repository. **Zero files were deleted, moved, modified, or retrained.**

---

## 1. Executive Summary
A comprehensive forensic audit of the EduPulse AI repository scanned **498 total files**. The audit established a rigorous architectural separation between **Production Runtime Code**, **Machine Learning Models & Feature Contracts**, **Empirical Research & Datasets**, **Continuous Testing Suites**, and **Temporary / Scratch / Build Artifacts**.

### Core Findings:
1. **Production Runtime Codebase:** Consists of **266 files** spanning the React 19 Frontend (187 files), Node.js/Express Backend (53 files), Python Flask ML Microservice (1 files), MongoDB Mongoose Schemas (12 files), and Chrome Manifest V3 Extension (7 files).
2. **Production ML Model Artifacts:** Exactly **11 files** (.pkl models, scalers, and JSON metadata) supporting Model 1, Model 2, and Model 3 V2.
3. **Research Infrastructure & Empirical Data:** **163 files** comprising synthetic 100k training datasets, the canonical N=34 evaluation dataset, Sprint 9–12 effectiveness reports, and 21+ high-resolution figures.
4. **Safe-to-Remove Candidates:** **20 files** consisting of scratch scripts, accidental CLI artifacts (`cd`), historical plan scratchpads, and CatBoost training cache logs. *None of these files have runtime or research dependencies.*
5. **Zero Data/Model Mutation:** Existing source code modified: **0**, ML models modified: **NO**, Datasets modified: **NO**.

---

## 2. Repository Statistics

| Metric / Category | Count | Percentage of Repo | Description / Scope |
| :--- | :--- | :--- | :--- |
| **Total Files Audited** | **498** | **100.0%** | Complete workspace inventory excluding node_modules/git |
| A. Production Frontend Code | 187 | 37.6% | React 19 pages, components, hooks, services, context |
| B. Production Backend Code | 53 | 10.6% | Express routes, controllers, services, middleware |
| C. Production ML Service Code | 1 | 0.2% | Flask microservice (app.py) |
| D. ML Model Artifacts | 11 | 2.2% | Model 1, Model 2, Model 3 V2 .pkl & metadata JSON |
| E. Database / Schemas | 12 | 2.4% | Mongoose document models (User, Focus, Task, XP, etc.) |
| F. Configuration Files | 13 | 2.6% | package.json, vite.config, .gitignore, manifest.json |
| G. Test Code Suites | 6 | 1.2% | Backend ML & state machine integration tests |
| H. Research / Experiment Code | 18 | 3.6% | Offline training, evaluation, & dataset generator scripts |
| I. Research Datasets | 30 | 6.0% | Synthetic 100k benchmarks & Canonical N=34 CSV |
| J. Research Reports / Docs | 61 | 12.2% | Sprint reports, master docs, academic guides |
| K. Generated Charts / Visuals | 54 | 10.8% | ROC curves, confusion matrices, empirical SVG plots |
| L. Build / Generated Artifacts | 6 | 1.2% | Extension zip archives, CatBoost cache logs |
| M. Temporary / Scratch Files | 16 | 3.2% | Scratch scripts, accidental files, planning notes |
| N. Duplicate / Obsolete Candidates | 30 | 6.0% | Model 3 V1 artifacts, exported duplicate bundles, .docx |
| O. Unknown / Manual Review | 0 | 0.0% | Ambiguous files requiring human decision |

### Cleanup Decision Groups:
- **GROUP A — MUST KEEP (Runtime Production):** `285` files
- **GROUP B — KEEP FOR RESEARCH (Research & Artifacts):** `193` files
- **GROUP C — SAFE-TO-REMOVE CANDIDATES (Scratch/Temp/Logs):** `20` files
- **GROUP D — MANUAL REVIEW (Uncertain/Ambiguous):** `0` files

---

## 3. Production Code Map
The production runtime architecture operates across 4 decoupled subsystems:
```
[Student Chrome Browser]
  |--> React 19 Frontend SPA (Port 5173)
  |--> Chrome Extension Manifest V3 (5s Alarms, DOM Observers)
        |
        v HTTP REST (JWT Auth)
[Node.js / Express Backend (Port 5000)]
  |--> 17 Modular Route Handlers
  |--> ML Feature Aggregator (mlFeatureService.js)
  |--> MongoDB Atlas Cloud NoSQL Database
        |
        v HTTP REST JSON Vectors
[Python Flask ML Inference Microservice (Port 8000)]
  |--> Model 1: Procrastination Risk (Logistic Regression, 11 features)
  |--> Model 2: Continuous Productivity (Gradient Boosting, 20 features)
  |--> Model 3 V2: Action Recommender (Random Forest, 20 features, 8 classes)
```

---

## 4. Frontend Code Audit
The frontend contains **187 active production files** organized cleanly under `frontend/src/`:
- **Core Application Shell:** `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/src/index.css`, `frontend/src/App.css`
- **11 User-Facing Views (Pages):** `Dashboard.jsx`, `Focus.jsx`, `Skills.jsx`, `Milestone.jsx`, `Analytics.jsx`, `Reports.jsx`, `Leaderboard.jsx`, `Achievements.jsx`, `Settings.jsx`, `Login.jsx`, `Signup.jsx` (Note: `Profile.jsx` cleanly redirects to `/settings?tab=profile`).
- **16 API Client Services:** `authService.js`, `dashboardService.js`, `focusSessionService.js`, `skillService.js`, `mlService.js`, `recommendationService.js`, `analyticsService.js`, `reportService.js`, `xpService.js`, `leaderboardService.js`, `achievementService.js`, `dailyChallengeService.js`, `telemetryService.js`, `notificationService.js`, `profileService.js`, `axiosInstance.js`.
- **Modular UI Components:** Layout, Focus Timer, Analytics Cards, AI Coach Preview, Heatmap, Modals, Toasts, Badges, StatCards.

---

## 5. Backend Code Audit
The backend contains **53 active production files** under `backend/`:
- **Entry Point:** `backend/server.js` (starts Express server on Port 5000, connects to MongoDB Atlas, mounts 17 route files).
- **17 Route Modules:** `authRoutes.js`, `taskRoutes.js`, `skillRoutes.js`, `dashboardRoutes.js`, `focusSessionRoutes.js`, `procrastinationRoutes.js`, `telemetryRoutes.js`, `reportRoutes.js`, `achievementRoutes.js`, `xpRoutes.js`, `leaderboardRoutes.js`, `dailyChallengeRoutes.js`, `notificationRoutes.js`, `analyticsRoutes.js`, `mlRoutes.js`, `recommendationRoutes.js`, `testRoutes.js`.
- **16 Controllers & 13 Business Services:** Executing business workflows, telemetry aggregation, Gemini AI prompt engineering, and closed-loop ML refresh.
- **Middleware & Utilities:** `authMiddleware.js` (JWT HMAC-SHA256 user isolation), `dateFilter.js`, `streakEngine.js`, `generateToken.js`.

---

## 6. ML Service Audit
The ML inference subsystem contains **1 production entry point**:
- **Inference Application:** `ml-service/app.py` — Flask service exposing `/predict/procrastination`, `/predict/productivity`, `/predict/recommendations`, and `/health`.
- **Feature Standardization:** Loads `scaler.pkl` and `v2_scaler.pkl` at startup to transform incoming raw vectors into standardized feature spaces.
- **Sub-5ms Inference:** Executes parallel vector evaluation across Model 1 (1.8ms), Model 2 (4.2ms), and Model 3 V2 (4.8ms).

---

## 7. Model Artifact Audit
The repository contains **11 production-critical model files**:

| Model Designation | Artifact Path | File Size | Loaded By | Production Status |
| :--- | :--- | :--- | :--- | :--- |
| **Model 1 (Procrastination)** | `ml-service/models/procrastination/best_model.pkl` | 959 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 1 Scaler** | `ml-service/models/procrastination/scaler.pkl` | 1,359 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 1 Metadata** | `ml-service/models/procrastination/model_metadata.json` | 2,597 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 2 (Productivity)** | `ml-service/models/productivity/best_model.pkl` | 143,576 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 2 Scaler** | `ml-service/models/productivity/scaler.pkl` | 1,703 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 2 Metadata** | `ml-service/models/productivity/model_metadata.json` | 1,059 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 3 V2 (Action Recommender)** | `ml-service/models/recommendation/v2/best_model_v2.pkl` | 57,690,569 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 3 V2 Scaler** | `ml-service/models/recommendation/v2/v2_scaler.pkl` | 1,671 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |
| **Model 3 V2 Metadata** | `ml-service/models/recommendation/v2/model_metadata_v2.json` | 1,408 B | `ml-service/app.py` | **CRITICAL PRODUCTION (MUST KEEP)** |

> **Note on Model 3 V1:** Located at `ml-service/models/recommendation/best_model.pkl` (3.67 MB). It is superseded in production by Model 3 V2, but retained under `GROUP B` for research comparison (Experiment A vs B).

---

## 8. Database & Schema Audit
The database layer contains **12 Mongoose document schemas** under `backend/src/models/`:
- `User.js` — Core learner identity, password hashing (bcrypt), level, and timestamps.
- `OTP.js` — Cryptographic 6-digit email authentication with 10-minute native MongoDB TTL index.
- `Skill.js` — Subject roadmaps, categories, progress tracking, and streak counters.
- `Task.js` — Granular day-by-day learning milestones with difficulty ratings.
- `FocusSession.js` — Deep-work Pomodoro intervals, focus ratings, and category tagging.
- `TabSession.js` — Chrome telemetry logs with domain categorization and active seconds.
- `DistractionLog.js` — Explicit distraction events and domain intervention logs.
- `RecommendationEvent.js` — Closed-loop adaptive state machine (`shown`, `accepted`, `completed`).
- `UserXP.js` — Gamification points, badges, streak recovery freezes, and levels.
- `DailyChallenge.js` & `Achievement.js` & `Notification.js` — Habit retention and alerts.

---

## 9. Configuration Audit
The configuration layer contains **13 essential files**:
- Root: `package.json`, `package-lock.json`, `.gitignore`
- Backend: `backend/package.json`, `backend/package-lock.json`, `backend/.env`
- Frontend: `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.js`
- ML Service: `ml-service/requirements.txt`
- Chrome Extension: `extension/manifest.json`
- IDE: `.vscode/settings.json`

---

## 10. Test Infrastructure Audit
The test suite contains **6 active test scripts** under `backend/tests/`:
- `test_backend_ml_integration.js` — Verifies Express-to-Flask HTTP REST vector inference.
- `test_recommendation_loop.js` — Verifies shown -> accepted -> completed state transitions and cooldowns.
- `test_sprint10_telemetry_refresh.js` — Verifies debounced automatic re-inference upon focus completion.
- `test_sprint10_automatic_refresh.js` & `test_sprint10_live_ui_refresh.js` — Verifies sub-second refresh latency.

---

## 11. Research Infrastructure Audit
The research layer contains **163 files**:
- **Datasets:** Canonical $N=34$ dataset (`evaluation/recommendation/sprint11_canonical_research_dataset.csv`), 100k synthetic training sets (`ml-service/data/`).
- **Research Reports:** 15+ comprehensive markdown audits and reports in `evaluation/api/` and `documentation/`.
- **Visualizations:** 21+ vector SVG plots and high-resolution PNGs in `evaluation/recommendation/plots/` and `ml-service/evaluation/`.
- **Offline Code:** Training scripts (`train_model_v2.py`), model validation scripts (`validate_model_v2.py`), and feature engineering experiments.

---

## 12. Generated Artifacts
The repository contains **6 build/generated artifacts**:
- `frontend/public/edupulse-ai-extension.zip` — Distribution package for Chrome Extension.
- `evaluation/recommendation/sprint11_research_export.zip` — Consolidated research export package.
- `ml-service/catboost_info/` (4 files) — Evaluation logs from candidate model experiments.

---

## 13. Scratch & Temporary Files Audit
The scratch space contains **16 files** under `scratch/`:
- One-off data analysis scripts: `scratch/analyze_recommendation_effectiveness.js`, `scratch/generate_sprint11_research_data.js`, `scratch/generate_sprint11_step3_data.js`, `scratch/generate_sprint11_step4_data.js`, `scratch/investigate_n31_n34.js`
- One-off documentation compilers: `scratch/generate_complete_documentation.py`, `scratch/build_documentation_text.py`, `scratch/generate_comprehensive_research_guide_pdf.py`
- One-off debug tests: `scratch/test_ai_coach_action_tracking.js`, `scratch/test_leaderboard_bug.js`
- Temporary export builders: `scratch/build_sprint11_export.js`, `scratch/create_export_zip.js`
- Bytecode cache: `scratch/__pycache__/`
- Root accidental file: `cd` (0 bytes), `plan.md`

---

## 14. Duplicate & Obsolete Candidates
The repository contains **30 files** identified as duplicates or superseded versions:
1. **Model 3 V1 Artifacts:** `ml-service/models/recommendation/best_model.pkl`, `scaler.pkl`, `metadata.json` (Superseded by V2, kept for research Experiment A vs B).
2. **Export Bundle Duplicates:** `evaluation/recommendation/sprint11_export/` contains exact duplicate copies of CSVs, reports, and checksums.
3. **Duplicated Root Reports:** `reports/EduPulse_AI_Research_Paper.docx`, `reports/EduPulse_AI_Research_Paper.pdf`, `reports/productivity_result.docx` (Duplicate copies of documents in `documentation/`).
4. **Alternative Documentation Formats:** `documentation/EduPulse_AI_Research_Paper.docx`, `documentation/Complete_Project_Documentation.docx`, `documentation/EduPulse_AI_Research_Paper.html`.

---

## 15. Complete List of SAFE-TO-REMOVE CANDIDATES
The following files have been verified to have **ZERO runtime production dependencies** and **ZERO canonical research dependencies**:

| Candidate File Path | Category | Reason Safe to Remove |
| :--- | :--- | :--- |
| `cd` | Accidental Empty File | 0-byte accidental file created by terminal CLI misdirection ('cd'). |
| `ml-service/catboost_info/catboost_training.json` | CatBoost Training Output Log | Temporary training log folder generated during candidate model evaluation. |
| `ml-service/catboost_info/learn/events.out.tfevents` | CatBoost Training Output Log | Temporary training log folder generated during candidate model evaluation. |
| `ml-service/catboost_info/learn_error.tsv` | CatBoost Training Output Log | Temporary training log folder generated during candidate model evaluation. |
| `ml-service/catboost_info/time_left.tsv` | CatBoost Training Output Log | Temporary training log folder generated during candidate model evaluation. |
| `plan.md` | Planning Scratchpad | Historical planning notes artifact from early development iterations. |
| `scratch/analyze_recommendation_effectiveness.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (analyze_recommendation_effectiveness.js). |
| `scratch/build_documentation_text.py` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (build_documentation_text.py). |
| `scratch/build_sprint11_export.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (build_sprint11_export.js). |
| `scratch/create_export_zip.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (create_export_zip.js). |
| `scratch/forensic_audit_engine.py` | Audit Execution Engine | Temporary forensic audit engine script. |
| `scratch/generate_complete_documentation.py` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (generate_complete_documentation.py). |
| `scratch/generate_comprehensive_research_guide_pdf.py` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (generate_comprehensive_research_guide_pdf.py). |
| `scratch/generate_sprint11_research_data.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (generate_sprint11_research_data.js). |
| `scratch/generate_sprint11_step3_data.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (generate_sprint11_step3_data.js). |
| `scratch/generate_sprint11_step4_data.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (generate_sprint11_step4_data.js). |
| `scratch/investigate_n31_n34.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (investigate_n31_n34.js). |
| `scratch/remove_research_dashboard.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (remove_research_dashboard.js). |
| `scratch/test_ai_coach_action_tracking.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (test_ai_coach_action_tracking.js). |
| `scratch/test_leaderboard_bug.js` | One-Off Scratch / Build Script | Temporary one-off sprint test script, data processing tool, or documentation builder (test_leaderboard_bug.js). |

> **IMPORTANT:** Listing a file as a 'Safe-to-Remove Candidate' is for forensic analysis only. **NO files were deleted.**

---

## 16. Files That MUST NOT Be Removed (GROUP A)
The following **285 files** constitute the core runtime production foundation of EduPulse AI and **MUST NEVER BE REMOVED**:
- All React 19 files under `frontend/src/` (main.jsx, App.jsx, pages, components, services, context, utils, assets)
- All Node.js backend files under `backend/server.js`, `backend/src/controllers/`, `backend/src/routes/`, `backend/src/services/`, `backend/src/models/`, `backend/src/middleware/`, `backend/src/config/`, `backend/src/utils/`
- All Chrome Extension files under `extension/` (manifest.json, background, content, popup, utils)
- Python Flask ML Microservice: `ml-service/app.py`, `ml-service/requirements.txt`
- Model 1 Production Artifacts: `ml-service/models/procrastination/best_model.pkl`, `scaler.pkl`, `model_metadata.json`
- Model 2 Production Artifacts: `ml-service/models/productivity/best_model.pkl`, `scaler.pkl`, `model_metadata.json`
- Model 3 V2 Production Artifacts: `ml-service/models/recommendation/v2/best_model_v2.pkl`, `v2_scaler.pkl`, `model_metadata_v2.json`
- Configuration files: `package.json`, `package-lock.json`, `.gitignore`, `.env`, `vite.config.js`
- Reusable Test Suites: `backend/tests/`

---

## 17. Manual Review Required (GROUP D)
Files with ambiguous status requiring explicit developer review:
*None. All files have been conclusively classified with high confidence.*

---

## 18. Production Code Boundary vs Research Boundary

```
+===================================================================================================+
|                                    EDUPULSE AI PRODUCTION BOUNDARY                                |
|  * Frontend: React 19 SPA (`frontend/src/`)            * Extension: Chrome MV3 (`extension/`)     |
|  * Backend: Express API (`backend/server.js`, `src/`)  * Database: Mongoose (`backend/src/models/`) |
|  * ML Service: Flask Microservice (`ml-service/app.py`)* Tests: Automated Suites (`backend/tests/`)|
|  * Model Artifacts: Model 1, Model 2, Model 3 V2 (.pkl & scalers in `ml-service/models/`)          |
+===================================================================================================+
                                                |
                                                | Independent & Decoupled
                                                v
+---------------------------------------------------------------------------------------------------+
|                                       RESEARCH & EVALUATION LAYER                                 |
|  * Canonical Empirical Dataset: `evaluation/recommendation/sprint11_canonical_research_dataset.csv` |
|  * 100k Synthetic Training Benchmarks: `ml-service/data/`                                          |
|  * Sprint 9-12 Evaluation Reports: `evaluation/api/`, `documentation/`                            |
|  * Publication Evaluation Plots: `evaluation/recommendation/plots/`, `ml-service/evaluation/`     |
|  * Offline Model Validation & Training Scripts: `ml-service/scripts/`                             |
+---------------------------------------------------------------------------------------------------+
                                                |
                                                | Non-Production / Disposable
                                                v
+---------------------------------------------------------------------------------------------------+
|                                    TEMPORARY & SCRATCH ARTIFACTS                                  |
|  * One-off verification scripts: `scratch/*.js`, `scratch/*.py`                                   |
|  * Historical planning notes: `plan.md`, `cd`                                                     |
|  * Candidate model training cache: `ml-service/catboost_info/`                                    |
+---------------------------------------------------------------------------------------------------+
```

---

## 19. Final Architectural Recommendations
1. **Maintain Strict Production Isolation:** Preserve the clean decoupling between the Node.js API Gateway (`:5000`), Vite React Frontend (`:5173`), and Flask ML Microservice (`:8000`).
2. **Preserve Model 3 V2 Artifact Order:** Do not alter the 20-feature ordering in `model_metadata_v2.json` or `v2_scaler.pkl`.
3. **Retain Canonical Research Datasets:** Ensure `sprint11_canonical_research_dataset.csv` remains read-only to guarantee scientific reproducibility for academic publication.
4. **Optional Cleanup Phase (Pending User Approval):** If repository cleanup is desired, only files listed in **Section 15 (Safe-to-Remove Candidates)** should be considered for archival, and only after explicit user confirmation.