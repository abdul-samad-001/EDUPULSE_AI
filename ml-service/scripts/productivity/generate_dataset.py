"""
generate_dataset.py

EduPulse AI - Synthetic Productivity Dataset Generator

Purpose:
Generates a realistic, research-informed synthetic dataset of 100,000 student
records for training the EduPulse AI Productivity Prediction ML models.

Output:
data/productivity/productivity_dataset.csv

Dataset Specs:
- Records: 100,000
- Features: 20 behavioural and academic metrics
- Target: productivity_score (0.00 to 100.00)
"""

import os
import random
import numpy as np
import pandas as pd

# Set random seeds for exact reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

N_SAMPLES = 100000

# ==========================================================
# STEP 1: Directory Setup
# ==========================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

if os.path.basename(SCRIPT_DIR) == "productivity":
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
elif os.path.basename(SCRIPT_DIR) == "scripts":
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
else:
    BASE_DIR = os.getcwd()

OUTPUT_DIR = os.path.join(BASE_DIR, "data", "productivity")
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "productivity_dataset.csv")

# ==========================================================
# STEP 2: Feature Generation (100,000 Records)
# ==========================================================
print("Generating 100,000 synthetic records...")

# Latent base productivity propensity (Beta distributed for realistic bell shape)
latent_propensity = np.random.beta(a=2.5, b=2.5, size=N_SAMPLES)

# Study hours (0.5 to 10.0 hours/day)
study_hours_per_day = np.clip(
    1.0 + (latent_propensity * 7.5) + np.random.normal(0, 0.8, N_SAMPLES), 0.5, 10.0
)

# Productive minutes (0 to 600 minutes)
productive_minutes = np.clip(
    study_hours_per_day * 50 + np.random.normal(0, 30, N_SAMPLES), 0.0, 600.0
)

# Focus session minutes (10 to 300 minutes)
focus_session_minutes = np.clip(
    productive_minutes * 0.6 + np.random.normal(0, 20, N_SAMPLES), 10.0, 300.0
)

# Distraction minutes (0 to 400 minutes)
distraction_minutes = np.clip(
    280.0 - (latent_propensity * 220) + np.random.normal(0, 40, N_SAMPLES), 0.0, 400.0
)

# Idle time minutes (0 to 240 minutes)
idle_time_minutes = np.clip(
    160.0 - (latent_propensity * 130) + np.random.normal(0, 25, N_SAMPLES), 0.0, 240.0
)

# Completed tasks (0 to 15 tasks)
completed_tasks = np.clip(
    np.round(1.0 + latent_propensity * 11.5 + np.random.normal(0, 1.5, N_SAMPLES)), 0, 15
).astype(int)

# Pending tasks (0 to 20 tasks)
pending_tasks = np.clip(
    np.round(16.0 - latent_propensity * 12.0 + np.random.normal(0, 2.0, N_SAMPLES)), 0, 20
).astype(int)

# Deadline completion rate (0 to 100 %)
deadline_completion_rate = np.clip(
    30.0 + latent_propensity * 60.0 + np.random.normal(0, 8.0, N_SAMPLES), 0.0, 100.0
)

# Activity breakdowns: Coding, Reading, Revision
coding_hours = np.clip(
    study_hours_per_day * 0.4 + np.random.normal(0, 0.5, N_SAMPLES), 0.0, 8.0
)
reading_hours = np.clip(
    study_hours_per_day * 0.3 + np.random.normal(0, 0.4, N_SAMPLES), 0.0, 6.0
)
revision_hours = np.clip(
    study_hours_per_day * 0.25 + np.random.normal(0, 0.3, N_SAMPLES), 0.0, 5.0
)

# Quiz score (0 to 100)
quiz_score = np.clip(
    40.0 + latent_propensity * 52.0 + np.random.normal(0, 7.0, N_SAMPLES), 0.0, 100.0
)

# Practice questions completed (0 to 100)
practice_questions = np.clip(
    np.round(latent_propensity * 85.0 + np.random.normal(0, 8.0, N_SAMPLES)), 0, 100
).astype(int)

# Sleep hours (4 to 10 hours)
sleep_hours = np.clip(
    np.random.normal(7.2, 1.1, N_SAMPLES), 4.0, 10.0
)

# Break frequency (0 to 12 breaks/day)
break_frequency = np.clip(
    np.round(2.0 + (1.0 - latent_propensity) * 6.0 + np.random.normal(0, 1.2, N_SAMPLES)), 0, 12
).astype(int)

# Focus score (20 to 100)
focus_score = np.clip(
    25.0 + latent_propensity * 70.0 + np.random.normal(0, 6.0, N_SAMPLES), 20.0, 100.0
)

# Gamification metrics
xp_earned = np.clip(
    np.round(latent_propensity * 22000 + np.random.normal(0, 1500, N_SAMPLES)), 0, 25000
).astype(int)

current_level = np.clip(
    np.round(1 + latent_propensity * 45 + np.random.normal(0, 3, N_SAMPLES)), 1, 50
).astype(int)

streak_days = np.clip(
    np.round(latent_propensity * 320 + np.random.normal(0, 30, N_SAMPLES)), 0, 365
).astype(int)

skills_completed = np.clip(
    np.round(latent_propensity * 44 + np.random.normal(0, 3, N_SAMPLES)), 0, 50
).astype(int)

# ==========================================================
# STEP 3: Target Calculation (productivity_score 0 to 100)
# ==========================================================

# Optimal sleep score: Peak at 7.5 hours, penalize under/over sleep
sleep_optimality = 1.0 - np.minimum(1.0, (np.abs(sleep_hours - 7.5) / 3.5) ** 1.8)

# Break optimality: Peak at 3-4 breaks, penalize excess breaks (> 5)
break_penalty = np.where(break_frequency > 5, (break_frequency - 5) * 4.0, 0.0)

# Positive components (normalized impact)
pos_score = (
    (study_hours_per_day / 10.0) * 12.0 +
    (productive_minutes / 600.0) * 15.0 +
    (completed_tasks / 15.0) * 12.0 +
    (deadline_completion_rate / 100.0) * 10.0 +
    (coding_hours / 8.0) * 6.0 +
    (reading_hours / 6.0) * 5.0 +
    (revision_hours / 5.0) * 5.0 +
    (quiz_score / 100.0) * 8.0 +
    (practice_questions / 100.0) * 6.0 +
    sleep_optimality * 8.0 +
    (focus_score / 100.0) * 12.0 +
    (xp_earned / 25000.0) * 5.0 +
    (streak_days / 365.0) * 4.0 +
    (skills_completed / 50.0) * 4.0
)

# Negative components
neg_score = (
    (distraction_minutes / 400.0) * 14.0 +
    (idle_time_minutes / 240.0) * 10.0 +
    (pending_tasks / 20.0) * 8.0 +
    break_penalty
)

# Gaussian non-linear noise
gaussian_noise = np.random.normal(0, 4.5, N_SAMPLES)

# Raw composite productivity score
raw_productivity_score = pos_score - neg_score + gaussian_noise

# Rescale raw composite score linearly to standard 0-100 scale
min_raw, max_raw = np.percentile(raw_productivity_score, [1, 99])
scaled_score = ((raw_productivity_score - min_raw) / (max_raw - min_raw)) * 85.0 + 10.0

# Final clipped and rounded productivity score
productivity_score = np.round(np.clip(scaled_score, 0.0, 100.0), 2)

# ==========================================================
# STEP 4: DataFrame Assembly & Shuffling
# ==========================================================
df = pd.DataFrame({
    "study_hours_per_day": np.round(study_hours_per_day, 2),
    "focus_session_minutes": np.round(focus_session_minutes, 1),
    "productive_minutes": np.round(productive_minutes, 1),
    "distraction_minutes": np.round(distraction_minutes, 1),
    "idle_time_minutes": np.round(idle_time_minutes, 1),
    "completed_tasks": completed_tasks,
    "pending_tasks": pending_tasks,
    "deadline_completion_rate": np.round(deadline_completion_rate, 2),
    "coding_hours": np.round(coding_hours, 2),
    "reading_hours": np.round(reading_hours, 2),
    "revision_hours": np.round(revision_hours, 2),
    "quiz_score": np.round(quiz_score, 2),
    "practice_questions": practice_questions,
    "sleep_hours": np.round(sleep_hours, 2),
    "break_frequency": break_frequency,
    "focus_score": np.round(focus_score, 2),
    "xp_earned": xp_earned,
    "current_level": current_level,
    "streak_days": streak_days,
    "skills_completed": skills_completed,
    "productivity_score": productivity_score,
})

# Shuffle dataset
df = df.sample(frac=1.0, random_state=RANDOM_SEED).reset_index(drop=True)

# Save dataset
df.to_csv(OUTPUT_FILE, index=False)

# ==========================================================
# STEP 5: Verification & Console Output
# ==========================================================
print("\n" + "=" * 65)
print("Dataset generated successfully")
print("=" * 65)
print(f"Dataset size            : {len(df):,} records")
print(f"Feature count           : {len(df.columns) - 1} features")
print("Target statistics (productivity_score):")
print(f"  - Mean productivity score : {df['productivity_score'].mean():.2f}")
print(f"  - Minimum score          : {df['productivity_score'].min():.2f}")
print(f"  - Maximum score          : {df['productivity_score'].max():.2f}")
print(f"Output path             : {OUTPUT_FILE}")
print("=" * 65)
