# Sprint 11 Step 4 — Personalization Effectiveness Research Report

**Sprint**: Sprint 11 Step 4 — Personalization Effectiveness Analysis  
**Date**: August 13, 2026  
**Status**: Personalization Research Analysis Complete  

---

> [!IMPORTANT]
> **RESEARCH & DATA LEAKAGE DIRECTIVE**: This report evaluates observed engagement and behavioral patterns across baseline learner profiles. All baseline profiles were constructed **strictly using pre-recommendation telemetry** ($[ \text{shownAt} - 30\text{m}, \text{shownAt} ]$). Zero post-recommendation outcomes were used to segment learners (Data Leakage Check: **PASS**). All findings represent **descriptive observational associations**. Zero ML models were retrained.

---

## 1. Objective

The objective of Sprint 11 Step 4 is to determine whether Model 3 V2 recommendation predictions, learner adherence rates, and post-recommendation temporal behaviors differ across distinct baseline learner profiles.

---

## 2. Canonical Dataset

- **Canonical Analysis Population**: $N = 34$ validated baseline `RecommendationEvent` records (39 live records evaluated post-validation).
- **Data Integrity**: 100% data integrity with zero missing timestamps, zero missing user IDs, and zero duplicate primary keys.

---

## 3. Baseline Profile Definitions

Baseline user segments were defined using ONLY telemetry logged **BEFORE** recommendation delivery ($[ \text{shownAt} - 30\text{m}, \text{shownAt} ]$):

1. **Productivity Profile**:
   - **Low Productivity**: Pre-recommendation productive minutes = $0.00$ mins.
   - **Medium Productivity**: Pre-recommendation productive minutes $> 0.00$ and $\le 5.00$ mins.
   - **High Productivity**: Pre-recommendation productive minutes $> 5.00$ mins.
2. **Focus Profile**:
   - **High Focus**: Pre-recommendation productive minutes $\ge$ distraction minutes.
   - **Low Focus**: Pre-recommendation distraction minutes $>$ productive minutes (or $> 2.00$ mins).

---

## 4. Sample Sizes

Observed baseline user segment sample sizes:

| Baseline Profile | Segment Name | Sample Size ($N$) | Percentage of Total (%) | Descriptive Sample Size Flag |
| :--- | :--- | :---: | :---: | :--- |
| **Productivity Profile** | **Low Productivity** | 23 | 58.97% | *small sample — interpret cautiously* |
| **Productivity Profile** | **Medium Productivity** | 5 | 12.82% | *very small sample — insufficient for reliable generalization* |
| **Productivity Profile** | **High Productivity** | 11 | 28.21% | *small sample — interpret cautiously* |
| **Focus Profile** | **High Focus** | 39 | 100.00% | *adequate for descriptive analysis* |
| **Focus Profile** | **Low Focus** | 0 | 0.00% | *no observed data* |

---

## 5. Recommendation Distribution by Profile

Observed recommendation class assignments across baseline productivity profiles:

| Baseline Profile | Primary Recommendation Class Received | Count | Percentage within Profile (%) | Secondary Classes Received |
| :--- | :--- | :---: | :---: | :--- |
| **Low Productivity** | Class 0 (*Continue Current Skill*) | 21 | **91.30%** | Class 1 (*Start Focus Session*, 8.7%) |
| **Medium Productivity** | Class 0 (*Continue Current Skill*) | 3 | **60.00%** | Class 3 (*Practice Coding*, 40.0%) |
| **High Productivity** | Class 2 (*Take Short Break*) | 4 | **36.36%** | Class 0 (18.2%), Class 1 (18.2%), Class 3 (18.2%), Class 5 (9.1%) |

> [!NOTE]
> High productivity learners received a more diverse recommendation mix (5 distinct classes) including rest guidance (*Take Short Break*), whereas low productivity learners received structured focus and skill guidance (*Continue Current Skill*).

---

## 6. Acceptance by Profile

Learner recommendation acceptance rate across baseline profiles:

| Baseline Profile | Segment Name | Total Shown ($N$) | Accepted | Completed | Acceptance Rate (%) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Productivity Profile** | Low Productivity | 23 | 4 | 3 | **17.39%** |
| **Productivity Profile** | Medium Productivity | 5 | 0 | 0 | **0.00%** |
| **Productivity Profile** | High Productivity | 11 | 5 | 5 | **45.45%** |

---

## 7. Completion by Profile

Milestone completion post-acceptance across baseline profiles:

| Baseline Profile | Segment Name | Total Shown ($N$) | Accepted | Completed | Completion Rate (%) | Completion Among Accepted (%) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Productivity Profile** | Low Productivity | 23 | 4 | 3 | **13.04%** | **75.00%** |
| **Productivity Profile** | Medium Productivity | 5 | 0 | 0 | **0.00%** | **N/A ($N=0$)** |
| **Productivity Profile** | High Productivity | 11 | 5 | 5 | **45.45%** | **100.00%** |

---

## 8. Behavioral Changes by Profile

Pre vs post 30-minute productive time changes by baseline profile:

| Baseline Profile | Sample Size ($N$) | Pre Mean (30m) | Post Mean (30m) | Absolute Change (mins) | Post 24h Tasks Completed |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Low Productivity** | 23 | 0.00m | 1.74m | **+1.74m** | 0.00 tasks |
| **Medium Productivity** | 5 | 1.84m | 6.23m | **+4.39m** | 0.00 tasks |
| **High Productivity** | 11 | 18.76m | 12.10m | **-6.66m** | 0.00 tasks |

---

## 9. Confidence by Profile

Model 3 V2 prediction confidence summary by baseline profile:

| Baseline Profile | Sample Size ($N$) | Mean Confidence | Median Confidence | Acceptance Rate (%) |
| :--- | :---: | :---: | :---: | :---: |
| **Low Productivity** | 23 | 0.32 | 0.28 | **17.39%** |
| **Medium Productivity** | 5 | 0.43 | 0.35 | **0.00%** |
| **High Productivity** | 11 | 0.52 | 0.45 | **45.45%** |

---

## 10. Recommendation Diversity

Recommendation class concentration by profile:
- **Low Productivity Concentration**: **91.30%** of recommendations concentrated in Class 0 (*Continue Current Skill*).
- **High Productivity Diversity**: 5 unique classes assigned ($N = 11$).

---

## 11. Statistical Analysis

Subgroup sample sizes ($N = 5$ to $N = 23$) do not justify formal inferential hypothesis testing ($t$-tests, ANOVA). Reporting $p$-values on these small subgroups is not scientifically appropriate.

---

## 12. Observed Personalization Patterns

1. **Rest Guidance for High Productivity**: High productivity learners were the only group assigned Class 2 (*Take Short Break*) recommendations.
2. **Skill Continuity for Low Productivity**: Low productivity learners predominantly received Class 0 (*Continue Current Skill*) guidance.
3. **Higher Adherence in Active Learners**: High productivity learners demonstrated higher acceptance rates (**45.45%**) compared to low productivity learners (**17.39%**).

---

## 13. Small Sample Limitations

- Subgroup sizes ($N = 5, 11, 23$) require preliminary interpretation.
- Findings describe observed behavioral patterns in live logs and cannot be generalized to all student cohorts without larger samples.

---

## 14. Research Validity

- **Data Leakage Check**: **PASS**. 100% of baseline profile definitions were constructed strictly from pre-recommendation telemetry.
- **Model Integrity**: **PASS**. Model 3 V2 weights and 20 feature contracts remain 100% unchanged.

---

## 15. Conclusion

Sprint 11 Step 4 personalization analysis reveals distinct observed prediction distributions and adherence patterns across baseline user profiles while strictly preventing data leakage. Future sprints will collect expanded sample sizes to enable longitudinal personalization modeling.
