"""
compare_models.py

EduPulse AI - Model 3 Algorithm Comparison (Experimental)

Purpose:
Evaluates advanced tree-based classification algorithms (Random Forest, Extra Trees,
XGBoost, LightGBM, CatBoost) against the current baseline (Gradient Boosting) for the
EduPulse AI Recommendation Engine.

Outputs:
- evaluation/recommendation/model_comparison.csv
- evaluation/recommendation/model_comparison.json
- evaluation/recommendation/model_comparison.png

IMPORTANT:
- This is an experimental evaluation script.
- Does NOT overwrite existing best_model.pkl or dataset files.
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

CLASS_NAMES = [
    "Continue Current Skill",
    "Start Focus Session",
    "Take Short Break",
    "Practice Coding",
    "Revision",
    "Watch Learning Video",
    "Complete Pending Tasks",
    "Attempt Quiz",
]


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
    print("========================================")
    print("EDUPULSE AI")
    print("MODEL 3 ALGORITHM COMPARISON")
    print("========================================")
    print()

    # Load Train/Test Split
    train_path = DATA_DIR / "train.csv"
    test_path = DATA_DIR / "test.csv"

    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError(
            f"Missing train/test files at '{DATA_DIR}'. Please run train_model.py first."
        )

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    if "recommendation" not in train_df.columns or "recommendation" not in test_df.columns:
        raise KeyError("Target column 'recommendation' missing from dataset files!")

    X_train = train_df.drop(columns=["recommendation"])
    y_train = train_df["recommendation"].astype(int)
    X_test = test_df.drop(columns=["recommendation"])
    y_test = test_df["recommendation"].astype(int)

    print(f"Loaded Train Set: {X_train.shape[0]:,} samples × {X_train.shape[1]} features")
    print(f"Loaded Test Set : {X_test.shape[0]:,} samples × {X_test.shape[1]} features")
    print()

    results = []

    # ==========================================================
    # 1. BASELINE MODEL: Gradient Boosting
    # ==========================================================
    print("BASELINE")
    print("Gradient Boosting")
    try:
        from sklearn.ensemble import GradientBoostingClassifier

        gb_model = GradientBoostingClassifier(
            n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42
        )
        t_start = time.time()
        gb_model.fit(X_train, y_train)
        t_train = time.time() - t_start

        t_start = time.time()
        gb_pred = gb_model.predict(X_test)
        gb_proba = gb_model.predict_proba(X_test)
        t_pred = time.time() - t_start

        gb_acc = accuracy_score(y_test, gb_pred)
        gb_prec = precision_score(y_test, gb_pred, average="weighted", zero_division=0)
        gb_rec = recall_score(y_test, gb_pred, average="weighted", zero_division=0)
        gb_f1_w = f1_score(y_test, gb_pred, average="weighted", zero_division=0)
        gb_f1_m = f1_score(y_test, gb_pred, average="macro", zero_division=0)
        gb_spec = calculate_macro_specificity(y_test, gb_pred)
        gb_mcc = matthews_corrcoef(y_test, gb_pred)

        try:
            gb_roc = roc_auc_score(
                y_test, gb_proba, multi_class="ovr", average="weighted"
            )
        except Exception:
            gb_roc = "N/A"

        res_gb = {
            "Model": "Gradient Boosting (BASELINE)",
            "IsBaseline": True,
            "Accuracy": float(gb_acc),
            "Precision": float(gb_prec),
            "Recall": float(gb_rec),
            "Macro F1": float(gb_f1_m),
            "Weighted F1": float(gb_f1_w),
            "Specificity": float(gb_spec),
            "ROC AUC": float(gb_roc) if isinstance(gb_roc, (int, float)) else gb_roc,
            "MCC": float(gb_mcc),
            "Training Time": float(t_train),
            "Prediction Time": float(t_pred),
        }
        results.append(res_gb)
        print(f"  Accuracy    : {gb_acc:.4f}")
        print(f"  Weighted F1 : {gb_f1_w:.4f}")
        print(f"  Macro F1    : {gb_f1_m:.4f}")
        print(f"  MCC         : {gb_mcc:.4f}")
        print(f"  Training Time: {t_train:.2f}s | Prediction Time: {t_pred:.2f}s")
    except Exception as e:
        print(f"  Baseline error: {e}")
    print()

    # ==========================================================
    # 2. EXPERIMENTAL MODELS
    # ==========================================================
    print("EXPERIMENTAL MODELS")

    # A. Random Forest
    print("\nRandom Forest")
    try:
        from sklearn.ensemble import RandomForestClassifier

        rf_model = RandomForestClassifier(
            n_estimators=100, random_state=42, n_jobs=-1
        )
        t_start = time.time()
        rf_model.fit(X_train, y_train)
        t_train = time.time() - t_start

        t_start = time.time()
        rf_pred = rf_model.predict(X_test)
        rf_proba = rf_model.predict_proba(X_test)
        t_pred = time.time() - t_start

        rf_acc = accuracy_score(y_test, rf_pred)
        rf_prec = precision_score(y_test, rf_pred, average="weighted", zero_division=0)
        rf_rec = recall_score(y_test, rf_pred, average="weighted", zero_division=0)
        rf_f1_w = f1_score(y_test, rf_pred, average="weighted", zero_division=0)
        rf_f1_m = f1_score(y_test, rf_pred, average="macro", zero_division=0)
        rf_spec = calculate_macro_specificity(y_test, rf_pred)
        rf_mcc = matthews_corrcoef(y_test, rf_pred)

        try:
            rf_roc = roc_auc_score(
                y_test, rf_proba, multi_class="ovr", average="weighted"
            )
        except Exception:
            rf_roc = "N/A"

        results.append({
            "Model": "Random Forest",
            "IsBaseline": False,
            "Accuracy": float(rf_acc),
            "Precision": float(rf_prec),
            "Recall": float(rf_rec),
            "Macro F1": float(rf_f1_m),
            "Weighted F1": float(rf_f1_w),
            "Specificity": float(rf_spec),
            "ROC AUC": float(rf_roc) if isinstance(rf_roc, (int, float)) else rf_roc,
            "MCC": float(rf_mcc),
            "Training Time": float(t_train),
            "Prediction Time": float(t_pred),
        })
        print(f"  Accuracy    : {rf_acc:.4f}")
        print(f"  Weighted F1 : {rf_f1_w:.4f}")
        print(f"  Macro F1    : {rf_f1_m:.4f}")
        print(f"  MCC         : {rf_mcc:.4f}")
        print(f"  Training Time: {t_train:.2f}s | Prediction Time: {t_pred:.2f}s")
    except Exception as e:
        print(f"  Random Forest skipped: {e}")

    # B. Extra Trees
    print("\nExtra Trees")
    try:
        from sklearn.ensemble import ExtraTreesClassifier

        et_model = ExtraTreesClassifier(
            n_estimators=100, random_state=42, n_jobs=-1
        )
        t_start = time.time()
        et_model.fit(X_train, y_train)
        t_train = time.time() - t_start

        t_start = time.time()
        et_pred = et_model.predict(X_test)
        et_proba = et_model.predict_proba(X_test)
        t_pred = time.time() - t_start

        et_acc = accuracy_score(y_test, et_pred)
        et_prec = precision_score(y_test, et_pred, average="weighted", zero_division=0)
        et_rec = recall_score(y_test, et_pred, average="weighted", zero_division=0)
        et_f1_w = f1_score(y_test, et_pred, average="weighted", zero_division=0)
        et_f1_m = f1_score(y_test, et_pred, average="macro", zero_division=0)
        et_spec = calculate_macro_specificity(y_test, et_pred)
        et_mcc = matthews_corrcoef(y_test, et_pred)

        try:
            et_roc = roc_auc_score(
                y_test, et_proba, multi_class="ovr", average="weighted"
            )
        except Exception:
            et_roc = "N/A"

        results.append({
            "Model": "Extra Trees",
            "IsBaseline": False,
            "Accuracy": float(et_acc),
            "Precision": float(et_prec),
            "Recall": float(et_rec),
            "Macro F1": float(et_f1_m),
            "Weighted F1": float(et_f1_w),
            "Specificity": float(et_spec),
            "ROC AUC": float(et_roc) if isinstance(et_roc, (int, float)) else et_roc,
            "MCC": float(et_mcc),
            "Training Time": float(t_train),
            "Prediction Time": float(t_pred),
        })
        print(f"  Accuracy    : {et_acc:.4f}")
        print(f"  Weighted F1 : {et_f1_w:.4f}")
        print(f"  Macro F1    : {et_f1_m:.4f}")
        print(f"  MCC         : {et_mcc:.4f}")
        print(f"  Training Time: {t_train:.2f}s | Prediction Time: {t_pred:.2f}s")
    except Exception as e:
        print(f"  Extra Trees skipped: {e}")

    # C. XGBoost
    print("\nXGBoost")
    try:
        from xgboost import XGBClassifier

        xgb_model = XGBClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            objective="multi:softprob",
            num_class=8,
            eval_metric="mlogloss",
            random_state=42,
            n_jobs=-1,
        )
        t_start = time.time()
        xgb_model.fit(X_train, y_train)
        t_train = time.time() - t_start

        t_start = time.time()
        xgb_pred = xgb_model.predict(X_test)
        if hasattr(xgb_pred, "ravel"):
            xgb_pred = xgb_pred.ravel()
        xgb_proba = xgb_model.predict_proba(X_test)
        t_pred = time.time() - t_start

        xgb_acc = accuracy_score(y_test, xgb_pred)
        xgb_prec = precision_score(y_test, xgb_pred, average="weighted", zero_division=0)
        xgb_rec = recall_score(y_test, xgb_pred, average="weighted", zero_division=0)
        xgb_f1_w = f1_score(y_test, xgb_pred, average="weighted", zero_division=0)
        xgb_f1_m = f1_score(y_test, xgb_pred, average="macro", zero_division=0)
        xgb_spec = calculate_macro_specificity(y_test, xgb_pred)
        xgb_mcc = matthews_corrcoef(y_test, xgb_pred)

        try:
            xgb_roc = roc_auc_score(
                y_test, xgb_proba, multi_class="ovr", average="weighted"
            )
        except Exception:
            xgb_roc = "N/A"

        results.append({
            "Model": "XGBoost",
            "IsBaseline": False,
            "Accuracy": float(xgb_acc),
            "Precision": float(xgb_prec),
            "Recall": float(xgb_rec),
            "Macro F1": float(xgb_f1_m),
            "Weighted F1": float(xgb_f1_w),
            "Specificity": float(xgb_spec),
            "ROC AUC": float(xgb_roc) if isinstance(xgb_roc, (int, float)) else xgb_roc,
            "MCC": float(xgb_mcc),
            "Training Time": float(t_train),
            "Prediction Time": float(t_pred),
        })
        print(f"  Accuracy    : {xgb_acc:.4f}")
        print(f"  Weighted F1 : {xgb_f1_w:.4f}")
        print(f"  Macro F1    : {xgb_f1_m:.4f}")
        print(f"  MCC         : {xgb_mcc:.4f}")
        print(f"  Training Time: {t_train:.2f}s | Prediction Time: {t_pred:.2f}s")
    except Exception as e:
        print(f"  XGBoost skipped: {e}")

    # D. LightGBM
    print("\nLightGBM")
    try:
        from lightgbm import LGBMClassifier

        lgbm_model = LGBMClassifier(
            n_estimators=100,
            learning_rate=0.1,
            objective="multiclass",
            num_class=8,
            random_state=42,
            n_jobs=-1,
            verbose=-1,
        )
        t_start = time.time()
        lgbm_model.fit(X_train, y_train)
        t_train = time.time() - t_start

        t_start = time.time()
        lgbm_pred = lgbm_model.predict(X_test)
        if hasattr(lgbm_pred, "ravel"):
            lgbm_pred = lgbm_pred.ravel()
        lgbm_proba = lgbm_model.predict_proba(X_test)
        t_pred = time.time() - t_start

        lgbm_acc = accuracy_score(y_test, lgbm_pred)
        lgbm_prec = precision_score(y_test, lgbm_pred, average="weighted", zero_division=0)
        lgbm_rec = recall_score(y_test, lgbm_pred, average="weighted", zero_division=0)
        lgbm_f1_w = f1_score(y_test, lgbm_pred, average="weighted", zero_division=0)
        lgbm_f1_m = f1_score(y_test, lgbm_pred, average="macro", zero_division=0)
        lgbm_spec = calculate_macro_specificity(y_test, lgbm_pred)
        lgbm_mcc = matthews_corrcoef(y_test, lgbm_pred)

        try:
            lgbm_roc = roc_auc_score(
                y_test, lgbm_proba, multi_class="ovr", average="weighted"
            )
        except Exception:
            lgbm_roc = "N/A"

        results.append({
            "Model": "LightGBM",
            "IsBaseline": False,
            "Accuracy": float(lgbm_acc),
            "Precision": float(lgbm_prec),
            "Recall": float(lgbm_rec),
            "Macro F1": float(lgbm_f1_m),
            "Weighted F1": float(lgbm_f1_w),
            "Specificity": float(lgbm_spec),
            "ROC AUC": float(lgbm_roc) if isinstance(lgbm_roc, (int, float)) else lgbm_roc,
            "MCC": float(lgbm_mcc),
            "Training Time": float(t_train),
            "Prediction Time": float(t_pred),
        })
        print(f"  Accuracy    : {lgbm_acc:.4f}")
        print(f"  Weighted F1 : {lgbm_f1_w:.4f}")
        print(f"  Macro F1    : {lgbm_f1_m:.4f}")
        print(f"  MCC         : {lgbm_mcc:.4f}")
        print(f"  Training Time: {t_train:.2f}s | Prediction Time: {t_pred:.2f}s")
    except Exception as e:
        print(f"  LightGBM skipped: {e}")

    # E. CatBoost
    print("\nCatBoost")
    try:
        from catboost import CatBoostClassifier

        cb_model = CatBoostClassifier(
            iterations=100,
            learning_rate=0.1,
            loss_function="MultiClass",
            random_seed=42,
            verbose=False,
        )
        t_start = time.time()
        cb_model.fit(X_train, y_train)
        t_train = time.time() - t_start

        t_start = time.time()
        cb_pred = cb_model.predict(X_test)
        if hasattr(cb_pred, "ravel"):
            cb_pred = cb_pred.ravel()
        cb_proba = cb_model.predict_proba(X_test)
        t_pred = time.time() - t_start

        cb_acc = accuracy_score(y_test, cb_pred)
        cb_prec = precision_score(y_test, cb_pred, average="weighted", zero_division=0)
        cb_rec = recall_score(y_test, cb_pred, average="weighted", zero_division=0)
        cb_f1_w = f1_score(y_test, cb_pred, average="weighted", zero_division=0)
        cb_f1_m = f1_score(y_test, cb_pred, average="macro", zero_division=0)
        cb_spec = calculate_macro_specificity(y_test, cb_pred)
        cb_mcc = matthews_corrcoef(y_test, cb_pred)

        try:
            cb_roc = roc_auc_score(
                y_test, cb_proba, multi_class="ovr", average="weighted"
            )
        except Exception:
            cb_roc = "N/A"

        results.append({
            "Model": "CatBoost",
            "IsBaseline": False,
            "Accuracy": float(cb_acc),
            "Precision": float(cb_prec),
            "Recall": float(cb_rec),
            "Macro F1": float(cb_f1_m),
            "Weighted F1": float(cb_f1_w),
            "Specificity": float(cb_spec),
            "ROC AUC": float(cb_roc) if isinstance(cb_roc, (int, float)) else cb_roc,
            "MCC": float(cb_mcc),
            "Training Time": float(t_train),
            "Prediction Time": float(t_pred),
        })
        print(f"  Accuracy    : {cb_acc:.4f}")
        print(f"  Weighted F1 : {cb_f1_w:.4f}")
        print(f"  Macro F1    : {cb_f1_m:.4f}")
        print(f"  MCC         : {cb_mcc:.4f}")
        print(f"  Training Time: {t_train:.2f}s | Prediction Time: {t_pred:.2f}s")
    except Exception as e:
        print(f"  CatBoost skipped: {e}")

    # ==========================================================
    # FINAL COMPARISON & BEST EXPERIMENTAL MODEL SELECTION
    # ==========================================================
    print("\n" + "=" * 65)
    print("FINAL COMPARISON")
    print("=" * 65)

    comp_df = pd.DataFrame(results)
    
    # Sort by Weighted F1 descending
    comp_df = comp_df.sort_values(by=["Weighted F1", "MCC", "Accuracy"], ascending=False).reset_index(drop=True)

    display_cols = [
        "Model",
        "Accuracy",
        "Precision",
        "Recall",
        "Macro F1",
        "Weighted F1",
        "Specificity",
        "ROC AUC",
        "MCC",
        "Training Time",
        "Prediction Time",
    ]
    print(comp_df[display_cols].to_string(index=False))

    # Baseline reference values
    base_row = [r for r in results if r.get("IsBaseline")]
    if base_row:
        base_acc = base_row[0]["Accuracy"]
        base_f1 = base_row[0]["Weighted F1"]
    else:
        base_acc = 0.0
        base_f1 = 0.0

    # Select Best Experimental Model (excluding baseline if available, or overall best)
    exp_models = [r for r in results if not r.get("IsBaseline")]
    if not exp_models:
        exp_models = results

    exp_sorted = sorted(
        exp_models,
        key=lambda x: (x["Weighted F1"], x["MCC"], x["Accuracy"]),
        reverse=True,
    )
    best_exp = exp_sorted[0]

    acc_diff = best_exp["Accuracy"] - base_acc
    f1_diff = best_exp["Weighted F1"] - base_f1

    acc_pct = (acc_diff / base_acc * 100) if base_acc > 0 else 0.0
    f1_pct = (f1_diff / base_f1 * 100) if base_f1 > 0 else 0.0

    print("\n" + "=" * 65)
    print("BEST EXPERIMENTAL MODEL")
    print("=" * 65)
    roc_val = best_exp["ROC AUC"]
    roc_str = roc_val if isinstance(roc_val, str) else f"{roc_val:.4f}"

    print(f"Model             : {best_exp['Model']}")
    print(f"Accuracy          : {best_exp['Accuracy']:.4f}")
    print(f"Weighted F1       : {best_exp['Weighted F1']:.4f}")
    print(f"Macro F1          : {best_exp['Macro F1']:.4f}")
    print(f"ROC AUC           : {roc_str}")
    print(f"MCC               : {best_exp['MCC']:.4f}")
    print(f"Specificity       : {best_exp['Specificity']:.4f}")
    print(f"\nBaseline Accuracy   : {base_acc:.4f}")
    print(f"Baseline Weighted F1: {base_f1:.4f}")
    print(f"\nAccuracy Improvement: {acc_diff:+.4f} ({acc_pct:+.2f}%)")
    print(f"F1 Improvement      : {f1_diff:+.4f} ({f1_pct:+.2f}%)")
    print("=" * 65)

    # ==========================================================
    # SAVE OUTPUTS: CSV, JSON, PNG
    # ==========================================================
    csv_path = EVAL_DIR / "model_comparison.csv"
    json_path = EVAL_DIR / "model_comparison.json"
    png_path = EVAL_DIR / "model_comparison.png"

    comp_df[display_cols].to_csv(csv_path, index=False)
    print(f"\nSaved CSV comparison : {csv_path}")

    # JSON export
    comparison_data = {
        "baseline": base_row[0] if base_row else {},
        "best_experimental_model": best_exp,
        "improvements": {
            "accuracy_difference": round(acc_diff, 4),
            "accuracy_percent": round(acc_pct, 2),
            "f1_difference": round(f1_diff, 4),
            "f1_percent": round(f1_pct, 2),
        },
        "all_models": results,
    }
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(comparison_data, f, indent=4)
    print(f"Saved JSON comparison: {json_path}")

    # Plot PNG Bar Chart comparing Accuracy, Weighted F1, MCC
    fig, ax = plt.subplots(figsize=(10, 6))
    
    models_list = comp_df["Model"].tolist()
    x = np.arange(len(models_list))
    width = 0.25

    rects1 = ax.bar(x - width, comp_df["Accuracy"], width, label="Accuracy", color="#2563eb")
    rects2 = ax.bar(x, comp_df["Weighted F1"], width, label="Weighted F1", color="#16a34a")
    rects3 = ax.bar(x + width, comp_df["MCC"], width, label="MCC", color="#9333ea")

    ax.set_ylabel("Score", fontsize=11)
    ax.set_title("Model Comparison - Recommendation Engine (Model 3)", fontsize=13, pad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(models_list, rotation=15, ha="right", fontsize=9)
    ax.set_ylim([0.0, 1.0])
    ax.legend(loc="upper left", fontsize=10)
    ax.grid(True, linestyle="--", alpha=0.5, axis="y")

    # Add values on top of bars
    for rect in rects1:
        h = rect.get_height()
        ax.annotate(f"{h:.3f}", xy=(rect.get_x() + rect.get_width()/2, h), xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=7)
    for rect in rects2:
        h = rect.get_height()
        ax.annotate(f"{h:.3f}", xy=(rect.get_x() + rect.get_width()/2, h), xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=7)
    for rect in rects3:
        h = rect.get_height()
        ax.annotate(f"{h:.3f}", xy=(rect.get_x() + rect.get_width()/2, h), xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=7)

    plt.tight_layout()
    plt.savefig(png_path, dpi=300)
    plt.close()
    print(f"Saved PNG Comparison Chart: {png_path}")
    print("\nComparison Completed Successfully.")


if __name__ == "__main__":
    main()
