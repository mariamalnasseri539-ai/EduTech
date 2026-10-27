<?php

declare(strict_types=1);

namespace App\Domain\Assessment\Entities;

use App\Domain\Learning\ValueObjects\TopicId;
use DateTimeImmutable;

/**
 * Entity representing an individual quiz attempt log.
 * Stored in Firestore collection: attempts/{attemptId}
 */
final class ChallengeAttempt
{
    public function __construct(
        private readonly string $attemptId,
        private readonly string $studentId,
        private readonly TopicId $topicId,
        private readonly string $questionId,
        private readonly int $selectedOption,
        private readonly bool $isCorrect,
        private readonly string $feedback,
        private readonly int $timeSpentSeconds = 0,
        private readonly DateTimeImmutable $attemptedAt = new DateTimeImmutable()
    ) {}

    public function getAttemptId(): string
    {
        return $this->attemptId;
    }

    public function getStudentId(): string
    {
        return $this->studentId;
    }

    public function getTopicId(): TopicId
    {
        return $this->topicId;
    }

    public function getQuestionId(): string
    {
        return $this->questionId;
    }

    public function getSelectedOption(): int
    {
        return $this->selectedOption;
    }

    public function isCorrect(): bool
    {
        return $this->isCorrect;
    }

    public function getFeedback(): string
    {
        return $this->feedback;
    }

    public function getTimeSpentSeconds(): int
    {
        return $this->timeSpentSeconds;
    }

    public function getAttemptedAt(): DateTimeImmutable
    {
        return $this->attemptedAt;
    }

    /**
     * @return array<string, mixed>
     */
    public function toFirestore(): array
    {
        return [
            'attempt_id' => $this->attemptId,
            'type' => 'quiz',
            'student_id' => $this->studentId,
            'topic_id' => $this->topicId->getValue(),
            'question_id' => $this->questionId,
            'selected_option' => $this->selectedOption,
            'is_correct' => $this->isCorrect,
            'feedback' => $this->feedback,
            'time_spent_seconds' => $this->timeSpentSeconds,
            'attempted_at' => $this->attemptedAt->format(DATE_ATOM),
        ];
    }
}
