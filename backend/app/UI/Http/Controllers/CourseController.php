<?php

declare(strict_types=1);

namespace App\UI\Http\Controllers;

use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
