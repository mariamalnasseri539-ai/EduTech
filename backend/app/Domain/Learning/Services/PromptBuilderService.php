<?php

declare(strict_types=1);

namespace App\Domain\Learning\Services;

use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Enums\CognitiveStatus;
use App\Domain\Learning\ValueObjects\BloomTaxonomyLevel;
use App\Domain\Learning\ValueObjects\DifficultyLevel;
use App\Domain\Learning\ValueObjects\TopicId;

/**
 * Domain Service responsible for synthesizing pedagogical context into rigorous AI prompts.
 * Enforces the Zone of Proximal Development (ZPD) principles and dynamic remediation directives.
 */
final class PromptBuilderService
{
    /**
     * Builds the prompt payload for generating an adaptive lesson.
     *
     * @param StudentKnowledgeState $knowledgeState
     * @param TopicId $topicId
     * @param array<string, mixed> $topicMeta
     * @return array{system_instruction: string, user_prompt: string}
     */
    public function buildLessonPrompt(
        StudentKnowledgeState $knowledgeState,
        TopicId $topicId,
        array $topicMeta
    ): array {
        $skillScore = $knowledgeState->getScoreForTopic($topicId);
        $masteryValue = $skillScore?->getScore() ?? 0.0;
        $difficulty = DifficultyLevel::fromMasteryScore($masteryValue);
        $bloomLevel = $this->determineBloomLevel($masteryValue, $knowledgeState->getCognitiveStatus());

        $weaknesses = $knowledgeState->getWeaknessPointsForTopic($topicId);
        $weaknessSummary = empty($weaknesses)
            ? 'No recorded misconceptions. Deliver foundational conceptual grounding with progressive challenge.'
            : 'CRITICAL REMEDIATION REQUIRED for detected misconceptions: ' . implode('; ', array_map(
                static fn($w) => "Concept '{$w->getConceptTag()}': {$w->getDescription()}",
                $weaknesses
            ));

        $prereqContext = $this->formatPrerequisiteContext($knowledgeState, $topicMeta['prerequisites'] ?? []);

        $systemInstruction = <<<INSTRUCTION
You are an elite Adaptive Pedagogical AI Engine for an advanced computer science and software engineering platform.
Your mandate is strictly governed by the "Zero-Content Cloud Architecture":
- You generate comprehensive, crystal-clear, pedagogically rigorous lesson modules on-the-fly.
- You must adapt precisely to the student's Zone of Proximal Development (ZPD).
- You must address any detected conceptual weaknesses with targeted analogies and step-by-step deconstructions.
- Output MUST be valid JSON adhering strictly to the required schema. Never return Markdown wrapping outside the JSON.
INSTRUCTION;

        $targetConcepts = implode(', ', $topicMeta['target_concepts'] ?? [$topicMeta['title'] ?? $topicId->getValue()]);
        $prereqs = implode(', ', $topicMeta['prerequisites'] ?? ['None']);

        $userPrompt = <<<PROMPT
GENERATE ADAPTIVE LESSON FOR STUDENT:
- Target Topic: {$topicMeta['title']} (ID: {$topicId->getValue()})
- Target Concepts: {$targetConcepts}
- Syllabus Prerequisites: {$prereqs}
- Student Prerequisite Context: {$prereqContext}
- Current Mastery Score: {$masteryValue} (Scale: 0.00 to 1.00)
- Assigned Difficulty Level: {$difficulty->value}
- Assigned Cognitive Bloom Level: {$bloomLevel->value} - {$bloomLevel->pedagogicalDirective()}
- Diagnostic Misconceptions & Weaknesses: {$weaknessSummary}

PEDAGOGICAL INSTRUCTIONS:
1. Generate 3 to 4 sequential Explanation Cards:
   - Card 1: Intuitive Conceptual Foundation & Vivid Real-World Analogy.
   - Card 2: Deep Dive into Mechanism / Architecture / Core Syntax with runnable code snippet.
   - Card 3: Common Pitfalls, Edge Cases, and direct resolution of the student's listed misconceptions.
   - Card 4: Synthesis, Best Practices, and Production Patterns.
2. For each card, generate a `speech_transcript` optimized for Text-to-Speech (TTS):
   - Natural spoken cadence, no markdown asterisks, no raw code symbols spelled out verbatim.
3. Generate 3 high-yield diagnostic multiple-choice questions:
   - Question 1 (Concept Verification): Tests core understanding.
   - Question 2 (Misconception Buster): Designed specifically with plausible distractors targeting known pitfalls.
   - Question 3 (Applied Scenario): Requires analyzing code or architectural trade-offs.
   - For every incorrect option, provide a detailed diagnostic note explaining the specific conceptual error.
4. Generate 1 Practical Code Challenge:
   - Include clear prompt, starter code with comments, test cases (input, expected_output, is_hidden), and solution stub.
PROMPT;

        return [
            'system_instruction' => $systemInstruction,
            'user_prompt' => $userPrompt,
        ];
    }

    /**
     * Builds the prompt payload for verifying a student's code challenge submission.
     *
     * @param string $topicTitle
     * @param string $challengePrompt
     * @param string $submittedCode
     * @param string $language
     * @param array<mixed> $testCases
     * @return array{system_instruction: string, user_prompt: string}
     */
    public function buildCodeVerificationPrompt(
        string $topicTitle,
        string $challengePrompt,
        string $submittedCode,
        string $language,
        array $testCases
    ): array {
        $testCasesJson = json_encode($testCases, JSON_PRETTY_PRINT);

        $systemInstruction = <<<INSTRUCTION
You are an Automated Code Evaluator and Senior Engineering Mentor.
You evaluate student code submissions for correctness, algorithmic efficiency, clean architecture, and edge case resilience.
You must return a structured JSON response matching the code evaluation schema.
INSTRUCTION;

        $userPrompt = <<<PROMPT
EVALUATE STUDENT CODE CHALLENGE SUBMISSION:
- Topic: {$topicTitle}
- Challenge Specification: {$challengePrompt}
- Language: {$language}
- Test Cases to evaluate:
{$testCasesJson}

STUDENT SUBMITTED CODE:
```{$language}
{$submittedCode}
```

EVALUATION DIRECTIVES:
1. Determine if the code correctly implements the specification and passes all test cases.
2. Calculate an execution/correctness score from 0.0 to 1.0.
3. Identify any logical bugs, edge-case failures, or conceptual misunderstandings.
4. If failed, formulate actionable `inferred_weaknesses` detailing the exact misunderstanding.
5. Provide constructive, encouraging pedagogical feedback and an optimized refactored snippet.
PROMPT;

        return [
            'system_instruction' => $systemInstruction,
            'user_prompt' => $userPrompt,
        ];
    }

    /**
     * Builds a prompt for the contextual AI smart assistant drawer.
     */
    public function buildSmartAssistantPrompt(
        string $studentQuestion,
        string $topicTitle,
        string $activeCardTitle,
        string $activeCardMarkdown,
        float $masteryScore
    ): array {
        $systemInstruction = <<<INSTRUCTION
You are a Personal AI Teaching Assistant embedded inside an adaptive learning session.
The student is currently viewing a lesson card and has asked a question.
Provide clear, pedagogically grounded answers. Do not reveal raw exam answers directly; guide the student through Socratic inquiry and concrete examples.
Keep explanations concise, encouraging, and highly relevant to the card context.
INSTRUCTION;

        $userPrompt = <<<PROMPT
Topic: {$topicTitle}
Current Card: {$activeCardTitle}
Current Card Content:
{$activeCardMarkdown}

Student's Current Topic Mastery: {$masteryScore}
Student's Question: "{$studentQuestion}"

Provide a targeted, friendly, and instructive explanation addressing the student's question in markdown format.
PROMPT;

        return [
            'system_instruction' => $systemInstruction,
            'user_prompt' => $userPrompt,
        ];
    }

    private function determineBloomLevel(float $mastery, CognitiveStatus $status): BloomTaxonomyLevel
    {
        if ($status === CognitiveStatus::GuidedReview) {
            return BloomTaxonomyLevel::Understand;
        }

        return match (true) {
            $mastery < 0.25 => BloomTaxonomyLevel::Remember,
            $mastery < 0.50 => BloomTaxonomyLevel::Understand,
            $mastery < 0.70 => BloomTaxonomyLevel::Apply,
            $mastery < 0.85 => BloomTaxonomyLevel::Analyze,
            $mastery < 0.95 => BloomTaxonomyLevel::Evaluate,
            default => BloomTaxonomyLevel::Create,
        };
    }

    /**
     * @param StudentKnowledgeState $knowledgeState
     * @param array<string> $prerequisiteTopicIds
     * @return string
     */
    private function formatPrerequisiteContext(StudentKnowledgeState $knowledgeState, array $prerequisiteTopicIds): string
    {
        if (empty($prerequisiteTopicIds)) {
            return 'Baseline introductory topic; no prior topics required.';
        }

        $reports = [];
        foreach ($prerequisiteTopicIds as $preReqId) {
            $score = $knowledgeState->getScoreForTopic(new TopicId($preReqId));
            $val = $score ? round($score->getScore() * 100, 1) . '%' : 'Unassessed';
            $reports[] = "{$preReqId} (Mastery: {$val})";
        }

        return implode(', ', $reports);
    }
}
