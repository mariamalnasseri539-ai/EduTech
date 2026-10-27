<?php

declare(strict_types=1);

namespace App\Domain\Learning\Entities;

/**
 * Ephemeral question generated dynamically to verify student comprehension without storing static test banks.
 */
final class Question
{
    /**
     * @param string $questionId
     * @param string $prompt
     * @param array<string> $options
     * @param int $correctOptionIndex
     * @param string $explanation
     * @param array<int, string> $misconceptionNotes
     * @param string $hint
     * @param string $conceptTested
     */
    public function __construct(
        private readonly string $questionId,
        private readonly string $prompt,
        private readonly array $options,
        private readonly int $correctOptionIndex,
        private readonly string $explanation,
        private readonly array $misconceptionNotes = [],
        private readonly string $hint = '',
        private readonly string $conceptTested = ''
    ) {}

    public function getQuestionId(): string
    {
        return $this->questionId;
    }

    public function getPrompt(): string
    {
        return $this->prompt;
    }

    /**
     * @return array<string>
     */
    public function getOptions(): array
    {
        return $this->options;
    }

    public function getCorrectOptionIndex(): int
    {
        return $this->correctOptionIndex;
    }

    public function getExplanation(): string
    {
        return $this->explanation;
    }

    /**
     * @return array<int, string>
     */
    public function getMisconceptionNotes(): array
    {
        return $this->misconceptionNotes;
    }

    public function getHint(): string
    {
        return $this->hint;
    }

    public function getConceptTested(): string
    {
        return $this->conceptTested;
    }

    public function isAnswerCorrect(int $selectedOption): bool
    {
        return $selectedOption === $this->correctOptionIndex;
    }

    public function getFeedbackForSelection(int $selectedOption): string
    {
        if ($this->isAnswerCorrect($selectedOption)) {
            return $this->explanation;
        }

        return $this->misconceptionNotes[$selectedOption] ?? 'Incorrect. Consider reviewing the core principle: ' . $this->explanation;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'question_id' => $this->questionId,
            'prompt' => $this->prompt,
            'options' => $this->options,
            'correct_option_index' => $this->correctOptionIndex,
            'explanation' => $this->explanation,
            'misconception_notes' => $this->misconceptionNotes,
            'hint' => $this->hint,
            'concept_tested' => $this->conceptTested,
        ];
    }
}
