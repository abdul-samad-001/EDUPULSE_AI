"""
generate_dataset_v2.py

EduPulse AI - Recommendation Engine Dataset Generator (Model 3 - Experiment B)

Purpose:
Generates a 100,000-record recommendation dataset using explicit, priority-based
behavioral decision rules and boundary-aware noise to reduce class overlap while
maintaining realistic behavioral ambiguity.

Output:
- data/recommendation/recommendation_dataset_v2.csv
- data/recommendation/recommendation_dataset_v2_metadata.json

Dataset Specs:
- Records: 100,000
- Features: 20 behavioural and academic metrics
- Target: recommendation (Multi-class: 0 to 7)
  0 = Continue Current Skill
  1 = Start Focus Session
  2 = Take Short Break
  3 = Practice Coding
  4 = Revision
  5 = Watch Learning Video
  6 = Complete Pending Tasks
  7 = Attempt Quiz
"""

import os
import json
import random
import numpy as np
import pandas as pd

# Set fixed random seed for exact reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

N_SAMPLES = 100000


def main():
    # ==========================================================
    # STEP 1: Directory & Path Setup
    # ==========================================================
    script_dir = os.path.dirname(os.path.abspath(__file__))

    if os.path.basename(script_dir) == "recommendation":
        base_dir = os.path.abspath(os.path.join(script_dir, "..", ".."))
    elif os.path.basename(script_dir) == "scripts":
        base_dir = os.path.abspath(os.path.join(script_dir, ".."))
    else:
        base_dir = os.getcwd()

    output_dir = os.path.join(base_dir, "data", "recommendation")
    os.makedirs(output_dir, exist_ok=True)
    
    csv_output_file = os.path.join(output_dir, "recommendation_dataset_v2.csv")
    json_output_file = os.path.join(output_dir, "recommendation_dataset_v2_metadata.json")

    # ==========================================================
    # STEP 2: Realistic Feature Generation (100,000 Records)
    # ==========================================================
    # Diverse behavioral profiles to cover realistic feature distributions
    arch_p = [0.125] * 8
    archetypes = np.random.choice(8, size=N_SAMPLES, p=arch_p)

    sp = np.zeros(N_SAMPLES)
    ps = np.zeros(N_SAMPLES)
    fs = np.zeros(N_SAMPLES)
    sh = np.zeros(N_SAMPLES)
    cd = np.zeros(N_SAMPLES)
    rd = np.zeros(N_SAMPLES)
    rv = np.zeros(N_SAMPLES)
    qz = np.zeros(N_SAMPLES)
    pm = np.zeros(N_SAMPLES)
    dl = np.zeros(N_SAMPLES)
    pt = np.zeros(N_SAMPLES, dtype=int)
    ct = np.zeros(N_SAMPLES, dtype=int)
    f_sess = np.zeros(N_SAMPLES, dtype=int)
    avg_sess = np.zeros(N_SAMPLES)

    for a in range(8):
        mask = (archetypes == a)
        n_a = mask.sum()
        if n_a == 0:
            continue

        if a == 0:  # Continue Current Skill
            sp[mask] = np.random.uniform(67, 92, n_a)
            ps[mask] = np.random.uniform(67, 92, n_a)
            pt[mask] = np.random.randint(1, 6, n_a)
            dl[mask] = np.random.uniform(72, 95, n_a)
            fs[mask] = np.random.uniform(60, 64.5, n_a)
            sh[mask] = np.random.uniform(3.0, 6.5, n_a)
            qz[mask] = np.random.uniform(60, 75, n_a)
            ct[mask] = np.random.randint(2, 5, n_a)
            cd[mask] = np.random.uniform(0.5, 1.8, n_a)
            rd[mask] = np.random.uniform(1.0, 3.0, n_a)
            rv[mask] = np.random.uniform(0.5, 2.0, n_a)
            f_sess[mask] = np.random.randint(2, 4, n_a)
            avg_sess[mask] = np.random.uniform(30, 48, n_a)
            pm[mask] = np.random.uniform(140, 300, n_a)
        elif a == 1:  # Start Focus Session
            fs[mask] = np.random.uniform(20, 52, n_a)
            pm[mask] = np.random.uniform(40, 175, n_a)
            sh[mask] = np.random.uniform(1.0, 3.8, n_a)
            pt[mask] = np.random.randint(2, 9, n_a)
            sp[mask] = np.random.uniform(30, 70, n_a)
            ps[mask] = np.random.uniform(25, 55, n_a)
            dl[mask] = np.random.uniform(40, 75, n_a)
            qz[mask] = np.random.uniform(35, 65, n_a)
            ct[mask] = np.random.randint(2, 9, n_a)
            cd[mask] = np.random.uniform(0.2, 1.8, n_a)
            rd[mask] = np.random.uniform(0.5, 2.0, n_a)
            rv[mask] = np.random.uniform(0.2, 1.5, n_a)
            f_sess[mask] = np.random.randint(1, 4, n_a)
            avg_sess[mask] = np.random.uniform(20, 45, n_a)
        elif a == 2:  # Take Short Break
            f_sess[mask] = np.random.randint(4, 9, n_a)
            avg_sess[mask] = np.random.uniform(52, 95, n_a)
            pm[mask] = np.random.uniform(245, 500, n_a)
            fs[mask] = np.random.uniform(72, 95, n_a)
            sh[mask] = np.random.uniform(5.5, 10.0, n_a)
            pt[mask] = np.random.randint(2, 9, n_a)
            sp[mask] = np.random.uniform(45, 80, n_a)
            ps[mask] = np.random.uniform(70, 95, n_a)
            dl[mask] = np.random.uniform(65, 90, n_a)
            qz[mask] = np.random.uniform(60, 85, n_a)
            ct[mask] = np.random.randint(5, 18, n_a)
            cd[mask] = np.random.uniform(1.0, 1.9, n_a)
            rd[mask] = np.random.uniform(1.0, 3.0, n_a)
            rv[mask] = np.random.uniform(1.0, 2.5, n_a)
        elif a == 3:  # Practice Coding
            cd[mask] = np.random.uniform(2.2, 6.0, n_a)
            qz[mask] = np.random.uniform(47, 78, n_a)
            sp[mask] = np.random.uniform(30, 78, n_a)
            pt[mask] = np.random.randint(2, 9, n_a)
            sh[mask] = np.random.uniform(3.5, 8.0, n_a)
            fs[mask] = np.random.uniform(58, 85, n_a)
            ps[mask] = np.random.uniform(50, 80, n_a)
            dl[mask] = np.random.uniform(50, 80, n_a)
            ct[mask] = np.random.randint(3, 12, n_a)
            pm[mask] = np.random.uniform(185, 350, n_a)
            rd[mask] = np.random.uniform(0.5, 2.0, n_a)
            rv[mask] = np.random.uniform(0.5, 2.0, n_a)
            f_sess[mask] = np.random.randint(2, 4, n_a)
            avg_sess[mask] = np.random.uniform(30, 48, n_a)
        elif a == 4:  # Revision
            qz[mask] = np.random.uniform(20, 52, n_a)
            sp[mask] = np.random.uniform(27, 73, n_a)
            sh[mask] = np.random.uniform(2.2, 6.5, n_a)
            rv[mask] = np.random.uniform(1.5, 4.5, n_a)
            pt[mask] = np.random.randint(2, 9, n_a)
            fs[mask] = np.random.uniform(58, 85, n_a)
            ps[mask] = np.random.uniform(40, 70, n_a)
            dl[mask] = np.random.uniform(45, 75, n_a)
            ct[mask] = np.random.randint(2, 10, n_a)
            pm[mask] = np.random.uniform(185, 300, n_a)
            cd[mask] = np.random.uniform(0.2, 1.8, n_a)
            rd[mask] = np.random.uniform(0.5, 2.5, n_a)
            f_sess[mask] = np.random.randint(2, 4, n_a)
            avg_sess[mask] = np.random.uniform(25, 45, n_a)
        elif a == 5:  # Watch Learning Video
            sp[mask] = np.random.uniform(10, 38, n_a)
            sh[mask] = np.random.uniform(0.8, 2.8, n_a)
            qz[mask] = np.random.uniform(15, 62, n_a)
            rd[mask] = np.random.uniform(0.1, 1.8, n_a)
            pt[mask] = np.random.randint(1, 9, n_a)
            fs[mask] = np.random.uniform(58, 80, n_a)
            ps[mask] = np.random.uniform(20, 55, n_a)
            dl[mask] = np.random.uniform(30, 65, n_a)
            ct[mask] = np.random.randint(1, 6, n_a)
            pm[mask] = np.random.uniform(40, 140, n_a)
            cd[mask] = np.random.uniform(0.1, 1.5, n_a)
            rv[mask] = np.random.uniform(0.1, 1.2, n_a)
            f_sess[mask] = np.random.randint(1, 3, n_a)
            avg_sess[mask] = np.random.uniform(15, 40, n_a)
        elif a == 6:  # Complete Pending Tasks
            pt[mask] = np.random.randint(10, 25, n_a)
            ct[mask] = np.random.randint(1, 8, n_a)
            dl[mask] = np.random.uniform(20, 58, n_a)
            sp[mask] = np.random.uniform(20, 70, n_a)
            ps[mask] = np.random.uniform(25, 65, n_a)
            fs[mask] = np.random.uniform(30, 65, n_a)
            sh[mask] = np.random.uniform(2.0, 6.0, n_a)
            qz[mask] = np.random.uniform(30, 70, n_a)
            pm[mask] = np.random.uniform(90, 250, n_a)
            cd[mask] = np.random.uniform(0.2, 1.8, n_a)
            rd[mask] = np.random.uniform(0.5, 2.0, n_a)
            rv[mask] = np.random.uniform(0.2, 2.0, n_a)
            f_sess[mask] = np.random.randint(1, 4, n_a)
            avg_sess[mask] = np.random.uniform(20, 45, n_a)
        elif a == 7:  # Attempt Quiz
            qz[mask] = np.random.uniform(72, 98, n_a)
            sp[mask] = np.random.uniform(72, 98, n_a)
            fs[mask] = np.random.uniform(67, 95, n_a)
            ct[mask] = np.random.randint(6, 22, n_a)
            pt[mask] = np.random.randint(1, 6, n_a)
            ps[mask] = np.random.uniform(70, 95, n_a)
            dl[mask] = np.random.uniform(72, 95, n_a)
            sh[mask] = np.random.uniform(3.5, 7.5, n_a)
            pm[mask] = np.random.uniform(185, 350, n_a)
            cd[mask] = np.random.uniform(0.5, 1.8, n_a)
            rd[mask] = np.random.uniform(1.0, 3.5, n_a)
            rv[mask] = np.random.uniform(1.0, 3.0, n_a)
            f_sess[mask] = np.random.randint(2, 4, n_a)
            avg_sess[mask] = np.random.uniform(30, 48, n_a)

    # Derived realistic features with slight measurement noise
    productivity_score = np.round(np.clip(ps + np.random.normal(0, 1.0, N_SAMPLES), 0.0, 100.0), 2)
    focus_score = np.round(np.clip(fs + np.random.normal(0, 1.0, N_SAMPLES), 0.0, 100.0), 2)
    study_hours = np.round(np.clip(sh, 0.5, 12.0), 2)
    coding_hours = np.round(np.clip(cd, 0.0, 8.0), 2)
    reading_hours = np.round(np.clip(rd, 0.0, 6.0), 2)
    revision_hours = np.round(np.clip(rv, 0.0, 6.0), 2)
    quiz_score = np.round(np.clip(qz + np.random.normal(0, 1.0, N_SAMPLES), 0.0, 100.0), 2)
    productive_minutes = np.round(np.clip(pm, 15.0, 600.0), 2)
    distraction_minutes = np.round(np.clip(300.0 - focus_score * 2.5 + np.random.normal(0, 8.0, N_SAMPLES), 0.0, 400.0), 2)
    idle_minutes = np.round(np.clip(200.0 - productivity_score * 1.5 + np.random.normal(0, 8.0, N_SAMPLES), 0.0, 300.0), 2)
    sleep_hours = np.round(np.clip(np.random.normal(7.0, 1.0, N_SAMPLES), 3.0, 10.0), 2)
    skill_progress = np.round(np.clip(sp + np.random.normal(0, 1.0, N_SAMPLES), 0.0, 100.0), 2)
    deadline_completion_rate = np.round(np.clip(dl + np.random.normal(0, 1.0, N_SAMPLES), 0.0, 100.0), 2)
    average_session_minutes = np.round(np.clip(avg_sess, 5.0, 120.0), 2)
    completed_tasks = np.clip(ct, 0, 30).astype(int)
    pending_tasks = np.clip(pt, 0, 30).astype(int)
    focus_sessions = np.clip(f_sess, 1, 15).astype(int)

    xp = np.clip(np.round(skill_progress * 350 + study_hours * 800 + np.random.normal(0, 500, N_SAMPLES)), 100, 50000).astype(int)
    level = np.clip((xp // 1000) + 1, 1, 50).astype(int)
    streak_days = np.clip(np.round(productivity_score * 0.6 + np.random.exponential(3.0, N_SAMPLES)), 0, 100).astype(int)

    task_completion_rate = completed_tasks / (completed_tasks + pending_tasks + 1e-5)

    # ==========================================================
    # STEP 3: Priority-Based Behavioral Rules & Target Assignment
    # ==========================================================
    c6 = (pending_tasks >= 10) & ((task_completion_rate < 0.55) | (deadline_completion_rate < 60))
    c1 = (focus_score < 55) & (productive_minutes < 180) & (study_hours < 4)
    c2 = (focus_sessions >= 4) & (average_session_minutes >= 50) & (productive_minutes >= 240) & (focus_score >= 70)
    c4 = (quiz_score < 55) & (skill_progress >= 25) & (skill_progress <= 75) & (study_hours >= 2)
    c3 = (coding_hours >= 2.0) & (quiz_score >= 45) & (quiz_score <= 80) & (skill_progress < 80)
    c7 = (quiz_score >= 70) & (skill_progress >= 70) & (focus_score >= 65) & (completed_tasks >= 5)
    c5 = (skill_progress < 40) & (study_hours < 3) & (quiz_score < 65) & (reading_hours < 2)
    c0 = (skill_progress >= 65) & (productivity_score >= 65) & (pending_tasks < 7) & (deadline_completion_rate >= 70) & (focus_score >= 60)

    rule_matches = np.column_stack([c0, c1, c2, c3, c4, c5, c6, c7])
    priority_order = [6, 1, 2, 4, 3, 7, 5, 0]

    primary_class = np.full(N_SAMPLES, -1, dtype=int)
    secondary_class = np.full(N_SAMPLES, -1, dtype=int)

    for cls in priority_order:
        mask = rule_matches[:, cls]
        primary_mask = mask & (primary_class == -1)
        primary_class[primary_mask] = cls
        
        secondary_mask = mask & (primary_class != -1) & (primary_class != cls) & (secondary_class == -1)
        secondary_class[secondary_mask] = cls

    # Boundary-aware noise near rule overlaps (6% probability of secondary recommendation)
    noise_flip = (secondary_class != -1) & (np.random.rand(N_SAMPLES) < 0.06)
    final_target = np.where(noise_flip, secondary_class, primary_class)

    # Fallback to profile archetype for edge cases
    unassigned_mask = (final_target == -1)
    final_target[unassigned_mask] = archetypes[unassigned_mask]

    # ==========================================================
    # STEP 4: DataFrame Assembly & Data Quality Verification
    # ==========================================================
    feature_dict = {
        "productivity_score": productivity_score,
        "focus_score": focus_score,
        "study_hours": study_hours,
        "xp": xp,
        "level": level,
        "streak_days": streak_days,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "coding_hours": coding_hours,
        "reading_hours": reading_hours,
        "revision_hours": revision_hours,
        "quiz_score": quiz_score,
        "productive_minutes": productive_minutes,
        "distraction_minutes": distraction_minutes,
        "idle_minutes": idle_minutes,
        "sleep_hours": sleep_hours,
        "skill_progress": skill_progress,
        "deadline_completion_rate": deadline_completion_rate,
        "focus_sessions": focus_sessions,
        "average_session_minutes": average_session_minutes,
        "recommendation": final_target,
    }

    df = pd.DataFrame(feature_dict)

    # Shuffle dataset with fixed random seed
    df = df.sample(frac=1.0, random_state=RANDOM_SEED).reset_index(drop=True)

    # Quality Checks
    missing_values = int(df.isnull().sum().sum())
    duplicate_rows = int(df.duplicated().sum())

    class_names = {
        0: "Continue Current Skill",
        1: "Start Focus Session",
        2: "Take Short Break",
        3: "Practice Coding",
        4: "Revision",
        5: "Watch Learning Video",
        6: "Complete Pending Tasks",
        7: "Attempt Quiz",
    }

    class_dist_counts = df["recommendation"].value_counts().sort_index()

    class_dist_str_lines = []
    for cls_idx in range(8):
        count = int(class_dist_counts.get(cls_idx, 0))
        pct = (count / len(df)) * 100
        cls_name = class_names[cls_idx]
        class_dist_str_lines.append(
            f"  Class {cls_idx} ({cls_name:<23}): {count:>6} ({pct:5.2f}%)"
        )
    class_dist_str = "\n".join(class_dist_str_lines)

    # Save output CSV
    df.to_csv(csv_output_file, index=False)

    # Save Metadata JSON
    metadata = {
        "dataset_version": "Experiment B - Refined Recommendation Labels",
        "record_count": N_SAMPLES,
        "feature_count": 20,
        "target": "recommendation",
        "class_names": class_names,
        "random_seed": RANDOM_SEED,
        "label_generation_method": "Priority-based behavioral rules with boundary-aware noise",
        "rule_priority": [
            "Complete Pending Tasks",
            "Start Focus Session",
            "Take Short Break",
            "Revision",
            "Practice Coding",
            "Attempt Quiz",
            "Watch Learning Video",
            "Continue Current Skill",
        ],
        "noise_strategy": "Boundary-aware stochastic component applied near rule intersections without global Gaussian noise",
    }

    with open(json_output_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    # ==========================================================
    # STEP 5: Console Output
    # ==========================================================
    print("========================================")
    print("EDUPULSE AI")
    print("MODEL 3 - EXPERIMENT B")
    print("REFINED RECOMMENDATION DATASET")
    print("========================================")
    print()
    print("Dataset generated successfully")
    print()
    print("Dataset Shape:")
    print(df.shape)
    print()
    print("Target:")
    print("recommendation")
    print()
    print("Class Distribution:")
    print(class_dist_str)
    print()
    print("Missing Values:")
    print(missing_values)
    print()
    print("Duplicate Rows:")
    print(duplicate_rows)
    print()
    print("Label Generation:")
    print("Priority-based behavioral rules")
    print("with boundary-aware noise")
    print()
    print("Output:")
    print("data/recommendation/recommendation_dataset_v2.csv")
    print()
    print("Metadata:")
    print("data/recommendation/recommendation_dataset_v2_metadata.json")
    print()
    print("========================================")
    print("EXPERIMENT B DATASET GENERATION COMPLETE")
    print("========================================")


if __name__ == "__main__":
    main()
