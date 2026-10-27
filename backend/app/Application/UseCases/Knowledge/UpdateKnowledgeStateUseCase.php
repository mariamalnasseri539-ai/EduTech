<?php

declare(strict_types=1);

namespace App\Application\UseCases\Knowledge;

use App\Domain\KnowledgeState\Entities\SkillScore;
use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Entities\WeaknessPoint;
use App\Domain\KnowledgeState\Enums\CognitiveStatus;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\ValueObjects\TopicId;

final class UpdateKnowledgeStateUseCase
{
    public function __construct(
        private readonly KnowledgeStateRepositoryInterface $knowledgeRepository,
        private readonly CourseRepositoryInterface $courseRepository
    ) {}

    /**
     * @param string $studentId
     * @param string $courseId
     * @param array<string, mixed> $adjustments
     * @return array<string, mixed>
     */
    public function execute(string $studentId, string $courseId, array $adjustments): array
    {
        $state = $this->knowledgeRepository->findByStudentAndCourse($studentId, $courseId)
            ?? new StudentKnowledgeState($studentId, $courseId);

        if (isset($adjustments['status'])) {
            $enumStatus = CognitiveStatus::tryFrom((string)$adjustments['status']);
            if ($enumStatus !== null) {
                $state->setCognitiveStatus($enumStatus);
            }
        }

        if (isset($adjustments['topic_id'], $adjustments['score'])) {
            $topicId = new TopicId((string)$adjustments['topic_id']);
            $scoreVal = (float)$adjustments['score'];
            $state->updateTopicMastery($topicId, $scoreVal >= 0.70);
        }

        $topicMap = $this->courseRepository->getTopicMap($courseId);
        $state->recomputeZPD($topicMap);
        $this->knowledgeRepository->save($state);

        return $state->toFirestore();
    }
}
