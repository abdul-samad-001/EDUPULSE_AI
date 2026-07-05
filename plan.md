# Implementation Plan - EduPulse AI Integration & Procrastination Detection

This plan compares the current state of the codebase at `d:\FINAL YEAR\EduPulse-AI` with the requirements in [EduPulse_AI_PRD_v3_Final.pdf](file:///D:/DOWNLOADS/final/EduPulse_AI_PRD_v3_Final.pdf) and details the integration of **Module 2: Procrastination Detection System** using the files found in `D:\DOWNLOADS\files\`.

---

## Current vs. Required State

| Feature / Component | PRD v3 Requirement | Current Codebase State | Status / Action |
|---|---|---|---|
| **Module 1: Skill & Task Tracking** | Day-wise roadmaps, checkable tasks, and category filter. | Fully implemented in backend & frontend. | **Done** |
| **Streak Engine** | Per-skill streak resets (24h) and auto day progression. | Fully implemented in `backend/src/utils/streakEngine.js` and wired. | **Done** (Found a small bug in `taskController.js`) |
| **Gemini Roadmap** | Auto-generate days/tasks via Gemini AI. | Fully implemented in `geminiService.js`. | **Done** |
| **Module 2: ML Service** | Standalone Python Flask microservice (port 8000) using Logistic Regression model. | Files exist in `D:\DOWNLOADS\files\` but are completely absent from the workspace. | **Pending Integration** (Need to copy files & configure) |
| **Node.js ML Service integration** | Node.js backend communicates with Flask service over HTTP on `/predict`. | Controller, service wrapper, and route files exist in `D:\DOWNLOADS\files\` but are absent in workspace. | **Pending Integration** (Need to copy files & configure) |
| **Frontend Risk Surfacing** | Render per-skill `RiskBadge` and overall risk on the dashboard. | No risk badge component or overview analytics exist in frontend. | **Pending Integration** (Need to copy/create & wire up) |

---

## Proposed Changes

### 1. Standalone Python ML Microservice
We will create a new directory `ml-service/` at the root of the workspace to host the Python microservice.

#### [NEW] [requirements.txt](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/requirements.txt)
- Specifies Python packages: `flask`, `flask-cors`, `scikit-learn`, `pandas`, `numpy`, `joblib`.
- Copy from [D:\DOWNLOADS\files\requirements.txt](file:///D:/DOWNLOADS/files/requirements.txt).

#### [NEW] [app.py](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/app.py)
- Flask service loading models and exposing `/predict` and `/health`.
- Copy from [D:\DOWNLOADS\files\app.py](file:///D:/DOWNLOADS/files/app.py).

#### [NEW] [generate_dataset.py](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/generate_dataset.py)
- Code to generate synthetic training dataset.
- Copy from [D:\DOWNLOADS\files\generate_dataset.py](file:///D:/DOWNLOADS/files/generate_dataset.py).

#### [NEW] [train_models.py](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/train_models.py)
- Script to train and compare Logistic Regression & Random Forest models.
- Copy from [D:\DOWNLOADS\files\train_models.py](file:///D:/DOWNLOADS/files/train_models.py).

#### [NEW] Model & Data Artifacts
- [best_model.pkl](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/models/best_model.pkl) (Copy from `D:\DOWNLOADS\files\best_model.pkl`)
- [scaler.pkl](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/models/scaler.pkl) (Copy from `D:\DOWNLOADS\files\scaler.pkl`)
- [model_metadata.json](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/models/model_metadata.json) (Copy from `D:\DOWNLOADS\files\model_metadata.json`)
- [procrastination_dataset.csv](file:///d:/FINAL%20YEAR/EduPulse-AI/ml-service/data/procrastination_dataset.csv) (Copy from `D:\DOWNLOADS\files\procrastination_dataset.csv`)

---

### 2. Backend (Node.js) Modifications

#### [NEW] [mlService.js](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/services/mlService.js)
- Thin wrapper service that forwards features to the Flask microservice over HTTP.
- Copy from [D:\DOWNLOADS\files\mlService.js](file:///D:/DOWNLOADS/files/mlService.js).

#### [NEW] [procrastinationController.js](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/controllers/procrastinationController.js)
- Fetches skill details, builds feature vectors, fetches predictions, and returns risk classifications.
- Copy from [D:\DOWNLOADS\files\procrastinationController.js](file:///D:/DOWNLOADS/files/procrastinationController.js).

#### [NEW] [procrastinationRoutes.js](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/routes/procrastinationRoutes.js)
- Maps routes `/overview` and `/:skillId` to the procrastination controller.
- Copy from [D:\DOWNLOADS\files\procrastinationRoutes.js](file:///D:/DOWNLOADS/files/procrastinationRoutes.js).

#### [MODIFY] [server.js](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/server.js)
- Import and register `/api/procrastination` routes.

#### [MODIFY] [.env](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/.env)
- Add `ML_SERVICE_URL=http://localhost:8000` to specify the ML microservice endpoint.

#### [MODIFY] [taskController.js](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/controllers/taskController.js)
- **Bug Fix**: Relocate the unreachable `await checkStreakDeadline(skill);` inside `getTasksBySkill` (currently nested inside `if (!skill)` after a return statement) so that it runs when the skill *does* exist.

---

### 3. Frontend Modifications

#### [NEW] [procrastinationService.js](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/services/procrastinationService.js)
- Frontend client service handling HTTP calls for per-skill risk and overview risk.
- Created from [D:\DOWNLOADS\files\procrastinationService.js](file:///D:/DOWNLOADS/files/procrastinationService.js) (stripping the commented-out badge component).

#### [NEW] [RiskBadge.jsx](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/components/skills/RiskBadge.jsx)
- Extracted from the commented-out component in `D:\DOWNLOADS\files\procrastinationService.js`.
- Renders Low/Moderate/High risk tier badges with descriptive tooltip probabilities.

#### [MODIFY] [SkillCard.jsx](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/components/skills/SkillCard.jsx)
- Import and display `RiskBadge` in the card header next to the streak 🔥 indicator.

#### [MODIFY] [Dashboard.jsx](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/pages/Dashboard.jsx)
- Fetch the procrastination overview on mount using `procrastinationService.getRiskOverview()`.
- Calculate an overall risk status:
  - Default: **Low Risk**
  - If any tracked skill has **High** risk, set to **High Risk**.
  - Otherwise, if any skill has **Moderate** risk, set to **Moderate Risk**.
- Render a new `StatCard` displaying the user's **Overall Procrastination Risk** alongside the existing cards (Total Skills, Completed, Overall Progress, Current Streak).

---

## Verification Plan

### Automated Verification
1. Run Python Flask service and test `GET /health` and `POST /predict` endpoints directly using HTTP requests.
2. Verify Node.js backend boots up successfully and API routes `/api/procrastination/overview` and `/api/procrastination/:skillId` return correct responses.

### Manual Verification
1. Open frontend in browser, expand a skill card, and verify that the `RiskBadge` appears (e.g., displaying "Low Risk" or "High Risk" depending on progress).
2. Go to the main Dashboard and verify the 5th stat card showing **Overall Procrastination Risk** renders correctly.
