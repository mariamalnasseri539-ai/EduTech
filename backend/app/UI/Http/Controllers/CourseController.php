<?php

declare(strict_types=1);

namespace App\UI\Http\Controllers;

use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

final class CourseController
{
    public function __construct(
        private readonly CourseRepositoryInterface $courseRepository,
        private readonly KnowledgeStateRepositoryInterface $knowledgeRepository
    ) {}

    public function index(): JsonResponse
    {
        $courses = $this->courseRepository->getAllCourses();
        return response()->json([
            'courses' => $courses,
        ]);
    }

    public function show(string $courseId): JsonResponse
    {
        $course = $this->courseRepository->getCourse($courseId);
        if ($course === null) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        return response()->json([
            'course' => $course,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
            'level' => ['nullable', 'string'],
            'estimated_hours' => ['nullable', 'numeric'],
            'placement_test_questions_count' => ['nullable', 'integer', 'min:3', 'max:30'],
            'topic_map' => ['nullable', 'array'],
            'topics' => ['nullable', 'array'],
        ]);

        try {
            $saved = $this->courseRepository->saveCourse($validated);
            return response()->json([
                'message' => 'تم حفظ المقرر وشجرة المفاهيم في الفايربيس بنجاح.',
                'course' => $saved,
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل حفظ المقرر في الفايربيس: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $courseId): JsonResponse
    {
        try {
            $this->courseRepository->deleteCourse($courseId);
            return response()->json([
                'message' => 'تم حذف المقرر بنجاح.',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل حذف المقرر: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function knowledgeState(Request $request, string $courseId): JsonResponse
    {
        $studentId = (string)$request->attributes->get('student_id', 'stu_101');
        $state = $this->knowledgeRepository->findByStudentAndCourse($studentId, $courseId);

        if ($state === null) {
            $topicMap = $this->courseRepository->getTopicMap($courseId);
            $state = new StudentKnowledgeState(
                studentId: $studentId,
                courseId: $courseId
            );
            $state->recomputeZPD($topicMap);
            $this->knowledgeRepository->save($state);
        }

        return response()->json([
            'knowledge_state' => $state->toFirestore(),
        ]);
    }
}
