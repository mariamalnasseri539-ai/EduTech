# إديوتك | EduTech
## Personalized Adaptive Learning Platform Powered by Generative AI
### Clean Architecture, Domain-Driven Design (DDD) & Zero-Content Cloud Architecture

---

## 📌 1. Project Overview
**EduTech (إديوتك)** is an enterprise-grade adaptive learning platform designed for real-time, student-centered education.
- **Backend:** Laravel 11 (PHP 8.2+) structured using strict Domain-Driven Design (DDD) principles.
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite.
- **Identity & Database:** Firebase Authentication & Google Cloud Firestore.
- **AI Synthesis Engine:** Google Gemini 1.5 API for dynamic, on-the-fly instructional generation.

---

## 🗂️ 2. Repository Structure

```text
EduTech/
├── backend/                  # Laravel 11 DDD Architecture
│   ├── app/
│   │   ├── Domain/           # Core Entities, Value Objects, Repository Interfaces
│   │   │   ├── Identity/     # Student & Admin Entities
│   │   │   ├── KnowledgeState/# Bayesian mastery scores & ZPD state
│   │   │   ├── Learning/     # Course & Topic contracts
│   │   │   └── Assessment/   # Challenge attempts & submissions
│   │   ├── Application/      # Use Cases & DTOs
│   │   ├── Infrastructure/   # Firebase Client, Gemini AI Client, JSON Validator
│   │   └── UI/Http/          # API Controllers & Firebase Auth Middleware
│   ├── config/               # App, Firebase, Gemini configuration
│   └── routes/api.php        # API Endpoints
│
├── frontend/                 # React 18 (TypeScript + Tailwind CSS + Vite)
│   ├── src/
│   │   ├── components/       # AuthCardLayout, LoadingScreen, Navbar, Theme
│   │   ├── context/          # AuthContext, ThemeContext
│   │   ├── services/         # firebaseConfig (Auth & Firestore), apiClient (Axios Bearer interceptor)
│   │   └── pages/
│   │       ├── auth/         # Creative LoginPage & RegisterPage
│   │       ├── WelcomePage.tsx # Clean Post-Login Landing Page
│   │       ├── admin/        # 🛠️ Team Workspace for Admin Interfaces
│   │       │   └── AdminDashboard.tsx
│   │       └── student/      # 🛠️ Team Workspace for Student Interfaces
│   │           └── StudentDashboard.tsx
│
├── run.bat                   # 1-Click Windows Launcher for both Frontend & Backend
├── start.ps1                 # PowerShell Launcher
└── package.json              # Root project dependencies & scripts
```

---

## 🚀 3. Quick Start Guide

### Prerequisites
- PHP 8.2+ with `curl`, `mbstring`, `openssl`, `sodium`, and `zip` extensions enabled.
- Node.js 18+ and npm.
- Composer 2+.

### 1-Click Launch (Windows)
Double-click `run.bat` in the project root:
- Starts Laravel Backend on: `http://localhost:8000`
- Starts React Vite Frontend on: `http://localhost:3000`

### Manual Launch
```bash
# Terminal 1: Backend
cd backend
composer install
cp .env.example .env
php artisan serve --port=8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 🔐 4. Environment & Firebase Setup

1. **Backend Firebase Service Account:**
   Place your downloaded Firebase service account JSON key in:
   `backend/storage/app/firebase/firebase-credentials.json`

2. **Frontend Firebase Web Configuration:**
   Create `frontend/.env` based on `frontend/.env.example` and set:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_web_api_key_here
   VITE_FIREBASE_APP_ID=your_firebase_app_id_here
   ```

---

## 👥 5. Team Workspace Instructions
- **Admin Team:** Implement all administrator interfaces and analytics inside `frontend/src/pages/admin/`.
- **Student Team:** Implement all student learning interfaces inside `frontend/src/pages/student/`.
