<?php

declare(strict_types=1);

namespace App\Domain\KnowledgeState\Entities;

use App\Domain\KnowledgeState\Enums\CognitiveStatus;
use App\Domain\Learning\ValueObjects\TopicId;
use DateTimeImmutable;

/**
 * Aggregate Root maintaining the student's cognitive state, Bayesian skill scores,
 * detected misconceptions (weakness points), and computed Zone of Proximal Development (ZPD).
 *
 * Stored in Cloud Firestore under: knowledge_states/{studentId}_{courseId}
 */
final class StudentKnowledgeState
{
    /**
     * @param string $studentId
     * @param string $courseId
     * @param CognitiveStatus $cognitiveStatus
     * @param array<string, SkillScore> $topicScores Keyed by topicId string
     * @param array<WeaknessPoint> $weaknessPoints
     * @param array<string> $zoneOfProximalDevelopment List of topic IDs ready for learning
     * @param DateTimeImmutable $lastEvaluatedAt
     */
    public function __construct(
        private readonly string $studentId,
        private readonly string $courseId,
        private CognitiveStatus $cognitiveStatus = CognitiveStatus::Unassessed,
        private array $topicScores = [],
        private array $weaknessPoints = [],
        private array $zoneOfProximalDevelopment = [],
        private DateTimeImmutable $lastEvaluatedAt = new DateTimeImmutable()
    ) {}

    public function getStudentId(): string
    {
        return $this->studentId;
    }

    public function getCourseId(): string
    {
        return $this->courseId;
    }

    public function getCognitiveStatus(): CognitiveStatus
    {
        return $this->cognitiveStatus;
    }

    public function setCognitiveStatus(CognitiveStatus $status): void
    {
        $this->cognitiveStatus = $status;
        $this->lastEvaluatedAt = new DateTimeImmutable();
    }

    /**
     * @return array<string, SkillScore>
     */
    public function getTopicScores(): array
    {
        return $this->topicScores;
    }

    public function getScoreForTopic(TopicId $topicId): ?SkillScore
    {
        return $this->topicScores[$topicId->getValue()] ?? null;
    }

    /**
     * @return array<WeaknessPoint>
     */
    public function getWeaknessPoints(): array
    {
        return $this->weaknessPoints;
    }

    /**
     * @return array<WeaknessPoint>
     */
    public function getWeaknessPointsForTopic(TopicId $topicId): array
    {
        return array_values(array_filter(
            $this->weaknessPoints,
            static fn(WeaknessPoint $wp) => $wp->getTopicId()->equals($topicId)
        ));
    }

    /**
     * @return array<string>
     */
    public function getZoneOfProximalDevelopment(): array
    {
        return $this->zoneOfProximalDevelopment;
    }

    public function getLastEvaluatedAt(): DateTimeImmutable
    {
        return $this->lastEvaluatedAt;
    }

    /**
     * Updates or initializes the mastery score for a topic.
     */
    public function updateTopicMastery(TopicId $topicId, bool $isSuccess, float $difficultyWeight = 0.5): void
    {
        $key = $topicId->getValue();
        $current = $this->topicScores[$key] ?? new SkillScore(score: 0.1, confidenceInterval: 0.8, attemptsCount: 0);

        $this->topicScores[$key] = $current->recordOutcome($isSuccess, $difficultyWeight);
        $this->lastEvaluatedAt = new DateTimeImmutable();

        // Adjust Cognitive Status based on recent performance
        $updatedScore = $this->topicScores[$key]->getScore();
        if ($updatedScore >= 0.85) {
            $this->cognitiveStatus = CognitiveStatus::Mastered;
        } elseif (!$isSuccess && count($this->getWeaknessPointsForTopic($topicId)) > 0) {
            $this->cognitiveStatus = CognitiveStatus::GuidedReview;
        } else {
            $this->cognitiveStatus = CognitiveStatus::ActiveLearning;
        }
    }

    /**
     * Records an inferred misconception / weakness point.
     */
    public function recordWeaknessPoint(WeaknessPoint $point): void
    {
        // Avoid duplicate weakness points for the same topic and conceptTag
        $filtered = array_filter($this->weaknessPoints, static function (WeaknessPoint $existing) use ($point) {
            return !($existing->getTopicId()->equals($point->getTopicId()) &&
                     $existing->getConceptTag() === $point->getConceptTag());
        });

        $filtered[] = $point;
        $this->weaknessPoints = array_values($filtered);
        $this->cognitiveStatus = CognitiveStatus::GuidedReview;
        $this->lastEvaluatedAt = new DateTimeImmutable();
    }

    /**
     * Clears resolved weaknesses once the student exhibits mastery in remediation.
     */
    public function clearWeaknessForTopic(TopicId $topicId): void
    {
        $this->weaknessPoints = array_values(array_filter(
            $this->weaknessPoints,
            static fn(WeaknessPoint $wp) => !$wp->getTopicId()->equals($topicId)
        ));
        $this->lastEvaluatedAt = new DateTimeImmutable();
    }

    /**
     * Computes the Zone of Proximal Development (ZPD) against the Course Topic DAG.
     * Identifies topics whose prerequisites are mastered (score >= 0.75), but the topic itself
     * is not yet mastered (< 0.85).
     *
     * @param array<string, array{prerequisites: array<string>, title: string}> $syllabusTopicMap
     */
    public function recomputeZPD(array $syllabusTopicMap): void
    {
        $zpd = [];

        foreach ($syllabusTopicMap as $topicIdStr => $topicMeta) {
            $currentScore = $this->topicScores[$topicIdStr]?->getScore() ?? 0.0;

            // If already mastered, it is beyond the proximal development boundary
            if ($currentScore >= 0.85) {
                continue;
            }

            // Check if all prerequisites are fulfilled
            $prereqs = $topicMeta['prerequisites'] ?? [];
            $prereqsMet = true;

            foreach ($prereqs as $prereqId) {
                $prereqScore = $this->topicScores[$prereqId]?->getScore() ?? 0.0;
                if ($prereqScore < 0.70) {
                    $prereqsMet = false;
                    break;
                }
            }

            if ($prereqsMet) {
                $zpd[] = $topicIdStr;
            }
        }

        // If no topic is unlocked, fallback to foundational topics (no prerequisites)
        if (empty($zpd)) {
            foreach ($syllabusTopicMap as $topicIdStr => $topicMeta) {
                if (empty($topicMeta['prerequisites'] ?? [])) {
                    $zpd[] = $topicIdStr;
                }
            }
        }

        $this->zoneOfProximalDevelopment = array_values(array_unique($zpd));
        $this->lastEvaluatedAt = new DateTimeImmutable();
    }

    /**
     * Serializes to Firestore representation.
     *
     * @return array<string, mixed>
     */
    public function toFirestore(): array
    {
        $scoresSerialized = [];
        foreach ($this->topicScores as $topicId => $score) {
            $scoresSerialized[$topicId] = $score->toArray();
        }

        return [
            'student_id' => $this->studentId,
            'course_id' => $this->courseId,
            'cognitive_status' => $this->cognitiveStatus->value,
            'skill_scores' => $scoresSerialized,
            'weakness_points' => array_map(static fn(WeaknessPoint $wp) => $wp->toArray(), $this->weaknessPoints),
            'zpd_topics' => $this->zoneOfProximalDevelopment,
            'last_evaluated_at' => $this->lastEvaluatedAt->format(DATE_ATOM),
        ];
    }

    /**
     * Hydrates from Firestore document array.
     *
     * @param array<string, mixed> $data
     */
    public static function fromFirestore(array $data): self
    {
        $topicScores = [];
        if (!empty($data['skill_scores']) && is_array($data['skill_scores'])) {
            foreach ($data['skill_scores'] as $topicId => $scoreData) {
                if (is_array($scoreData)) {
                    $topicScores[$topicId] = SkillScore::fromArray($scoreData);
                }
            }
        }

        $weaknessPoints = [];
        if (!empty($data['weakness_points']) && is_array($data['weakness_points'])) {
            foreach ($data['weakness_points'] as $wpData) {
                if (is_array($wpData)) {
                    $weaknessPoints[] = WeaknessPoint::fromArray($wpData);
                }
            }
        }

        $cognitiveStatus = isset($data['cognitive_status'])
            ? (CognitiveStatus::tryFrom((string)$data['cognitive_status']) ?? CognitiveStatus::Unassessed)
            : CognitiveStatus::Unassessed;

        $lastEvaluated = isset($data['last_evaluated_at'])
            ? new DateTimeImmutable((string)$data['last_evaluated_at'])
            : new DateTimeImmutable();

        return new self(
            studentId: (string)($data['student_id'] ?? ''),
            courseId: (string)($data['course_id'] ?? ''),
            cognitiveStatus: $cognitiveStatus,
            topicScores: $topicScores,
            weaknessPoints: $weaknessPoints,
            zoneOfProximalDevelopment: (array)($data['zpd_topics'] ?? []),
            lastEvaluatedAt: $lastEvaluated
        );
    }
}
