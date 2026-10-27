<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final readonly class CodeVerificationResultDTO
{
    /**
     * @param string $submissionId
     * @param float $score
     * @param string $executionStatus
     * @param int $passedTestCases
     * @param int $totalTestCases
     * @param string $aiFeedback
     * @param array<string> $inferredWeaknesses
     * @param string $refactoredSolution
     * @param array<mixed> $testResults
     * @param float $newTopicMastery
     * @param string $cognitiveStatus
     */
    public function __construct(
        public string $submissionId,
        public float $score,
        public string $executionStatus,
        public int $passedTestCases,
        public int $totalTestCases,
        public string $aiFeedback,
        public array $inferredWeaknesses,
        public string $refactoredSolution,
        public array $testResults,
        public float $newTopicMastery,
        public string $cognitiveStatus
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'submission_id' => $this->submissionId,
            'score' => $this->score,
            'execution_status' => $this->executionStatus,
            'passed_test_cases' => $this->passedTestCases,
            'total_test_cases' => $this->totalTestCases,
            'ai_feedback' => $this->aiFeedback,
            'inferred_weaknesses' => $this->inferredWeaknesses,
            'refactored_solution' => $this->refactoredSolution,
            'test_results' => $this->testResults,
            'new_topic_mastery' => $this->newTopicMastery,
            'cognitive_status' => $this->cognitiveStatus,
        ];
    }
}
