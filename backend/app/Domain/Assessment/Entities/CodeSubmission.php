<?php

declare(strict_types=1);

namespace App\Domain\Assessment\Entities;

use App\Domain\Learning\ValueObjects\TopicId;
use DateTimeImmutable;

/**
 * Entity representing a practical code challenge submission and its evaluation log.
 * Stored in Firestore collection: attempts/{submissionId}
 */
final class CodeSubmission
{
    /**
     * @param string $submissionId
     * @param string $studentId
     * @param TopicId $topicId
     * @param string $code
     * @param string $language
     * @param float $score
     * @param string $executionStatus
     * @param string $aiFeedback
     * @param array<mixed> $testResults
     * @param array<string> $inferredWeaknesses
     * @param DateTimeImmutable $submittedAt
     */
    public function __construct(
        private readonly string $submissionId,
        private readonly string $studentId,
        private readonly TopicId $topicId,
        private readonly string $code,
        private readonly string $language,
        private readonly float $score,
        private readonly string $executionStatus,
        private readonly string $aiFeedback,
        private readonly array $testResults = [],
        private readonly array $inferredWeaknesses = [],
        private readonly DateTimeImmutable $submittedAt = new DateTimeImmutable()
    ) {}

    public function getSubmissionId(): string
    {
        return $this->submissionId;
    }

    public function getStudentId(): string
    {
        return $this->studentId;
    }

    public function getTopicId(): TopicId
    {
        return $this->topicId;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function getScore(): float
    {
        return $this->score;
    }

    public function getExecutionStatus(): string
    {
        return $this->executionStatus;
    }

    public function getAiFeedback(): string
    {
        return $this->aiFeedback;
    }

    /**
     * @return array<mixed>
     */
    public function getTestResults(): array
    {
        return $this->testResults;
    }

    /**
     * @return array<string>
     */
    public function getInferredWeaknesses(): array
    {
        return $this->inferredWeaknesses;
    }

    public function isPassing(): bool
    {
        return $this->score >= 0.80;
    }

    /**
     * @return array<string, mixed>
     */
    public function toFirestore(): array
    {
        return [
            'attempt_id' => $this->submissionId,
            'type' => 'code_challenge',
            'student_id' => $this->studentId,
            'topic_id' => $this->topicId->getValue(),
            'code' => $this->code,
            'language' => $this->language,
            'score' => $this->score,
            'execution_status' => $this->executionStatus,
            'ai_feedback' => $this->aiFeedback,
            'test_results' => $this->testResults,
            'inferred_weaknesses' => $this->inferredWeaknesses,
            'submitted_at' => $this->submittedAt->format(DATE_ATOM),
        ];
    }
}
