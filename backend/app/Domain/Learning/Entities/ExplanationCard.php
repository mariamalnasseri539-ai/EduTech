<?php

declare(strict_types=1);

namespace App\Domain\Learning\Entities;

/**
 * Represents an ephemeral, AI-generated instructional card tailored to the student's cognitive state.
 * Under the Zero-Content architecture, this card is generated dynamically on-the-fly and never persisted statically.
 */
final class ExplanationCard
{
    /**
     * @param string $cardId
     * @param string $title
     * @param string $summary
     * @param string $contentMarkdown
     * @param array<string> $keyTakeaways
     * @param string|null $analogy
     * @param array{language: string, code: string, explanation: string}|null $codeSnippet
     * @param string $speechTranscript
     */
    public function __construct(
        private readonly string $cardId,
        private readonly string $title,
        private readonly string $summary,
        private readonly string $contentMarkdown,
        private readonly array $keyTakeaways,
        private readonly ?string $analogy,
        private readonly ?array $codeSnippet,
        private readonly string $speechTranscript
    ) {}

    public function getCardId(): string
    {
        return $this->cardId;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getSummary(): string
    {
        return $this->summary;
    }

    public function getContentMarkdown(): string
    {
        return $this->contentMarkdown;
    }

    /**
     * @return array<string>
     */
    public function getKeyTakeaways(): array
    {
        return $this->keyTakeaways;
    }

    public function getAnalogy(): ?string
    {
        return $this->analogy;
    }

    /**
     * @return array{language: string, code: string, explanation: string}|null
     */
    public function getCodeSnippet(): ?array
    {
        return $this->codeSnippet;
    }

    public function getSpeechTranscript(): string
    {
        return $this->speechTranscript;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'card_id' => $this->cardId,
            'title' => $this->title,
            'summary' => $this->summary,
            'content_markdown' => $this->contentMarkdown,
            'key_takeaways' => $this->keyTakeaways,
            'analogy' => $this->analogy,
            'code_snippet' => $this->codeSnippet,
            'speech_transcript' => $this->speechTranscript,
        ];
    }
}
