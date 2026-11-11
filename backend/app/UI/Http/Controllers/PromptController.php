<?php

declare(strict_types=1);

namespace App\UI\Http\Controllers;

use App\Domain\Learning\Repositories\PromptTemplateRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

final class PromptController
{
    public function __construct(
        private readonly PromptTemplateRepositoryInterface $promptRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $prompts = $this->promptRepository->getAllPrompts(is_string($category) ? $category : null);

        return response()->json([
            'prompts' => $prompts,
            'total' => count($prompts),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $prompt = $this->promptRepository->getPrompt($id);
        if ($prompt === null) {
            return response()->json(['error' => 'الأمر المطلوب غير موجود في قاعدة البيانات.'], 404);
        }

        return response()->json([
            'prompt' => $prompt,
        ]);
    }

    public function getActive(string $category, Request $request): JsonResponse
    {
        $courseId = $request->query('course_id');
        $prompt = $this->promptRepository->getActivePrompt($category, is_string($courseId) ? $courseId : null);

        if ($prompt === null) {
            return response()->json(['error' => 'لا يوجد أمر مفعل لهذا القسم.'], 404);
        }

        return response()->json([
            'prompt' => $prompt,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:placement_test,static_slides,interactive_code,micro_quiz'],
            'target_course_id' => ['nullable', 'string'],
            'target_course_title' => ['nullable', 'string'],
            'system_prompt' => ['required', 'string'],
            'user_prompt_template' => ['required', 'string'],
            'variables' => ['nullable', 'array'],
            'model' => ['nullable', 'string'],
            'temperature' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'max_tokens' => ['nullable', 'integer', 'min:256', 'max:8192'],
            'is_active' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        try {
            $saved = $this->promptRepository->savePrompt($validated);

            return response()->json([
                'message' => 'تم حفظ وتحديث قالب الأمر في الفايربيس بنجاح.',
                'prompt' => $saved,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل حفظ الأمر في الفايربيس: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function toggleStatus(string $id): JsonResponse
    {
        $prompt = $this->promptRepository->getPrompt($id);
        if ($prompt === null) {
            return response()->json(['error' => 'الأمر غير موجود.'], 404);
        }

        $nextStatus = !($prompt['is_active'] ?? true);
        $prompt['is_active'] = $nextStatus;

        try {
            $saved = $this->promptRepository->savePrompt($prompt);
            return response()->json([
                'message' => $nextStatus ? 'تم تفعيل الأمر بنجاح.' : 'تم إيقاف تفعيل الأمر بنجاح.',
                'prompt' => $saved,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل تعديل حالة الأمر: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->promptRepository->deletePrompt($id);
            return response()->json([
                'message' => 'تم حذف الأمر نهائياً من الفايربيس بنجاح.',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل حذف الأمر من الفايربيس: ' . $e->getMessage(),
            ], 500);
        }
    }
}
