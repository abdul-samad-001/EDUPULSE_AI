# pyrefly: ignore [missing-import]
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "EduPulse AI ML Service Running"
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "EduPulse AI ML Service",
        "version": "1.0.0"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)