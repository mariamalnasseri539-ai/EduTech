<?php

declare(strict_types=1);

namespace App\Domain\KnowledgeState\Entities;

use DateTimeImmutable;
use InvalidArgumentException;

/**
 * Value Object representing a Bayesian-inspired mastery score for a syllabus topic.
 */
final class SkillScore
{
    private float $score;
    private float $confidenceInterval;
    private int $attemptsCount;
    private DateTimeImmutable $lastAssessedAt;

    public function __construct(
        float $score,
        float $confidenceInterval = 0.50,
        int $attemptsCount = 0,
        ?DateTimeImmutable $lastAssessedAt = null
    ) {
        if ($score < 0.0 || $score > 1.0) {
            throw new InvalidArgumentException("Skill score must be between 0.0 and 1.0. Given: {$score}");
        }

        $this->score = round($score, 4);
        $this->confidenceInterval = round(max(0.05, min(1.0, $confidenceInterval)), 4);
        $this->attemptsCount = max(0, $attemptsCount);
        $this->lastAssessedAt = $lastAssessedAt ?? new DateTimeImmutable();
    }

    public function getScore(): float
    {
        return $this->score;
    }

    public function getConfidenceInterval(): float
    {
        return $this->confidenceInterval;
    }

    public function getAttemptsCount(): int
    {
        return $this->attemptsCount;
    }

    public function getLastAssessedAt(): DateTimeImmutable
    {
        return $this->lastAssessedAt;
    }

    /**
     * Updates the score using an adaptive exponential moving average with confidence weighting.
     */
    public function recordOutcome(bool $isSuccess, float $difficultyWeight = 0.5): self
    {
        $outcomeVal = $isSuccess ? 1.0 : 0.0;
        $learningRate = max(0.15, 0.40 / (1 + ($this->attemptsCount * 0.1)));

        // Reward harder questions more on success; penalize easier questions more on failure
        $adjustment = $isSuccess 
            ? ($outcomeVal - $this->score) * $learningRate * (0.8 + 0.4 * $difficultyWeight)
            : ($outcomeVal - $this->score) * $learningRate * (1.2 - 0.4 * $difficultyWeight);

        $newScore = max(0.0, min(1.0, $this->score + $adjustment));
        $newConfidence = max(0.05, $this->confidenceInterval * 0.85);

        return new self(
            score: $newScore,
            confidenceInterval: $newConfidence,
            attemptsCount: $this->attemptsCount + 1,
            lastAssessedAt: new DateTimeImmutable()
        );
    }

    /**
     * @return array{score: float, confidence_interval: float, attempts_count: int, last_assessed_at: string}
     */
    public function toArray(): array
    {
        return [
            'score' => $this->score,
            'confidence_interval' => $this->confidenceInterval,
            'attempts_count' => $this->attemptsCount,
            'last_assessed_at' => $this->lastAssessedAt->format(DATE_ATOM),
        ];
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        $lastAssessed = isset($data['last_assessed_at']) 
            ? new DateTimeImmutable((string)$data['last_assessed_at']) 
            : new DateTimeImmutable();

        return new self(
            score: (float)($data['score'] ?? 0.0),
            confidenceInterval: (float)($data['confidence_interval'] ?? 0.5),
            attemptsCount: (int)($data['attempts_count'] ?? 0),
            lastAssessedAt: $lastAssessed
        );
    }
}
