# EduPulse AI — Backend → ML Service Integration Report

**Sprint**: Sprint 8 — ML Intelligence Integration  
**Phase**: Phase 1 (Express Backend → ML Microservice)  
**Date**: August 13, 2026  
**Status**: Completed & Verified  

---

## Executive Summary

Phase 1 of Sprint 8 establishes a production-grade, secure, and resilient bridge between the EduPulse AI Express.js backend (`backend/`) and the standalone Python ML microservice (`ml-service/`). 

All three Machine Learning models are fully integrated, authenticated, and mapped to real MongoDB user telemetry without breaking existing backend routes or introducing third-party client dependencies.

---

## 1. ML Service URL Configuration

- **Environment Variable**: `ML_SERVICE_URL`
- **Default Base URL**: `http://127.0.0.1:8000`
- **HTTP Client**: `axios` configured in `backend/src/services/mlService.js`
- **Timeout**: `5000ms` (5 seconds) with automatic error catch and server-side log synthesis.

---

## 2. Express ML Routes

Mounted under base route `/api/ml` in `backend/server.js`:

| HTTP Method | Express Endpoint | Target ML Microservice Endpoint | Auth Required | Purpose |
| :---: | :--- | :--- | :---: | :--- |
| `GET` | `/api/ml/health` | `GET /health` | No | System health check & model status |
| `POST` | `/api/ml/procrastination` | `POST /predict` | **Yes (JWT)** | Model 1 Procrastination Risk prediction |
| `POST` | `/api/ml/productivity` | `POST /predict/productivity` | **Yes (JWT)** | Model 2 Productivity Score prediction |
| `POST` | `/api/ml/recommendation` | `POST /predict/recommendation` | **Yes (JWT)** | Model 3 V2 Recommendation Engine |

---

## 3. Authentication & User Isolation

- **Security Enforcement**: All prediction endpoints (`/api/ml/procrastination`, `/api/ml/productivity`, `/api/ml/recommendation`) enforce JWT authentication via `backend/src/middleware/authMiddleware.js` (`protect`).
- **User Isolation**: User identity is derived strictly from `req.user._id` contained inside the verified JWT token. Unauthenticated or tampered `userId` parameters in request bodies are ignored, preventing unauthorized cross-user data access.

---

## 4. Feature Mapping & Telemetry Extraction

Integrated via `backend/src/services/mlFeatureService.js`:

- **Data Sources**:
  - `FocusSession`: `study_hours`, `focus_score`, `productive_minutes`, `distraction_minutes`, `idle_minutes`, `focus_sessions`, `average_session_minutes`
  - `Skill`: `streak_days`, `skill_progress`, `skills_completed`
  - `Task`: `completed_tasks`, `pending_tasks`, `deadline_completion_rate`
  - `UserXP`: `xp`, `level`
  - `TabSession`: `coding_hours`, `reading_hours`, `revision_hours`
- **Feature Contract Compliance**:
  - Model 3 V2 features are formatted in exact order specified by metadata contract.
  - Fallbacks to documented baseline defaults (e.g. `sleep_hours: 7.5`, `quiz_score: 75.0`) occur seamlessly for new users without data, preventing model prediction failures.

---

## 5. Error Handling & ML Service Failure Resiliency

- **Input Validation**: `validateNumericPayload()` inspects incoming feature overrides for non-numeric types, `NaN`, or `Infinity`, returning `HTTP 400 Bad Request` before reaching the ML client.
- **Service Failure Safety**: If the ML microservice is offline, unreachable, or times out, `mlService.js` catches the error and returns a clean `HTTP 503 Service Unavailable` JSON response (`{"success": false, "message": "ML service unavailable"}`).
- **Information Leakage Prevention**: Zero Python stack traces, internal paths, or file locations are exposed to API clients.

---

## 6. Integration Verification & Test Results

Executed via `backend/tests/test_backend_ml_integration.js`:

| Test Category | Description | Status |
| :--- | :--- | :---: |
| **Health Check** | `GET /api/ml/health` returns status of all 3 models | **PASS** |
| **Authentication** | Rejects unauthenticated requests with `HTTP 401` | **PASS** |
| **Model 1 Prediction** | `POST /api/ml/procrastination` returns risk level & probability | **PASS** |
| **Model 2 Prediction** | `POST /api/ml/productivity` returns numeric score | **PASS** |
| **Model 3 Prediction** | `POST /api/ml/recommendation` returns class, text, confidence, version | **PASS** |
| **Input Validation** | Rejects `NaN` / non-numeric input with `HTTP 400` | **PASS** |
| **User Isolation** | Binds feature aggregation exclusively to `req.user._id` | **PASS** |
| **ML Service Failure** | Graceful `HTTP 503` fallback during ML outage | **PASS** |

---

*Phase 1 Complete. Ready for Phase 2 (Frontend & Extension Integration).*
