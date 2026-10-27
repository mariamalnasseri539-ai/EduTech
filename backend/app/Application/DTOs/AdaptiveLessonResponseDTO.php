<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final readonly class AdaptiveLessonResponseDTO
{
    /**
     * @param string $lessonId
     * @param string $topicId
     * @param string $topicTitle
     * @param string $difficulty
     * @param string $targetBloom
     * @param string $zpdRationale
     * @param array<mixed> $cards
     * @param array<mixed> $questions
     * @param array<mixed>|null $codeChallenge
     * @param array<mixed> $currentKnowledgeState
     */
    public function __construct(
        public string $lessonId,
        public string $topicId,
        public string $topicTitle,
        public string $difficulty,
        public string $targetBloom,
        public string $zpdRationale,
        public array $cards,
        public array $questions,
        public ?array $codeChallenge,
        public array $currentKnowledgeState
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'lesson_id' => $this->lessonId,
            'topic_id' => $this->topicId,
            'topic_title' => $this->topicTitle,
            'difficulty' => $this->difficulty,
            'target_bloom' => $this->targetBloom,
            'zpd_rationale' => $this->zpdRationale,
            'cards' => $this->cards,
            'questions' => $this->questions,
            'code_challenge' => $this->codeChallenge,
            'current_knowledge_state' => $this->currentKnowledgeState,
        ];
    }
}
