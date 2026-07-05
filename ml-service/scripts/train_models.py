"""
train_models.py

EduPulse AI

Train multiple machine learning models using the synthetic
procrastination dataset and automatically save the best model.
"""

import json
import joblib
import pandas as pd

from datetime import datetime

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)
# ==========================================================
# STEP 1 - Load Dataset
# ==========================================================

print("=" * 60)
print("Loading dataset...")
print("=" * 60)

df = pd.read_csv("data/procrastination_dataset.csv")

print("Dataset Loaded Successfully")
print(f"Shape: {df.shape}")

print("\nFirst 5 Records:")
print(df.head())

# ==========================================================
# STEP 2 - Prepare Features and Target
# ==========================================================

print("\nPreparing Features and Target...")

# Target variable
y = df["is_procrastinator"]

# Input features
X = df.drop(columns=["is_procrastinator", "risk_level"])

print(f"Features Shape : {X.shape}")
print(f"Target Shape   : {y.shape}")

print("\nFeatures:")
for feature in X.columns:
    print(f"✓ {feature}")

# ==========================================================
# STEP 3 - Train/Test Split
# ==========================================================

print("\nSplitting Dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}")

print(f"\nX_train Shape : {X_train.shape}")
print(f"X_test Shape  : {X_test.shape}")
print(f"y_train Shape : {y_train.shape}")
print(f"y_test Shape  : {y_test.shape}")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# ==========================================================
# STEP 4 - Feature Scaling
# ==========================================================

print("\nScaling Features...")

scaler = StandardScaler()

# Fit scaler on training data only
X_train_scaled = scaler.fit_transform(X_train)

# Transform testing data using same scaler
X_test_scaled = scaler.transform(X_test)

print("Feature Scaling Completed")

print(f"Scaled Training Shape : {X_train_scaled.shape}")
print(f"Scaled Testing Shape  : {X_test_scaled.shape}")

# ==========================================================
# STEP 5 - Train Logistic Regression
# ==========================================================

print("\nTraining Logistic Regression Model...")

logistic_model = LogisticRegression(
    random_state=42,
    max_iter=1000
)

logistic_model.fit(X_train_scaled, y_train)

print("Logistic Regression Training Completed")

# ==========================================================
# STEP 6 - Evaluate Logistic Regression
# ==========================================================

print("\nEvaluating Logistic Regression...")

logistic_predictions = logistic_model.predict(X_test_scaled)
logistic_probabilities = logistic_model.predict_proba(X_test_scaled)[:, 1]

logistic_accuracy = accuracy_score(y_test, logistic_predictions)
logistic_precision = precision_score(y_test, logistic_predictions)
logistic_recall = recall_score(y_test, logistic_predictions)
logistic_f1 = f1_score(y_test, logistic_predictions)
logistic_auc = roc_auc_score(y_test, logistic_probabilities)

print("\n========== Logistic Regression ==========")
print(f"Accuracy : {logistic_accuracy:.4f}")
print(f"Precision: {logistic_precision:.4f}")
print(f"Recall   : {logistic_recall:.4f}")
print(f"F1 Score : {logistic_f1:.4f}")
print(f"ROC AUC  : {logistic_auc:.4f}")

# ==========================================================
# STEP 7 - Train Random Forest
# ==========================================================

print("\nTraining Random Forest Model...")

random_forest_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

random_forest_model.fit(X_train, y_train)

print("Random Forest Training Completed")

# ==========================================================
# STEP 8 - Evaluate Random Forest
# ==========================================================

print("\nEvaluating Random Forest...")

rf_predictions = random_forest_model.predict(X_test)
rf_probabilities = random_forest_model.predict_proba(X_test)[:, 1]

rf_accuracy = accuracy_score(y_test, rf_predictions)
rf_precision = precision_score(y_test, rf_predictions)
rf_recall = recall_score(y_test, rf_predictions)
rf_f1 = f1_score(y_test, rf_predictions)
rf_auc = roc_auc_score(y_test, rf_probabilities)

print("\n========== Random Forest ==========")
print(f"Accuracy : {rf_accuracy:.4f}")
print(f"Precision: {rf_precision:.4f}")
print(f"Recall   : {rf_recall:.4f}")
print(f"F1 Score : {rf_f1:.4f}")
print(f"ROC AUC  : {rf_auc:.4f}")

# ==========================================================
# STEP 9 - Select Best Model
# ==========================================================

print("\nComparing Models...")

models = {
    "Logistic Regression": {
        "model": logistic_model,
        "accuracy": logistic_accuracy,
        "precision": logistic_precision,
        "recall": logistic_recall,
        "f1": logistic_f1,
        "roc_auc": logistic_auc,
    },
    "Random Forest": {
        "model": random_forest_model,
        "accuracy": rf_accuracy,
        "precision": rf_precision,
        "recall": rf_recall,
        "f1": rf_f1,
        "roc_auc": rf_auc,
    },
}

best_model_name = max(models, key=lambda x: models[x]["f1"])
best_model = models[best_model_name]["model"]

print(f"\nBest Model: {best_model_name}")
print(f"Best F1 Score: {models[best_model_name]['f1']:.4f}")

# ==========================================================
# STEP 10 - Save Model
# ==========================================================

joblib.dump(best_model, "models/best_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")

metadata = {
    "model": best_model_name,
    "dataset_size": len(df),
    "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "metrics": {
        "accuracy": models[best_model_name]["accuracy"],
        "precision": models[best_model_name]["precision"],
        "recall": models[best_model_name]["recall"],
        "f1_score": models[best_model_name]["f1"],
        "roc_auc": models[best_model_name]["roc_auc"],
    }
}

with open("models/model_metadata.json", "w") as file:
    json.dump(metadata, file, indent=4)

print("\nModel Saved Successfully!")
print("best_model.pkl")
print("scaler.pkl")
print("model_metadata.json")