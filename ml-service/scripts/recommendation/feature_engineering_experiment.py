"""
feature_engineering_experiment.py

EduPulse AI - Model 3 Feature Engineering Experiment

Purpose:
Tests whether adding 12 derived behavioral features to the existing 20 features
(total 32 features) improves recommendation performance for Model 3.

Outputs:
- evaluation/recommendation/feature_engineering_comparison.csv
- evaluation/recommendation/feature_engineering_comparison.png
- evaluation/recommendation/engineered_feature_importance.png
- evaluation/recommendation/experimental_train_engineered.csv
- evaluation/recommendation/experimental_test_engineered.csv

IMPORTANT:
- Experimental evaluation script only.
- Does NOT modify production model (best_model.pkl) or existing dataset files.
"""

import os
import sys
import json
import time
import numpy as np
import pandas as pd
from pathlib import Path

# Configure UTF-8 encoding where possible
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    matthews_corrcoef,
    roc_auc_score,
    confusion_matrix,
)

from xgboost import XGBClassifier
from catboost import CatBoostClassifier

# Setup Directory Paths
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

if SCRIPT_DIR.name == "recommendation":
    BASE_DIR = SCRIPT_DIR.parent.parent
elif SCRIPT_DIR.name == "scripts":
    BASE_DIR = SCRIPT_DIR.parent
else:
    BASE_DIR = Path.cwd()

DATA_DIR = BASE_DIR / "data" / "recommendation"
EVAL_DIR = BASE_DIR / "evaluation" / "recommendation"
EVAL_DIR.mkdir(parents=True, exist_ok=True)

ORIGINAL_FEATURES = [
    "productivity_score",
    "focus_score",
    "study_hours",
    "xp",
    "level",
    "streak_days",
    "completed_tasks",
    "pending_tasks",
    "coding_hours",
    "reading_hours",
    "revision_hours",
    "quiz_score",
    "productive_minutes",
    "distraction_minutes",
    "idle_minutes",
    "sleep_hours",
    "skill_progress",
    "deadline_completion_rate",
    "focus_sessions",
    "average_session_minutes",
]

DERIVED_FEATURES = [
    "productive_ratio",
    "distraction_ratio",
    "task_completion_rate",
    "pending_task_ratio",
    "focus_efficiency",
    "study_efficiency",
    "deadline_risk",
    "quiz_readiness",
    "learning_consistency",
    "skill_momentum",
    "sleep_quality",
    "focus_session_efficiency",
]


def add_derived_features(df):
    """
    Computes 12 derived behavioral features safely.
    Handles division by zero and ensures no NaN/inf values.
    """
    df_eng = df.copy()

    # 1. Productive ratio
    total_time = df_eng["productive_minutes"] + df_eng["distraction_minutes"] + df_eng["idle_minutes"]
    df_eng["productive_ratio"] = np.where(total_time > 0, df_eng["productive_minutes"] / total_time, 0.0)

    # 2. Distraction ratio
    df_eng["distraction_ratio"] = np.where(total_time > 0, df_eng["distraction_minutes"] / total_time, 0.0)

    # 3. Task completion rate
    total_tasks = df_eng["completed_tasks"] + df_eng["pending_tasks"]
    df_eng["task_completion_rate"] = np.where(total_tasks > 0, df_eng["completed_tasks"] / total_tasks, 0.0)

    # 4. Pending task ratio
    df_eng["pending_task_ratio"] = np.where(total_tasks > 0, df_eng["pending_tasks"] / total_tasks, 0.0)

    # 5. Focus efficiency
    df_eng["focus_efficiency"] = (df_eng["focus_score"] / 100.0) * df_eng["productive_ratio"] * 100.0

    # 6. Study efficiency
    df_eng["study_efficiency"] = np.where(
        df_eng["study_hours"] > 0,
        df_eng["productive_minutes"] / (df_eng["study_hours"] * 60.0),
        0.0,
    )

    # 7. Deadline risk
    df_eng["deadline_risk"] = 100.0 - df_eng["deadline_completion_rate"]

    # 8. Quiz readiness (normalized ~ 0-100)
    df_eng["quiz_readiness"] = (
        df_eng["quiz_score"] * 0.4 + df_eng["skill_progress"] * 0.4 + df_eng["focus_score"] * 0.2
    )

    # 9. Learning consistency (normalized ~ 0-100)
    df_eng["learning_consistency"] = np.clip(
        (df_eng["streak_days"] / 100.0 * 40.0)
        + (df_eng["focus_sessions"] / 15.0 * 30.0)
        + (df_eng["task_completion_rate"] * 30.0),
        0.0,
        100.0,
    )

    # 10. Skill momentum
    df_eng["skill_momentum"] = (
        (df_eng["skill_progress"] * 0.5)
        + (df_eng["completed_tasks"] / 30.0 * 25.0)
        + (df_eng["streak_days"] / 100.0 * 25.0)
    )

    # 11. Sleep quality (closeness to 7.5 hours)
    df_eng["sleep_quality"] = np.clip(100.0 - np.abs(df_eng["sleep_hours"] - 7.5) * 15.0, 0.0, 100.0)

    # 12. Focus session efficiency
    sess_total = df_eng["focus_sessions"] * df_eng["average_session_minutes"]
    df_eng["focus_session_efficiency"] = np.where(
        sess_total > 0, df_eng["productive_minutes"] / sess_total, 0.0
    )

    # Clean any accidental NaN / Infinite values
    df_eng = df_eng.replace([np.inf, -np.inf], np.nan).fillna(0.0)
    return df_eng


def calculate_macro_specificity(y_true, y_pred, num_classes=8):
    cm = confusion_matrix(y_true, y_pred, labels=list(range(num_classes)))
    specificities = []
    for c in range(num_classes):
        tp = cm[c, c]
        fp = cm[:, c].sum() - tp
        fn = cm[c, :].sum() - tp
        tn = cm.sum() - (tp + fp + fn)
        spec = (tn / (tn + fp)) if (tn + fp) > 0 else 0.0
        specificities.append(spec)
    return float(np.mean(specificities))


def main():
    # Load Train/Test Split
    train_path = DATA_DIR / "train.csv"
    test_path = DATA_DIR / "test.csv"

    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError(
            f"Missing train/test files at '{DATA_DIR}'. Please run train_model.py first."
        )

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    # Generate Engineered Data
    train_eng_df = add_derived_features(train_df)
    test_eng_df = add_derived_features(test_df)

    # Export Experimental Datasets safely to evaluation/recommendation/
    exp_train_path = EVAL_DIR / "experimental_train_engineered.csv"
    exp_test_path = EVAL_DIR / "experimental_test_engineered.csv"

    train_eng_df.to_csv(exp_train_path, index=False)
    test_eng_df.to_csv(exp_test_path, index=False)

    y_train = train_df["recommendation"].astype(int)
    y_test = test_df["recommendation"].astype(int)

    X_train_orig = train_df[ORIGINAL_FEATURES]
    X_test_orig = test_df[ORIGINAL_FEATURES]

    engineered_feature_cols = ORIGINAL_FEATURES + DERIVED_FEATURES
    X_train_eng = train_eng_df[engineered_feature_cols]
    X_test_eng = test_eng_df[engineered_feature_cols]

    print("========================================")
    print("EDUPULSE AI")
    print("MODEL 3 FEATURE ENGINEERING EXPERIMENT")
    print("========================================")
    print()
    print("ORIGINAL FEATURE COUNT:")
    print(len(ORIGINAL_FEATURES))
    print()
    print("ENGINEERED FEATURE COUNT:")
    print(len(engineered_feature_cols))
    print()

    # Define Experiment Configurations
    exp_configs = [
        {
            "name": "XGBoost - Original Features",
            "model_type": "XGBoost",
            "feature_set": "Original Features",
            "X_tr": X_train_orig,
            "X_te": X_test_orig,
            "model": XGBClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                objective="multi:softprob",
                num_class=8,
                eval_metric="mlogloss",
                random_state=42,
                n_jobs=-1,
            ),
            "is_baseline": True,
        },
        {
            "name": "XGBoost - Engineered Features",
            "model_type": "XGBoost",
            "feature_set": "Engineered Features",
            "X_tr": X_train_eng,
            "X_te": X_test_eng,
            "model": XGBClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                objective="multi:softprob",
                num_class=8,
                eval_metric="mlogloss",
                random_state=42,
                n_jobs=-1,
            ),
            "is_baseline": False,
        },
        {
            "name": "CatBoost - Engineered Features",
            "model_type": "CatBoost",
            "feature_set": "Engineered Features",
            "X_tr": X_train_eng,
            "X_te": X_test_eng,
            "model": CatBoostClassifier(
                iterations=100,
                learning_rate=0.1,
                loss_function="MultiClass",
                random_seed=42,
                verbose=False,
            ),
            "is_baseline": False,
        },
    ]

    results = []

    for cfg in exp_configs:
        exp_name = cfg["name"]

        if cfg["is_baseline"]:
            print("BASELINE:\n")
        else:
            if "XGBoost" in exp_name:
                print("EXPERIMENT 1:\n")
            else:
                print("EXPERIMENT 2:\n")

        print(exp_name)

        model = cfg["model"]
        model.fit(cfg["X_tr"], y_train)

        preds = model.predict(cfg["X_te"])
        if hasattr(preds, "ravel"):
            preds = preds.ravel()
        probs = model.predict_proba(cfg["X_te"])

        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, average="weighted", zero_division=0)
        rec = recall_score(y_test, preds, average="weighted", zero_division=0)
        f1_w = f1_score(y_test, preds, average="weighted", zero_division=0)
        f1_m = f1_score(y_test, preds, average="macro", zero_division=0)
        spec = calculate_macro_specificity(y_test, preds)
        mcc = matthews_corrcoef(y_test, preds)

        try:
            roc = roc_auc_score(
                y_test, probs, multi_class="ovr", average="weighted"
            )
        except Exception:
            roc = "N/A"

        res = {
            "Model": cfg["model_type"],
            "Feature Set": cfg["feature_set"],
            "Accuracy": float(acc),
            "Precision": float(prec),
            "Recall": float(rec),
            "Macro F1": float(f1_m),
            "Weighted F1": float(f1_w),
            "Specificity": float(spec),
            "ROC AUC": float(roc) if isinstance(roc, (int, float)) else roc,
            "MCC": float(mcc),
            "Model_Obj": model,
            "IsBaseline": cfg["is_baseline"],
        }

        results.append(res)

        print(f"Accuracy   : {acc:.4f}")
        print(f"Weighted F1: {f1_w:.4f}")
        print(f"MCC        : {mcc:.4f}")
        roc_str = f"{roc:.4f}" if isinstance(roc, float) else str(roc)
        print(f"ROC AUC    : {roc_str}")
        print()

    # ==========================================================
    # FINAL COMPARISON TABLE
    # ==========================================================
    print("========================================")
    print("FINAL COMPARISON")
    print("========================================")

    comp_df = pd.DataFrame(results)
    comp_df = comp_df.sort_values(by=["Weighted F1", "MCC", "Accuracy"], ascending=False).reset_index(drop=True)

    display_cols = [
        "Model",
        "Feature Set",
        "Accuracy",
        "Precision",
        "Recall",
        "Macro F1",
        "Weighted F1",
        "Specificity",
        "ROC AUC",
        "MCC",
    ]

    print(comp_df[display_cols].to_string(index=False))
    print()

    # Baseline reference values (XGBoost - Original Features)
    base_row = [r for r in results if r["IsBaseline"]][0]
    base_acc = base_row["Accuracy"]
    base_f1 = base_row["Weighted F1"]

    best_res = comp_df.iloc[0]
    acc_diff = best_res["Accuracy"] - base_acc
    f1_diff = best_res["Weighted F1"] - base_f1

    acc_pct = (acc_diff / base_acc * 100) if base_acc > 0 else 0.0
    f1_pct = (f1_diff / base_f1 * 100) if base_f1 > 0 else 0.0

    print("========================================")
    print("BEST EXPERIMENT")
    print("========================================")
    print(f"Model               : {best_res['Model']}")
    print(f"Feature Set         : {best_res['Feature Set']}")
    print(f"Accuracy            : {best_res['Accuracy']:.4f}")
    print(f"Weighted F1         : {best_res['Weighted F1']:.4f}")
    print(f"Macro F1            : {best_res['Macro F1']:.4f}")
    roc_best_str = f"{best_res['ROC AUC']:.4f}" if isinstance(best_res["ROC AUC"], float) else str(best_res["ROC AUC"])
    print(f"ROC AUC             : {roc_best_str}")
    print(f"MCC                 : {best_res['MCC']:.4f}")
    print(f"Specificity         : {best_res['Specificity']:.4f}")
    print()
    print(f"Baseline Accuracy   : {base_acc:.4f}")
    print(f"Accuracy Improvement: {acc_diff:+.4f} ({acc_pct:+.2f}%)")
    print()
    print(f"Baseline Weighted F1: {base_f1:.4f}")
    print(f"F1 Improvement      : {f1_diff:+.4f} ({f1_pct:+.2f}%)")
    print("========================================")

    # Save Comparison CSV
    csv_path = EVAL_DIR / "feature_engineering_comparison.csv"
    comp_df[display_cols].to_csv(csv_path, index=False)
    print(f"\nSaved CSV comparison: {csv_path}")

    # Plot Comparison Chart PNG
    fig, ax = plt.subplots(figsize=(10, 6))
    labels = [f"{r['Model']}\n({r['Feature Set']})" for _, r in comp_df.iterrows()]
    x = np.arange(len(labels))
    width = 0.25

    rects1 = ax.bar(x - width, comp_df["Accuracy"], width, label="Accuracy", color="#2563eb")
    rects2 = ax.bar(x, comp_df["Weighted F1"], width, label="Weighted F1", color="#16a34a")
    rects3 = ax.bar(x + width, comp_df["MCC"], width, label="MCC", color="#9333ea")

    ax.set_ylabel("Score", fontsize=11)
    ax.set_title("Feature Engineering Experiment - Model 3 Recommendation", fontsize=13, pad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylim([0.0, 1.0])
    ax.legend(loc="upper left", fontsize=10)
    ax.grid(True, linestyle="--", alpha=0.5, axis="y")

    for rect in rects1:
        h = rect.get_height()
        ax.annotate(f"{h:.4f}", xy=(rect.get_x() + rect.get_width()/2, h), xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=8)
    for rect in rects2:
        h = rect.get_height()
        ax.annotate(f"{h:.4f}", xy=(rect.get_x() + rect.get_width()/2, h), xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=8)
    for rect in rects3:
        h = rect.get_height()
        ax.annotate(f"{h:.4f}", xy=(rect.get_x() + rect.get_width()/2, h), xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=8)

    plt.tight_layout()
    chart_path = EVAL_DIR / "feature_engineering_comparison.png"
    plt.savefig(chart_path, dpi=300)
    plt.close()
    print(f"Saved Comparison Chart: {chart_path}")

    # Plot Engineered Feature Importance PNG for Best Engineered Model
    best_eng_res = [r for _, r in comp_df.iterrows() if r["Feature Set"] == "Engineered Features"][0]
    best_eng_model = best_eng_res["Model_Obj"]

    if hasattr(best_eng_model, "feature_importances_"):
        importances = best_eng_model.feature_importances_
        indices = np.argsort(importances)

        colors_list = []
        labels_list = []
        for i in indices:
            fname = engineered_feature_cols[i]
            if fname in DERIVED_FEATURES:
                colors_list.append("#dc2626")  # Red for derived features
                labels_list.append(f"{fname} (Derived)")
            else:
                colors_list.append("#2563eb")  # Blue for original features
                labels_list.append(fname)

        fig, ax = plt.subplots(figsize=(10, 10))
        ax.barh(range(len(indices)), importances[indices], align="center", color=colors_list)
        ax.set_yticks(range(len(indices)))
        ax.set_yticklabels(labels_list, fontsize=8)
        ax.set_xlabel("Feature Importance Score", fontsize=11)
        ax.set_title(
            f"Feature Importance ({best_eng_res['Model']} - 32 Features)", fontsize=13, pad=12
        )

        # Legend
        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor="#2563eb", label="Original Features (20)"),
            Patch(facecolor="#dc2626", label="Derived Features (12)"),
        ]
        ax.legend(handles=legend_elements, loc="lower right", fontsize=10)

        plt.tight_layout()
        fi_path = EVAL_DIR / "engineered_feature_importance.png"
        plt.savefig(fi_path, dpi=300)
        plt.close()
        print(f"Saved Feature Importance Chart: {fi_path}")

    print("\nFeature Engineering Experiment Completed Successfully.")


if __name__ == "__main__":
    main()
