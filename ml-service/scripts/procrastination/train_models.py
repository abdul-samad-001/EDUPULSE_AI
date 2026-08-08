"""
train_models.py

EduPulse AI - Machine Learning Training & Evaluation Pipeline

Train multiple machine learning models (Logistic Regression, Decision Tree,
Random Forest, XGBoost/Gradient Boosting) using the procrastination dataset.
Generates comprehensive evaluation metrics, ROC/PR curves, confusion matrices,
learning curves, feature importances, and saves the best model & metadata.
"""

import os
import json
import time
import sys
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

# Set stdout/stderr encoding to utf-8 if possible
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for headless plot generation
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split, learning_curve
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Try importing XGBoost, fallback to GradientBoostingClassifier if unavailable
try:
    # pyrefly: ignore [missing-import]
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    from sklearn.ensemble import GradientBoostingClassifier
    HAS_XGB = False

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    matthews_corrcoef,
    confusion_matrix,
    classification_report,
    roc_curve,
    precision_recall_curve,
)

# ==========================================================
# REQUIREMENT 13: DIRECTORY CHECK & PATH SETUP
# ==========================================================

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# BASE_DIR should resolve to ml-service root directory
if os.path.basename(SCRIPT_DIR) == "procrastination":
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
elif os.path.basename(SCRIPT_DIR) == "scripts":
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
else:
    BASE_DIR = os.getcwd()

DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
EVAL_DIR = os.path.join(BASE_DIR, "evaluation")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(EVAL_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)


# ==========================================================
# STEP 1 - Load Dataset
# ==========================================================

print("=" * 65)
print("STEP 1: Loading Dataset...")
print("=" * 65)

dataset_path = os.path.join(DATA_DIR, "procrastination", "procrastination_dataset.csv")
if not os.path.exists(dataset_path):
    dataset_path = os.path.join(DATA_DIR, "procrastination_dataset.csv")
if not os.path.exists(dataset_path):
    dataset_path = "data/procrastination_dataset.csv"

df = pd.read_csv(dataset_path)

print("Dataset Loaded Successfully")
print(f"Dataset Path: {dataset_path}")
print(f"Shape: {df.shape}")

print("\nFirst 5 Records:")
print(df.head())


# ==========================================================
# STEP 2 - Prepare Features and Target
# ==========================================================

print("\n" + "=" * 65)
print("STEP 2: Preparing Features and Target...")
print("=" * 65)

# Target variable
y = df["is_procrastinator"]

# Input features
X = df.drop(columns=["is_procrastinator", "risk_level"], errors="ignore")

print(f"Features Shape : {X.shape}")
print(f"Target Shape   : {y.shape}")

print("\nFeatures:")
for feature in X.columns:
    print(f" [+] {feature}")


# ==========================================================
# STEP 3 - Train/Test Split & Save Splits (Requirement 1)
# ==========================================================

print("\n" + "=" * 65)
print("STEP 3: Splitting Dataset & Saving Train/Test Splits...")
print("=" * 65)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}")
print(f"X_train Shape    : {X_train.shape}")
print(f"X_test Shape     : {X_test.shape}")
print(f"y_train Shape    : {y_train.shape}")
print(f"y_test Shape     : {y_test.shape}")

# Save train.csv and test.csv including features and target column
train_df = pd.concat([X_train, y_train], axis=1)
test_df = pd.concat([X_test, y_test], axis=1)

train_file_path = os.path.join(DATA_DIR, "train.csv")
test_file_path = os.path.join(DATA_DIR, "test.csv")

train_df.to_csv(train_file_path, index=False)
test_df.to_csv(test_file_path, index=False)

print("[+] train.csv saved")
print("[+] test.csv saved")


# ==========================================================
# STEP 4 - Feature Scaling
# ==========================================================

print("\n" + "=" * 65)
print("STEP 4: Scaling Features...")
print("=" * 65)

scaler = StandardScaler()

# Fit scaler on training data only
X_train_scaled = scaler.fit_transform(X_train)

# Transform testing data using same scaler
X_test_scaled = scaler.transform(X_test)

print("Feature Scaling Completed")
print(f"Scaled Training Shape : {X_train_scaled.shape}")
print(f"Scaled Testing Shape  : {X_test_scaled.shape}")


# ==========================================================
# HELPER - Model Evaluation Function
# ==========================================================

def evaluate_model(model_name, model, X_test_data, y_test_data):
    predictions = model.predict(X_test_data)

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(X_test_data)[:, 1]
    elif hasattr(model, "decision_function"):
        probabilities = model.decision_function(X_test_data)
    else:
        probabilities = predictions

    acc = accuracy_score(y_test_data, predictions)
    prec = precision_score(y_test_data, predictions, zero_division=0)
    rec = recall_score(y_test_data, predictions, zero_division=0)
    f1 = f1_score(y_test_data, predictions, zero_division=0)
    roc_auc = roc_auc_score(y_test_data, probabilities)
    avg_prec = average_precision_score(y_test_data, probabilities)
    mcc = matthews_corrcoef(y_test_data, predictions)

    cm = confusion_matrix(y_test_data, predictions)
    tn, fp, fn, tp = cm.ravel()
    spec = tn / (tn + fp) if (tn + fp) > 0 else 0.0

    print(f"\n========== {model_name} ==========")
    print(f"Accuracy         : {acc:.4f}")
    print(f"Precision        : {prec:.4f}")
    print(f"Recall           : {rec:.4f}")
    print(f"Specificity      : {spec:.4f}")
    print(f"F1 Score         : {f1:.4f}")
    print(f"ROC AUC          : {roc_auc:.4f}")
    print(f"Average Precision: {avg_prec:.4f}")
    print(f"MCC              : {mcc:.4f}")
    print("Confusion Matrix :")
    print(f"  [[TN={tn}, FP={fp}],")
    print(f"   [FN={fn}, TP={tp}]]")

    return {
        "name": model_name,
        "model": model,
        "predictions": predictions,
        "probabilities": probabilities,
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "specificity": spec,
        "f1": f1,
        "roc_auc": roc_auc,
        "average_precision": avg_prec,
        "mcc": mcc,
        "confusion_matrix": cm.tolist(),
    }


# ==========================================================
# STEP 5 - Model Training & Evaluation
# ==========================================================

print("\n" + "=" * 65)
print("STEP 5: Model Training & Evaluation...")
print("=" * 65)

start_time_all = time.time()

# 1. Logistic Regression
print("\n[1/4] Training Logistic Regression...")
logistic_model = LogisticRegression(random_state=42, max_iter=1000)
logistic_model.fit(X_train_scaled, y_train)
print("Logistic Regression Training Completed")
logistic_res = evaluate_model("Logistic Regression", logistic_model, X_test_scaled, y_test)

# 2. Decision Tree (Requirement 2)
print("\n[2/4] Training Decision Tree Classifier...")
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train, y_train)
print("Decision Tree Training Completed")
dt_res = evaluate_model("Decision Tree", dt_model, X_test, y_test)

# 3. Random Forest
print("\n[3/4] Training Random Forest Classifier...")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_train)
print("Random Forest Training Completed")
rf_res = evaluate_model("Random Forest", rf_model, X_test, y_test)

# 4. XGBoost / Gradient Boosting Fallback (Requirement 3)
if HAS_XGB:
    print("\n[4/4] Training XGBoost Classifier...")
    xgb_model_name = "XGBoost"
    xgb_model = XGBClassifier(random_state=42, eval_metric="logloss", n_estimators=100)
else:
    print("\n[4/4] Training Gradient Boosting Classifier (XGBoost Fallback)...")
    xgb_model_name = "Gradient Boosting"
    xgb_model = GradientBoostingClassifier(random_state=42, n_estimators=100)

xgb_model.fit(X_train, y_train)
print(f"{xgb_model_name} Training Completed")
xgb_res = evaluate_model(xgb_model_name, xgb_model, X_test, y_test)

total_training_time = time.time() - start_time_all


# ==========================================================
# STEP 6 - Model Comparison Table & Selection (Requirement 4)
# ==========================================================

print("\n" + "=" * 65)
print("STEP 6: Model Comparison & Selection...")
print("=" * 65)

results_list = [logistic_res, dt_res, rf_res, xgb_res]

comparison_df = pd.DataFrame([
    {
        "Model": res["name"],
        "Accuracy": res["accuracy"],
        "Precision": res["precision"],
        "Recall": res["recall"],
        "Specificity": res["specificity"],
        "F1 Score": res["f1"],
        "ROC AUC": res["roc_auc"],
        "Avg Precision": res["average_precision"],
        "MCC": res["mcc"],
    }
    for res in results_list
])

print("\nModel Comparison Table:")
print(comparison_df.to_string(index=False, float_format=lambda x: f"{x:.4f}"))

# Automatically choose best model based on F1 Score
best_res = max(results_list, key=lambda x: x["f1"])
best_model_name = best_res["name"]
best_model = best_res["model"]

print(f"\n[BEST MODEL SELECTED]: {best_model_name}")
print(f"[BEST F1 SCORE]: {best_res['f1']:.4f}")


# ==========================================================
# STEP 7 - Generate Evaluation Artifacts & Plots (Requirements 5-11)
# ==========================================================

print("\n" + "=" * 65)
print("STEP 7: Generating Evaluation Artifacts & Plots...")
print("=" * 65)

# ----------------------------------------------------------
# Requirement 5: Classification Report (evaluation/classification_report.txt)
# ----------------------------------------------------------
report_file_path = os.path.join(EVAL_DIR, "classification_report.txt")
with open(report_file_path, "w", encoding="utf-8") as f:
    f.write("=========================================================\n")
    f.write("     EDUPULSE AI - ML CLASSIFICATION EVALUATION REPORT   \n")
    f.write("=========================================================\n\n")
    f.write(f"Generated Date : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write(f"Best Model     : {best_model_name}\n")
    f.write(f"Best F1 Score  : {best_res['f1']:.4f}\n\n")

    for res in results_list:
        f.write(f"---------------------------------------------------------\n")
        f.write(f"Model: {res['name']}\n")
        f.write(f"---------------------------------------------------------\n")
        test_data = X_test_scaled if res["name"] == "Logistic Regression" else X_test
        rep = classification_report(y_test, res["predictions"], digits=4)
        f.write(rep + "\n\n")

print(f"[+] Saved classification_report.txt -> {report_file_path}")


# ----------------------------------------------------------
# Requirement 6: Confusion Matrix Image (evaluation/confusion_matrix.png)
# ----------------------------------------------------------
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.flatten()

for idx, res in enumerate(results_list):
    cm = np.array(res["confusion_matrix"])
    ax = axes[idx]
    im = ax.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    ax.set_title(f"{res['name']}\n(F1: {res['f1']:.4f})", fontsize=12, fontweight="bold")
    fig.colorbar(im, ax=ax)
    tick_marks = np.arange(2)
    ax.set_xticks(tick_marks)
    ax.set_yticks(tick_marks)
    ax.set_xticklabels(["Non-Procrastinator", "Procrastinator"], fontsize=9)
    ax.set_yticklabels(["Non-Procrastinator", "Procrastinator"], fontsize=9)
    ax.set_ylabel("True Label", fontsize=10)
    ax.set_xlabel("Predicted Label", fontsize=10)

    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(
                j,
                i,
                format(cm[i, j], "d"),
                ha="center",
                va="center",
                color="white" if cm[i, j] > thresh else "black",
                fontweight="bold",
            )

plt.tight_layout()
cm_fig_path = os.path.join(EVAL_DIR, "confusion_matrix.png")
plt.savefig(cm_fig_path, dpi=300, bbox_inches="tight")
plt.close()
print(f"[+] Saved confusion_matrix.png -> {cm_fig_path}")


# ----------------------------------------------------------
# Requirement 7: ROC Curve (evaluation/roc_curve.png)
# ----------------------------------------------------------
plt.figure(figsize=(10, 8))
colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]

for idx, res in enumerate(results_list):
    fpr, tpr, _ = roc_curve(y_test, res["probabilities"])
    plt.plot(
        fpr,
        tpr,
        color=colors[idx],
        lw=2,
        label=f"{res['name']} (AUC = {res['roc_auc']:.4f})",
    )

plt.plot([0, 1], [0, 1], color="navy", lw=1.5, linestyle="--", label="Random Chance (AUC = 0.50)")
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel("False Positive Rate (1 - Specificity)", fontsize=12)
plt.ylabel("True Positive Rate (Recall)", fontsize=12)
plt.title("Receiver Operating Characteristic (ROC) Curve Comparison", fontsize=14, fontweight="bold")
plt.legend(loc="lower right", fontsize=11)
plt.grid(True, linestyle=":", alpha=0.6)

roc_fig_path = os.path.join(EVAL_DIR, "roc_curve.png")
plt.savefig(roc_fig_path, dpi=300, bbox_inches="tight")
plt.close()
print(f"[+] Saved roc_curve.png -> {roc_fig_path}")


# ----------------------------------------------------------
# Requirement 8: Precision Recall Curve (evaluation/precision_recall_curve.png)
# ----------------------------------------------------------
plt.figure(figsize=(10, 8))

for idx, res in enumerate(results_list):
    prec_vals, rec_vals, _ = precision_recall_curve(y_test, res["probabilities"])
    plt.plot(
        rec_vals,
        prec_vals,
        color=colors[idx],
        lw=2,
        label=f"{res['name']} (AP = {res['average_precision']:.4f})",
    )

plt.xlabel("Recall", fontsize=12)
plt.ylabel("Precision", fontsize=12)
plt.title("Precision-Recall Curve Comparison", fontsize=14, fontweight="bold")
plt.legend(loc="lower left", fontsize=11)
plt.grid(True, linestyle=":", alpha=0.6)

pr_fig_path = os.path.join(EVAL_DIR, "precision_recall_curve.png")
plt.savefig(pr_fig_path, dpi=300, bbox_inches="tight")
plt.close()
print(f"[+] Saved precision_recall_curve.png -> {pr_fig_path}")


# ----------------------------------------------------------
# Requirement 9: Feature Importance (evaluation/feature_importance.png)
# ----------------------------------------------------------
plt.figure(figsize=(10, 6))
feature_names = X.columns.tolist()

if hasattr(best_model, "feature_importances_"):
    importances = best_model.feature_importances_
    indices = np.argsort(importances)
    plt.barh(range(len(indices)), importances[indices], align="center", color="#2b5c8f")
    plt.yticks(range(len(indices)), [feature_names[i] for i in indices], fontsize=10)
    plt.xlabel("Feature Importance Score", fontsize=12)
    plt.title(f"Feature Importance ({best_model_name})", fontsize=14, fontweight="bold")
    plt.grid(True, linestyle=":", alpha=0.6)
elif hasattr(best_model, "coef_"):
    importances = np.abs(best_model.coef_[0])
    indices = np.argsort(importances)
    plt.barh(range(len(indices)), importances[indices], align="center", color="#2b5c8f")
    plt.yticks(range(len(indices)), [feature_names[i] for i in indices], fontsize=10)
    plt.xlabel("Absolute Coefficient Magnitude", fontsize=12)
    plt.title(f"Feature Importance / Coefficient Magnitude ({best_model_name})", fontsize=14, fontweight="bold")
    plt.grid(True, linestyle=":", alpha=0.6)

plt.tight_layout()
fi_fig_path = os.path.join(EVAL_DIR, "feature_importance.png")
plt.savefig(fi_fig_path, dpi=300, bbox_inches="tight")
plt.close()
print(f"[+] Saved feature_importance.png -> {fi_fig_path}")


# ----------------------------------------------------------
# Requirement 10: Learning Curve (evaluation/learning_curve.png)
# ----------------------------------------------------------
plt.figure(figsize=(10, 6))
train_data_lc = X_train_scaled if best_model_name == "Logistic Regression" else X_train

lc_out = learning_curve(
    best_model,
    train_data_lc,
    y_train,
    cv=5,
    scoring="f1",
    train_sizes=np.linspace(0.1, 1.0, 5),
    random_state=42,
)
train_sizes = lc_out[0]
train_scores = lc_out[1]
test_scores = lc_out[2]

train_mean = np.mean(train_scores, axis=1)
train_std = np.std(train_scores, axis=1)
test_mean = np.mean(test_scores, axis=1)
test_std = np.std(test_scores, axis=1)

plt.plot(train_sizes, train_mean, "o-", color="#1f77b4", label="Training F1 Score")
plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.15, color="#1f77b4")

plt.plot(train_sizes, test_mean, "o-", color="#2ca02c", label="Cross-Validation F1 Score")
plt.fill_between(train_sizes, test_mean - test_std, test_mean + test_std, alpha=0.15, color="#2ca02c")

plt.xlabel("Training Set Size (Samples)", fontsize=12)
plt.ylabel("F1 Score", fontsize=12)
plt.title(f"Learning Curve ({best_model_name})", fontsize=14, fontweight="bold")
plt.legend(loc="lower right", fontsize=11)
plt.grid(True, linestyle=":", alpha=0.6)

lc_fig_path = os.path.join(EVAL_DIR, "learning_curve.png")
plt.savefig(lc_fig_path, dpi=300, bbox_inches="tight")
plt.close()
print(f"[+] Saved learning_curve.png -> {lc_fig_path}")


# ----------------------------------------------------------
# Requirement 11: Metrics JSON (evaluation/metrics.json)
# ----------------------------------------------------------
metrics_json_data = {}
for res in results_list:
    metrics_json_data[res["name"]] = {
        "accuracy": float(res["accuracy"]),
        "precision": float(res["precision"]),
        "recall": float(res["recall"]),
        "specificity": float(res["specificity"]),
        "f1": float(res["f1"]),
        "roc_auc": float(res["roc_auc"]),
        "average_precision": float(res["average_precision"]),
        "mcc": float(res["mcc"]),
        "confusion_matrix": res["confusion_matrix"],
    }

metrics_json_path = os.path.join(EVAL_DIR, "metrics.json")
with open(metrics_json_path, "w", encoding="utf-8") as f:
    json.dump(metrics_json_data, f, indent=4)

print(f"[+] Saved metrics.json -> {metrics_json_path}")


# ==========================================================
# STEP 8 - Save Best Model & Update Metadata (Requirements 8, 12)
# ==========================================================

print("\n" + "=" * 65)
print("STEP 8: Saving Best Model & Metadata...")
print("=" * 65)

best_model_save_path = os.path.join(MODELS_DIR, "best_model.pkl")
scaler_save_path = os.path.join(MODELS_DIR, "scaler.pkl")
metadata_save_path = os.path.join(MODELS_DIR, "model_metadata.json")
alt_metadata_save_path = os.path.join(MODELS_DIR, "metadata.json")

joblib.dump(best_model, best_model_save_path)
joblib.dump(scaler, scaler_save_path)

# Comprehensive Metadata (Requirement 12)
metadata = {
    "model": best_model_name,
    "best_model": best_model_name,
    "dataset_size": len(df),
    "train_samples": len(X_train),
    "test_samples": len(X_test),
    "feature_count": len(X.columns),
    "feature_names": list(X.columns),
    "training_time_seconds": round(total_training_time, 2),
    "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "metrics": {
        "accuracy": float(best_res["accuracy"]),
        "precision": float(best_res["precision"]),
        "recall": float(best_res["recall"]),
        "specificity": float(best_res["specificity"]),
        "f1_score": float(best_res["f1"]),
        "roc_auc": float(best_res["roc_auc"]),
        "average_precision": float(best_res["average_precision"]),
        "mcc": float(best_res["mcc"]),
    },
    "comparison_of_all_models": {
        res["name"]: {
            "accuracy": float(res["accuracy"]),
            "precision": float(res["precision"]),
            "recall": float(res["recall"]),
            "specificity": float(res["specificity"]),
            "f1": float(res["f1"]),
            "roc_auc": float(res["roc_auc"]),
            "average_precision": float(res["average_precision"]),
            "mcc": float(res["mcc"]),
        }
        for res in results_list
    },
}

with open(metadata_save_path, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=4)

with open(alt_metadata_save_path, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=4)

print("Model Saved Successfully!")
print(f"  - best_model.pkl -> {best_model_save_path}")
print(f"  - scaler.pkl     -> {scaler_save_path}")
print(f"  - model_metadata.json -> {metadata_save_path}")


# ==========================================================
# STEP 9 - Generate PDF Result Report (reports/procrastination_result.pdf)
# ==========================================================

print("\n" + "=" * 65)
print("STEP 9: Generating PDF Result Report...")
print("=" * 65)

try:
    from generate_pdf_report import create_procrastination_pdf
except ImportError:
    try:
        from scripts.procrastination.generate_pdf_report import create_procrastination_pdf
    except ImportError:
        from .generate_pdf_report import create_procrastination_pdf

pdf_primary_path = os.path.join(REPORTS_DIR, "procrastination_result.pdf")
pdf_secondary_path = "reports/procrastination_result.pdf"

create_procrastination_pdf(
    df=df,
    X=X,
    y=y,
    X_train=X_train,
    X_test=X_test,
    y_train=y_train,
    y_test=y_test,
    X_train_scaled=X_train_scaled,
    X_test_scaled=X_test_scaled,
    results_list=results_list,
    best_res=best_res,
    total_training_time=total_training_time,
    output_pdf_path=pdf_primary_path,
)

# Ensure copy exists at reports/procrastination_result.pdf relative to cwd if cwd differs
if os.path.abspath(pdf_primary_path) != os.path.abspath(pdf_secondary_path):
    os.makedirs(os.path.dirname(pdf_secondary_path), exist_ok=True)
    import shutil
    shutil.copy2(pdf_primary_path, pdf_secondary_path)
    print(f"[+] Saved procrastination_result.pdf -> {pdf_secondary_path}")

print("\n" + "=" * 65)
print("TRAINING AND EVALUATION PIPELINE COMPLETED SUCCESSFULLY!")
print("=" * 65)