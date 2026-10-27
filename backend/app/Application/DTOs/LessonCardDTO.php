<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final readonly class LessonCardDTO
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
        public string $cardId,
        public string $title,
        public string $summary,
        public string $contentMarkdown,
        public array $keyTakeaways,
        public ?string $analogy,
        public ?array $codeSnippet,
        public string $speechTranscript
    ) {}

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
