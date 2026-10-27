<?php

declare(strict_types=1);

namespace App\Domain\Learning\Entities;

use App\Domain\Learning\ValueObjects\BloomTaxonomyLevel;
use App\Domain\Learning\ValueObjects\DifficultyLevel;
use App\Domain\Learning\ValueObjects\TopicId;
use DateTimeImmutable;

/**
 * Transient Aggregate Root representing a complete adaptive lesson generated specifically
 * for the current student's Zone of Proximal Development (ZPD).
 *
 * NOTE: Strict Zero-Content Architecture rule: Lessons are strictly transient (ephemeral).
 * They are streamed / delivered to the client and evaluated in memory; neither questions nor
 * lesson text are saved statically to the database.
 */
final class Lesson
{
    /**
     * @param string $lessonId
     * @param TopicId $topicId
     * @param string $topicTitle
     * @param DifficultyLevel $difficulty
     * @param BloomTaxonomyLevel $targetBloom
     * @param array<ExplanationCard> $cards
     * @param array<Question> $questions
     * @param array<string, mixed>|null $codeChallenge
     * @param string $zpdRationale
     * @param DateTimeImmutable $generatedAt
     */
    public function __construct(
        private readonly string $lessonId,
        private readonly TopicId $topicId,
        private readonly string $topicTitle,
        private readonly DifficultyLevel $difficulty,
        private readonly BloomTaxonomyLevel $targetBloom,
        private readonly array $cards,
        private readonly array $questions,
        private readonly ?array $codeChallenge,
        private readonly string $zpdRationale,
        private readonly DateTimeImmutable $generatedAt = new DateTimeImmutable()
    ) {}

    public function getLessonId(): string
    {
        return $this->lessonId;
    }

    public function getTopicId(): TopicId
    {
        return $this->topicId;
    }

    public function getTopicTitle(): string
    {
        return $this->topicTitle;
    }

    public function getDifficulty(): DifficultyLevel
    {
        return $this->difficulty;
    }

    public function getTargetBloom(): BloomTaxonomyLevel
    {
        return $this->targetBloom;
    }

    /**
     * @return array<ExplanationCard>
     */
    public function getCards(): array
    {
        return $this->cards;
    }

    /**
     * @return array<Question>
     */
    public function getQuestions(): array
    {
        return $this->questions;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getCodeChallenge(): ?array
    {
        return $this->codeChallenge;
    }

    public function getZpdRationale(): string
    {
        return $this->zpdRationale;
    }

    public function getGeneratedAt(): DateTimeImmutable
    {
        return $this->generatedAt;
    }

    public function findQuestion(string $questionId): ?Question
    {
        foreach ($this->questions as $question) {
            if ($question->getQuestionId() === $questionId) {
                return $question;
            }
        }
        return null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'lesson_id' => $this->lessonId,
            'topic_id' => $this->topicId->getValue(),
            'topic_title' => $this->topicTitle,
            'difficulty' => $this->difficulty->value,
            'target_bloom' => $this->targetBloom->value,
            'zpd_rationale' => $this->zpdRationale,
            'cards' => array_map(static fn(ExplanationCard $card) => $card->toArray(), $this->cards),
            'questions' => array_map(static fn(Question $question) => $question->toArray(), $this->questions),
            'code_challenge' => $this->codeChallenge,
            'generated_at' => $this->generatedAt->format(DATE_ATOM),
        ];
    }
}
