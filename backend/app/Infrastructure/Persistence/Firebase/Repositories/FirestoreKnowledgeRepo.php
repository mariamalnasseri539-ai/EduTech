<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase\Repositories;

use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Infrastructure\Persistence\Firebase\FirebaseClient;

final class FirestoreKnowledgeRepo implements KnowledgeStateRepositoryInterface
{
    private const COLLECTION = 'knowledge_states';

    public function __construct(
        private readonly FirebaseClient $firebase
    ) {}

    public function findByStudentAndCourse(string $studentId, string $courseId): ?StudentKnowledgeState
    {
        $docId = "{$studentId}_{$courseId}";
        $data = $this->firebase->getDocument(self::COLLECTION, $docId);

        if ($data === null) {
            return null;
        }

        return StudentKnowledgeState::fromFirestore($data);
    }

    public function save(StudentKnowledgeState $state): void
    {
        $docId = "{$state->getStudentId()}_{$state->getCourseId()}";
        $this->firebase->setDocument(
            self::COLLECTION,
            $docId,
            $state->toFirestore()
        );
    }

    public function getCohortStates(string $courseId): array
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);
        $results = [];

        foreach ($all as $item) {
            if (($item['course_id'] ?? '') === $courseId) {
                $results[] = StudentKnowledgeState::fromFirestore($item);
            }
        }

        return $results;
    }
}
