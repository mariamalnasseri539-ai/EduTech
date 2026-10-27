# Personalized Student-Centered Adaptive Learning Platform Powered by Generative AI
## Based on Strict Zero-Content Cloud Architecture & Domain-Driven Design (DDD)

---

## 1. System Overview & Core Architectural Paradigm

This platform is an enterprise-grade adaptive learning ecosystem implementing a **Zero-Content Cloud Architecture**:
- **Zero-Content Invariant:** The database **MUST NOT** store pre-authored educational lessons or static explanations.
- **Dynamic On-the-Fly Synthesis:** All lesson cards, interactive explanations, code challenges, and assessment questions are synthesized dynamically by **Google Gemini 1.5** based on the student's real-time **Knowledge State** (Bayesian mastery scores, inferred misconceptions, and Zone of Proximal Development - ZPD).
- **Cloud Firestore Storage Constraints:** Cloud Firestore stores exclusively:
  1. Student Identity (`students/{firebaseUid}`)
  2. Approved Course Syllabi & Topic Maps (`courses/{courseId}`)
  3. Mastery Indicators & Diagnostic Misconceptions (`knowledge_states/{studentId}_{courseId}`)
  4. Attempt & Submission Logs (`attempts/{attemptId}`)

---

## 2. Bounded Contexts & Domain-Driven Design (DDD)

```text
app/
├── Domain/
│   ├── Learning/
│   │   ├── Entities/ (Lesson, ExplanationCard, Question)
│   │   ├── ValueObjects/ (TopicId, DifficultyLevel, BloomTaxonomyLevel)
│   │   ├── Repositories/ (CourseRepositoryInterface, LessonRepositoryInterface)
│   │   └── Services/ (PromptBuilderService)
│   ├── KnowledgeState/
│   │   ├── Entities/ (StudentKnowledgeState, SkillScore, WeaknessPoint)
│   │   ├── Enums/ (CognitiveStatus: Unassessed, ActiveLearning, Assessing, GuidedReview, Mastered)
│   │   └── Repositories/ (KnowledgeStateRepositoryInterface)
│   ├── Assessment/
│   │   ├── Entities/ (ChallengeAttempt, CodeSubmission)
│   │   └── Repositories/ (AttemptRepositoryInterface)
│   └── Identity/
│       ├── Entities/ (Student, Admin)
│       └── Repositories/ (StudentRepositoryInterface)
│
├── Application/
│   ├── UseCases/
│   │   ├── Learning/
│   │   │   ├── RequestAdaptiveLessonUseCase.php
│   │   │   └── AskSmartAssistantUseCase.php
│   │   ├── Assessment/
│   │   │   ├── SubmitQuizAnswerUseCase.php
│   │   │   └── VerifyCodeChallengeUseCase.php
│   │   └── Knowledge/
│   │       ├── InitializePlacementTestUseCase.php
│   │       └── UpdateKnowledgeStateUseCase.php
│   └── DTOs/
│       ├── LessonCardDTO.php
│       ├── QuizAttemptDTO.php
│       ├── CodeVerificationResultDTO.php
│       └── AdaptiveLessonResponseDTO.php
│
├── Infrastructure/
│   ├── AI/
│   │   ├── GeminiApiClient.php (Structured output mode, Temperature = 0.2)
│   │   └── PromptTemplates/ (GuidedSystemPrompt.php)
│   ├── Validation/
│   │   ├── JSONValidatorService.php (Draft 2020-12 validator with silent self-healing retry)
│   │   └── Schemas/ (adaptive_lesson_schema_2020_12.json, code_evaluation_schema_2020_12.json)
│   ├── Persistence/Firebase/
│   │   ├── FirebaseClient.php
│   │   └── Repositories/ (FirestoreStudentRepo, FirestoreKnowledgeRepo, FirestoreCourseRepo, FirestoreAttemptRepo, CacheLessonRepository)
│   └── ExternalServices/
│       └── TextToSpeechService.php
│
└── UI/Http/
    ├── Controllers/ (AuthController, CourseController, LessonController, AssessmentController, AdminDashboardController)
    ├── Requests/ (RequestLessonRequest, SubmitCodeRequest, SubmitQuizRequest)
    └── Middleware/ (FirebaseAuthMiddleware, CheckAdminRole)
```

---

## 3. Tech Stack & Integration Contracts

- **Backend:** Laravel 11 / PHP 8.2+ strictly organized with Domain-Driven Design and Clean Architecture.
- **Database & Identity:** Cloud Firestore & Firebase Auth via `kreait/laravel-firebase`.
- **AI Engine:** Google Gemini 1.5 API in structured JSON mode (`temperature: 0.2`) with API keys hidden securely server-side.
- **Output Validation:** JSON Schema Draft 2020-12 with automated, silent self-healing retry logic.
- **Frontend:** React 18, TypeScript, TailwindCSS, Monaco/CodeMirror code editor, native Web Speech API Text-to-Speech (TTS).

---

## 4. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/me` | Fetch authenticated student profile |
| `GET` | `/api/courses` | List syllabus topic DAGs |
| `GET` | `/api/courses/{id}` | View course syllabus metadata |
| `GET` | `/api/courses/{id}/knowledge-state` | Fetch real-time Bayesian mastery & ZPD |
| `POST` | `/api/lessons/request` | On-demand adaptive lesson synthesis |
| `POST` | `/api/lessons/ask-assistant` | Contextual AI teaching assistant drawer |
| `POST` | `/api/assessment/quiz` | Formative quiz check submission |
| `POST` | `/api/assessment/code` | Automated code challenge evaluation |
| `GET` | `/api/admin/topic-maps` | Curriculum designer syllabus inspection |
| `GET` | `/api/admin/cohort/{id}` | Cohort skill distributions & misconceptions |
| `GET` | `/api/admin/telemetry` | AI synthesis compliance & latency telemetry |

---

## 5. Getting Started

### Backend Setup:
```bash
cd backend
cp .env.example .env
# Configure GEMINI_API_KEY and FIREBASE_CREDENTIALS in .env
composer install
php artisan serve
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the platform.
