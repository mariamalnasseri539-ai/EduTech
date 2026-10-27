<?php

declare(strict_types=1);

namespace App\Application\UseCases\Assessment;

use App\Application\DTOs\CodeVerificationResultDTO;
use App\Domain\Assessment\Entities\CodeSubmission;
use App\Domain\Assessment\Repositories\AttemptRepositoryInterface;
use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Entities\WeaknessPoint;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\Repositories\LessonRepositoryInterface;
use App\Domain\Learning\Services\PromptBuilderService;
use App\Domain\Learning\ValueObjects\TopicId;
use App\Infrastructure\AI\GeminiApiClient;
use DateTimeImmutable;

final class VerifyCodeChallengeUseCase
{
    public function __construct(
        private readonly LessonRepositoryInterface $lessonRepository,
        private readonly KnowledgeStateRepositoryInterface $knowledgeRepository,
        private readonly AttemptRepositoryInterface $attemptRepository,
        private readonly CourseRepositoryInterface $courseRepository,
        private readonly PromptBuilderService $promptBuilder,
        private readonly GeminiApiClient $geminiClient
    ) {}

    public function execute(
        string $studentId,
        string $courseId,
        string $lessonId,
        string $topicId,
        string $code,
        string $language
    ): CodeVerificationResultDTO {
        $lesson = $this->lessonRepository->getActiveLesson($studentId, $lessonId);
        $topicTitle = 'Code Challenge';
        $challengePrompt = 'Implement the required algorithmic solution.';
        $testCases = [];

        if ($lesson !== null && $lesson->getCodeChallenge() !== null) {
            $challenge = $lesson->getCodeChallenge();
            $topicTitle = $lesson->getTopicTitle();
            $challengePrompt = $challenge['prompt'] ?? $challengePrompt;
            $testCases = $challenge['test_cases'] ?? [];
        }

        // 1. Build Verification Prompt
        $promptData = $this->promptBuilder->buildCodeVerificationPrompt(
            topicTitle: $topicTitle,
            challengePrompt: $challengePrompt,
            submittedCode: $code,
            language: $language,
            testCases: $testCases
        );

        // 2. Call Gemini API with Draft 2020-12 code evaluation schema
        $schemaPath = base_path('app/Infrastructure/Validation/Schemas/code_evaluation_schema_2020_12.json');
        if (!file_exists($schemaPath)) {
            $schemaPath = __DIR__ . '/../../../Infrastructure/Validation/Schemas/code_evaluation_schema_2020_12.json';
        }

        $eval = $this->geminiClient->generateStructuredJson(
            $promptData['system_instruction'],
            $promptData['user_prompt'],
            $schemaPath
        );

        $score = (float)($eval['score'] ?? 0.0);
        $isPassing = $score >= 0.75;
        $inferredWeaknesses = (array)($eval['inferred_weaknesses'] ?? []);
        $submissionId = 'sub_' . bin2hex(random_bytes(8));
        $topicIdObj = new TopicId($topicId);

        // 3. Update Knowledge State
        $knowledgeState = $this->knowledgeRepository->findByStudentAndCourse($studentId, $courseId)
            ?? new StudentKnowledgeState($studentId, $courseId);

        $topicMap = $this->courseRepository->getTopicMap($courseId);

        if (!$isPassing && !empty($inferredWeaknesses)) {
            foreach ($inferredWeaknesses as $weaknessText) {
                $knowledgeState->recordWeaknessPoint(new WeaknessPoint(
                    topicId: $topicIdObj,
                    conceptTag: 'Code-Implementation',
                    description: (string)$weaknessText,
                    severity: 'high'
                ));
            }
        } elseif ($isPassing) {
            $knowledgeState->clearWeaknessForTopic($topicIdObj);
        }

        $knowledgeState->updateTopicMastery($topicIdObj, $isPassing, difficultyWeight: 0.8);
        $knowledgeState->recomputeZPD($topicMap);
        $this->knowledgeRepository->save($knowledgeState);

        // 4. Log code submission in Firestore
        $codeSubmission = new CodeSubmission(
            submissionId: $submissionId,
            studentId: $studentId,
            topicId: $topicIdObj,
            code: $code,
            language: $language,
            score: $score,
            executionStatus: (string)($eval['execution_status'] ?? 'PASSED'),
            aiFeedback: (string)($eval['ai_feedback'] ?? ''),
            testResults: (array)($eval['test_results'] ?? []),
            inferredWeaknesses: $inferredWeaknesses,
            submittedAt: new DateTimeImmutable()
        );
        $this->attemptRepository->logCodeSubmission($codeSubmission);

        $newMastery = $knowledgeState->getScoreForTopic($topicIdObj)?->getScore() ?? 0.0;

        return new CodeVerificationResultDTO(
            submissionId: $submissionId,
            score: $score,
            executionStatus: (string)($eval['execution_status'] ?? 'PASSED'),
            passedTestCases: (int)($eval['passed_test_cases'] ?? 0),
            totalTestCases: (int)($eval['total_test_cases'] ?? 0),
            aiFeedback: (string)($eval['ai_feedback'] ?? ''),
            inferredWeaknesses: $inferredWeaknesses,
            refactoredSolution: (string)($eval['refactored_solution'] ?? ''),
            testResults: (array)($eval['test_results'] ?? []),
            newTopicMastery: $newMastery,
            cognitiveStatus: $knowledgeState->getCognitiveStatus()->value
        );
    }
}
