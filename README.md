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

## 🎨 3. Design System & Theme Guidelines (نظام التصميم والألوان)

### Color Palette (لوحة الألوان المعتمدة)
The platform follows a strict, high-contrast, modern aesthetic:

| Role / Element | HEX Code | Tailwind Token | Light Mode Usage | Dark Mode Usage |
|---|---|---|---|---|
| **Primary Accent / Gold** | `#FFCB74` | `text-[#FFCB74]`, `bg-[#FFCB74]` | Highlights, Buttons, Active Badges | Highlights, Action Buttons, Golden Glow |
| **Pitch Black / Dark Surface** | `#111111` | `bg-[#111111]`, `dark:bg-[#111111]` | Primary dark text, deep accents | Main dark background (`body`) |
| **Charcoal / Elevation Card** | `#2F2F2F` | `bg-[#2F2F2F]`, `dark:bg-[#2F2F2F]` | Secondary borders, dark cards | Elevated cards, dialogs, form inputs |
| **Off-White / Soft Surface** | `#F6F6F6` | `bg-[#F6F6F6]`, `dark:bg-[#111111]` | Main light background (`body`) | - |
| **Pure White** | `#FFFFFF` | `bg-white`, `dark:bg-[#2F2F2F]` | Cards, inputs, dialog containers | Text in dark mode, pure highlights |

### Dark & Light Mode Implementation (آلية تبديل الثيم)
- **Theme Provider:** `frontend/src/context/ThemeContext.tsx`
  - Provides `theme` (`'dark' | 'light'`) and `toggleTheme()`.
  - Toggles the `.dark` class directly on the root `<html>` element.
  - Automatically remembers the user's choice in browser `localStorage`.
- **Styling Best Practices for Team Members:**
  Use Tailwind's `dark:` modifier on every visual element:
  ```tsx
  // Background and Card containers:
  className="bg-[#F6F6F6] dark:bg-[#111111]"
  className="bg-white dark:bg-[#2F2F2F] border border-slate-200 dark:border-[#3d3d3d]"

  // Text colors:
  className="text-slate-900 dark:text-white"
  className="text-slate-600 dark:text-slate-400"

  // Primary buttons & highlights:
  className="bg-[#FFCB74] text-[#111111] hover:bg-[#ffd387]"
  ```

---

## ✍️ 4. Typography & Fonts (الخطوط والطباعة)

The application embeds three specialized font families imported from Google Fonts:

| Font Family | Primary Usage | Supported Weights | Implementation |
|---|---|---|---|
| **Cairo (كايرو)** | الخط العربي الأساسي لجميع العناوين والنصوص والأزرار | `400, 500, 600, 700, 800, 900` | Google Fonts (Cairo) |
| **Inter** | Primary Latin/English typography for international UI | `300, 400, 500, 600, 700, 800` | Google Fonts (Inter) |
| **Fira Code** | Monospace typography for code snippets, tokens, and IDs | `400, 500, 600` | Google Fonts (Fira Code) |

- **Font Import:** Configured in `frontend/index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
  ```
- **Default Font Stack:** `font-sans` defaults to `'Cairo', 'Inter', sans-serif`.

---

## 🚀 5. Quick Start Guide

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

## 🔐 6. Environment & Firebase Setup

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

## 👥 7. Team Workspace Instructions
- **Admin Team:** Implement all administrator interfaces and analytics inside `frontend/src/pages/admin/`.
- **Student Team:** Implement all student learning interfaces inside `frontend/src/pages/student/`.
