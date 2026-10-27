<?php

declare(strict_types=1);

namespace App\Domain\KnowledgeState\Entities;

use App\Domain\Learning\ValueObjects\TopicId;
use DateTimeImmutable;

/**
 * Entity representing an inferred conceptual misconception or knowledge gap.
 */
final class WeaknessPoint
{
    public function __construct(
        private readonly TopicId $topicId,
        private readonly string $conceptTag,
        private readonly string $description,
        private readonly string $severity = 'medium', // low, medium, high, critical
        private readonly DateTimeImmutable $detectedAt = new DateTimeImmutable()
    ) {}

    public function getTopicId(): TopicId
    {
        return $this->topicId;
    }

    public function getConceptTag(): string
    {
        return $this->conceptTag;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getSeverity(): string
    {
        return $this->severity;
    }

    public function getDetectedAt(): DateTimeImmutable
    {
        return $this->detectedAt;
    }

    /**
     * @return array{topic_id: string, concept_tag: string, description: string, severity: string, detected_at: string}
     */
    public function toArray(): array
    {
        return [
            'topic_id' => $this->topicId->getValue(),
            'concept_tag' => $this->conceptTag,
            'description' => $this->description,
            'severity' => $this->severity,
            'detected_at' => $this->detectedAt->format(DATE_ATOM),
        ];
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        $detectedAt = isset($data['detected_at'])
            ? new DateTimeImmutable((string)$data['detected_at'])
            : new DateTimeImmutable();

        return new self(
            topicId: new TopicId((string)$data['topic_id']),
            conceptTag: (string)($data['concept_tag'] ?? 'General'),
            description: (string)($data['description'] ?? 'Misconception detected during assessment.'),
            severity: (string)($data['severity'] ?? 'medium'),
            detectedAt: $detectedAt
        );
    }
}
