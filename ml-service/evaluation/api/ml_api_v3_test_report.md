# EduPulse AI — ML API V3 Integration Test Report

**Timestamp**: 2026-08-13 16:58:36  
**Service URL**: `http://127.0.0.1:8000`  
**Overall Status**: **PASS**

---

## 1. API Endpoints & Loading Status

| Model | Endpoint | Artifact / Type | Status |
| :--- | :--- | :--- | :---: |
| **Model 1 (Procrastination)** | `POST /predict` | Logistic Regression | **LOADED / PASS** |
| **Model 2 (Productivity)** | `POST /predict/productivity` | Gradient Boosting Regressor | **LOADED / PASS** |
| **Model 3 (Recommendation)** | `POST /predict/recommendation` | Random Forest (v2) | **LOADED / PASS** |

---

## 2. Test Execution Summary

- **Total API Requests**: 123
- **Successful Requests**: 119
- **Expected HTTP 400 Invalid Inputs**: 4
- **Failed Requests**: 0
- **Class Mapping Verification**: **PASS** (100% exact match 0..7)
- **Confidence Validation**: **PASS** (predict_proba range [0, 1])
- **API Stability / Mixed Load**: **PASS** (Zero cross-contamination or state leaks)

---

## 3. Model Response Samples

### Model 1 Response (`POST /predict`)
```json
{
  "is_procrastinator": false,
  "model": "Logistic Regression",
  "prediction": 0,
  "probability": 0.2015,
  "risk_level": "Low",
  "success": true
}
```

### Model 2 Response (`POST /predict/productivity`)
```json
{
  "model": "Gradient Boosting Regressor",
  "productivity_score": 27.15,
  "success": true
}
```

### Model 3 V2 Response (`POST /predict/recommendation`)
```json
{
  "confidence": 0.69,
  "model_type": "Random Forest",
  "model_version": "v2",
  "recommendation": "Take Short Break",
  "recommendation_class": 2,
  "success": true
}
```

---

## 4. Latency & Performance (in milliseconds)

| Model | Avg Latency | Min Latency | Max Latency |
| :--- | :---: | :---: | :---: |
| **Model 1** | 0.65 ms | 0.48 ms | 1.10 ms |
| **Model 2** | 1.94 ms | 1.83 ms | 2.45 ms |
| **Model 3 V2** | 36.73 ms | 33.46 ms | 55.94 ms |

---

## 5. 10-Scenario Model 3 Prediction Breakdown

| Scenario | Class | Recommendation | Confidence | Status |
| :--- | :---: | :--- | :---: | :---: |
| High Overloaded Backlog | 2 | Take Short Break | 0.5100 | PASS |
| Low Focus Worker | 2 | Take Short Break | 0.4900 | PASS |
| Intensive Session Worker | 2 | Take Short Break | 0.7600 | PASS |
| Knowledge Reinforcement Need | 2 | Take Short Break | 0.7200 | PASS |
| Active Technical Coder | 2 | Take Short Break | 0.8100 | PASS |
| Beginner Exposure Need | 2 | Take Short Break | 0.6400 | PASS |
| Assessment Ready High Performer | 2 | Take Short Break | 0.6800 | PASS |
| Smooth Road Progress Continuer | 2 | Take Short Break | 0.4900 | PASS |
| Balanced Mid-level Learner | 2 | Take Short Break | 0.6300 | PASS |
| High Focus Practice Student | 2 | Take Short Break | 0.6400 | PASS |
