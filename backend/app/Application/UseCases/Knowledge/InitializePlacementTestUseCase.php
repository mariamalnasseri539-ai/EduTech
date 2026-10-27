<?php

declare(strict_types=1);

namespace App\Application\UseCases\Knowledge;

use App\Domain\KnowledgeState\Entities\SkillScore;
use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Enums\CognitiveStatus;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Infrastructure\AI\GeminiApiClient;
use RuntimeException;

final class InitializePlacementTestUseCase
{
    public function __construct(
        private readonly CourseRepositoryInterface $courseRepository,
        private readonly KnowledgeStateRepositoryInterface $knowledgeRepository,
        private readonly GeminiApiClient $geminiClient
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function execute(string $studentId, string $courseId): array
    {
        $topicMap = $this->courseRepository->getTopicMap($courseId);
        if (empty($topicMap)) {
            throw new RuntimeException("Course '{$courseId}' syllabus not found.");
        }

        // Initialize empty or baseline knowledge state
        $existing = $this->knowledgeRepository->findByStudentAndCourse($studentId, $courseId);
        if ($existing === null) {
            $existing = new StudentKnowledgeState(
                studentId: $studentId,
                courseId: $courseId,
                cognitiveStatus: CognitiveStatus::Unassessed
            );
            $existing->recomputeZPD($topicMap);
            $this->knowledgeRepository->save($existing);
        }

        return [
            'student_id' => $studentId,
            'course_id' => $courseId,
            'cognitive_status' => $existing->getCognitiveStatus()->value,
            'zpd_topics' => $existing->getZoneOfProximalDevelopment(),
            'message' => 'Diagnostic baseline initialized. Student is primed for adaptive entry.',
        ];
    }
}
