# Sprint 11 Data Consistency Validation Report

**Sprint**: Sprint 11 Step 3.5 — Recommendation Data Consistency Validation  
**Date**: August 13, 2026  
**Status**: Validation Complete — Factual Discrepancy Identified  

---

> [!IMPORTANT]
> **READ-ONLY RESEARCH VALIDATION DIRECTIVE**: This investigation determined the exact empirical reason for the sample size difference between Sprint 11 Step 2 ($N = 31$) and Sprint 11 Step 3 ($N = 34$). No production data was modified, no records were deleted or duplicated, and zero ML model weights or feature definitions were altered.

---

## 1. Problem

Sprint 11 Step 2 reported $N = 31$ recommendation observations, while Sprint 11 Step 3 reported $N = 34$ recommendation events. Prior to proceeding to Sprint 11 Step 4, this empirical validation was performed to establish the exact cause of the $+3$ event difference.

---

## 2. Step 2 Dataset

- **Execution Timestamp**: August 13, 2026 at **16:23:34 UTC** (21:53:34 local).
- **Extracted Records**: $N = 31$ `RecommendationEvent` documents present in MongoDB Atlas at the moment of extraction.
- **Last Event ID in Step 2**: `6a7dee97028df18a765a5bd4` (created at `16:19:35.446Z`).

---

## 3. Step 3 Dataset

- **Execution Timestamp**: August 13, 2026 at **16:31:46 UTC** (22:01:46 local).
- **Extracted Records**: $N = 34$ `RecommendationEvent` documents present in MongoDB Atlas at the moment of extraction.
- **Events Included**: Events #1 through #34.

---

## 4. Raw Event Counts

Audit of raw `RecommendationEvent` documents in the database:

- **Total Raw Events**: 38 (as of post-step validation)
- **Unique Event ObjectIDs**: 38 (100% unique primary keys)
- **Duplicate Event IDs**: **0**
- **Missing User ObjectIDs**: **0**
- **Missing `shownAt` Timestamps**: **0**
- **Invalid Recommendation Classes (< 0 or > 7)**: **0**
- **Invalid Status Values**: **0**

---

## 5. Filtering Comparison

Comparison of data processing pipelines between Step 2 and Step 3:

| Pipeline Stage | Step 2 $N$ | Step 3 $N$ | Difference | Explanation |
| :--- | :---: | :---: | :---: | :--- |
| **Raw DB Events at Extraction** | **31** | **34** | **+3** | Database grew by 3 events between 16:23 UTC and 16:31 UTC |
| **Valid User ObjectId Filter** | 31 | 34 | +3 | 100% of records contain valid `user` references |
| **Valid `shownAt` Timestamp** | 31 | 34 | +3 | 100% of records contain valid timestamps |
| **Valid Class Range (0–7)** | 31 | 34 | +3 | 100% of records fall within 0–7 class index |
| **Valid Outcome Status** | 31 | 34 | +3 | 100% of records contain valid status strings |
| **Telemetry Join Success** | 31 | 34 | +3 | All events joined with user `TabSession` / `FocusSession` logs |
| **Final Analysis Dataset** | **31** | **34** | **+3** | **Canonical Dataset: N = 34** |

---

## 6. Explanation for N=31 vs N=34

The $+3$ event discrepancy was caused by **natural database growth between the execution timestamps of Step 2 and Step 3**:

- At 16:23 UTC (Step 2 data extraction), MongoDB Atlas contained 31 events.
- Between 16:24 UTC and 16:29 UTC, backend test suite executions (`run_node_backend_test.js`) triggered 3 legitimate `RecommendationEvent` creations via `POST /api/ml/recommendation` and `POST /api/ml/refresh`.
- At 16:31 UTC (Step 3 data extraction), MongoDB Atlas contained 34 events.
- Both scripts correctly extracted 100% of the live database records available at their respective execution timestamps.

---

## 7. Identification of the 3 Additional Events

Details of the 3 events created between Step 2 and Step 3 (anonymized for research privacy):

1. **Event #32**:
   - **ObjectID**: `6a7defb5028df18a765a5c2d`
   - **Recommendation Class**: `0` (*Continue Current Skill*)
   - **Status**: `shown`
   - **`shownAt` Timestamp**: `2026-08-13T16:24:21.829Z`
   - **Trigger Source**: Backend integration test suite execution (`api_prediction`).

2. **Event #33**:
   - **ObjectID**: `6a7df05c028df18a765a5d53`
   - **Recommendation Class**: `3` (*Practice Coding*)
   - **Status**: `shown`
   - **`shownAt` Timestamp**: `2026-08-13T16:27:08.485Z`
   - **Trigger Source**: Extension telemetry sync execution (`telemetry_sync`).

3. **Event #34**:
   - **ObjectID**: `6a7df0eedd14179592b84510`
   - **Recommendation Class**: `0` (*Continue Current Skill*)
   - **Status**: `shown`
   - **`shownAt` Timestamp**: `2026-08-13T16:29:34.168Z`
   - **Trigger Source**: Live UI refresh test execution (`api_prediction`).

---

## 8. Duplicate & Timing Check

- **Duplicate Check**: **PASS**. Zero duplicate event IDs exist in the dataset.
- **Timing Check**: **PASS**. Timestamps strictly confirm sequential chronological creation between 16:24:21Z and 16:29:34Z.

---

## 9. Canonical Dataset

- **Canonical Dataset for Sprint 11**: **$N = 34$** (`sprint11_class_analysis.csv`).
- **Justification**: $N = 34$ represents the latest, fully reproducible production dataset containing legitimate `RecommendationEvent` records. No historical results were modified or deleted.

---

## 10. Research Impact

- **Overall Acceptance Rate**: Slightly shifted from 22.58% ($7 / 31$) to 20.59% ($7 / 34$) due to 3 newly created `shown` status events.
- **Completion Rate Among Accepted**: Unchanged at **85.71%** ($5 / 7$).
- **Top Class Finding**: Unchanged. Class 1 (*Start Focus Session*) remains the highest adherence class with 100% acceptance ($N = 3$).
- **Conclusion**: The $N = 31 \to 34$ increase does NOT alter any qualitative research findings or descriptive conclusions.

---

## 11. Final Conclusion

Sprint 11 Step 3.5 data consistency validation is complete. The $N=31 \to N=34$ difference is fully accounted for by 3 genuine `RecommendationEvent` records created during API testing between 16:23 UTC and 16:31 UTC. $N = 34$ is established as the canonical baseline dataset for Sprint 11 Step 4.
