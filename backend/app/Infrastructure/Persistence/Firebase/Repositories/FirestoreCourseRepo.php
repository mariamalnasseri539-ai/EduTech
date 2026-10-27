<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase\Repositories;

use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\ValueObjects\TopicId;
use App\Infrastructure\Persistence\Firebase\FirebaseClient;

final class FirestoreCourseRepo implements CourseRepositoryInterface
{
    private const COLLECTION = 'courses';

    public function __construct(
        private readonly FirebaseClient $firebase
    ) {}

    public function getCourse(string $courseId): ?array
    {
        return $this->firebase->getDocument(self::COLLECTION, $courseId);
    }

    public function getAllCourses(): array
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);
        return array_values($all);
    }

    public function getTopicMap(string $courseId): array
    {
        $course = $this->getCourse($courseId);
        return (array)($course['topic_map'] ?? []);
    }

    public function findTopic(string $courseId, TopicId $topicId): ?array
    {
        $topicMap = $this->getTopicMap($courseId);
        return $topicMap[$topicId->getValue()] ?? null;
    }
}
