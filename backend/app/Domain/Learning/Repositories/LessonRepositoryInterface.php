<?php

declare(strict_types=1);

namespace App\Domain\Learning\Repositories;

use App\Domain\Learning\Entities\Lesson;

/**
 * Interface defining ephemeral session storage for active adaptive lessons.
 * Strictly adheres to Zero-Content Architecture: lessons are stored ephemerally
 * in memory/cache during the active learning session to validate quiz answers
 * and code challenges, but NEVER written as permanent educational content in Firestore.
 */
interface LessonRepositoryInterface
{
    /**
     * Stashes an active adaptive lesson session into ephemeral storage.
     */
    public function cacheActiveLesson(string $studentId, Lesson $lesson, int $ttlSeconds = 3600): void;

    /**
     * Retrieves an active lesson session for assessment validation.
     */
    public function getActiveLesson(string $studentId, string $lessonId): ?Lesson;

    /**
     * Evicts the ephemeral lesson after completion or expiration.
     */
    public function clearActiveLesson(string $studentId, string $lessonId): void;
}
