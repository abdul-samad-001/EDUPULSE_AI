# AI Coach Action Tracking & Telemetry Loop Report

**Sprint**: AI Coach Closed-Loop Action Tracking  
**Date**: August 13, 2026  
**Status**: Implementation Complete & Verified  

---

> [!NOTE]
> **REPRODUCIBLE CLOSED-LOOP ARCHITECTURE**: Clicking "Start Coding Focus Session" sets the `RecommendationEvent` status to `accepted`. Only after the learner completes the actual FocusSession is the recommendation marked `completed`, updating telemetry (`coding_hours`, `productive_minutes`, `focus_sessions`), and triggering debounced automatic ML refresh for Model 3 V2.

---

## 1. Objective

Enable closed-loop tracking for EduPulse AI Productivity Coach recommendations so that when Model 3 recommends actionable study guidance (e.g., *"Practice Coding"*), the learner can start, execute, and complete the corresponding activity with end-to-end telemetry and automatic ML refresh.

---

## 2. Recommendation → Action Flow Architecture

```text
Model 3 Recommendation ("Practice Coding")
                ↓
    Learner Clicks Primary CTA ("Start Coding Focus Session")
                ↓
  RecommendationEvent Status → "accepted"
                ↓
  Navigates to Focus Workspace (/focus?mode=coding)
                ↓
  Coding Focus Session Started (category: "coding")
                ↓
  Learner Executes Activity (FocusTimer running)
                ↓
  Learner Completes Focus Session
                ↓
  FocusSession Saved (actualDurationMinutes recorded)
                ↓
  RecommendationEvent Status → "completed"
                ↓
  Telemetry Aggregated (coding_hours += actualDuration / 60)
                ↓
  Automatic ML Refresh Triggered (triggerUserMLRefresh)
                ↓
  Model 3 V2 Inference Runs with Updated Telemetry
                ↓
  Fresh AI Coach Recommendation Generated
```

---

## 3. Key Technical Implementation Details

### A. FocusSession Schema Extension
- Added `category` field (`enum: ["general", "coding", "revision", "reading", "break"]`, default: `"general"`) to [`FocusSession.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/models/FocusSession.js).
- Added `recommendationId` reference to correlate specific FocusSessions with original RecommendationEvents.

### B. Telemetry Feature Aggregation (`mlFeatureService.js`)
- Updated [`getUserAggregatedMetrics`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/services/mlFeatureService.js#L88) so completed `FocusSession` records with `category === "coding"` dynamically contribute `actualDurationMinutes / 60` to `coding_hours`.
- Preserved existing `study_hours`, `productive_minutes`, `focus_sessions`, and `average_session_minutes` aggregation.

### C. Backend Focus Session Controller (`focusSessionController.js`)
- [`startFocusSession`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/controllers/focusSessionController.js#L12): Accepts `category` and `recommendationId`.
- [`stopFocusSession`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/controllers/focusSessionController.js#L64): Calculates actual duration, completes FocusSession, calls `markRecommendationComplete`, and dispatches debounced automatic ML refresh.

### D. AI Coach Component Upgrades (`AICoachPreviewCard.jsx` & `AIFocusPreviewCard.jsx`)
- Upgraded primary CTA buttons across all 8 Model 3 V2 recommendation classes:
  - Class 0 (Continue Current Skill): Navigates to `/skills`.
  - Class 1 (Start Focus Session): Navigates to `/focus`.
  - Class 2 (Take Short Break): Navigates to `/focus?mode=break`.
  - Class 3 (Practice Coding): Navigates to `/focus?mode=coding` with CTA *"Start Coding Focus Session"*.
  - Class 4 (Revision): Navigates to `/focus?mode=revision`.
  - Class 5 (Watch Video Lesson): Navigates to `/skills`.
  - Class 6 (Complete Pending Tasks): Navigates to `/tasks`.
  - Class 7 (Attempt Challenge Quiz): Navigates to `/daily-challenge`.
- Added button state locking (`actionProcessing`) to prevent duplicate clicks.

---

## 4. State Machine Integrity

| Stage | Trigger | RecommendationEvent Status | FocusSession Status | Telemetry Updated |
|---|---|---|---|---|
| 1. Presentation | AI Coach rendered | `shown` | N/A | No |
| 2. Acceptance | CTA Click | `accepted` | `active` | No |
| 3. Execution | Focus Timer | `accepted` | `active` | No |
| 4. Completion | Stop Session | `completed` | `completed` | **YES** (`coding_hours` $\uparrow$) |

---

## 5. Security & Isolation

- All FocusSession creation, completion, and recommendation updates strictly enforce `req.user._id` authentication via JWT middleware.
- Zero keystroke logging, zero raw source code capturing, and zero invasive surveillance.

---

## 6. Model Integrity

- **Model 1 (Procrastination Risk)**: UNCHANGED
- **Model 2 (Productivity Score)**: UNCHANGED
- **Model 3 V2 (Recommendation Engine)**: UNCHANGED
- **scikit-learn `.pkl` Artifacts**: UNCHANGED
- **20-Feature Contract & 8-Class Mapping**: UNCHANGED
- **ML Retraining**: NO

---

## 7. Testing & Verification

- End-to-End Action Tracking Script: [`scratch/test_ai_coach_action_tracking.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/scratch/test_ai_coach_action_tracking.js) -> **PASSED**.
- Verified `coding_hours` increased accurately (from 0.6 to 1.2 hours).
- Verified `RecommendationEvent` status transitioned from `shown` -> `accepted` -> `completed`.
- Verified debounced automatic ML refresh (`5000ms`).
