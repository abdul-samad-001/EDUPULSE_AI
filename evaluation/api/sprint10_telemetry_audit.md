# EduPulse AI — Sprint 10 Telemetry & ML Refresh Audit Report

**Sprint**: Sprint 10 — Real-Time Telemetry → ML Refresh  
**Date**: August 13, 2026  
**Status**: Completed & Verified  

---

## 1. Existing Telemetry Data Sources & MongoDB Models

| Data Source | MongoDB Model | Key Fields Monitored | Current Usage in Feature Extraction |
| :--- | :--- | :--- | :--- |
| **Focus Sessions** | `FocusSession` (`user`) | `status`, `actualDurationMinutes`, `productiveSeconds`, `distractionSeconds`, `pausedDuration`, `focusScore` | Aggregates `study_hours`, `average_session_minutes`, `productive_minutes`, `distraction_minutes`, `idle_minutes`, `focus_score` |
| **User Skills** | `Skill` (`user`) | `progress`, `completed`, `streakCount` | Computes `streak_days`, `skills_completed`, `skill_progress` |
| **Tasks** | `Task` (`user`) | `completed`, `dueDate` | Computes `completed_tasks`, `pending_tasks`, `deadline_completion_rate` |
| **User XP & Level** | `UserXP` (`user`) | `totalXP`, `level` | Provides `xp`, `xp_earned`, `level`, `current_level` |
| **Browser Telemetry** | `TabSession` (`user`) | `durationSeconds`, `domain`, `category` | Classifies domain activity into `coding_hours`, `reading_hours`, `revision_hours` |

---

## 2. Model Feature Contracts

### Model 1: Procrastination Risk (11 Features)
1. `study_hours_per_day`
2. `app_usage_minutes`
3. `idle_time_minutes`
4. `lms_logins_per_week`
5. `submission_offset_hours`
6. `completion_rate_percent`
7. `deadline_misses_30d`
8. `streak_days`
9. `avg_session_length_min`
10. `distraction_visits_per_day`
11. `sleep_hours`

### Model 2: Productivity Score (20 Features)
1. `study_hours_per_day`
2. `focus_session_minutes`
3. `productive_minutes`
4. `distraction_minutes`
5. `idle_time_minutes`
6. `completed_tasks`
7. `pending_tasks`
8. `deadline_completion_rate`
9. `coding_hours`
10. `reading_hours`
11. `revision_hours`
12. `quiz_score`
13. `practice_questions`
14. `sleep_hours`
15. `break_frequency`
16. `focus_score`
17. `xp_earned`
18. `current_level`
19. `streak_days`
20. `skills_completed`

### Model 3 V2: Recommendation Engine (20 Features - Exact Order)
1. `productivity_score`
2. `focus_score`
3. `study_hours`
4. `xp`
5. `level`
6. `streak_days`
7. `completed_tasks`
8. `pending_tasks`
9. `coding_hours`
10. `reading_hours`
11. `revision_hours`
12. `quiz_score`
13. `productive_minutes`
14. `distraction_minutes`
15. `idle_minutes`
16. `sleep_hours`
17. `skill_progress`
18. `deadline_completion_rate`
19. `focus_sessions`
20. `average_session_minutes`

---

## 3. Meaningful Telemetry Event Triggers

To prevent unnecessary predictions on minor DB updates while keeping intelligence fresh:
1. `focus_session_completed`: Triggered when a user finishes a Pomodoro/Focus block.
2. `task_status_changed`: Triggered when a user marks a task completed/pending.
3. `skill_progress_updated`: Triggered when a skill milestone is updated or completed.
4. `xp_earned`: Triggered when User XP / level increases.
5. `telemetry_sync`: Triggered when Chrome extension syncs new domain tab sessions.

---

## 4. Cooldown & User Isolation Architecture

- **User Isolation**: All feature builds and prediction requests are strictly filtered by `req.user._id`.
- **Cooldown Protection**: `RECOMMENDATION_COOLDOWN_MINUTES` (30 mins) is strictly maintained for database event creation. Fresh ML predictions are computed in memory for real-time UI display without duplicating `RecommendationEvent` DB documents.
