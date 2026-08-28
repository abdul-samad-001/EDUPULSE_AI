# EduPulse AI — Intelligent Student Productivity & Learning Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-ML_Service-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-ML_Microservice-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![scikit--learn](https://img.shields.io/badge/scikit--learn-Machine_Learning-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

EduPulse AI is a full-stack, AI-powered student productivity and learning platform that combines academic tracking, behavioral telemetry, machine learning, generative AI, and personalized recommendations.

The platform helps students:

- Build and track learning skills
- Generate structured learning roadmaps
- Manage academic tasks
- Track focus and study sessions
- Monitor productivity
- Detect procrastination-related behavioral patterns
- Measure productivity levels
- Receive personalized AI recommendations
- Act on recommendations through real application activities
- Continuously update recommendations based on new behavioral data

The system contains **three machine-learning models** connected through a Python Flask microservice and integrated with a React + Node.js application.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Project Objectives](#project-objectives)
- [Core Concept](#core-concept)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Application Features](#application-features)
- [Machine Learning System](#machine-learning-system)
  - [Model 1 — Procrastination Detection](#model-1--procrastination-detection)
  - [Model 2 — Productivity Prediction](#model-2--productivity-prediction)
  - [Model 3 V2 — Recommendation Engine](#model-3-v2--recommendation-engine)
  - [Recommendation Classes](#recommendation-classes)
  - [Model 3 V2 Feature Contract](#model-3-v2-feature-contract)
- [AI Productivity Coach](#ai-productivity-coach)
- [Closed-Loop Recommendation Lifecycle](#closed-loop-recommendation-lifecycle)
- [Recommendation Event Tracking](#recommendation-event-tracking)
- [Telemetry System](#telemetry-system)
- [Automatic ML Refresh](#automatic-ml-refresh)
- [Debounce and Recommendation Cooldown](#debounce-and-recommendation-cooldown)
- [Coding Activity Tracking](#coding-activity-tracking)
- [Skill and Task Management](#skill-and-task-management)
- [Focus Sessions](#focus-sessions)
- [AI Learning Roadmaps](#ai-learning-roadmaps)
- [Procrastination Risk](#procrastination-risk)
- [Productivity Measurement](#productivity-measurement)
- [Authentication and Security](#authentication-and-security)
- [User Isolation](#user-isolation)
- [Database Models](#database-models)
- [Project Structure](#project-structure)
- [ML Service API](#ml-service-api)
- [Backend API](#backend-api)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Testing and Verification](#testing-and-verification)
- [Research and Evaluation](#research-and-evaluation)
  - [Research Methodology](#research-methodology)
  - [Research Findings](#research-findings)
- [Performance](#performance)
- [Data Integrity](#data-integrity)
- [Model Integrity](#model-integrity)
- [Project Status](#project-status)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

EduPulse AI is designed around the idea of building an intelligent learning assistant that does more than simply store student information.

The platform observes academic and behavioral activity, converts that activity into structured machine-learning features, generates predictions, and uses those predictions to provide actionable guidance.

The system combines:

```text
Academic Data
      +
Behavioral Telemetry
      +
Historical Activity
      ↓
Feature Aggregation
      ↓
Machine Learning
      ↓
Personalized Recommendation
      ↓
Student Action
      ↓
New Telemetry
      ↓
Updated Prediction
```

This creates a feedback loop between learner behavior and AI-generated guidance.

## Problem Statement

Students often struggle with:

- Procrastination
- Poor time management
- Inconsistent study schedules
- Difficulty maintaining focus
- Unfinished tasks
- Lack of personalized study guidance
- Difficulty identifying unproductive behavior
- Lack of measurable feedback about their learning habits

Traditional productivity applications generally track tasks and time but do not connect those signals to machine-learning-based behavioral analysis and personalized interventions.

EduPulse AI attempts to address this gap by combining:

- Academic progress tracking
- Behavioral telemetry
- Machine learning
- Generative AI
- Personalized recommendations
- Action tracking
- Continuous feedback

## Project Objectives

The major objectives of EduPulse AI are:

- Track student skills and academic progress
- Generate structured learning plans
- Track tasks and milestones
- Measure focus behavior
- Estimate procrastination risk
- Predict productivity
- Recommend appropriate next actions
- Track whether recommendations are followed
- Update behavioral features after completed activities
- Refresh ML predictions automatically
- Maintain secure user-level data isolation
- Provide a research-oriented platform for studying recommendation effectiveness

## Core Concept

The complete system can be represented as:

```text
┌──────────────────────┐
│     Student Activity │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Telemetry System   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Feature Aggregation  │
└──────────┬───────────┘
           ↓
┌───────────────────────────────────┐
│          ML Prediction            │
│                                   │
│ Model 1 → Procrastination Risk   │
│ Model 2 → Productivity Score     │
│ Model 3 → Recommendation         │
└──────────┬────────────────────────┘
           ↓
┌──────────────────────┐
│   AI Productivity    │
│        Coach         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Student Takes       │
│  Recommended Action  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Updated Telemetry    │
└──────────┬───────────┘
           ↓
       ML Refresh
           ↓
    New Recommendation
```

## System Architecture

```text
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │      Vite / React    │
                         │       :5173          │
                         └──────────┬───────────┘
                                    │
                               HTTP + JWT
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js / Express  │
                         │      Backend API     │
                         │       :5000          │
                         └──────┬────────┬──────┘
                                │        │
                         MongoDB│        │HTTP
                                │        │
                                ▼        ▼
                     ┌──────────────┐  ┌─────────────────────┐
                     │   MongoDB    │  │ Python Flask ML     │
                     │   Database   │  │    Microservice     │
                     └──────────────┘  │       :8000         │
                                       └──────────┬──────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                       ┌────────────┐     ┌────────────┐     ┌────────────┐
                       │   Model 1  │     │   Model 2  │     │ Model 3 V2 │
                       │Procrastina-│     │Productivity│     │Recommendation│
                       │   tion     │     │ Prediction │     │   Engine    │
                       └────────────┘     └────────────┘     └────────────┘
```

The frontend communicates with the backend.

The backend owns:

- Authentication
- Database access
- Feature aggregation
- ML service communication
- Recommendation lifecycle
- User isolation
- Application business logic

The Python service owns ML inference.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Frontend Build | Vite |
| Backend | Node.js |
| Backend Framework | Express |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Generative AI | Google Gemini 2.5 Flash |
| ML Service | Python + Flask |
| ML Library | scikit-learn |
| Model 1 | Logistic Regression |
| Model 2 | Gradient Boosting Regressor |
| Model 3 V2 | Random Forest Classifier |
| Communication | REST / HTTP |
| Frontend Validation | ESLint |
| Testing | Backend + Frontend + Python verification |
| Version Control | Git |

## Application Features

### Authentication

- User registration
- User login
- JWT authentication
- Protected routes
- Token validation
- Unauthorized request handling
- User-specific database queries

### Dashboard

The dashboard provides an overview of the learner's current state.

It can surface:

- Productivity
- Focus
- Study activity
- XP
- Level
- Streak
- Completed tasks
- Pending tasks
- Skill progress
- Procrastination risk
- AI recommendations
- Learning activity

### Skills

Students can:

- Create skills
- Update skills
- Track skill progress
- Manage milestones
- Connect learning tasks to skills

### Tasks

Students can:

- Create tasks
- Edit tasks
- Delete tasks
- Complete tasks
- Track pending tasks
- Track completed tasks
- Earn XP through completion

### Focus Sessions

Students can run focused study sessions.

Supported session categories include:

- general
- coding
- revision
- reading
- break

The system records actual session duration instead of relying only on planned duration.

### Coding Focus

Coding sessions receive special treatment because coding activity is an explicit feature of the recommendation model.

Completed coding sessions can update:

- coding_hours
- productive_minutes
- focus_sessions
- average_session_minutes

This information can trigger a new ML recommendation.

## Machine Learning System

EduPulse AI contains three production ML models.

```text
                    Student Data
                        │
                        ▼
                Feature Extraction
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          Model 1     Model 2    Model 3 V2
          Logistic    Gradient   Random Forest
          Regression  Boosting   Classifier
             │          │          │
             ▼          ▼          ▼
       Procrastination Productivity Recommendation
            Risk          Score       Class
```

### Model 1 — Procrastination Detection

**Purpose**

Model 1 estimates whether the learner is exhibiting procrastination-related behavioral patterns.

**Algorithm**

Logistic Regression

**Input**

Model 1 uses an 11-feature contract.

The backend validates the required feature set before sending the request to the ML service.

**Output**

The model returns a classification and probability.

Example:

```json
{
  "is_procrastinator": false,
  "probability": 0.163
}
```

The probability is used to derive a risk interpretation.

### Model 2 — Productivity Prediction

**Purpose**

Model 2 produces a continuous productivity score based on learner activity.

**Algorithm**

Gradient Boosting Regressor

**Input**

Model 2 uses a validated 20-feature contract.

**Output**

A continuous productivity score.

Example:

```text
Productivity Score: 27.15 / 100
```

This score becomes one of the important inputs to the recommendation engine.

### Model 3 V2 — Recommendation Engine

Model 3 V2 is the central personalized recommendation model.

**Purpose**

The model determines the most appropriate pedagogical action for the learner based on their current state.

**Algorithm**

Random Forest Classifier

**Input**

Model 3 V2 uses exactly 20 features.

**Output**

The model returns:

- Recommendation
- Recommendation class
- Confidence/probability

Example:

```json
{
  "recommendation": "Practice Coding",
  "recommendation_class": 3,
  "confidence": 0.38
}
```

### Recommendation Classes

Model 3 V2 contains eight pedagogical recommendation classes.

| Class | Recommendation |
|---|---|
| 0 | Continue Current Skill |
| 1 | Start Focus Session |
| 2 | Take Short Break |
| 3 | Practice Coding |
| 4 | Revise |
| 5 | Watch Learning Video |
| 6 | Complete Pending Tasks |
| 7 | Attempt Quiz |

The eight classes allow the system to provide different types of interventions instead of a single generic recommendation.

### Model 3 V2 Feature Contract

The recommendation model uses the following 20 features:

1. productivity_score
2. focus_score
3. study_hours
4. xp
5. level
6. streak_days
7. completed_tasks
8. pending_tasks
9. coding_hours
10. reading_hours
11. revision_hours
12. quiz_score
13. productive_minutes
14. distraction_minutes
15. idle_minutes
16. sleep_hours
17. skill_progress
18. deadline_completion_rate
19. focus_sessions
20. average_session_minutes

These features represent academic activity, behavioral activity, productivity, engagement, and learner state.

The feature contract is treated as a strict interface between the application and the ML model.

## AI Productivity Coach

The AI Productivity Coach presents model output as actionable guidance.

Example:

```text
AI Productivity Coach

Recommended Next Action:
Practice Coding

Reason:
Technical mastery requires hands-on practice.
Diving into coding challenges will reinforce recent concepts.

Confidence:
37%
```

The coach may also present historical behavioral context.

Example:

```text
Historical Behavioral Insight

Your history shows balanced engagement across
daily recommendations.
```

The important difference is that recommendations can be connected to actual application actions.

## Closed-Loop Recommendation Lifecycle

EduPulse AI implements a closed-loop recommendation system.

```text
Recommendation Generated
          ↓
RecommendationEvent Created
          ↓
Recommendation Shown
          ↓
Student Clicks CTA
          ↓
Status = Accepted
          ↓
Student Performs Activity
          ↓
Activity Completed
          ↓
Status = Completed
          ↓
Telemetry Updated
          ↓
ML Refresh Triggered
          ↓
New Recommendation
```

This allows the system to measure what happens after a recommendation is presented.

## Recommendation Event Tracking

Each recommendation event can contain information such as:

- user
- recommendationClass
- recommendation
- confidence
- modelType
- modelVersion
- status
- shownAt
- respondedAt
- completedAt
- actionType
- actionTarget
- context

The recommendation lifecycle supports states such as:

- shown
- accepted
- dismissed
- ignored
- completed

This provides a measurable connection between:

`AI Prediction → Student Response → Activity Completion`

## Telemetry System

EduPulse AI collects behavioral telemetry from multiple parts of the application.

Important telemetry models include:

- FocusSession
- Task
- Skill
- UserXP
- TabSession

The system can derive information such as:

- Study hours
- Focus duration
- Coding hours
- Reading hours
- Revision hours
- Productive minutes
- Distraction minutes
- Idle minutes
- Completed tasks
- Pending tasks
- Skill progress
- Quiz performance
- XP
- Level
- Streak
- Deadline completion
- Average session duration
- Focus session count

## Automatic ML Refresh

The system can automatically refresh ML predictions after relevant behavioral changes.

Examples include:

```text
Focus Session Completed
        ↓
Task Completed
        ↓
Skill Progress Updated
        ↓
XP Updated
        ↓
Telemetry Updated
        ↓
Coding Session Completed
```

These events can trigger a user-specific ML refresh.

The refresh process:

```text
Telemetry
    ↓
Feature Aggregation
    ↓
Model 1
Model 2
Model 3 V2
    ↓
Updated AI Recommendation
```

## Debounce and Recommendation Cooldown

The system contains protections against excessive ML refreshes and duplicate recommendations.

**Refresh Debounce**

Rapid events can be grouped into a single refresh operation.

```text
Event A ─┐
Event B ─┼──→ Debounced ML Refresh
Event C ─┘
```

This reduces unnecessary inference operations.

**Recommendation Cooldown**

A recommendation cooldown is used to prevent repetitive recommendation events from being inserted within the configured cooldown period.

Current implementation:

```text
RECOMMENDATION_COOLDOWN_MINUTES = 30
```

The system can still refresh predictions while preventing unnecessary duplicate recommendation events.

## Coding Activity Tracking

Coding recommendations are connected to actual coding focus sessions.

Example:

```text
AI Recommendation
"Practice Coding"
        ↓
CTA Click
        ↓
Coding Focus Mode
        ↓
Student Completes Session
        ↓
FocusSession(category="coding")
        ↓
coding_hours increases
        ↓
productive_minutes increases
        ↓
focus_sessions increases
        ↓
ML Refresh
```

This creates a measurable action-to-telemetry pipeline.

## Skill and Task Management

The platform supports skill-based learning.

A student can create:

```text
Skill
 ├── Day 1
 │    ├── Task
 │    └── Task
 ├── Day 2
 │    ├── Task
 │    └── Task
 └── Day 3
      ├── Task
      └── Task
```

Task completion can contribute to:

- Skill progress
- XP
- Streak
- Productivity metrics
- Recommendation features

## AI Learning Roadmaps

Google Gemini is used to generate structured learning roadmaps.

The system can transform a learning objective into:

- Day-wise learning plans
- Tasks
- Checklists
- Milestones
- Progressive activities

Example:

```text
Learning Goal
     ↓
Gemini
     ↓
Structured Roadmap
     ↓
Skills + Tasks
     ↓
Student Progress
```

## Procrastination Risk

Model 1 provides a machine-learning-based behavioral risk signal.

The system can use:

- Activity patterns
- Focus behavior
- Task behavior
- Productivity indicators
- Engagement signals

to estimate procrastination-related risk.

The prediction is presented as a risk indicator rather than a clinical or psychological diagnosis.

## Productivity Measurement

Model 2 produces a productivity score.

Productivity is influenced by multiple behavioral signals rather than a single measurement.

The application can combine:

- Study Activity
- Focus Activity
- Task Completion
- Productive Minutes
- Distraction
- Idle Time
- Skill Progress
- Other Behavioral Features

into the ML feature representation.

## Authentication and Security

Security features include:

- JWT-based authentication
- Protected API routes
- Authentication middleware
- Input validation
- Controlled error responses
- Production protection for development-only routes
- Sensitive log sanitization
- No JWT token logging
- No password logging
- No secret logging

Invalid authentication requests return controlled responses such as:

```text
401 Unauthorized
```

Invalid payloads return structured:

```text
400 Bad Request
```

## User Isolation

EduPulse AI is designed for multi-user data isolation.

Database queries are scoped to the authenticated user.

Conceptually:

```text
Authenticated User
       ↓
JWT
       ↓
req.user._id
       ↓
User-specific queries
       ↓
Only that user's data
```

Testing verified that one test user cannot access another user's:

- Skills
- Tasks
- Focus sessions
- Telemetry
- Recommendation records

## Database Models

The application uses MongoDB with Mongoose.

The verified model set includes:

- User
- OTP
- Skill
- Task
- FocusSession
- TabSession
- DistractionLog
- RecommendationEvent
- UserXP
- DailyChallenge
- Achievement
- Notification

## Project Structure

The main repository is organized into separate application and evaluation areas.

```text
EduPulse-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── package.json
│
├── ml-service/
│   ├── app.py
│   ├── models/
│   ├── data/
│   ├── scripts/
│   └── requirements.txt
│
├── extension/
│   └── ...
│
├── evaluation/
│   ├── api/
│   └── recommendation/
│
├── documentation/
│   └── ...
│
├── scratch/
│   └── ...
│
└── README.md
```

The `evaluation/` directory contains research and verification artifacts and is kept separate from the production application code.

## ML Service API

The Python Flask ML service runs on:

```text
http://localhost:8000
```

**Health**

```text
GET /health
```

Returns the health status of the ML service and loaded models.

**Model 1**

```text
POST /predict
```

Used for procrastination prediction.

Example response:

```json
{
  "is_procrastinator": false,
  "probability": 0.163
}
```

**Model 2**

```text
POST /predict/productivity
```

Used for productivity prediction.

Example response:

```json
{
  "productivity_score": 27.15
}
```

**Model 3 V2**

```text
POST /predict/recommendation
```

Used for personalized recommendations.

Example response:

```json
{
  "recommendation": "Practice Coding",
  "recommendation_class": 3,
  "confidence": 0.38
}
```

## Backend API

The Express backend runs on:

```text
http://localhost:5000
```

The backend provides APIs for:

- Authentication
- Users
- Skills
- Tasks
- Focus sessions
- Telemetry
- ML predictions
- ML refresh
- Recommendations
- Recommendation lifecycle
- Productivity
- Procrastination detection
- Application statistics

The frontend communicates with these APIs using authenticated HTTP requests.

## Getting Started

### Prerequisites

Install the following:

- Node.js 18+
- Python 3.9+
- MongoDB / MongoDB Atlas
- npm
- Git

### Environment Variables

Backend environment variables are stored in:

```text
backend/.env
```

Example:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GEMINI_API_KEY=<your-gemini-api-key>
ML_SERVICE_URL=http://localhost:8000
```

Do not commit real credentials to Git.

### Running the Application

EduPulse AI contains three primary runtime services.

**1. Start ML Service**

```bash
cd ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the service:

```bash
python app.py
```

The ML service runs on:

```text
http://localhost:8000
```

**2. Start Backend**

Open another terminal:

```bash
cd backend
npm install
npm start
```

Backend:

```text
http://localhost:5000
```

**3. Start Frontend**

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

**Running Order**

Recommended startup order:

```text
MongoDB
   ↓
Python ML Service
   ↓
Node.js Backend
   ↓
React Frontend
```

## Testing and Verification

The project underwent a structured verification process.

The testing process was divided into four major phases.

### Phase A — Static Verification

Phase A verified the repository and application without modifying production source code.

Verified areas included:

- Repository integrity
- Frontend dependencies
- Frontend lint
- Frontend build
- Backend dependencies
- Backend syntax
- Backend tests
- Python syntax
- Python imports
- Model artifacts
- Model contracts
- Database schemas
- Configuration
- Dependency integrity
- Git integrity
- Research integrity

Result:

```text
Critical Issues: 0
High Issues: 0
Medium Issues: 0
Low Issues: 2
```

### Phase B — Live Service Verification

Phase B verified the running application and ML services.

Verified:

- Python ML service
- ML health endpoint
- Model 1 inference
- Model 2 inference
- Model 3 V2 inference
- Express backend
- Express → Python communication
- Database connectivity
- Authentication
- Error handling
- Failure recovery
- Response contracts
- Runtime security
- Performance baseline

Result:

```text
Critical Issues: 0
High Issues: 0
Medium Issues: 0
Low Issues: 0
```

### Phase C — End-to-End Verification

Phase C verified complete user workflows.

Tested:

- Authentication
- Dashboard
- Skills
- Tasks
- Focus sessions
- Coding focus
- Telemetry
- Model 1
- Model 2
- Model 3 V2
- AI Coach
- Recommendation lifecycle
- Automatic ML refresh
- Debounce
- Deduplication
- Recommendation cooldown
- User isolation
- Error recovery
- Database consistency
- Complete user journey

Result:

```text
Critical Issues: 0
High Issues: 0
Medium Issues: 0
Low Issues: 0
```

### Phase D — Final Robustness Validation

Phase D tested the system under additional robustness conditions.

Tested:

- Regression
- Model contracts
- Invalid inputs
- Boundary values
- Concurrency
- Recommendation lifecycle
- Cooldown
- User isolation
- Authentication
- Failure recovery
- Database handling
- Frontend robustness
- Performance
- Process stability
- Log security
- API contracts
- Route regression
- Production configuration
- Repository integrity
- Complete user journey

Result:

```text
Critical Issues: 0
High Issues: 0
Medium Issues: 0
Low Issues: 0
```

## Research and Evaluation

EduPulse AI also contains a research-oriented evaluation workflow.

The purpose of the research was to investigate the observed behavior of the recommendation system rather than claim causal effects.

The research focused on:

- Recommendation effectiveness
- Recommendation acceptance
- Recommendation completion
- Class-level effectiveness
- Personalization
- Behavioral changes after recommendations
- Confidence versus adherence
- Recommendation diversity
- Data quality
- User isolation and privacy
- Temporal pre/post analysis
- Limitations caused by sample size

### Research Methodology

The research uses observational analysis of recommendation events and learner telemetry.

The analysis considers:

```text
Recommendation Event
       ↓
Baseline Behavioral State
       ↓
Recommendation
       ↓
User Response
       ↓
Completion
       ↓
Post-Recommendation Behavior
```

Baseline profiles were constructed using telemetry before recommendation presentation.

For temporal analysis, pre/post behavioral windows were used to compare observed activity around recommendation events.

The research deliberately avoids interpreting these observations as causal evidence.

Therefore, appropriate terminology includes:

- observed association
- post-recommendation difference
- descriptive analysis
- behavioral pattern
- observational finding

rather than:

- caused
- proved
- treatment effect
- statistically significant effect

when the available evidence does not support those claims.

**Research Dataset**

The canonical research baseline contains:

```text
N = 34
```

empirical recommendation events.

The canonical dataset was established after reconciling extraction timestamps and verifying that additional events were generated by backend test execution rather than fabricated or duplicated records.

The research dataset was preserved during final verification.

### Research Findings

The research analysis produced the following observations.

**Overall Recommendation Engagement**

Canonical dataset:

```text
N = 34
```

Observed acceptance:

```text
7 / 34
```

Acceptance rate:

```text
20.59%
```

Observed completion:

```text
5 / 34
```

Completion rate:

```text
14.71%
```

Completion among accepted recommendations:

```text
5 / 7
```

Completion among accepted:

```text
85.71%
```

These are descriptive observations and should not be interpreted as causal effectiveness estimates.

**Class-Level Findings**

The eight recommendation classes were evaluated descriptively.

Observed classes included:

- Class 0 — Continue Current Skill
- Class 1 — Start Focus Session
- Class 2 — Take Short Break
- Class 3 — Practice Coding
- Class 5 — Watch Learning Video

No empirical observations were available for:

- Class 4 — Revise
- Class 6 — Complete Pending Tasks
- Class 7 — Attempt Quiz

Because several classes had very small sample sizes, the analysis emphasizes descriptive statistics rather than strong statistical inference.

**Personalization Findings**

The personalization analysis examined recommendation distributions across baseline learner profiles.

One observed pattern was:

```text
Low Productivity Learners
→ Class 0 appeared frequently
```

while:

```text
High Productivity Learners
→ More diverse recommendation distribution
```

Observed adherence also differed across baseline productivity groups.

These results provide evidence of observed personalization patterns, but the sample size is insufficient to establish generalizable causal conclusions.

**Confidence Analysis**

The research also examined whether recommendation confidence was associated with observed adherence.

One observed result was:

```text
Confidence ≥ 0.70
→ 100% adherence
→ N = 3
```

Because the subgroup contains only three observations, this should be described as an observed pattern rather than a reliable population-level relationship.

## Data Integrity

The research workflow included checks for:

- Duplicate records
- PII exposure
- User isolation
- Timestamp consistency
- Dataset reconciliation
- Extraction timing
- Sample-size validity
- Production data modification
- ML artifact modification

The canonical dataset was preserved.

## Model Integrity

During the complete testing and research workflow:

```text
ML Retraining: NO
ML Model Modification: NO
Production Model Weights: UNCHANGED
Feature Contracts: UNCHANGED
```

The production ML artifacts were used for inference and verification without retraining them during the final validation process.

## Performance

The final validation included multiple inference runs.

Observed averages:

| Component | Average Latency |
|---|---|
| Model 1 | ~2.4 ms |
| Model 2 | ~5.0 ms |
| Model 3 V2 | ~35.8 ms |
| Express ML Health | ~3.9 ms |
| Full ML Refresh | ~322.2 ms |

Model 3 V2 is naturally slower than the simpler models because it performs the recommendation classification through the Random Forest model.

The full refresh includes:

- Database aggregation
- Feature construction
- ML inference
- Recommendation processing

**Robustness Testing**

The final validation tested:

*Invalid Inputs*

Missing required features produced controlled:

```text
HTTP 400 Bad Request
```

responses.

*Authentication Failures*

The following were rejected:

- Missing JWT
- Malformed JWT
- Expired JWT

with:

```text
HTTP 401 Unauthorized
```

*ML Service Failure*

When the Python ML service was stopped, the Express backend returned a controlled service-unavailable response.

After restarting the Python service, ML health recovered successfully.

*Boundary Testing*

Extreme telemetry values were tested, including:

- All-zero feature values
- Maximum boundary values

The models returned valid responses without:

- NaN
- Infinity

*Concurrency*

Concurrent ML refresh requests were tested to verify safe behavior under burst conditions.

Debouncing and user isolation remained functional during concurrent execution.

**Data Privacy and Security**

EduPulse AI follows several privacy-oriented principles:

- JWT-protected endpoints
- User-scoped database access
- No password logging
- No JWT token logging
- No secret logging
- PII-free research exports
- Controlled error responses
- Production protection for development test routes

Research analysis is performed using anonymized/non-PII datasets.

**Research Limitations**

The current research has important limitations.

*Small Sample Size*

The canonical research dataset contains:

```text
N = 34
```

recommendation events.

Several individual recommendation classes contain very few observations.

Therefore, class-level results should be interpreted cautiously.

*Observational Design*

The current evaluation is observational.

The analysis does not establish that recommendations caused changes in student behavior.

*Limited Class Coverage*

Only five of the eight recommendation classes had observed events in the canonical dataset.

Three classes had:

```text
N = 0
```

*Generalizability*

The observed results are based on the available project data and should not automatically be generalized to a larger student population.

A larger longitudinal dataset would be required for stronger conclusions.

## Project Status

EduPulse AI is currently in a completed and validated state.

| Area | Status |
|---|---|
| Core Features | COMPLETE |
| ML Models | COMPLETE |
| ML Integration | COMPLETE |
| AI Coach | COMPLETE |
| Recommendation Tracking | COMPLETE |
| Telemetry | COMPLETE |
| Coding Tracking | COMPLETE |
| Automatic ML Refresh | COMPLETE |
| Authentication | COMPLETE |
| Security Hardening | COMPLETE |
| Testing | COMPLETE |
| Research Evaluation | COMPLETE |

**Final Verification Status**

All four validation phases were completed:

```text
Phase A — Static Verification        PASS
Phase B — Live Service Verification  PASS
Phase C — End-to-End Verification    PASS
Phase D — Final Robustness Validation PASS
```

Final status:

```text
Critical Issues: 0
High Issues: 0
Medium Issues: 0
Low Issues: 0

ML Models Modified: NO
ML Retraining: NO
Research Dataset Modified: NO
```

The project is ready for:

- Demonstration
- Submission
- Research Paper Preparation
- Portfolio Presentation

## Future Improvements

Possible future work includes:

- Larger longitudinal student datasets
- Real-world user studies
- More recommendation events
- Better coverage across all eight recommendation classes
- Statistical modeling with adequate sample sizes
- A/B testing of recommendation strategies
- Personalized intervention policies
- Model calibration analysis
- Explainable AI techniques
- More advanced temporal modeling
- Improved recommendation diversity
- Dynamic recommendation thresholds
- Continuous model monitoring
- Production deployment
- Mobile application support

These improvements are considered future research/development directions and are not required for the current validated implementation.

## Contributing

Contributions are welcome.

Before making major changes:

1. Open an issue describing the proposed change.
2. Keep changes focused.
3. Avoid modifying production ML artifacts without explicit model-validation procedures.
4. Maintain the existing feature contracts.
5. Run the relevant test and validation suites.
6. Do not commit secrets or environment files.

## License

This project is licensed under the MIT License.

See the LICENSE file for details.

## Author

**Abdul Samad**

B.Tech — Computer Science
Artificial Intelligence & Machine Learning

- GitHub: [abdul-samad-001](https://github.com/abdul-samad-001)
- LinkedIn: [abdul-samad025](https://www.linkedin.com/in/abdul-samad025)

---

## Project Summary

EduPulse AI combines:

```text
Full-Stack Development
        +
Machine Learning
        +
Generative AI
        +
Behavioral Telemetry
        +
Personalized Recommendations
        +
Closed-Loop Interaction Tracking
        +
Research Evaluation
```

The key contribution of the project is the integration of machine-learning predictions with actual student actions and subsequent telemetry updates.

Instead of stopping at:

```text
Predict → Display Recommendation
```

EduPulse AI implements:

```text
Predict
   ↓
Recommend
   ↓
Student Acts
   ↓
Track Action
   ↓
Update Telemetry
   ↓
Refresh Models
   ↓
Recommend Again
```

This architecture provides a foundation for studying how intelligent, behavior-aware learning assistance can be integrated into a student productivity platform.
