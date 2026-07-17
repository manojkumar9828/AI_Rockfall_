# AI-Based Rockfall Prediction and Alert System for Open Pit Mines

A professional, AI-powered rockfall risk monitoring system for open pit mines. The system uses a Convolutional Neural Network (CNN) to classify mine slope images into **Safe**, **Warning**, and **Dangerous** categories and generates automated evacuation alerts.

## Project Description

Rockfall is one of the most critical hazards in open pit mining. This project develops a web-based AI monitoring system that analyzes mine slope photographs using deep learning and provides real-time risk classification with color-coded alerts. The system maintains a prediction history database, generates analytical reports, and includes an admin panel for user and system management.

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| Backend | Python, Flask |
| Machine Learning | TensorFlow/Keras, NumPy, Pandas, OpenCV, Pillow, Scikit-learn |
| Database | SQLite |

## Features

- **Home Page** — Landing page with hero section, about, objectives, features, team, and contact
- **Login System** — Admin and user login with session management and registration
- **Dashboard** — Stat cards (total images, safe/warning/danger predictions, alerts) with charts
- **Image Upload** — Drag-and-drop upload for JPG/JPEG/PNG with live preview
- **AI Prediction** — CNN model classifies images into Safe/Warning/Dangerous with confidence score, risk level, and prediction time
- **Alert System** — Red alert (evacuation), orange warning, green safe with automated messages
- **Alert History** — SQLite storage with search, delete, and CSV export
- **Reports** — Daily, weekly, monthly reports with charts and accuracy statistics
- **Settings** — Confidence threshold, alert sensitivity, theme configuration
- **Admin Panel** — User management, prediction history, reports, system logs
- **Info Pages** — Mine information, emergency contacts, live camera/GPS/weather placeholders
- **Documentation** — Full project documentation (abstract, methodology, UML diagrams, ER diagram, etc.)

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.8 or higher
- pip (Python package manager)

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup (Optional — for CNN model training)

1. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate the trained model** (creates synthetic dataset + trains CNN)
   ```bash
   python model/generate_model.py
   ```

4. **Run the Flask backend**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

## Run Commands Summary

```bash
# Frontend (React + Vite)
npm install
npm run dev        # Development server
npm run build      # Production build
npm run typecheck  # TypeScript checking

# Backend (Python Flask + TensorFlow)
pip install -r requirements.txt
python model/generate_model.py   # Train model (first run only)
python app.py                     # Start Flask server
```

## Folder Structure

```
AI-Rockfall-System/
│
├── app.py                    # Flask application (routes, auth, blueprints)
├── database.py               # SQLite database initialization and helpers
├── requirements.txt          # Python dependencies
├── database.db               # SQLite database (auto-created on first run)
├── README.md                 # This file
│
├── index.html                # Vite HTML entry point
├── package.json              # Node.js dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint configuration
│
├── src/                      # React Frontend
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles (Tailwind + custom)
│   ├── store.tsx             # App state, navbar, footer, types
│   ├── vite-env.d.ts         # Vite type declarations
│   └── pages/                # Page components
│       ├── HomePage.tsx          # Landing page
│       ├── LoginPage.tsx         # Login & registration
│       ├── DashboardPage.tsx     # Dashboard with charts
│       ├── UploadPage.tsx        # Image upload
│       ├── PredictionPage.tsx    # Prediction result
│       ├── HistoryPage.tsx       # Alert history table
│       ├── ReportsPage.tsx       # Report generation
│       ├── SettingsPage.tsx      # System settings
│       ├── AdminPage.tsx         # Admin panel
│       ├── MineInfoPage.tsx      # Mine information
│       ├── EmergencyPage.tsx     # Emergency contacts
│       └── DocumentationPage.tsx # Full project documentation
│
├── model/                    # Machine Learning
│   ├── cnn_model.py          # CNN architecture definition
│   ├── train_model.py        # Training script (real dataset)
│   ├── generate_model.py     # Synthetic data generation + training
│   ├── predict.py            # Prediction/inference utility
│   ├── plot_training.py      # Training accuracy/loss graph plotting
│   ├── rockfall_model.h5     # Trained model (generated)
│   ├── class_names.json      # Class labels (generated)
│   └── training_history.json # Training metrics (generated)
│
├── static/                   # Static assets (Flask backend)
│   ├── css/
│   │   └── style.css         # Dark mining theme styles
│   ├── js/
│   │   └── main.js           # Client-side interactions
│   └── uploads/              # Uploaded images
│
├── templates/                # Jinja2 HTML templates (Flask backend)
│   ├── base.html             # Base layout (navbar, footer)
│   ├── index.html            # Home page
│   ├── login.html            # Login & registration
│   ├── dashboard.html        # Dashboard with charts
│   ├── upload.html           # Image upload
│   ├── prediction.html       # Prediction result
│   ├── history.html          # Alert history table
│   ├── reports.html          # Report generation
│   ├── settings.html         # System settings
│   ├── admin.html            # Admin panel
│   ├── mine_info.html        # Mine information
│   ├── emergency.html        # Emergency contacts
│   ├── documentation.html   # Full project documentation
│   └── error.html            # Error page
│
└── dataset/                  # Training dataset
    ├── Safe/
    ├── Warning/
    └── Dangerous/
```

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (admin/user roles) |
| `predictions` | All prediction records with image, class, confidence, risk |
| `alerts` | Alert records linked to predictions |
| `reports` | Generated report summaries |
| `system_logs` | Audit log of user actions |

## CNN Model Architecture

```
Input (224x224x3)
├── Conv2D(32) + BatchNorm + MaxPool
├── Conv2D(64) + BatchNorm + MaxPool
├── Conv2D(128) + BatchNorm + MaxPool
├── Conv2D(256) + BatchNorm + MaxPool
├── GlobalAveragePooling2D
├── Dropout(0.4)
├── Dense(128, ReLU)
├── Dropout(0.3)
└── Dense(3, Softmax)  →  [Safe, Warning, Dangerous]
```

- **Optimizer:** Adam (lr=1e-3)
- **Loss:** Categorical Crossentropy
- **Image Augmentation:** Rotation, shift, flip, zoom, shear

## Prediction Flow

```
Uploaded Image → Resize 224x224 → Normalize [0,1] → CNN Model
  → Prediction Class → Confidence Score → Risk Level
  → Alert Generation → Save to Database → Display Dashboard
```

## Future Improvements

- Live CCTV camera integration for continuous monitoring
- Drone image capture for inaccessible areas
- SMS and email alert integration
- IoT sensor fusion (vibration, displacement sensors)
- Mobile application for field operators
- Transfer learning with larger real-world datasets

## License

This project is developed as a final-year engineering project. Educational use permitted.
