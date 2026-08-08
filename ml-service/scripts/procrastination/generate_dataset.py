"""
generate_dataset.py

EduPulse AI - Synthetic Procrastination Dataset Generator

Purpose:
Generate a research-informed synthetic dataset for training the
EduPulse AI procrastination prediction model.

This dataset is completely synthetic because no publicly available,
large-scale, labeled academic procrastination dataset exists.

The feature distributions and correlations are inspired by published
research on academic procrastination and student learning behaviour.

Output:
data/procrastination_dataset.csv

Dataset Size:
100,000 synthetic student records

Target Variables:
- is_procrastinator (0/1)
- risk_level (Low / Moderate / High)
"""

import numpy as np
import pandas as pd

np.random.seed(42)  # reproducible — re-running this script gives the same data

N = 100000

# ---------------------------------------------------------------------------
# STEP 1
# Generate a hidden procrastination tendency for every synthetic student.
#
# This variable is NOT stored in the dataset.
# It is only used internally to generate realistic feature correlations.
#
# Range:
# 0 = Highly disciplined
# 1 = Highly procrastinating
# ---------------------------------------------------------------------------

true_tendency = np.random.beta(a=2, b=2, size=N)  # bell-shaped, bounded 0-1

# ---------------------------------------------------------------------------
# 2. Observable features — each one is a noisy function of true_tendency,
#    matching the direction of correlation reported in the literature.
# ---------------------------------------------------------------------------

# Study hours per day (synopsis: "study hours"). Higher tendency -> fewer
# study hours. Realistic range ~0 to 8 hours.
study_hours = np.clip(
    6.5 - (true_tendency * 5.5) + np.random.normal(0, 1.0, N), 0, 10
)

# App usage minutes/day on non-academic apps (synopsis: "app usage logs").
# Higher tendency -> more non-academic app usage.
app_usage_minutes = np.clip(
    40 + (true_tendency * 220) + np.random.normal(0, 35, N), 0, 480
)

# Idle time minutes during scheduled study sessions (synopsis: "idle time").
idle_time_minutes = np.clip(
    10 + (true_tendency * 60) + np.random.normal(0, 15, N), 0, 180
)

# LMS / study-portal login frequency per week (synopsis: "login frequency").
# Higher tendency -> fewer logins.
lms_logins_per_week = np.clip(
    np.round(14 - (true_tendency * 10) + np.random.normal(0, 2, N)), 0, 21
)

# Assignment submission timing, in hours BEFORE deadline (negative = late).
# This is the single strongest signal per Hooshyar et al. 2019.
submission_offset_hours = (
    48 - (true_tendency * 60) + np.random.normal(0, 12, N)
)

# Task/assignment completion rate (%) — EduPulse's own Task.completed ratio
# maps directly onto this in the real-data retraining phase later.
completion_rate = np.clip(
    95 - (true_tendency * 70) + np.random.normal(0, 8, N), 0, 100
)

# Deadline misses in the last 30 days (count).
deadline_misses_30d = np.clip(
    np.round(true_tendency * 12 + np.random.normal(0, 1.5, N)), 0, 20
)

# Current streak length in days (EduPulse-specific feature — maps directly
# onto Skill.streakCount in the real app, so this feature transfers
# cleanly when retraining on real EduPulse data later).
streak_days = np.clip(
    np.round((1 - true_tendency) * 20 + np.random.normal(0, 3, N)), 0, 60
)

# Average session length in minutes when the student DOES study.
avg_session_length_min = np.clip(
    55 - (true_tendency * 30) + np.random.normal(0, 10, N), 5, 120
)

# Number of distraction-site visits per day (proxy for browser-tracking
# telemetry the team scoped but did not build — included here so the
# model/feature schema stays forward-compatible if that extension is
# revisited later).
distraction_visits_per_day = np.clip(
    np.round(true_tendency * 15 + np.random.normal(0, 3, N)), 0, 40
)

# Sleep hours (lower sleep correlates with poorer self-regulation in the
# procrastination literature broadly, included as a 10th+ feature).
sleep_hours = np.clip(
    7.2 - (true_tendency * 1.8) + np.random.normal(0, 0.8, N), 3, 10
)

# ---------------------------------------------------------------------------
# 3. Label: binary procrastinator / non-procrastinator.
#    Built from true_tendency + noise, matching the MODERATE correlation
#    (not perfect) reported by Ben Alaya et al. (r ~ 0.22-0.27) between
#    procrastination and outcomes — i.e. label noise is intentional and
#    realistic, not a data-generation bug.
# ---------------------------------------------------------------------------
label_noise = np.random.normal(0, 0.15, N)
procrastinator = ((true_tendency + label_noise) > 0.5).astype(int)

# Three-tier risk level, derived the same way the literature frames severity
# (Low / Moderate / High), used for the "risk classification" deliverable
# explicitly named in the synopsis.
risk_level = pd.cut(
    true_tendency + label_noise,
    bins=[-np.inf, 0.35, 0.65, np.inf],
    labels=["Low", "Moderate", "High"],
)

# ---------------------------------------------------------------------------
# 4. Assemble + save
# ---------------------------------------------------------------------------
df = pd.DataFrame({
    "study_hours_per_day": np.round(study_hours, 2),
    "app_usage_minutes": np.round(app_usage_minutes, 1),
    "idle_time_minutes": np.round(idle_time_minutes, 1),
    "lms_logins_per_week": lms_logins_per_week.astype(int),
    "submission_offset_hours": np.round(submission_offset_hours, 1),
    "completion_rate_percent": np.round(completion_rate, 1),
    "deadline_misses_30d": deadline_misses_30d.astype(int),
    "streak_days": streak_days.astype(int),
    "avg_session_length_min": np.round(avg_session_length_min, 1),
    "distraction_visits_per_day": distraction_visits_per_day.astype(int),
    "sleep_hours": np.round(sleep_hours, 2),
    "risk_level": risk_level,
    "is_procrastinator": procrastinator,
})

df.to_csv("data/procrastination_dataset.csv", index=False)

print(f"Generated {len(df)} rows -> data/procrastination_dataset.csv")
print(f"\nClass balance (is_procrastinator):\n{df['is_procrastinator'].value_counts(normalize=True)}")
print(f"\nRisk level distribution:\n{df['risk_level'].value_counts(normalize=True)}")
print(f"\nFeature correlation with label (sanity check — should be moderate, not near-zero or near-1):")
print(df.drop(columns=["risk_level"]).corr()["is_procrastinator"].sort_values(ascending=False))
