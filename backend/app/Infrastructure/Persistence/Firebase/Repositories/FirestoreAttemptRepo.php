<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase\Repositories;

use App\Domain\Assessment\Entities\ChallengeAttempt;
use App\Domain\Assessment\Entities\CodeSubmission;
use App\Domain\Assessment\Repositories\AttemptRepositoryInterface;
use App\Infrastructure\Persistence\Firebase\FirebaseClient;

final class FirestoreAttemptRepo implements AttemptRepositoryInterface
{
    private const COLLECTION = 'attempts';

    public function __construct(
        private readonly FirebaseClient $firebase
    ) {}

    public function logQuizAttempt(ChallengeAttempt $attempt): void
    {
        $this->firebase->setDocument(
            self::COLLECTION,
            $attempt->getAttemptId(),
            $attempt->toFirestore()
        );
    }

    public function logCodeSubmission(CodeSubmission $submission): void
    {
        $this->firebase->setDocument(
            self::COLLECTION,
            $submission->getSubmissionId(),
            $submission->toFirestore()
        );
    }

    public function getStudentRecentAttempts(string $studentId, int $limit = 20): array
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);
        $filtered = [];

        foreach ($all as $item) {
            if (($item['student_id'] ?? '') === $studentId) {
                $filtered[] = $item;
            }
        }

        // Sort desc by attempted_at or submitted_at
        usort($filtered, static function ($a, $b) {
            $timeA = $a['attempted_at'] ?? $a['submitted_at'] ?? '';
            $timeB = $b['attempted_at'] ?? $b['submitted_at'] ?? '';
            return strcmp((string)$timeB, (string)$timeA);
        });

        return array_slice($filtered, 0, $limit);
    }

    public function getTopicAttemptTelemetry(string $topicId): array
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);
        $filtered = [];

        foreach ($all as $item) {
            if (($item['topic_id'] ?? '') === $topicId) {
                $filtered[] = $item;
            }
        }

        return $filtered;
    }
}
