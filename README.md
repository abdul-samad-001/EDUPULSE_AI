# 🤖 EduPulse AI — AI-Powered Personalized Learning & Productivity Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-ML%20Service-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-ML%20API-black?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![scikit--learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

> **EduPulse AI** is a full-stack AI-powered personalized learning and productivity platform that combines learner telemetry, machine learning, AI-generated learning plans, focus tracking, and adaptive recommendations to help students learn more effectively and reduce procrastination.

---

# 📌 Table of Contents

- [Overview](#overview)
- [Key Highlights](#key-highlights)
- [System Architecture](#system-architecture)
- [Machine Learning System](#machine-learning-system)
- [ML Feature Contract](#ml-feature-contract)
- [Recommendation Classes](#recommendation-classes)
- [Closed-Loop AI Architecture](#closed-loop-ai-architecture)
- [Features](#features)
- [AI Coach](#ai-coach)
- [Telemetry System](#telemetry-system)
- [Recommendation Lifecycle](#recommendation-lifecycle)
- [Security](#security)
- [Research & Evaluation](#research--evaluation)
- [Testing & Verification](#testing--verification)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Research Scope](#research-scope)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

# 🎯 Overview

EduPulse AI is designed as an intelligent learning companion for students.

Instead of simply tracking tasks and study time, the platform continuously analyzes learner activity and uses machine learning to provide personalized guidance.

The system combines:

- Academic skill tracking
- Task and milestone management
- AI-generated learning roadmaps
- Focus-session tracking
- Coding-focused study sessions
- Browser/learning telemetry
- Procrastination risk detection
- Productivity prediction
- Personalized learning recommendations
- AI Coach
- Recommendation action tracking
- Automatic ML refresh
- Behavioral analytics

The core idea is to create a closed-loop learning system:

```text
Learner Activity
       ↓
Telemetry Collection
       ↓
Feature Extraction
       ↓
Machine Learning Models
       ↓
Personalized Recommendation
       ↓
AI Coach
       ↓
Learner Action
       ↓
New Telemetry
       ↓
Updated ML Prediction
