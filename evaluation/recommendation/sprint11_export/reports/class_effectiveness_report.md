# Sprint 11 Step 3 — Recommendation Class Effectiveness Research Report

**Sprint**: Sprint 11 Step 3 — Recommendation Class Effectiveness Analysis  
**Date**: August 13, 2026  
**Status**: Class-Level Research Analysis Complete  

---

> [!IMPORTANT]
> **CAUSALITY & SAMPLE SIZE DIRECTIVE**: This report presents descriptive research findings evaluated across the 8 Model 3 V2 recommendation classes using empirical production logs. Due to the small sample size ($N = 34$), all findings represent **preliminary observational associations**. This analysis does **NOT** establish that recommendations caused student performance improvements. Zero ML models were retrained, and all 20 Model 3 V2 feature contracts remain strictly unchanged.

---

## 1. Objective

The objective of Sprint 11 Step 3 is to conduct a granular class-level research analysis of the 8 Model 3 V2 recommendation classes (Classes 0–7) using empirical production logs and paired 30-minute telemetry windows.

---

## 2. Data Source

The evaluation utilizes empirical production records retrieved directly from MongoDB Atlas:

- **`RecommendationEvent`**: 34 records logging recommendation decisions, class IDs (0–7), confidence scores, and outcome statuses (`shown`, `accepted`, `dismissed`, `ignored`, `completed`).
- **`TabSession`**: 1,819 browser extension telemetry logs categorizing domain sessions as `productive` or `distraction`.
- **`FocusSession`**: 22 focus session duration and completion logs.
- **`Task`**: 133 roadmap task completion logs.

---

## 3. Observed Sample Size

- **Total Recommendation Observations**: $N = 34$
- **Clean Usable Records**: 34 (100.00% data integrity, 0 missing timestamps, 0 duplicate keys)
- **Sample Size Assessment**: $N = 34$ is suitable for initial descriptive reporting, but individual class subgroup sizes ($N = 0$ to $N = 23$) require preliminary interpretation.

---

## 4. Class Distribution

Distribution of recommendation events presented to learners across all 8 classes:

| Class ID | Class Name | Total Shown ($N$) | Percentage of Total (%) | Descriptive Sample Size Flag |
| :---: | :--- | :---: | :---: | :--- |
| **0** | **Continue Current Skill** | 23 | 67.65% | *small sample — interpret cautiously* |
| **1** | **Start Focus Session** | 3 | 8.82% | *very small sample — insufficient for reliable generalization* |
| **2** | **Take Short Break** | 3 | 8.82% | *very small sample — insufficient for reliable generalization* |
| **3** | **Practice Coding** | 4 | 11.76% | *very small sample — insufficient for reliable generalization* |
| **4** | **Revision** | 0 | 0.00% | *no observed data* |
| **5** | **Watch Learning Video** | 1 | 2.94% | *very small sample — insufficient for reliable generalization* |
| **6** | **Complete Pending Tasks** | 0 | 0.00% | *no observed data* |
| **7** | **Attempt Quiz** | 0 | 0.00% | *no observed data* |

---

## 5. Engagement by Class

Observed learner initial response across recommendation classes:

| Class ID | Class Name | Shown ($N$) | Accepted | Dismissed | Ignored | Acceptance Rate (%) | Dismissal Rate (%) | Ignore Rate (%) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | Continue Current Skill | 23 | 3 | 0 | 4 | **13.04%** | **0.00%** | **17.39%** |
| **1** | Start Focus Session | 3 | 3 | 0 | 0 | **100.00%** | **0.00%** | **0.00%** |
| **2** | Take Short Break | 3 | 1 | 0 | 0 | **33.33%** | **0.00%** | **0.00%** |
| **3** | Practice Coding | 4 | 0 | 1 | 1 | **0.00%** | **25.00%** | **25.00%** |
| **4** | Revision | 0 | 0 | 0 | 0 | **N/A ($N=0$)** | **N/A ($N=0$)** | **N/A ($N=0$)** |
| **5** | Watch Learning Video | 1 | 0 | 0 | 0 | **0.00%** | **0.00%** | **0.00%** |
| **6** | Complete Pending Tasks | 0 | 0 | 0 | 0 | **N/A ($N=0$)** | **N/A ($N=0$)** | **N/A ($N=0$)** |
| **7** | Attempt Quiz | 0 | 0 | 0 | 0 | **N/A ($N=0$)** | **N/A ($N=0$)** | **N/A ($N=0$)** |

---

## 6. Completion by Class

Observed milestone completion post-acceptance across classes:

| Class ID | Class Name | Shown ($N$) | Accepted | Completed | Completion Rate (%) | Completion Among Accepted (%) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **0** | Continue Current Skill | 23 | 3 | 2 | **8.70%** | **66.67%** |
| **1** | Start Focus Session | 3 | 3 | 3 | **100.00%** | **100.00%** |
| **2** | Take Short Break | 3 | 1 | 1 | **33.33%** | **100.00%** |
| **3** | Practice Coding | 4 | 0 | 0 | **0.00%** | **N/A ($N=0$)** |
| **4** | Revision | 0 | 0 | 0 | **N/A ($N=0$)** | **N/A ($N=0$)** |
| **5** | Watch Learning Video | 1 | 0 | 0 | **0.00%** | **N/A ($N=0$)** |
| **6** | Complete Pending Tasks | 0 | 0 | 0 | **N/A ($N=0$)** | **N/A ($N=0$)** |
| **7** | Attempt Quiz | 0 | 0 | 0 | **N/A ($N=0$)** | **N/A ($N=0$)** |

---

## 7. Behavioral Change by Class

Mean productive minutes in 30-minute window before vs after recommendation:

| Class ID | Class Name | Sample Size ($N$) | Pre Mean (30m) | Post Mean (30m) | Absolute Change (mins) |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0** | Continue Current Skill | 23 | 0.00m | +1.63m | **+1.63m** |
| **1** | Start Focus Session | 3 | 0.00m | +5.00m | **+5.00m** |
| **2** | Take Short Break | 3 | 5.00m | 0.00m | **-5.00m** |
| **3** | Practice Coding | 4 | 7.49m | 0.00m | **-7.49m** |
| **4** | Revision | 0 | — | — | **N/A ($N=0$)** |
| **5** | Watch Learning Video | 1 | 0.00m | 0.00m | **+0.00m** |
| **6** | Complete Pending Tasks | 0 | — | — | **N/A ($N=0$)** |
| **7** | Attempt Quiz | 0 | — | — | **N/A ($N=0$)** |

---

## 8. Confidence Analysis

Model 3 V2 prediction confidence summary by class:

| Class ID | Class Name | Observed $N$ | Mean Confidence | Min Confidence | Max Confidence | High Conf ($\ge 0.70$) Acceptance Rate (%) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **0** | Continue Current Skill | 23 | 0.28 | 0.28 | 0.28 | **N/A (No events $\ge 0.70$)** |
| **1** | Start Focus Session | 3 | 0.75 | 0.75 | 0.75 | **100.00%** ($N=3$) |
| **2** | Take Short Break | 3 | 0.45 | 0.45 | 0.45 | **N/A (No events $\ge 0.70$)** |
| **3** | Practice Coding | 4 | 0.35 | 0.35 | 0.35 | **N/A (No events $\ge 0.70$)** |

---

## 9. Accepted vs Non-Accepted Comparison

Comparing productive minutes change between accepted vs non-accepted guidance:

| Class Name | Accepted $N$ | Accepted Mean Change (30m) | Non-Accepted $N$ | Non-Accepted Mean Change (30m) |
| :--- | :---: | :---: | :---: | :---: |
| **Continue Current Skill** | 3 | **+5.00 mins** | 20 | **+1.12 mins** |
| **Start Focus Session** | 3 | **+5.00 mins** | 0 | **N/A ($N=0$)** |
| **Take Short Break** | 1 | **-5.00 mins** | 2 | **-5.00 mins** |

---

## 10. Sample Size Limitations

The evaluation is constrained by small sample sizes:
- Class 0 ($N = 23$): *small sample — interpret cautiously*.
- Classes 1, 2, 3, 5 ($N = 1$ to $3$): *very small sample — insufficient for reliable class-level generalization*.
- Classes 4, 6, 7 ($N = 0$): *no observed data*.

---

## 11. Statistical Analysis

Due to sample sizes ($N < 30$ in all subgroups), inferential hypothesis tests (such as $t$-tests or Mann-Whitney $U$ tests) were **not performed**. Reporting $p$-values on sample sizes of $N=1$ or $N=3$ would create misleading statistical significance claims.

---

## 12. Observed Findings

1. **Focus Guidance Adherence**: Class 1 (*Start Focus Session*) achieved 100% acceptance ($N = 3$) and $+5.00$ mins mean productive time increase.
2. **Follow-Through Post Acceptance**: In Class 0 (*Continue Current Skill*), accepted recommendations resulted in $+5.00$ mins productive change compared to $+1.12$ mins for non-accepted events.
3. **High Confidence Correlation**: Predictions with confidence $\ge 0.70$ showed 100% adherence.

---

## 13. Research Interpretation

Observational evidence indicates that structured focus session guidance (*Start Focus Session*) aligns closely with learner willingness to engage in study sessions. However, these descriptive trends represent initial observational patterns rather than proven interventions.

---

## 14. Limitations

- **Observational Nature**: Absence of a randomized controlled trial (RCT) control group.
- **Under-represented Classes**: Zero observations for Classes 4, 6, and 7 due to cold-start telemetry distributions.
- **Short Evaluation Horizon**: 30-minute pre/post windows capture immediate responses but require long-term longitudinal tracking.

---

## 15. Conclusion

Sprint 11 Step 3 completes a class-level descriptive analysis of the 8 Model 3 V2 recommendation classes. All Model 3 weights and 20 feature contracts remain 100% unchanged. As telemetry logging continues in future sprints, larger sample sizes will enable formal inferential testing across all guidance classes.
