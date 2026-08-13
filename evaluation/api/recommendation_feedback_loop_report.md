# EduPulse AI — Adaptive AI Productivity Coach: Recommendation Feedback & Outcome Loop Report

**Sprint**: Sprint 9 — Adaptive AI Productivity Coach  
**Date**: August 13, 2026  
**Status**: Completed & Fully Verified  

---

> [!IMPORTANT]
> **CRITICAL RESEARCH NOTE**: The recommendation feedback loop does NOT retrain or modify the deployed machine-learning models (Model 1, Model 2, Model 3 V2). The feedback data is collected strictly for recommendation analytics, UI personalization, outcome measurement, and future research dataset exports.

---

## 1. RecommendationEvent Model & Schema

- **File**: `backend/src/models/RecommendationEvent.js`
- **Fields**:
  - `user`: `ObjectId` (ref: `User`, `required: true`)
  - `recommendationClass`: `Number` (`required: true`)
  - `recommendation`: `String` (`required: true`)
  - `confidence`: `Number` (`required: true`)
  - `modelType`: `String` (default: `"Random Forest"`)
  - `modelVersion`: `String` (default: `"v2"`)
  - `status`: `String` (enum: `["shown", "accepted", "dismissed", "ignored", "completed"]`, default: `"shown"`)
  - `shownAt`: `Date` (default: `Date.now`)
  - `respondedAt`: `Date` (optional)
  - `completedAt`: `Date` (optional)
  - `actionType`: `String` (optional)
  - `actionTarget`: `String` (optional)
  - `context`: `Object` (optional)
- **Indexes**:
  - `{ user: 1, shownAt: -1 }`
  - `{ user: 1, status: 1 }`
  - `{ user: 1, recommendationClass: 1 }`

---

## 2. API Endpoints

Mounted under `/api/recommendations` in `backend/server.js` (Protected by `authMiddleware.js`):

| HTTP Method | Route | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/recommendations` | Creates or deduplicates a recommendation event | **Yes** |
| `POST` | `/api/recommendations/:id/respond` | Responds to recommendation (`accepted` or `dismissed`) | **Yes** |
| `POST` | `/api/recommendations/:id/complete` | Marks recommendation status as `completed` | **Yes** |
| `GET` | `/api/recommendations/history` | Retrieves user's recommendation history | **Yes** |
| `GET` | `/api/recommendations/stats` | Computes acceptance rate, completion rate, top actions | **Yes** |
| `GET` | `/api/recommendations/export` | Produces PII-free dataset export for future research | **Yes** |

---

## 3. Cooldown & Anti-Spam Mechanism

- **Environment Variable**: `RECOMMENDATION_COOLDOWN_MINUTES` (Default: `30`)
- **Deduplication**: When `POST /api/ml/recommendation` or `POST /api/recommendations` is called, the system inspects whether an identical recommendation event was created for that user within the 30-minute window. If found, the existing event is returned instead of duplicating DB records.

---

## 4. Ignored Status Lazy Evaluation

- **Environment Variable**: `RECOMMENDATION_IGNORE_AFTER_MINUTES` (Default: `60`)
- **Lazy Evaluation**: Any recommendation left in `"shown"` status beyond 60 minutes is automatically updated to `"ignored"` during stats and history queries without requiring external background cron dependencies.

---

## 5. UI Integration & Personalization

- **AI Productivity Coach** (`AICoachPreviewCard.jsx`):
  - Renders **Accept (CTA)** and **Dismiss** buttons.
  - Displays lightweight toast confirmation upon interaction.
  - Incorporates historical behavioral insights (e.g. *"Your history shows 8 completed AI recommendations with an 85% acceptance rate"*).
- **Dashboard Overview** (`MLIntelligenceSummaryWidget.jsx`):
  - Displays live Acceptance Rate (%) and Follow-Through Completion Rate (%).
- **Analytics Performance Card** (`RecommendationPerformanceCard.jsx`):
  - Renders outcome status bar charts alongside most-followed and most-completed action statistics.

---

## 6. Verification & Test Results

1. **Backend Integration & Loop Tests** (`backend/tests/test_recommendation_loop.js`):
   - Record Event: **PASS**
   - Cooldown Deduplication: **PASS**
   - Accept Response: **PASS**
   - Complete Action: **PASS**
   - History Retrieval: **PASS**
   - Stats Computation: **PASS**
   - PII-Free Export: **PASS**
   - User Isolation: **PASS**
2. **ESLint**: `npm run lint` passed with **0 errors** and **0 warnings**.
3. **Vite Production Build**: `npm run build` compiled cleanly (**0 errors**).
