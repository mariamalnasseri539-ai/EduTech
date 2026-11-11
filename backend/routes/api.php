<?php

declare(strict_types=1);

use App\UI\Http\Controllers\AdminDashboardController;
use App\UI\Http\Controllers\AssessmentController;
use App\UI\Http\Controllers\AuthController;
use App\UI\Http\Controllers\CourseController;
use App\UI\Http\Controllers\LessonController;
use App\UI\Http\Controllers\PromptController;
use App\UI\Http\Middleware\CheckAdminRole;
use App\UI\Http\Middleware\FirebaseAuthMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Adaptive Learning Platform API Routes (Zero-Content Architecture)
|--------------------------------------------------------------------------
*/

Route::middleware([FirebaseAuthMiddleware::class])->group(function () {
    // Identity & Firebase Profile Sync
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/sync-user', [AuthController::class, 'syncUser']);

    // Courses & Syllabi (Topic DAGs)
    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::delete('/courses/{courseId}', [CourseController::class, 'destroy']);
    Route::get('/courses/{courseId}', [CourseController::class, 'show']);
    Route::get('/courses/{courseId}/knowledge-state', [CourseController::class, 'knowledgeState']);

    // Prompt Engineering Templates (4 Categories stored in Cloud Firestore)
    Route::get('/prompts', [PromptController::class, 'index']);
    Route::post('/prompts', [PromptController::class, 'store']);
    Route::get('/prompts/active/{category}', [PromptController::class, 'getActive']);
    Route::get('/prompts/{id}', [PromptController::class, 'show']);
    Route::post('/prompts/{id}/toggle', [PromptController::class, 'toggleStatus']);
    Route::delete('/prompts/{id}', [PromptController::class, 'destroy']);

    // Placement Diagnostic Tests (AI Dynamic Adaptive Generation via Gemini)
    Route::post('/assessment/placement-test/generate', [AssessmentController::class, 'generatePlacementTest']);
    Route::post('/assessment/placement-test/evaluate', [AssessmentController::class, 'evaluatePlacementTest']);

    // Adaptive Zero-Content Lesson Generation & Q&A
    Route::post('/lessons/request', [LessonController::class, 'requestLesson']);
    Route::post('/lessons/ask-assistant', [LessonController::class, 'askAssistant']);

    // Formative Assessment & Automated Code Challenge Evaluation
    Route::post('/assessment/quiz', [AssessmentController::class, 'submitQuiz']);
    Route::post('/assessment/code', [AssessmentController::class, 'submitCode']);

    // Admin & Pedagogical Oversight
    Route::middleware([CheckAdminRole::class])->prefix('admin')->group(function () {
        Route::get('/topic-maps', [AdminDashboardController::class, 'topicMaps']);
        Route::get('/cohort/{courseId}', [AdminDashboardController::class, 'cohortAnalytics']);
        Route::get('/telemetry', [AdminDashboardController::class, 'aiTelemetry']);
    });
});
