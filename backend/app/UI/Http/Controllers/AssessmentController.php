<?php

declare(strict_types=1);

namespace App\UI\Http\Controllers;

use App\Application\DTOs\QuizAttemptDTO;
use App\Application\UseCases\Assessment\EvaluatePlacementTestUseCase;
use App\Application\UseCases\Assessment\GeneratePlacementTestUseCase;
use App\Application\UseCases\Assessment\SubmitQuizAnswerUseCase;
use App\Application\UseCases\Assessment\VerifyCodeChallengeUseCase;
use App\UI\Http\Requests\SubmitCodeRequest;
use App\UI\Http\Requests\SubmitQuizRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

final class AssessmentController
{
    public function __construct(
        private readonly SubmitQuizAnswerUseCase $submitQuizAnswerUseCase,
        private readonly VerifyCodeChallengeUseCase $verifyCodeChallengeUseCase,
        private readonly GeneratePlacementTestUseCase $generatePlacementTestUseCase,
        private readonly EvaluatePlacementTestUseCase $evaluatePlacementTestUseCase
    ) {}

    public function generatePlacementTest(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => ['required', 'string'],
        ]);

        $studentId = (string)$request->attributes->get('student_id', 'stu_101');
        $courseId = (string)$request->input('course_id');

        try {
            $test = $this->generatePlacementTestUseCase->execute($studentId, $courseId);
            return response()->json($test);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل توليد امتحان تحديد المستوى: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function evaluatePlacementTest(Request $request): JsonResponse
    {
        $request->validate([
            'test_id' => ['required', 'string'],
            'course_id' => ['required', 'string'],
            'answers' => ['required', 'array'],
        ]);

        $studentId = (string)$request->attributes->get('student_id', 'stu_101');
        $courseId = (string)$request->input('course_id');
        $testId = (string)$request->input('test_id');
        $answers = (array)$request->input('answers');

        try {
            $evaluation = $this->evaluatePlacementTestUseCase->execute(
                studentId: $studentId,
                courseId: $courseId,
                testId: $testId,
                answers: $answers
            );
            return response()->json($evaluation);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'فشل تقييم امتحان تحديد المستوى: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function submitQuiz(SubmitQuizRequest $request): JsonResponse
    {
        $studentId = (string)$request->attributes->get('student_id', 'stu_101');
        $dto = QuizAttemptDTO::fromRequest($request->validated(), $studentId);

        try {
            $result = $this->submitQuizAnswerUseCase->execute($dto);
            return response()->json($result);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Failed to evaluate quiz attempt: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function submitCode(SubmitCodeRequest $request): JsonResponse
    {
        $studentId = (string)$request->attributes->get('student_id', 'stu_101');
        $validated = $request->validated();

        try {
            $result = $this->verifyCodeChallengeUseCase->execute(
                studentId: $studentId,
                courseId: (string)$validated['course_id'],
                lessonId: (string)$validated['lesson_id'],
                topicId: (string)$validated['topic_id'],
                code: (string)$validated['code'],
                language: (string)($validated['language'] ?? 'javascript')
            );

            return response()->json($result->toArray());
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Failed to verify code submission: ' . $e->getMessage(),
            ], 500);
        }
    }
}
