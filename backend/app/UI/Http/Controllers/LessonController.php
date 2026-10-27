<?php

declare(strict_types=1);

namespace App\UI\Http\Controllers;

use App\Application\UseCases\Learning\AskSmartAssistantUseCase;
use App\Application\UseCases\Learning\RequestAdaptiveLessonUseCase;
use App\UI\Http\Requests\RequestLessonRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

final class LessonController
{
    public function __construct(
        private readonly RequestAdaptiveLessonUseCase $requestLessonUseCase,
        private readonly AskSmartAssistantUseCase $askSmartAssistantUseCase
    ) {}

    public function requestLesson(RequestLessonRequest $request): JsonResponse
    {
        $studentId = (string)$request->attributes->get('student_id', 'stu_101');
        $courseId = (string)$request->input('course_id');
        $topicId = $request->input('topic_id') ? (string)$request->input('topic_id') : null;

        try {
            $lessonResponse = $this->requestLessonUseCase->execute($studentId, $courseId, $topicId);
            return response()->json($lessonResponse->toArray());
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Failed to synthesize adaptive lesson: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function askAssistant(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => ['required', 'string'],
            'lesson_id' => ['required', 'string'],
            'card_id' => ['required', 'string'],
            'question' => ['required', 'string'],
        ]);

        $studentId = (string)$request->attributes->get('student_id', 'stu_101');

        try {
            $response = $this->askSmartAssistantUseCase->execute(
                studentId: $studentId,
                courseId: (string)$request->input('course_id'),
                lessonId: (string)$request->input('lesson_id'),
                cardId: (string)$request->input('card_id'),
                studentQuestion: (string)$request->input('question')
            );

            return response()->json($response);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Smart assistant encountered an error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
