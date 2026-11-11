<?php

declare(strict_types=1);

namespace App\Domain\Learning\Repositories;

use App\Domain\Learning\ValueObjects\TopicId;

/**
 * Interface for reading and writing course structures, syllabi, and approved Topic Maps.
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
     *     id: string,
     *     title: string,
     *     description: string,
     *     prerequisites: array<string>,
     *     target_concepts: array<string>,
     *     category: string,
     *     order: int,
     *     bloom_level?: string
     * }>
     */
    public function getTopicMap(string $courseId): array;

    /**
     * @param string $courseId
     * @param TopicId $topicId
     * @return array<string, mixed>|null
     */
    public function findTopic(string $courseId, TopicId $topicId): ?array;

    /**
     * Persists or updates an entire course syllabus with its concept tree in Cloud Firestore.
     *
     * @param array<string, mixed> $courseData
     * @return array<string, mixed>
     */
    public function saveCourse(array $courseData): array;

    /**
     * Deletes a course from Cloud Firestore.
     *
     * @param string $courseId
     * @return bool
     */
    public function deleteCourse(string $courseId): bool;
}
