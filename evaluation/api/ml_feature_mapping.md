# EduPulse AI — ML Feature Mapping & Data Source Specification

**Module**: Express Backend → ML Service Integration  
**Date**: August 13, 2026  
**Status**: Feature Contract Defined & Mapped to MongoDB Collections  

---

## Executive Summary

This document specifies the exact mapping between EduPulse AI's backend MongoDB database models (`FocusSession`, `Skill`, `Task`, `UserXP`, `TabSession`, `DistractionLog`) and the feature inputs required by all 3 Machine Learning models:

1. **Model 1 (Procrastination Detection)**: 11 Features (Logistic Regression)
2. **Model 2 (Productivity Score Prediction)**: 20 Features (Gradient Boosting Regressor)
3. **Model 3 (Recommendation Engine V2)**: 20 Features (Random Forest Classifier)

---

## 1. Model 3 Recommendation Engine V2 (20 Features)

*Ordered strictly according to Model 3 V2 metadata contract (`models/recommendation/v2/model_metadata_v2.json`):*

| # | ML Feature Name | Source Collection / Entity | Source Field / Expression | Transformation / Default | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| 1 | `productivity_score` | `FocusSession` / `TabSession` | Average focus score or computed productivity ratio | $0 - 100$ scale (Default: `75.0`) | **Mapped** |
| 2 | `focus_score` | `FocusSession` | `avg(FocusSession.focusScore)` | Average of completed sessions (Default: `75.0`) | **Mapped** |
| 3 | `study_hours` | `FocusSession` | `sum(actualDurationMinutes) / 60` | Total completed focus hours (Default: `4.0`) | **Mapped** |
| 4 | `xp` | `UserXP` | `UserXP.totalXP` | Cumulative XP earned (Default: `0`) | **Mapped** |
| 5 | `level` | `UserXP` | `UserXP.level` | Current user level (Default: `1`) | **Mapped** |
| 6 | `streak_days` | `Skill` | `max(Skill.streakCount)` | Highest active skill streak (Default: `0`) | **Mapped** |
| 7 | `completed_tasks` | `Task` | `count(Task.completed == true)` | Total completed milestone tasks (Default: `0`) | **Mapped** |
| 8 | `pending_tasks` | `Task` | `count(Task.completed == false)` | Total active pending tasks (Default: `0`) | **Mapped** |
| 9 | `coding_hours` | `TabSession` / `FocusSession` | `sum(durationSeconds) / 3600` on coding domains | Extracted from coding tab sessions (Default: `1.5`) | **Mapped** |
| 10 | `reading_hours` | `TabSession` / `FocusSession` | `sum(durationSeconds) / 3600` on reading domains | Extracted from reading/docs tab sessions (Default: `1.0`) | **Mapped** |
| 11 | `revision_hours` | `TabSession` / `FocusSession` | `sum(durationSeconds) / 3600` on revision domains | Extracted from revision/notes sessions (Default: `1.0`) | **Mapped** |
| 12 | `quiz_score` | User Profile / Assessment | Latest quiz score | Scale $0 - 100$ (Default: `75.0`) | **Documented Default** |
| 13 | `productive_minutes` | `FocusSession` | `sum(productiveSeconds) / 60` | Sum of productive focus minutes (Default: `180.0`) | **Mapped** |
| 14 | `distraction_minutes` | `FocusSession` / `TabSession` | `sum(distractionSeconds) / 60` | Sum of distracted minutes (Default: `30.0`) | **Mapped** |
| 15 | `idle_minutes` | `FocusSession` / `TabSession` | `sum(pausedDuration)` or idle tab minutes | Sum of paused/idle minutes (Default: `20.0`) | **Mapped** |
| 16 | `sleep_hours` | User Telemetry / Self-Report | User self-reported sleep duration | Scale $4 - 10$ hours (Default: `7.5`) | **Documented Default** |
| 17 | `skill_progress` | `Skill` | `avg(Skill.progress)` | Overall average skill progress % (Default: `50.0`) | **Mapped** |
| 18 | `deadline_completion_rate` | `Task` | `(completed_tasks / total_tasks) * 100` | Percentage of tasks completed before deadline (Default: `80.0`) | **Mapped** |
| 19 | `focus_sessions` | `FocusSession` | `count(status == "completed")` | Count of completed focus sessions (Default: `0`) | **Mapped** |
| 20 | `average_session_minutes` | `FocusSession` | `avg(actualDurationMinutes)` | Mean duration per focus session (Default: `30.0`) | **Mapped** |

---

## 2. Model 1 Procrastination Detection (11 Features)

| # | ML Feature Name | Source Collection | Source Field / Expression | Transformation / Default | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| 1 | `study_hours_per_day` | `FocusSession` | Daily average study hours | `sum(actualDurationMinutes) / (60 * days)` (Default: `3.0`) | **Mapped** |
| 2 | `app_usage_minutes` | `TabSession` | Total active app usage | `sum(durationSeconds) / 60` (Default: `120.0`) | **Mapped** |
| 3 | `idle_time_minutes` | `FocusSession` / `TabSession` | Total idle/paused minutes | `sum(pausedDuration)` (Default: `30.0`) | **Mapped** |
| 4 | `lms_logins_per_week` | User Telemetry | Login count in 7 days | Count of auth events in last 7 days (Default: `5`) | **Mapped** |
| 5 | `submission_offset_hours` | `Task` | Time diff relative to deadline | Mean hours relative to task deadlines (Default: `0.0`) | **Mapped** |
| 6 | `completion_rate_percent` | `Task` | `(completed / total) * 100` | Task completion percentage (Default: `75.0`) | **Mapped** |
| 7 | `deadline_misses_30d` | `Task` | Missed deadlines in 30 days | Count of overdue tasks in last 30 days (Default: `0`) | **Mapped** |
| 8 | `streak_days` | `Skill` | `max(Skill.streakCount)` | Maximum active streak (Default: `0`) | **Mapped** |
| 9 | `avg_session_length_min` | `FocusSession` | `avg(actualDurationMinutes)` | Average focus session duration (Default: `30.0`) | **Mapped** |
| 10 | `distraction_visits_per_day` | `DistractionLog` / `TabSession` | Count of distraction visits | Daily average distraction site visits (Default: `5`) | **Mapped** |
| 11 | `sleep_hours` | User Telemetry | Self-reported sleep hours | Hours of sleep per night (Default: `7.5`) | **Documented Default** |

---

## 3. Model 2 Productivity Score Prediction (20 Features)

| # | ML Feature Name | Source Collection | Source Field / Expression | Transformation / Default | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| 1 | `study_hours_per_day` | `FocusSession` | Daily study hours | Total focus hours / active days (Default: `3.5`) | **Mapped** |
| 2 | `focus_session_minutes` | `FocusSession` | Mean focus session length | `avg(actualDurationMinutes)` (Default: `35.0`) | **Mapped** |
| 3 | `productive_minutes` | `FocusSession` | `sum(productiveSeconds) / 60` | Productive minutes total (Default: `180.0`) | **Mapped** |
| 4 | `distraction_minutes` | `FocusSession` / `TabSession` | `sum(distractionSeconds) / 60` | Distracted minutes total (Default: `30.0`) | **Mapped** |
| 5 | `idle_time_minutes` | `FocusSession` | `sum(pausedDuration)` | Paused/idle minutes total (Default: `20.0`) | **Mapped** |
| 6 | `completed_tasks` | `Task` | `count(completed == true)` | Total completed tasks (Default: `0`) | **Mapped** |
| 7 | `pending_tasks` | `Task` | `count(completed == false)` | Total pending tasks (Default: `0`) | **Mapped** |
| 8 | `deadline_completion_rate` | `Task` | `(completed / total) * 100` | Task completion rate % (Default: `80.0`) | **Mapped** |
| 9 | `coding_hours` | `TabSession` | `sum(durationSeconds) / 3600` | Hours on coding platforms (Default: `1.5`) | **Mapped** |
| 10 | `reading_hours` | `TabSession` | `sum(durationSeconds) / 3600` | Hours on reading platforms (Default: `1.0`) | **Mapped** |
| 11 | `revision_hours` | `TabSession` | `sum(durationSeconds) / 3600` | Hours on revision platforms (Default: `1.0`) | **Mapped** |
| 12 | `quiz_score` | User Profile | Quiz performance | Score $0 - 100$ (Default: `75.0`) | **Documented Default** |
| 13 | `practice_questions` | User Telemetry | Practice questions answered | Total completed questions (Default: `20`) | **Mapped** |
| 14 | `sleep_hours` | User Telemetry | Self-reported sleep hours | Hours of sleep per night (Default: `7.5`) | **Documented Default** |
| 15 | `break_frequency` | `FocusSession` | `avg(pauseCount)` | Average breaks per session (Default: `2`) | **Mapped** |
| 16 | `focus_score` | `FocusSession` | `avg(focusScore)` | Mean focus score (Default: `75.0`) | **Mapped** |
| 17 | `xp_earned` | `UserXP` | `UserXP.totalXP` | Total user XP (Default: `0`) | **Mapped** |
| 18 | `current_level` | `UserXP` | `UserXP.level` | Current user level (Default: `1`) | **Mapped** |
| 19 | `streak_days` | `Skill` | `max(Skill.streakCount)` | Maximum active streak (Default: `0`) | **Mapped** |
| 20 | `skills_completed` | `Skill` | `count(progress == 100)` | Fully completed skills (Default: `0`) | **Mapped** |

---

## 4. Centralization & Fallback Design

All features are dynamically extracted in `backend/src/services/mlFeatureService.js`. If a specific feature cannot be computed due to insufficient user telemetry (e.g. brand new user with 0 sessions), standard documented baseline defaults are applied to guarantee valid numerical input to the ML models without crashing or returning fake predictions.
