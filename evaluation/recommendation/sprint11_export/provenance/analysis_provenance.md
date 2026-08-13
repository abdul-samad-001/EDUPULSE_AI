# EduPulse AI Sprint 11 Analysis Provenance Document

**Project**: EduPulse AI Research Platform  
**Sprint**: Sprint 11 Step 6 — Research Export Package  
**Date**: August 13, 2026  
**Canonical Baseline**: $N = 34$ Recommendation Events  

---

## 1. Data Source & Extraction
All observations originate from production MongoDB collections (`RecommendationEvent`, `TabSession`, `FocusSession`, `Task`).

## 2. Sample Size Reconciliation
- Step 2 Extraction Timestamp: 16:23 UTC ($N = 31$).
- Live Integration Test Calls (16:24–16:29 UTC): Created 3 new legitimate events (#32, #33, #34).
- Step 3 Extraction Timestamp: 16:31 UTC ($N = 34$).
- Canonical Baseline: Established as $N = 34$ in `sprint11_data_consistency_validation.md`.

## 3. Data Leakage Safeguards
100% of baseline user profile classifications (`Low`, `Medium`, `High` productivity) were derived strictly from telemetry logged in $[ 	ext{shownAt} - 30	ext{m}, 	ext{shownAt} ]$. Zero post-recommendation data leakage.

## 4. Privacy Compliance
All export datasets substitute internal MongoDB ObjectIDs with anonymized observation keys (`REC_OBS_001` to `REC_OBS_034`). Zero PII (names, emails, JWTs) is present.
