<?php

declare(strict_types=1);

namespace App\Domain\Assessment\Repositories;

use App\Domain\Assessment\Entities\ChallengeAttempt;
use App\Domain\Assessment\Entities\CodeSubmission;

/**
 * Interface for persisting attempt telemetry in Cloud Firestore.
 */
interface AttemptRepositoryInterface
{
    public function logQuizAttempt(ChallengeAttempt $attempt): void;

    public function logCodeSubmission(CodeSubmission $submission): void;

    /**
     * @param string $studentId
     * @param int $limit
     * @return array<int, array<string, mixed>>
     */
    public function getStudentRecentAttempts(string $studentId, int $limit = 20): array;

    /**
     * @param string $topicId
     * @return array<int, array<string, mixed>>
     */
    public function getTopicAttemptTelemetry(string $topicId): array;
}
