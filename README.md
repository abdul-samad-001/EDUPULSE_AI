# EduPulse AI — Student Skill Tracker & Procrastination Detection System

EduPulse AI is a full-stack, AI-powered platform designed to help students track their academic skill acquisition and detect procrastination behaviors using machine learning. 

This repository connects a **React Frontend**, a **Node.js/Express Backend** (with Google Gemini integration for roadmaps), and a **Python Flask Machine Learning Service** (using Scikit-learn for procrastination risk detection).

--- 
 
## 🛠️ System Architecture

```text
       +---------------------------------------------+
       |             React Frontend (Vite)           |
       |                 (Port 5173)                 |
       +----------------------+----------------------+
                              |
                              | HTTP (API requests)
                              v
       +----------------------+----------------------+
       |          Node.js/Express Backend            |
       |                 (Port 5000)                 |
       +----------+-----------------------+----------+
                  |                       |
                  v                       v
         +--------+--------+     +--------+--------+
         |     MongoDB     |     | Python Flask ML |
         |  (NoSQL DB)     |     |   (Port 8000)   |
         +-----------------+     +-----------------+
```

---

## 📋 Integration Progress & Task Roadmap

Use this checklist to track the implementation of the **Procrastination Detection System (Module 2)**.

### 🟩 Completed Features (Module 1)
- [x] **Authentication System**: JWT-based register, login, and protected routes.
- [x] **Skill & Task CRUD**: Add, edit, delete skills, and checklist milestones.
- [x] **Gemini AI Roadmap**: Automated day-wise checklist generation using `gemini-2.5-flash`.
- [x] **Day-Wise Streak Engine**: Dynamic progression logic (`streakEngine.js`) that advances `currentDay` when daily tasks are completed, and checks the 24-hour deadline.

### 🟨 Pending Integration (Module 2 Setup)
Follow the step-by-step tasks below to wire up the ML Procrastination Detection system:

#### 1. ML Python Microservice Integration
- [ ] Create the `ml-service/` folder as a sibling to `backend/` and `frontend/`.
- [ ] Copy the following service scripts from `D:\DOWNLOADS\files\` to `ml-service/`:
  - `requirements.txt` (Dependencies)
  - `app.py` (Flask Server)
  - `generate_dataset.py` (Synthetic data generator)
  - `train_models.py` (Training script)
- [ ] Copy the data/model artifacts:
  - Copy `procrastination_dataset.csv` to `ml-service/data/`
  - Copy `best_model.pkl`, `scaler.pkl`, and `model_metadata.json` to `ml-service/models/`

#### 2. Node.js Backend Wiring
- [ ] Copy `mlService.js` to `backend/src/services/`
- [ ] Copy `procrastinationController.js` to `backend/src/controllers/`
- [ ] Copy `procrastinationRoutes.js` to `backend/src/routes/`
- [ ] Update `backend/.env` to include `ML_SERVICE_URL=http://localhost:8000`
- [ ] Mount `/api/procrastination` routes in `backend/server.js`
- [ ] Fix the unreachable `checkStreakDeadline(skill)` bug in `backend/src/controllers/taskController.js`

#### 3. Frontend UI Surfacing
- [ ] Copy `procrastinationService.js` to `frontend/src/services/`
- [ ] Create `RiskBadge.jsx` in `frontend/src/components/skills/` using the snippet defined in the service comments.
- [ ] Import and render `<RiskBadge skillId={skill._id} />` in `frontend/src/components/skills/SkillCard.jsx`.
- [ ] Update `frontend/src/pages/Dashboard.jsx` to fetch the overall risk state and render a new **Overall Procrastination Risk** card in the dashboard grid.

---

## 🚀 Running the Services Locally

To run the complete platform, start the three services in separate terminals:

### 1. Python ML Microservice
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
python app.py
```
*Runs on [http://localhost:8000](http://localhost:8000)*

### 2. Node.js Express Backend
```bash
cd backend
npm install
npm start
```
*Runs on [http://localhost:5000](http://localhost:5000)*

### 3. Vite React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs on [http://localhost:5173](http://localhost:5173)*
