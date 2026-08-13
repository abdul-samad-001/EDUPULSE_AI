"""
Sprint 11 Step 3: Recommendation Class Effectiveness Research Script
======================================================================
Performs deep descriptive analysis of the 8 Model 3 V2 recommendation classes
using empirical production logs (N = 31).

IMPORTANT SAFETY & RESEARCH RULES:
- Zero ML model retraining.
- Zero modification of .pkl model artifacts or feature definitions.
- Non-causal terminology enforced (observational associations only).
- Explicit sample size flags attached to all class-level metrics.
- Safe handling of zero-observation classes (N = 0) and zero denominators.
"""

import os
import sys
import json
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EVAL_DIR = os.path.join(BASE_DIR, "..", "evaluation", "recommendation")
CLASS_CSV_PATH = os.path.join(EVAL_DIR, "sprint11_class_analysis.csv")
BEHAVIORAL_CSV_PATH = os.path.join(EVAL_DIR, "sprint11_class_behavioral_analysis.csv")

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

def get_sample_size_flag(n):
    if n >= 30:
        return "adequate for descriptive analysis"
    elif n >= 10:
        return "small sample — interpret cautiously"
    elif n >= 1:
        return "very small sample — insufficient for reliable class-level generalization"
    else:
        return "no observed data"

def analyze_class_effectiveness():
    print("=" * 80)
    print("EDUPULSE AI — SPRINT 11 STEP 3: RECOMMENDATION CLASS EFFECTIVENESS ANALYZER")
    print("=" * 80)

    if not os.path.exists(CLASS_CSV_PATH):
        print(f"Error: {CLASS_CSV_PATH} not found. Please run data extraction script first.")
        return

    df_class = pd.read_csv(CLASS_CSV_PATH)
    df_beh = pd.read_csv(BEHAVIORAL_CSV_PATH) if os.path.exists(BEHAVIORAL_CSV_PATH) else pd.DataFrame()

    total_n = df_class["total_shown_n"].sum()
    print(f"\n1. TOTAL OBSERVED SAMPLE SIZE (N): {total_n} Recommendation Events\n")

    print("2. CLASS DISTRIBUTION & ENGAGEMENT METRICS (CLASSES 0–7):")
    print("-" * 80)
    
    table_rows = []
    for _, row in df_class.iterrows():
        c_id = int(row["class_id"])
        c_name = row["class_name"]
        n = int(row["total_shown_n"])
        acc = int(row["accepted"])
        dism = int(row["dismissed"])
        ign = int(row["ignored"])
        comp = int(row["completed"])
        acc_rate = row["acceptance_rate_pct"]
        comp_rate = row["completion_rate_pct"]
        flag = get_sample_size_flag(n)

        table_rows.append({
            "ID": c_id,
            "Class Name": c_name[:20],
            "N": n,
            "Acc": acc,
            "Dism": dism,
            "Ign": ign,
            "Comp": comp,
            "Acc Rate (%)": f"{acc_rate:.1f}%",
            "Comp Rate (%)": f"{comp_rate:.1f}%",
            "Sample Size Flag": flag
        })

    summary_df = pd.DataFrame(table_rows)
    print(summary_df.to_string(index=False))

    print("\n3. PRE/POST TEMPORAL BEHAVIORAL DIFFERENCES BY CLASS:")
    print("-" * 80)
    if not df_beh.empty:
        beh_rows = []
        for _, row in df_beh.iterrows():
            c_id = int(row["class_id"])
            c_name = row["class_name"]
            n = int(row["sample_size_n"])
            mean_change = row["mean_productive_change_mins"]
            acc_n = int(row["accepted_n"])
            acc_change = row["accepted_mean_prod_change"]
            non_acc_n = int(row["non_accepted_n"])
            non_acc_change = row["non_accepted_mean_prod_change"]

            beh_rows.append({
                "ID": c_id,
                "Class Name": c_name[:20],
                "N": n,
                "Mean Prod Change (30m)": f"{mean_change:+.2f}m" if n > 0 else "N/A",
                "Acc N": acc_n,
                "Acc Mean Change": f"{float(acc_change):+.2f}m" if acc_n > 0 and acc_change != "N/A" else "N/A",
                "Non-Acc N": non_acc_n,
                "Non-Acc Mean Change": f"{float(non_acc_change):+.2f}m" if non_acc_n > 0 and non_acc_change != "N/A" else "N/A"
            })
        beh_df = pd.DataFrame(beh_rows)
        print(beh_df.to_string(index=False))
    else:
        print("Behavioral dataset empty or unavailable.")

    print("\n4. DESCRIPTIVE CLASS RANKINGS (WITH SMALL-SAMPLE FLAGS):")
    print("-" * 80)
    # Sort classes with N > 0 by acceptance rate
    valid_classes = df_class[df_class["total_shown_n"] > 0].copy()
    if not valid_classes.empty:
        ranked_acc = valid_classes.sort_values(by="acceptance_rate_pct", ascending=False)
        print("  [Acceptance Rate Ranking]")
        for idx, (_, row) in enumerate(ranked_acc.iterrows(), 1):
            n = int(row["total_shown_n"])
            flag_note = " (Preliminary — very small sample)" if n < 10 else ""
            print(f"   Rank {idx}: {row['class_name']} — {row['acceptance_rate_pct']:.1f}% acceptance (N={n}){flag_note}")
    else:
        print("   No observed data for ranking.")

    print("\n5. STATISTICAL INFERENCE SUITABILITY WARNING:")
    print("-" * 80)
    print("   Total Dataset N = 31. Subgroup sample sizes range from N=0 to N=21.")
    print("   Directive: Statistical inference (t-tests, p-values) NOT appropriate for this sample size.")
    print("   Reporting descriptive observations and pre/post temporal differences only.")

    print("\n" + "=" * 80)
    print("ANALYSIS COMPLETE — RESEARCH METRICS SUCCESSFULLY EVALUATED")
    print("=" * 80)

if __name__ == "__main__":
    analyze_class_effectiveness()
