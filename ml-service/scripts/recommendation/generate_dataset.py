"""
generate_dataset.py

EduPulse AI - AI Recommendation Engine Dataset Generator (Model 3)

Purpose:
Generates a realistic, research-informed synthetic dataset of 100,000 learner
behavior records for training the EduPulse AI Recommendation Engine ML model.

Output:
data/recommendation/recommendation_dataset.csv

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
import random
import numpy as np
import pandas as pd

# Set fixed random seeds for exact reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

N_SAMPLES = 100000


def main():
    # ==========================================================
    # STEP 1: Directory & Path Setup
    # ==========================================================
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Determine base directory depending on where script is invoked
    if os.path.basename(script_dir) == "recommendation":
        base_dir = os.path.abspath(os.path.join(script_dir, "..", ".."))
    elif os.path.basename(script_dir) == "scripts":
        base_dir = os.path.abspath(os.path.join(script_dir, ".."))
    else:
        base_dir = os.getcwd()

    output_dir = os.path.join(base_dir, "data", "recommendation")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "recommendation_dataset.csv")

    # ==========================================================
    # STEP 2: Realistic Feature Generation (100,000 Records)
    # ==========================================================
    # Latent behavioral profiles for coherent student feature correlations
    latent_productivity = np.random.beta(a=2.5, b=2.5, size=N_SAMPLES)
    latent_focus = np.clip(
        latent_productivity * 0.6 + np.random.beta(a=2.0, b=2.0, size=N_SAMPLES) * 0.4,
        0.0,
        1.0,
    )
    latent_skill = np.random.beta(a=2.5, b=2.5, size=N_SAMPLES)

    # 1. Study hours (0.5 to 12.0 hours/day)
    study_hours = np.clip(
        1.0 + (latent_productivity * 8.0) + np.random.normal(0, 0.8, N_SAMPLES),
        0.5,
        12.0,
    )

    # 2. Productive minutes (15.0 to 600.0 minutes)
    productive_minutes = np.clip(
        study_hours * 45.0 + np.random.normal(0, 20.0, N_SAMPLES), 15.0, 600.0
    )

    # 3. Distraction minutes (0.0 to 400.0 minutes)
    distraction_minutes = np.clip(
        250.0 - (latent_focus * 200.0) + np.random.normal(0, 30.0, N_SAMPLES),
        0.0,
        400.0,
    )

    # 4. Idle minutes (0.0 to 300.0 minutes)
    idle_minutes = np.clip(
        150.0 - (latent_productivity * 100.0) + np.random.normal(0, 20.0, N_SAMPLES),
        0.0,
        300.0,
    )

    # 5. Productivity score (0.0 to 100.0)
    productivity_score = np.clip(
        latent_productivity * 75.0 + 15.0 + np.random.normal(0, 5.0, N_SAMPLES),
        0.0,
        100.0,
    )

    # 6. Focus score (0.0 to 100.0)
    focus_score = np.clip(
        latent_focus * 75.0 + 15.0 + np.random.normal(0, 5.0, N_SAMPLES),
        0.0,
        100.0,
    )

    # 7. Coding hours (0.0 to 8.0 hours)
    coding_hours = np.clip(
        study_hours * np.random.uniform(0.1, 0.5, N_SAMPLES)
        + np.random.normal(0, 0.3, N_SAMPLES),
        0.0,
        8.0,
    )

    # 8. Reading hours (0.0 to 6.0 hours)
    reading_hours = np.clip(
        study_hours * np.random.uniform(0.1, 0.4, N_SAMPLES)
        + np.random.normal(0, 0.3, N_SAMPLES),
        0.0,
        6.0,
    )

    # 9. Revision hours (0.0 to 6.0 hours)
    revision_hours = np.clip(
        study_hours * np.random.uniform(0.1, 0.3, N_SAMPLES)
        + np.random.normal(0, 0.3, N_SAMPLES),
        0.0,
        6.0,
    )

    # 10. Quiz score (0.0 to 100.0)
    quiz_score = np.clip(
        latent_productivity * 50.0
        + latent_focus * 30.0
        + np.random.normal(10.0, 8.0, N_SAMPLES),
        0.0,
        100.0,
    )

    # 11. Skill progress (0.0 to 100.0 %)
    skill_progress = np.clip(
        latent_skill * 80.0 + np.random.normal(10.0, 5.0, N_SAMPLES),
        0.0,
        100.0,
    )

    # 12. Deadline completion rate (0.0 to 100.0 %)
    deadline_completion_rate = np.clip(
        latent_productivity * 60.0 + 30.0 + np.random.normal(0, 8.0, N_SAMPLES),
        0.0,
        100.0,
    )

    # 13. XP (100 to 50,000)
    xp = np.clip(
        np.round(
            latent_skill * 35000.0
            + study_hours * 1000.0
            + np.random.normal(0, 2000.0, N_SAMPLES)
        ),
        100,
        50000,
    ).astype(int)

    # 14. Level (1 to 50)
    level = np.clip((xp // 1000) + 1, 1, 50).astype(int)

    # 15. Streak days (0 to 100 days)
    streak_days = np.clip(
        np.round(latent_productivity * 60.0 + np.random.exponential(5.0, N_SAMPLES)),
        0,
        100,
    ).astype(int)

    # 16. Completed tasks (0 to 30)
    completed_tasks = np.clip(
        np.round(latent_productivity * 20.0 + np.random.normal(0, 2.0, N_SAMPLES)),
        0,
        30,
    ).astype(int)

    # 17. Pending tasks (0 to 30)
    pending_tasks = np.clip(
        np.round(25.0 - latent_productivity * 18.0 + np.random.normal(0, 3.0, N_SAMPLES)),
        0,
        30,
    ).astype(int)

    # 18. Focus sessions (1 to 15)
    focus_sessions = np.clip(
        np.round(study_hours * 0.8 + np.random.normal(0, 1.0, N_SAMPLES)),
        1,
        15,
    ).astype(int)

    # 19. Average session minutes (5.0 to 120.0 minutes)
    average_session_minutes = np.clip(
        productive_minutes / np.maximum(focus_sessions, 1)
        + np.random.normal(0, 5.0, N_SAMPLES),
        5.0,
        120.0,
    )

    # 20. Sleep hours (3.0 to 10.0 hours)
    sleep_hours = np.clip(
        np.random.normal(7.0, 1.2, N_SAMPLES),
        3.0,
        10.0,
    )

    # Round continuous metrics for natural floating point presentation
    productivity_score = np.round(productivity_score, 2)
    focus_score = np.round(focus_score, 2)
    study_hours = np.round(study_hours, 2)
    coding_hours = np.round(coding_hours, 2)
    reading_hours = np.round(reading_hours, 2)
    revision_hours = np.round(revision_hours, 2)
    quiz_score = np.round(quiz_score, 2)
    productive_minutes = np.round(productive_minutes, 2)
    distraction_minutes = np.round(distraction_minutes, 2)
    idle_minutes = np.round(idle_minutes, 2)
    sleep_hours = np.round(sleep_hours, 2)
    skill_progress = np.round(skill_progress, 2)
    deadline_completion_rate = np.round(deadline_completion_rate, 2)
    average_session_minutes = np.round(average_session_minutes, 2)

    # ==========================================================
    # STEP 3: Multi-class Recommendation Target Generation
    # ==========================================================
    """
    Target Generation Logic:
    We compute non-trivial behavioral logits for 8 recommendation classes based on domain rules:

    0 = Continue Current Skill: High productivity + active skill progress + good focus
    1 = Start Focus Session: Low focus time + high pending workload + distraction
    2 = Take Short Break: Long continuous study + high focus time + low sleep / fatigue
    3 = Practice Coding: High coding activity but lower quiz score / skill gap
    4 = Revision: Low quiz score or stagnant skill performance despite studying
    5 = Watch Learning Video: Low skill progress + low learning exposure / low XP
    6 = Complete Pending Tasks: High pending tasks + low deadline completion rate
    7 = Attempt Quiz: High quiz readiness (high skill progress + revision/reading hours)

    Gaussian noise is added to ensure realistic class overlap and prevent trivial separability.
    """

    # Feature normalization for logit formulas
    p_norm = (productivity_score - productivity_score.mean()) / productivity_score.std()
    f_norm = (focus_score - focus_score.mean()) / focus_score.std()
    st_norm = (study_hours - study_hours.mean()) / study_hours.std()
    cd_norm = (coding_hours - coding_hours.mean()) / coding_hours.std()
    rd_norm = (reading_hours - reading_hours.mean()) / reading_hours.std()
    rv_norm = (revision_hours - revision_hours.mean()) / revision_hours.std()
    qz_norm = (quiz_score - quiz_score.mean()) / quiz_score.std()
    sk_norm = (skill_progress - skill_progress.mean()) / skill_progress.std()
    dl_norm = (deadline_completion_rate - deadline_completion_rate.mean()) / deadline_completion_rate.std()
    pt_norm = (pending_tasks - pending_tasks.mean()) / pending_tasks.std()
    ct_norm = (completed_tasks - completed_tasks.mean()) / completed_tasks.std()
    dt_norm = (distraction_minutes - distraction_minutes.mean()) / distraction_minutes.std()
    sl_norm = (sleep_hours - sleep_hours.mean()) / sleep_hours.std()
    sess_norm = (average_session_minutes - average_session_minutes.mean()) / average_session_minutes.std()
    xp_norm = (xp - xp.mean()) / xp.std()

    # Formulate logit scores per recommendation action
    logit_0 = 1.5 * p_norm + 1.5 * sk_norm + 1.0 * f_norm - 0.8 * pt_norm
    logit_1 = -1.5 * f_norm + 1.5 * pt_norm + 1.2 * dt_norm - 0.8 * sess_norm
    logit_2 = 1.5 * st_norm + 1.2 * sess_norm + 1.0 * (productive_minutes / 600.0) - 1.0 * sl_norm
    logit_3 = 1.8 * cd_norm - 1.5 * qz_norm - 0.8 * sk_norm
    logit_4 = -1.8 * qz_norm - 1.2 * sk_norm + 0.8 * st_norm + 0.8 * rv_norm
    logit_5 = -1.8 * sk_norm - 1.5 * xp_norm - 1.0 * st_norm - 0.8 * cd_norm
    logit_6 = 1.8 * pt_norm - 1.8 * dl_norm - 0.8 * ct_norm
    logit_7 = 1.5 * sk_norm + 1.5 * qz_norm + 1.0 * rv_norm + 1.0 * dl_norm

    logits = np.column_stack(
        [logit_0, logit_1, logit_2, logit_3, logit_4, logit_5, logit_6, logit_7]
    )

    # Standardize logits across columns for balanced class distribution
    logits = (logits - np.mean(logits, axis=0)) / np.std(logits, axis=0)

    # Add Gaussian noise for realistic overlap
    noise = np.random.normal(0, 0.6, logits.shape)
    logits_noisy = logits + noise

    # Assign recommendation target via argmax
    recommendation = np.argmax(logits_noisy, axis=1)

    # ==========================================================
    # STEP 4: DataFrame Assembly & Data Quality Checks
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
        "recommendation": recommendation,
    }

    df = pd.DataFrame(feature_dict)

    # Shuffle dataset reproducibility
    df = df.sample(frac=1.0, random_state=RANDOM_SEED).reset_index(drop=True)

    # Quality metrics
    missing_values = df.isnull().sum().sum()
    duplicate_rows = df.duplicated().sum()
    features_list = [c for c in df.columns if c != "recommendation"]

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
        count = class_dist_counts.get(cls_idx, 0)
        pct = (count / len(df)) * 100
        cls_name = class_names[cls_idx]
        class_dist_str_lines.append(
            f"  Class {cls_idx} ({cls_name:<23}): {count:>6} ({pct:5.2f}%)"
        )
    class_dist_str = "\n".join(class_dist_str_lines)

    # Save output CSV
    df.to_csv(output_file, index=False)

    # Relativize output path for console output
    rel_output_path = os.path.relpath(output_file, base_dir).replace("\\", "/")
    if not rel_output_path.startswith("data/"):
        rel_output_path = "data/recommendation/recommendation_dataset.csv"

    # ==========================================================
    # STEP 5: Professional Summary Console Output
    # ==========================================================
    print("========================================")
    print("EDUPULSE AI")
    print("RECOMMENDATION DATASET GENERATION")
    print("========================================")
    print()
    print("Dataset generated successfully")
    print()
    print("Dataset Shape:")
    print(df.shape)
    print()
    print("Features:")
    print(features_list)
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
    print("Target Statistics:")
    print(f"Min: {df['recommendation'].min()}")
    print(f"Max: {df['recommendation'].max()}")
    print(f"Unique Classes: {df['recommendation'].nunique()}")
    print()
    print("Output:")
    print(rel_output_path)
    print()
    print("Generation completed successfully.")


if __name__ == "__main__":
    main()
