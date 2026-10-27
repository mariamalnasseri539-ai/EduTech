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
│   │   ├── components/       # AuthCardLayout, LoadingScreen, Navbar, Theme, common/PlatformLogo
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

## 🛡️ 5. Brand Identity & Interactive Logo Component (شعار المنصة التفاعلي)

The platform includes a built-in, vector-based interactive SVG logo component located at:
`frontend/src/components/common/PlatformLogo.tsx`

### Semantic Rules & Features:
1. **Faceless Silhouette (شخص بدون ملامح نهائياً):**
   - The student figure is rendered in a modern flat silhouette style with **zero facial features** (no eyes, no nose, no mouth) conforming strictly to Islamic etiquette.
2. **Seamless Anatomy (اتصال الرأس والرقبة والجسد):**
   - The head, neck, and shoulders are continuously connected without any gaps.
3. **Circular Frame Masking (`clipPath`):**
   - The illustration is masked within a circular boundary so no parts protrude awkwardly outside the badge.
4. **Interactive SVG Props:**
   - Supports dynamic sizing (`size`), extra classes (`className`), and optional brand typography (`showText`).

### Component Props:
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `48` | Dimension (width & height in px) |
| `className` | `string` | `""` | Additional Tailwind CSS classes |
| `showText` | `boolean` | `false` | When true, renders "AdaptiveLearn AI EDTECH" alongside badge |

### Usage Examples for Team Members:
```tsx
import { PlatformLogo } from '../components/common/PlatformLogo';

// 1. Basic Badge in headers & navbars:
<PlatformLogo size={42} />

// 2. Large Hero / Splash / Loading screen:
<PlatformLogo size={96} className="shadow-xl" />

// 3. With Brand Typography:
<PlatformLogo size={48} showText={true} />
```

### Full Component Source Code (`PlatformLogo.tsx`):
```tsx
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const PlatformLogo: React.FC<LogoProps> = ({
  className = "",
  size = 48,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        width={size}
        height={size}
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Circular Clip Path so nothing protrudes outside the badge */}
          <clipPath id="logo-circle-clip">
            <circle cx="400" cy="400" r="378" />
          </clipPath>
        </defs>

        {/* Base Background Circle */}
        <circle cx="400" cy="400" r="380" fill="#111111" stroke="#2F2F2F" strokeWidth="8" />

        {/* Group clipped strictly inside the circular badge */}
        <g clipPath="url(#logo-circle-clip)">
          {/* Subtle Tech & Data Circuit Rings */}
          <circle cx="400" cy="400" r="350" fill="none" stroke="#2F2F2F" strokeDasharray="6,12" strokeWidth="2" />
          <circle cx="400" cy="400" r="320" fill="none" stroke="#2F2F2F" strokeWidth="1.5" />
          <path d="M 400,20 A 380,380 0 0,1 780,400" fill="none" stroke="#FFCB74" strokeWidth="2" opacity="0.35" />
          <path d="M 400,780 A 380,380 0 0,1 20,400" fill="none" stroke="#FFCB74" strokeWidth="2" opacity="0.35" />
          <circle cx="400" cy="80" r="5" fill="#FFCB74" />
          <circle cx="720" cy="400" r="5" fill="#FFCB74" />

          {/* The Smart Code & Progress Board */}
          <g transform="translate(260, 160)">
            <rect width="360" height="240" rx="20" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="4" />
            <rect x="10" y="10" width="340" height="220" rx="12" fill="#181818" />

            {/* Dashboard Code & Metrics */}
            <path d="M 25,35 L 35,25 L 25,15 M 40,35 L 50,35" fill="none" stroke="#FFCB74" strokeWidth="3" strokeLinecap="round" />
            <line x1="65" y1="25" x2="160" y2="25" stroke="#F6F6F6" strokeDasharray="5,5" strokeWidth="3" opacity="0.5" />
            <line x1="25" y1="60" x2="140" y2="60" stroke="#FFCB74" strokeWidth="4" strokeLinecap="round" />
            <line x1="25" y1="80" x2="110" y2="80" stroke="#F6F6F6" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Progression Graph */}
            <circle cx="280" cy="70" r="14" fill="none" stroke="#FFCB74" strokeWidth="3" />
            <path d="M 180,180 L 220,130 L 260,150 L 320,100" fill="none" stroke="#FFCB74" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="180" cy="180" r="5" fill="#FFCB74" />
            <circle cx="220" cy="130" r="5" fill="#F6F6F6" />
            <circle cx="260" cy="150" r="5" fill="#FFCB74" />
            <circle cx="320" cy="100" r="7" fill="#FFCB74" />
          </g>

          {/* AI Tutor Robot with Teaching Stick */}
          <g id="tutor-robot">
            <ellipse cx="620" cy="560" rx="28" ry="10" fill="#FFCB74" opacity="0.4" />
            <path d="M 590,555 L 620,585 L 650,555 Z" fill="#FFCB74" opacity="0.8" />

            {/* Pointing Arm & Teacher Stick */}
            <path d="M 570,440 Q 470,410 440,380" fill="none" stroke="#2F2F2F" strokeWidth="14" strokeLinecap="round" />
            <path d="M 570,440 Q 470,410 440,380" fill="none" stroke="#F6F6F6" strokeWidth="8" strokeLinecap="round" />
            <circle cx="440" cy="380" r="9" fill="#2F2F2F" />
            <circle cx="440" cy="380" r="5" fill="#FFCB74" />

            {/* Pointer Stick */}
            <line x1="445" y1="385" x2="330" y2="280" stroke="#FFCB74" strokeWidth="8" strokeLinecap="round" />

            {/* Robot Torso */}
            <path d="M 550,450 C 550,550 690,550 690,450 Z" fill="#F6F6F6" stroke="#2F2F2F" strokeWidth="4" />
            <rect x="580" y="440" width="80" height="80" rx="40" fill="#2F2F2F" />
            <circle cx="620" cy="480" r="14" fill="#FFCB74" />

            {/* Robot Head & Face Screen */}
            <rect x="605" y="385" width="30" height="25" rx="5" fill="#2F2F2F" />
            <rect x="540" y="280" width="160" height="120" rx="60" fill="#F6F6F6" stroke="#2F2F2F" strokeWidth="4" />
            <rect x="560" y="295" width="120" height="80" rx="40" fill="#2F2F2F" />
            <ellipse cx="595" cy="330" rx="14" ry="8" fill="#FFCB74" />
            <ellipse cx="645" cy="330" rx="14" ry="8" fill="#FFCB74" />
            <path d="M 610,355 Q 620,365 630,355" fill="none" stroke="#FFCB74" strokeWidth="4" strokeLinecap="round" />
            <rect x="525" y="320" width="15" height="40" rx="7" fill="#FFCB74" />
            <rect x="700" y="320" width="15" height="40" rx="7" fill="#FFCB74" />
            <line x1="620" y1="280" x2="620" y2="255" stroke="#2F2F2F" strokeWidth="4" />
            <circle cx="620" cy="250" r="8" fill="#FFCB74" />
          </g>

          {/* Young Adult Student (Faceless Silhouette - شخص بدون ملامح متصل انسيابياً بالرقبة والجسد) */}
          <g id="faceless-student">
            {/* Backpack on the left */}
            <path d="M 125,450 Q 85,460 92,600 Q 105,670 145,640 Z" fill="#202020" stroke="#111111" strokeWidth="4" />
            <path d="M 148,460 L 140,580" stroke="#FFCB74" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

            {/* Torso & Hoodie (Seamlessly connected shoulders) */}
            <path
              d="M 120,780 L 120,530 C 120,445 165,420 200,420 L 220,420 C 255,420 300,445 300,530 L 300,780 Z"
              fill="#2A2A2A"
              stroke="#111111"
              strokeWidth="4"
            />
            {/* Hoodie Collar Detail & Golden Accent */}
            <path d="M 180,425 Q 210,470 240,425" fill="#1E1E1E" stroke="#FFCB74" strokeWidth="3" />
            <path d="M 170,540 Q 210,575 250,540" fill="none" stroke="#F6F6F6" strokeWidth="2" opacity="0.4" />

            {/* Continuous Neck (Firmly connects chin to hoodie with NO gaps) */}
            <path
              d="M 194,340 L 194,435 L 226,435 L 226,340 Z"
              fill="#F9C29D"
            />
            {/* Subtle soft jaw shadow for realistic depth */}
            <path d="M 194,360 Q 210,375 226,360 L 226,375 Q 210,388 194,375 Z" fill="#E2A682" opacity="0.5" />

            {/* Arm & Smart Tablet */}
            <path d="M 130,530 Q 170,630 215,630" fill="none" stroke="#252525" strokeWidth="26" strokeLinecap="round" />
            <circle cx="215" cy="630" r="13" fill="#F9C29D" />

            {/* Futuristic Learning Tablet */}
            <g transform="translate(205, 560) rotate(12)">
              <rect width="64" height="92" rx="8" fill="#111111" stroke="#F6F6F6" strokeWidth="3" />
              <rect x="5" y="5" width="54" height="82" rx="5" fill="#202020" />
              <line x1="12" y1="18" x2="42" y2="18" stroke="#FFCB74" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="28" x2="48" y2="28" stroke="#F6F6F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="12" y1="38" x2="36" y2="38" stroke="#F6F6F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M 12,65 L 24,52 L 34,58 L 46,45" fill="none" stroke="#FFCB74" strokeWidth="2" strokeLinecap="round" />
            </g>
            <circle cx="270" cy="610" r="13" fill="#F9C29D" />

            {/* Faceless Head Shape (100% بدون ملامح نهائياً - لا عينين ولا أنف ولا فم) */}
            <ellipse cx="210" cy="320" rx="42" ry="50" fill="#F9C29D" stroke="#111111" strokeWidth="3.5" />

            {/* Modern Hair Silhouette */}
            <path
              d="M 166,310 C 166,230 254,230 254,295 C 248,260 228,245 204,248 C 182,250 172,272 166,310 Z"
              fill="#2B1E16"
              stroke="#111111"
              strokeWidth="2.5"
            />

            {/* Modern EdTech Headphones */}
            <path d="M 162,315 C 162,230 258,230 258,315" fill="none" stroke="#FFCB74" strokeWidth="8" strokeLinecap="round" />
            <rect x="154" y="298" width="14" height="30" rx="7" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="3" />
            <rect x="252" y="298" width="14" height="30" rx="7" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="3" />
          </g>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight text-[#111111] dark:text-[#F6F6F6]">
            Adaptive<span className="text-[#FFCB74]">Learn</span>
          </span>
          <span className="text-xs text-gray-400 font-mono tracking-wider">
            AI EDTECH
          </span>
        </div>
      )}
    </div>
  );
};

export default PlatformLogo;
```

---

## 🚀 6. Quick Start Guide

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

## 🔐 7. Environment & Firebase Setup

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

## 👥 8. Team Workspace Instructions
- **Admin Team:** Implement all administrator interfaces and analytics inside `frontend/src/pages/admin/`.
- **Student Team:** Implement all student learning interfaces inside `frontend/src/pages/student/`.
