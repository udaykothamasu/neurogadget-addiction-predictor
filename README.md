# NeuroGadget: Student Addiction Predictor

**NeuroGadget** is an advanced web application designed to assess smartphone addiction risks among adolescents. By leveraging **Deep Learning (TensorFlow.js)** for quantitative scoring and a **Rule-Based Expert System** for qualitative insights, it provides a comprehensive, offline-first analysis of how digital habits impact academic performance and mental well-being.

## 🚀 Key Features

### 1. 🧠 Deep Learning Assessment
- **Client-Side Inference**: Uses a Neural Network built with **TensorFlow.js** running entirely in the browser.
- **Predictive Scoring**: Calculates a precise "Addiction Score" (0-100) based on 19 data points, including:
  - **Behavioral Metrics**: Daily usage, phone checks, gaming hours, bedtime screen time.
  - **Psychological Factors**: Anxiety, depression, self-esteem, family communication.
  - **Personality Traits**: The "Big 5" traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).
- **Auto-Training**: The model automatically trains itself on a synthetic dataset of 600 student profiles upon application load.

### 2. ⚡ Offline Expert Insights
- **Privacy-First Analysis**: No data is sent to external servers. All processing happens locally on your device.
- **Heuristic Logic Engine**: Replaces external LLMs with a robust algorithm based on psychological research to generate:
  - **Academic Forecasts**: Predicting potential impact on grades based on usage patterns.
  - **Risk Factors**: Identifying specific triggers (e.g., "High Neuroticism + Social Media usage").
  - **Actionable Recommendations**: Tailored strategies for digital balance (e.g., Pomodoro technique, Blue light reduction).
- **Digital Wellness Coach**: An integrated offline chatbot that provides instant advice on sleep, focus, and stress management.

### 3. 📊 Real-Time Monitoring Dashboard
- **Longitudinal Tracking**: Visualizes trends in addiction scores over 30 days.
- **Live Simulation**: A "Live Mode" that simulates real-time data ingestion to demonstrate how the model reacts to fluctuating daily habits (e.g., increased anxiety or usage spikes).
- **Risk Alerts**: Automatically flags high-risk events when thresholds are crossed.

### 4. 🎨 Interactive UI
- **Multi-Step Survey**: A user-friendly, accessible form for data collection.
- **Data Visualization**: Rich charts (Recharts) displaying psychological profiles, usage correlations, and risk distribution.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on mobile and desktop.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Machine Learning**: TensorFlow.js (`@tensorflow/tfjs`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build**: ES Modules (via ESM.sh)

## 📂 Project Structure

```
├── index.html              # Entry point & Import Maps
├── index.tsx               # React Root
├── App.tsx                 # Main Application Logic
├── types.ts                # TypeScript Interfaces
├── services/
│   ├── dlModel.ts          # TensorFlow.js Model (Training & Prediction)
│   ├── geminiService.ts    # Logic Engine (Formerly GenAI)
│   └── dataset.ts          # Synthetic Data Generation
└── components/
    ├── Hero.tsx            # Landing Page
    ├── SurveyForm.tsx      # Data Collection Form
    ├── ResultsView.tsx     # Analysis Display
    ├── MonitoringDashboard.tsx # Live Trends & Alerts
    └── ChatBot.tsx         # Offline Assistant
```

## ⚡ How It Works

1.  **Initialization**: When the app loads, it generates a synthetic dataset based on research correlations (e.g., high neuroticism correlates with higher addiction risk) and trains a regression Neural Network in the background.
2.  **Assessment**: The user fills out the behavioral and psychological survey.
3.  **Prediction**: The trained TF.js model predicts a raw addiction score (0-100).
4.  **Analysis**: The app runs the profile through a logic engine to map the score and traits to specific academic risks and recommendations.
5.  **Monitoring**: Users can switch to the Dashboard view to see how hypothetical changes in behavior affect the risk score over time.

## 📝 Setup

This project uses **ES Modules** via CDN imports in `index.html`. No complex bundler setup is required.

**Requirements:**
- A modern web browser.
- No API Key is required.

## 📄 License

This project is open-source and available for educational and research purposes.