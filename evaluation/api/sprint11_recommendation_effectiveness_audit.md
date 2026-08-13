# Sprint 11 Recommendation Effectiveness Audit

**Sprint**: Sprint 11 Step 1 — Recommendation Effectiveness Audit  
**Date**: August 13, 2026  
**Status**: Audit Completed  

---

> [!IMPORTANT]
> **RESEARCH & COMPLIANCE DIRECTIVE**: This audit strictly evaluates existing database schemas, lifecycle APIs, analytics calculations, and temporal telemetry capabilities. Zero production code, ML models, `.pkl` artifacts, feature definitions, or training datasets were modified.

---

## 1. Existing Recommendation Event Model

The database schema for tracking recommendation outcomes is defined in [`backend/src/models/RecommendationEvent.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/models/RecommendationEvent.js):

| Field Name | Data Type | Purpose | Required | Indexed | Timestamp | Effectiveness Analysis Suitability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `user` | `ObjectId` (ref `User`) | Identifies authenticated student | **Yes** | **Yes** | No | Essential for per-user outcome scoping and temporal telemetry joins. |
| `recommendationClass` | `Number` (0–7) | ML recommendation class ID | **Yes** | **Yes** | No | Enables class-specific effectiveness analysis across all 8 guidance types. |
| `recommendation` | `String` | Human-readable recommendation text | **Yes** | No | No | Used for identifying most accepted / completed action guidance. |
| `confidence` | `Number` (0.0–1.0) | Model 3 Random Forest confidence | **Yes** | No | No | Correlates model prediction certainty with learner follow-through. |
| `modelType` | `String` | ML model architecture (default: "Random Forest") | No | No | No | Tracks model family attribution. |
| `modelVersion` | `String` | ML model version (default: "v2") | No | No | No | Tracks model version attribution across model updates. |
| `status` | `String` (Enum) | Outcome state: `shown`, `accepted`, `dismissed`, `ignored`, `completed` | **Yes** | **Yes** | No | Core metric for calculating acceptance, dismissal, ignore, and completion rates. |
| `shownAt` | `Date` | Timestamp when recommendation was created & presented | **Yes** | **Yes** | **Yes** | Baseline timestamp anchor for pre/post behavioral window analysis. |
| `respondedAt` | `Date` | Timestamp when user clicked Accept or Dismiss | No | No | **Yes** | Measures user response latency (decision duration). |
| `completedAt` | `Date` | Timestamp when target learning milestone was completed | No | No | **Yes** | Measures task fulfillment duration post-acceptance. |
| `actionType` | `String` | Response trigger mechanism (e.g., `cta_click`, `user_dismiss`) | No | No | No | Categorizes user interaction source. |
| `actionTarget` | `String` | Target UI route (e.g., `/focus`, `/skills`) | No | No | No | Maps recommendation outcome to navigation targets. |
| `context` | `Object` | Additional contextual metadata | No | No | No | Stores auxiliary event metadata (e.g., trigger source). |
| `createdAt` / `updatedAt` | `Date` | Mongoose document timestamps | Built-in | No | **Yes** | Database transaction timestamps. |

---

## 2. Recommendation Lifecycle

The complete recommendation lifecycle is implemented across [`recommendationController.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/controllers/recommendationController.js), [`recommendationRoutes.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/routes/recommendationRoutes.js), [`recommendationService.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/services/recommendationService.js), and [`AICoachPreviewCard.jsx`](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/components/dashboard/AICoachPreviewCard.jsx):

```
       [ ML Service Prediction Refresh ]
                       ↓
         createRecommendationEvent()
                       ↓
             ┌───────────────────┐
             │   status: shown   │ ──( > 60 mins inactive )──> status: ignored
             └─────────┬─────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
status: accepted            status: dismissed
         │
         ▼
 status: completed
```

### Lifecycle Transition Details:
1. **Event Creation (`shown`)**:
   - Executed via `createRecommendationEvent(userId, recommendationData, context)`.
   - **Cooldown Check**: Enforces `RECOMMENDATION_COOLDOWN_MINUTES=30`. If an event for the same `recommendationClass` exists within 30 minutes, the existing event is returned without creating a duplicate record.
2. **User Response (`accepted` / `dismissed`)**:
   - Endpoint: `POST /api/recommendations/:id/respond` (Controller: `respondToRecommendation`).
   - Triggered when learner clicks CTA (`accepted`) or Dismiss (`dismissed`) in `AICoachPreviewCard.jsx`.
   - Records `respondedAt = new Date()` and updates `status`.
3. **Lazy Expiration (`ignored`)**:
   - Enforced by `updateIgnoredRecommendations(userId)`.
   - Automatically transitions any recommendation with `status === "shown"` to `status = "ignored"` if `shownAt` is older than `RECOMMENDATION_IGNORE_AFTER_MINUTES=60`.
4. **Milestone Fulfillment (`completed`)**:
   - Endpoint: `POST /api/recommendations/:id/complete` (Controller: `completeRecommendation`) or internal helper `markRecommendationComplete(userId, class)`.
   - Records `completedAt = new Date()` and updates `status = "completed"`.

---

## 3. Existing Analytics

The current analytics system in [`recommendationController.js`](file:///d:/FINAL%20YEAR/EduPulse-AI/backend/src/controllers/recommendationController.js#L279) and [`RecommendationPerformanceCard.jsx`](file:///d:/FINAL%20YEAR/EduPulse-AI/frontend/src/components/analytics/RecommendationPerformanceCard.jsx) computes:

| Metric | Calculation Formula | Purpose |
| :--- | :--- | :--- |
| **Total Recommendations** | `count(events)` | Volume of recommendations presented to user |
| **Accepted Count** | `count(accepted) + count(completed)` | Volume of recommendations accepted or fulfilled |
| **Dismissed Count** | `count(dismissed)` | Volume of explicitly rejected recommendations |
| **Ignored Count** | `count(ignored)` | Volume of unacted recommendations older than 60 mins |
| **Completed Count** | `count(completed)` | Volume of fully completed recommendations |
| **Acceptance Rate (%)** | `Math.round((acceptedCount / totalRecommendations) * 100)` | Primary adherence metric |
| **Completion Rate (%)** | `Math.round((completedCount / acceptedCount) * 100)` | Primary follow-through metric |
| **Average Confidence** | `sum(confidence) / totalRecommendations` | Model prediction certainty |
| **Most Accepted Action** | Mode of `recommendation` text for accepted/completed events | Identifies highest adherence activity type |
| **Most Completed Goal** | Mode of `recommendation` text for completed events | Identifies highest completion activity type |

---

## 4. Available Behavioral Telemetry

The repository contains five active behavioral models that can be correlated with recommendation outcomes:

1. **`FocusSession`**:
   - Fields: `startedAt`, `endedAt`, `actualDurationMinutes`, `plannedDurationMinutes`, `status`, `notes`.
   - Application: Measures study duration & focus session completion pre/post recommendation.
2. **`Task`**:
   - Fields: `completed`, `assignedDay`, `order`, `createdAt`, `updatedAt`.
   - Application: Measures task completion rate pre/post recommendation.
3. **`Skill`**:
   - Fields: `progress`, `completed`, `streakCount`, `currentDay`, `lastCompletedAt`.
   - Application: Tracks roadmap progress before and after recommendation triggers.
4. **`UserXP`**:
   - Fields: `totalXP`, `level`, `currentLevelXP`, `nextLevelXP`.
   - Application: Tracks gamified experience progression following recommendation acceptance.
5. **`TabSession`**:
   - Fields: `domain`, `category` (`productive`, `distraction`, `neutral`), `durationSeconds`, `startedAt`, `endedAt`, `focusSession`.
   - Application: Evaluates distraction vs productive minutes in pre/post temporal windows.

---

## 5. Temporal Analysis Capability

The system has sufficient timestamp coverage to perform temporal analysis:

- **Timestamps Anchor**: `shownAt`, `respondedAt`, `completedAt` on `RecommendationEvent`.
- **Telemetry Timestamps**: `startedAt`, `endedAt` on `FocusSession` & `TabSession`; `updatedAt` on `Task` & `Skill`.
- **Temporal Windows Supported**:
  - **Pre-Recommendation Window**: e.g., `[shownAt - 30 mins, shownAt]`
  - **Intervention Window**: `[shownAt, respondedAt || completedAt]`
  - **Post-Recommendation Window**: e.g., `[shownAt, shownAt + 30 mins]` or `[shownAt, shownAt + 24 hrs]`

---

## 6. Currently Supported Metrics

- **Engagement Metrics**: Acceptance Rate (%), Dismissal Rate (%), Ignored Rate (%), Completion Rate (%).
- **Class Distributions**: Total recommendations shown per `recommendationClass` (0–7).
- **Fulfillment Metrics**: Most accepted recommendation, most completed goal, average model confidence.

---

## 7. Proposed Effectiveness Metrics

Based strictly on existing database models, the following effectiveness metrics can be computed:

### Category A: Engagement & Follow-Through
1. **Response Latency**: Time elapsed between `shownAt` and `respondedAt` (seconds).
2. **Fulfillment Duration**: Time elapsed between `respondedAt` and `completedAt` (minutes).
3. **Completion Conversion Rate**: Percentage of accepted recommendations that transition to `completed`.

### Category B: Behavioral Change (Observed Differences)
1. **Pre/Post Productive Time Delta**: `ProductiveMinutes(Post 30m) - ProductiveMinutes(Pre 30m)`.
2. **Pre/Post Distraction Time Delta**: `DistractionMinutes(Post 30m) - DistractionMinutes(Pre 30m)`.
3. **Post-Recommendation Focus Session Rate**: Number of focus sessions started within 60 minutes of a focus-related recommendation.
4. **Post-Recommendation Task Velocity**: Tasks completed within 24 hours following a task-related recommendation.

### Category C: Personalization & Class Breakdown
1. **Effectiveness by Recommendation Class**: Acceptance & completion rates broken down across all 8 recommendation classes.
2. **Effectiveness by Baseline Activity**: Comparing outcome rates between low-activity vs high-activity learners.

---

## 8. Data Gaps

The current schema does NOT record the following research parameters:
1. **Instantaneous Feature Snapshot**: The exact 20-feature input vector at the exact millisecond of recommendation generation.
2. **Direct Baseline Snapshot Fields**: Pre/post baseline metrics embedded directly on `RecommendationEvent` (currently requires joining `RecommendationEvent` with `FocusSession` / `TabSession`).
3. **Qualitative Dismissal Reason**: Reason why a user dismissed a recommendation (e.g. "Not relevant", "Busy now").
4. **Randomized A/B Test Identifier**: Control vs treatment group flags for causal experimentation.

---

## 9. Privacy & User Isolation

- **Authentication**: All recommendation controllers enforce JWT middleware (`protect`). Queries are strictly scoped to `req.user._id`.
- **Anonymized Data Export**: The `exportRecommendationData` endpoint (`GET /api/recommendations/export`) returns only event metrics (`eventId`, `recommendationClass`, `recommendation`, `confidence`, `modelType`, `modelVersion`, `status`, `shownAt`, `respondedAt`, `completedAt`, `actionType`). Zero PII (name, email, password hash, JWT tokens) is exposed.

---

## 10. Research Validity

### What the Existing Data CAN Support:
- **Observational Associations**: e.g., *"Students who accepted AI recommendations exhibited 28% more productive minutes in the subsequent 30-minute window compared to their pre-recommendation baseline."*
- **Comparative Engagement**: e.g., *"Focus session recommendations yielded a higher completion rate (82%) than quiz attempt recommendations (45%)."*

### What the Existing Data CANNOT Automatically Support:
- **Unconditional Causal Claims**: e.g., *"The AI recommendation directly caused the student to increase study time."*
- **Confounding Variable Elimination**: External factors such as student motivation, external assignment deadlines, or time of day cannot be isolated without a randomized control group.

---

## 11. Recommended Next Implementation Step

Proceed to **Sprint 11 Step 2**, where backend utility functions will be implemented to pair `RecommendationEvent` timestamps with `TabSession` and `FocusSession` telemetry to compute pre/post behavioral differences and observational effectiveness metrics.
