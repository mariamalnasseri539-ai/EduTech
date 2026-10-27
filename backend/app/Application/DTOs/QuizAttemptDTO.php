<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final readonly class QuizAttemptDTO
{
    public function __construct(
        public string $studentId,
        public string $courseId,
        public string $lessonId,
        public string $topicId,
        public string $questionId,
        public int $selectedOption,
        public int $timeSpentSeconds = 0
    ) {}

    /**
     * @param array<string, mixed> $data
     */
    public static function fromRequest(array $data, string $studentId): self
    {
        return new self(
            studentId: $studentId,
            courseId: (string)($data['course_id'] ?? ''),
            lessonId: (string)($data['lesson_id'] ?? ''),
            topicId: (string)($data['topic_id'] ?? ''),
            questionId: (string)($data['question_id'] ?? ''),
            selectedOption: (int)($data['selected_option'] ?? 0),
            timeSpentSeconds: (int)($data['time_spent_seconds'] ?? 0)
        );
    }
}
