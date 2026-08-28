# pyrefly: ignore [missing-import]
from flask import Flask, jsonify, request
from flask_cors import CORS

import joblib
import numpy as np
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5173", "http://127.0.0.1:5173"]}})

# ==========================================================
# BASE DIRECTORY & PATH CONFIGURATION
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Model 1: Procrastination Risk Prediction ---
MODEL1_PATH = os.path.join(BASE_DIR, "models", "procrastination", "best_model.pkl")
if not os.path.exists(MODEL1_PATH):
    MODEL1_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")

SCALER1_PATH = os.path.join(BASE_DIR, "models", "procrastination", "scaler.pkl")
if not os.path.exists(SCALER1_PATH):
    SCALER1_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

METADATA1_PATH = os.path.join(BASE_DIR, "models", "procrastination", "metadata.json")
if not os.path.exists(METADATA1_PATH):
    METADATA1_PATH = os.path.join(BASE_DIR, "models", "model_metadata.json")

MODEL1_FEATURE_NAMES = [
    "study_hours_per_day",
    "app_usage_minutes",
    "idle_time_minutes",
    "lms_logins_per_week",
    "submission_offset_hours",
    "completion_rate_percent",
    "deadline_misses_30d",
    "streak_days",
    "avg_session_length_min",
    "distraction_visits_per_day",
    "sleep_hours",
]

# --- Model 2: Productivity Score Prediction ---
MODEL2_PATH = os.path.join(BASE_DIR, "models", "productivity", "best_model.pkl")
SCALER2_PATH = os.path.join(BASE_DIR, "models", "productivity", "scaler.pkl")
METADATA2_PATH = os.path.join(BASE_DIR, "models", "productivity", "metadata.json")

# --- Model 3 V2: Recommendation Engine ---
MODEL3_V2_PATH = os.path.join(BASE_DIR, "models", "recommendation", "v2", "best_model_v2.pkl")
SCALER3_V2_PATH = os.path.join(BASE_DIR, "models", "recommendation", "v2", "v2_scaler.pkl")
if not os.path.exists(SCALER3_V2_PATH):
    SCALER3_V2_PATH = os.path.join(BASE_DIR, "models", "recommendation", "v2_scaler.pkl")
METADATA3_V2_PATH = os.path.join(BASE_DIR, "models", "recommendation", "v2", "model_metadata_v2.json")

MODEL3_CLASS_MAPPING = {
    0: "Continue Current Skill",
    1: "Start Focus Session",
    2: "Take Short Break",
    3: "Practice Coding",
    4: "Revision",
    5: "Watch Learning Video",
    6: "Complete Pending Tasks",
    7: "Attempt Quiz",
}

# ==========================================================
# LOAD MODELS & STARTUP VERIFICATION
# ==========================================================

# Model 1 Globals
model = None
scaler = None
metadata = {}

# Model 2 Globals
model_v2_prod = None
scaler_v2_prod = None
metadata_v2_prod = {}

# Model 3 Globals
model_v3 = None
scaler_v3 = None
metadata_v3 = {}
model3_feature_names = []

# --- 1. Load Model 1 (Procrastination) ---
try:
    if os.path.exists(MODEL1_PATH):
        model = joblib.load(MODEL1_PATH)
        scaler = joblib.load(SCALER1_PATH)
        if os.path.exists(METADATA1_PATH):
            with open(METADATA1_PATH, "r", encoding="utf-8") as file:
                metadata = json.load(file)
        print("[STARTUP] Model 1 (Procrastination Risk) loaded successfully.")
    else:
        print("[STARTUP WARN] Model 1 artifact not found.")
except Exception as error:
    print(f"[STARTUP ERROR] Failed to load Model 1: {error}")
    model = None
    scaler = None
    metadata = {}

# --- 2. Load Model 2 (Productivity) ---
try:
    if os.path.exists(MODEL2_PATH):
        model_v2_prod = joblib.load(MODEL2_PATH)
        if os.path.exists(SCALER2_PATH):
            scaler_v2_prod = joblib.load(SCALER2_PATH)
        if os.path.exists(METADATA2_PATH):
            with open(METADATA2_PATH, "r", encoding="utf-8") as file:
                metadata_v2_prod = json.load(file)
        print("[STARTUP] Model 2 (Productivity Score) loaded successfully.")
    else:
        print("[STARTUP WARN] Model 2 artifact not found.")
except Exception as error:
    print(f"[STARTUP ERROR] Failed to load Model 2: {error}")
    model_v2_prod = None
    scaler_v2_prod = None
    metadata_v2_prod = {}

# --- 3. Load Model 3 V2 (Recommendation Engine) ---
try:
    if os.path.exists(MODEL3_V2_PATH):
        model_v3 = joblib.load(MODEL3_V2_PATH)

        if os.path.exists(SCALER3_V2_PATH):
            scaler_v3 = joblib.load(SCALER3_V2_PATH)

        if os.path.exists(METADATA3_V2_PATH):
            with open(METADATA3_V2_PATH, "r", encoding="utf-8") as file:
                metadata_v3 = json.load(file)
            model3_feature_names = metadata_v3.get("features", [])

        if not model3_feature_names:
            model3_feature_names = [
                "productivity_score", "focus_score", "study_hours", "xp", "level",
                "streak_days", "completed_tasks", "pending_tasks", "coding_hours",
                "reading_hours", "revision_hours", "quiz_score", "productive_minutes",
                "distraction_minutes", "idle_minutes", "sleep_hours", "skill_progress",
                "deadline_completion_rate", "focus_sessions", "average_session_minutes"
            ]

        print("[STARTUP] Model 3 V2 (Recommendation Engine) loaded successfully.")
        print(f"          Type: {metadata_v3.get('model_name', 'Random Forest')}")
        print(f"          Features: {len(model3_feature_names)}")
    else:
        print("[STARTUP WARN] Model 3 V2 artifact not found.")
except Exception as error:
    print(f"[STARTUP ERROR] Failed to load Model 3 V2: {error}")
    model_v3 = None
    scaler_v3 = None
    metadata_v3 = {}
    model3_feature_names = []


# ==========================================================
# HOME & HEALTH ENDPOINTS
# ==========================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "EduPulse AI ML Service Running",
        "service": "EduPulse AI ML Service",
        "version": "1.0.0"
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy" if (model is not None or model_v3 is not None) else "unhealthy",
        "service": "EduPulse AI ML Service",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "model": metadata.get("model", "Procrastination Classifier"),
        "models": {
            "model_1": {
                "name": "Procrastination Risk",
                "status": "loaded" if model is not None else "not_loaded"
            },
            "model_2": {
                "name": "Productivity Score",
                "status": "loaded" if model_v2_prod is not None else "not_loaded"
            },
            "model_3": {
                "name": "Recommendation Engine",
                "status": "loaded" if model_v3 is not None else "not_loaded",
                "model_version": "v2",
                "model_type": metadata_v3.get("model_name", "Random Forest")
            }
        }
    })


# ==========================================================
# PREDICT PROCRASTINATION RISK (MODEL 1)
# ==========================================================

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None or scaler is None:
            return jsonify({
                "success": False,
                "message": "ML model is not available"
            }), 503

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "JSON request body is required"
            }), 400

        missing_features = [
            feature
            for feature in MODEL1_FEATURE_NAMES
            if feature not in data
        ]

        if missing_features:
            return jsonify({
                "success": False,
                "message": "Missing required features",
                "missing_features": missing_features
            }), 400

        feature_values = [
            float(data[feature])
            for feature in MODEL1_FEATURE_NAMES
        ]

        input_data = np.array(
            [feature_values],
            dtype=float
        )

        scaled_data = scaler.transform(input_data)

        prediction = int(model.predict(scaled_data)[0])

        probability = float(
            model.predict_proba(scaled_data)[0][1]
        )

        if probability < 0.35:
            risk_level = "Low"
        elif probability < 0.65:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        return jsonify({
            "success": True,
            "prediction": prediction,
            "is_procrastinator": bool(prediction),
            "probability": round(probability, 4),
            "risk_level": risk_level,
            "model": metadata.get("model")
        })

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "All feature values must be numeric"
        }), 400

    except Exception as error:
        print(f"Prediction Error: {error}")

        return jsonify({
            "success": False,
            "message": "Prediction failed"
        }), 500


# ==========================================================
# PREDICT PRODUCTIVITY SCORE (MODEL 2)
# ==========================================================

@app.route("/predict/productivity", methods=["POST"])
def predict_productivity():
    try:
        if model_v2_prod is None:
            return jsonify({
                "success": False,
                "message": "Productivity ML model is not available"
            }), 503

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "JSON request body is required"
            }), 400

        m2_features = metadata_v2_prod.get("feature_names") or metadata_v2_prod.get("features", [])
        if not m2_features:
            m2_features = [
                "study_hours_per_day", "focus_session_minutes", "productive_minutes",
                "distraction_minutes", "idle_time_minutes", "completed_tasks",
                "pending_tasks", "deadline_completion_rate", "coding_hours",
                "reading_hours", "revision_hours", "quiz_score", "practice_questions",
                "sleep_hours", "break_frequency", "focus_score", "xp_earned",
                "current_level", "streak_days", "skills_completed"
            ]

        missing_features = [f for f in m2_features if f not in data]
        if missing_features:
            return jsonify({
                "success": False,
                "message": "Missing required features",
                "missing_features": missing_features
            }), 400

        input_dict = {f: [float(data[f])] for f in m2_features}
        input_df = pd.DataFrame(input_dict, columns=m2_features)

        if scaler_v2_prod is not None:
            scaled_array = scaler_v2_prod.transform(input_df)
            input_df = pd.DataFrame(scaled_array, columns=m2_features)

        prediction = float(model_v2_prod.predict(input_df)[0])

        return jsonify({
            "success": True,
            "productivity_score": round(prediction, 2),
            "model": metadata_v2_prod.get("model_name", "Productivity Predictor")
        })

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "All feature values must be numeric"
        }), 400

    except Exception as error:
        print(f"Productivity Prediction Error: {error}")
        return jsonify({
            "success": False,
            "message": "Productivity prediction failed"
        }), 500


# ==========================================================
# PREDICT RECOMMENDATION (MODEL 3 V2)
# ==========================================================

@app.route("/predict/recommendation", methods=["POST"])
@app.route("/recommendation", methods=["POST"])
def predict_recommendation():
    try:
        if model_v3 is None:
            return jsonify({
                "success": False,
                "message": "Recommendation ML model is not available"
            }), 503

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "JSON request body is required"
            }), 400

        # Validate feature presence against exact metadata feature list
        missing_features = [
            feature
            for feature in model3_feature_names
            if feature not in data
        ]

        if missing_features:
            return jsonify({
                "success": False,
                "message": "Missing required features",
                "missing_features": missing_features
            }), 400

        # Construct 1-row DataFrame with exact feature names and order
        input_dict = {
            feature: [float(data[feature])]
            for feature in model3_feature_names
        }
        input_df = pd.DataFrame(input_dict, columns=model3_feature_names)

        # Predict target class (Random Forest trained directly on raw numerical features)
        pred_class = int(model_v3.predict(input_df)[0])

        if hasattr(model_v3, "predict_proba"):
            probabilities = model_v3.predict_proba(input_df)[0]
            confidence = float(np.max(probabilities))
        else:
            confidence = 1.0

        recommendation_str = MODEL3_CLASS_MAPPING.get(pred_class, "Unknown")

        return jsonify({
            "success": True,
            "recommendation_class": pred_class,
            "recommendation": recommendation_str,
            "confidence": round(confidence, 4),
            "model_type": metadata_v3.get("model_name", "Random Forest"),
            "model_version": "v2"
        })

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "All feature values must be numeric"
        }), 400

    except Exception as error:
        print(f"Recommendation Prediction Error: {error}")
        return jsonify({
            "success": False,
            "message": "Recommendation prediction failed"
        }), 500


# ==========================================================
# START SERVER
# ==========================================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=8000,
        debug=False
    )