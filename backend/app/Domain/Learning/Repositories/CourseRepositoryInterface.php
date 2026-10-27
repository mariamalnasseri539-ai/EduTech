<?php

declare(strict_types=1);

namespace App\Domain\Learning\Repositories;

use App\Domain\Learning\ValueObjects\TopicId;

/**
 * Interface for reading course structures, syllabi, and approved Topic Maps.
 * In the Zero-Content architecture, Firestore stores ONLY topic metadata,
 * concepts, and prerequisites—NEVER pre-written lessons.
 */
interface CourseRepositoryInterface
{
    /**
     * @param string $courseId
     * @return array<string, mixed>|null
     */
    public function getCourse(string $courseId): ?array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getAllCourses(): array;

    /**
     * Returns the full approved topic map / DAG for the given course.
     *
     * @param string $courseId
     * @return array<string, array{
     *     title: string,
     *     description: string,
     *     prerequisites: array<string>,
     *     target_concepts: array<string>,
     *     category: string,
     *     order: int
     * }>
     */
    public function getTopicMap(string $courseId): array;

    /**
     * @param string $courseId
     * @param TopicId $topicId
     * @return array{
     *     title: string,
     *     description: string,
     *     prerequisites: array<string>,
     *     target_concepts: array<string>,
     *     category: string,
     *     order: int
     * }|null
     */
    public function findTopic(string $courseId, TopicId $topicId): ?array;
}
