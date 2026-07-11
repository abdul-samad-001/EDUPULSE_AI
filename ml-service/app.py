# pyrefly: ignore [missing-import]

from flask import Flask, jsonify, request
from flask_cors import CORS

import joblib
import numpy as np
import json
import os


app = Flask(__name__)
CORS(app)


# ==========================================================
# MODEL CONFIGURATION
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")
METADATA_PATH = os.path.join(
    BASE_DIR,
    "models",
    "model_metadata.json"
)


FEATURE_NAMES = [
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


# ==========================================================
# LOAD MODEL
# ==========================================================

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    with open(METADATA_PATH, "r") as file:
        metadata = json.load(file)

    print("ML Model Loaded Successfully")
    print(f"Model: {metadata.get('model')}")

except Exception as error:
    print(f"Failed to load ML model: {error}")

    model = None
    scaler = None
    metadata = {}


# ==========================================================
# HOME
# ==========================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "EduPulse AI ML Service Running"
    })


# ==========================================================
# HEALTH
# ==========================================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy" if model is not None else "unhealthy",
        "service": "EduPulse AI ML Service",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "model": metadata.get("model")
    })


# ==========================================================
# PREDICT PROCRASTINATION RISK
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
            for feature in FEATURE_NAMES
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
            for feature in FEATURE_NAMES
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
# START SERVER
# ==========================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )