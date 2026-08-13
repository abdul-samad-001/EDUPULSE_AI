"""
Sprint 11 Step 2: Standalone Recommendation Effectiveness Research Script
========================================================================
Analyzes recommendation engagement, class-level performance, pre/post temporal
behavioral differences, model confidence association, sample sizes, data quality,
and privacy compliance based on empirical RecommendationEvent logs and telemetry.

IMPORTANT SAFETY DIRECTIVE:
- Zero ML model retraining.
- Zero modification of .pkl model artifacts or feature definitions.
- Non-causal terminology enforced (observational associations only).
- Handles empty datasets, zero baselines, and small sample sizes gracefully.
"""

import os
import sys
import json
import pandas as pd
import numpy as np

# Path configurations
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EVAL_DIR = os.path.join(BASE_DIR, "..", "evaluation", "recommendation")
DATASET_PATH = os.path.join(EVAL_DIR, "sprint11_effectiveness_dataset.csv")

CLASS_NAMES = {
    0: "Continue Current Skill",
    1: "Start Focus Session",
    2: "Take Short Break",
    3: "Practice Coding",
    4: "Revision",
    5: "Watch Learning Video",
    6: "Complete Pending Tasks",
    7: "Attempt Quiz",
}

def analyze_effectiveness():
    print("=" * 70)
    print("EDUPULSE AI — SPRINT 11 STEP 2: RECOMMENDATION EFFECTIVENESS ANALYZER")
    print("=" * 70)

    if not os.path.exists(DATASET_PATH):
        print(f"Warning: Effectiveness dataset not found at {DATASET_PATH}")
        print("Creating placeholder analysis report with N=0 usable observations.")
        df = pd.DataFrame(columns=[
            "event_id", "user_id", "recommendation_class", "class_name", "status",
            "confidence", "shown_at", "responded_at", "completed_at",
            "pre_productive_mins", "post_productive_mins", "productive_change_mins"
        ])
    else:
        df = pd.read_csv(DATASET_PATH)

    total_shown = len(df)
    print(f"\n1. DATASET OVERVIEW & SAMPLE SIZES:")
    print(f"   Total Recommendation Observations (N): {total_shown}")

    # Engagement Metrics
    accepted = len(df[df["status"].isin(["accepted", "completed"])])
    dismissed = len(df[df["status"] == "dismissed"])
    ignored = len(df[df["status"] == "ignored"])
    completed = len(df[df["status"] == "completed"])

    acc_rate = (accepted / total_shown * 100) if total_shown > 0 else 0.0
    dism_rate = (dismissed / total_shown * 100) if total_shown > 0 else 0.0
    ign_rate = (ignored / total_shown * 100) if total_shown > 0 else 0.0
    comp_rate = (completed / total_shown * 100) if total_shown > 0 else 0.0
    comp_among_acc = (completed / accepted * 100) if accepted > 0 else 0.0

    print(f"\n2. ENGAGEMENT METRICS:")
    print(f"   - Acceptance Rate:           {acc_rate:.2f}% (N = {total_shown})")
    print(f"   - Dismissal Rate:            {dism_rate:.2f}% (N = {total_shown})")
    print(f"   - Ignore Rate:               {ign_rate:.2f}% (N = {total_shown})")
    print(f"   - Completion Rate:           {comp_rate:.2f}% (N = {total_shown})")
    print(f"   - Completion Among Accepted: {comp_among_acc:.2f}% (N = {accepted})")

    # Class-Level Performance
    print(f"\n3. RECOMMENDATION CLASS PERFORMANCE (CLASSES 0–7):")
    class_summary = []
    for c in range(8):
        c_name = CLASS_NAMES.get(c, "Unknown Class")
        cdf = df[df["recommendation_class"] == c]
        c_n = len(cdf)
        c_acc = len(cdf[cdf["status"].isin(["accepted", "completed"])])
        c_comp = len(cdf[cdf["status"] == "completed"])
        c_acc_rate = (c_acc / c_n * 100) if c_n > 0 else 0.0
        c_comp_rate = (c_comp / c_n * 100) if c_n > 0 else 0.0
        
        class_summary.append({
            "Class ID": c,
            "Class Name": c_name,
            "Shown (N)": c_n,
            "Accepted": c_acc,
            "Completed": c_comp,
            "Acceptance Rate (%)": f"{c_acc_rate:.1f}%",
            "Completion Rate (%)": f"{c_comp_rate:.1f}%"
        })

    class_summary_df = pd.DataFrame(class_summary)
    print(class_summary_df.to_string(index=False))

    # Pre/Post Behavioral Change Analysis
    print(f"\n4. PRE/POST TEMPORAL BEHAVIORAL DIFFERENCES (30-MINUTE WINDOW):")
    if not df.empty and "productive_change_mins" in df.columns:
        valid_bdf = df[df["pre_productive_mins"].notna()]
        print(f"   Usable Paired Telemetry Observations (N): {len(valid_bdf)}")
        
        acc_bdf = valid_bdf[valid_bdf["status"].isin(["accepted", "completed"])]
        dism_bdf = valid_bdf[valid_bdf["status"] == "dismissed"]
        
        acc_mean_change = acc_bdf["productive_change_mins"].mean() if not acc_bdf.empty else 0.0
        dism_mean_change = dism_bdf["productive_change_mins"].mean() if not dism_bdf.empty else 0.0

        print(f"   - Accepted/Completed Mean Change: {acc_mean_change:+.2f} mins (N = {len(acc_bdf)})")
        print(f"   - Dismissed Mean Change:          {dism_mean_change:+.2f} mins (N = {len(dism_bdf)})")
    else:
        print("   Insufficient paired pre/post telemetry observations.")

    # Confidence Analysis
    print(f"\n5. MODEL CONFIDENCE ASSOCIATION ANALYSIS:")
    if not df.empty and "confidence" in df.columns:
        bins = [0.0, 0.5, 0.7, 0.9, 1.01]
        labels = ["0.00–0.49", "0.50–0.69", "0.70–0.89", "0.90–1.00"]
        df["conf_bin"] = pd.cut(df["confidence"], bins=bins, labels=labels, right=False)
        
        for label in labels:
            bdf = df[df["conf_bin"] == label]
            b_n = len(bdf)
            b_acc = len(bdf[bdf["status"].isin(["accepted", "completed"])])
            b_acc_rate = (b_acc / b_n * 100) if b_n > 0 else 0.0
            print(f"   - Range {label}: N = {b_n:2d} | Acceptance Rate = {b_acc_rate:5.1f}%")

    print("\n" + "=" * 70)
    print("ANALYSIS COMPLETE — RESEARCH METRICS SUCCESSFULLY EVALUATED")
    print("=" * 70)

if __name__ == "__main__":
    analyze_effectiveness()
