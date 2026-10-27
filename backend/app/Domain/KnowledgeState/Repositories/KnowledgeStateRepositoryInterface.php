<?php

declare(strict_types=1);

namespace App\Domain\KnowledgeState\Repositories;

use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;

/**
 * Interface for reading and persisting student knowledge states in Cloud Firestore.
 */
interface KnowledgeStateRepositoryInterface
{
    public function findByStudentAndCourse(string $studentId, string $courseId): ?StudentKnowledgeState;

    public function save(StudentKnowledgeState $state): void;

    /**
     * @param string $courseId
     * @return array<StudentKnowledgeState>
     */
    public function getCohortStates(string $courseId): array;
}
