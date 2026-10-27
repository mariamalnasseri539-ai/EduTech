<?php

declare(strict_types=1);

namespace App\Application\UseCases\Learning;

use App\Application\DTOs\AdaptiveLessonResponseDTO;
use App\Domain\KnowledgeState\Entities\StudentKnowledgeState;
use App\Domain\KnowledgeState\Enums\CognitiveStatus;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Entities\ExplanationCard;
use App\Domain\Learning\Entities\Lesson;
use App\Domain\Learning\Entities\Question;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\Repositories\LessonRepositoryInterface;
use App\Domain\Learning\Services\PromptBuilderService;
use App\Domain\Learning\ValueObjects\BloomTaxonomyLevel;
use App\Domain\Learning\ValueObjects\DifficultyLevel;
use App\Domain\Learning\ValueObjects\TopicId;
use App\Infrastructure\AI\GeminiApiClient;
use App\Infrastructure\ExternalServices\TextToSpeechService;
use InvalidArgumentException;
use RuntimeException;

final class RequestAdaptiveLessonUseCase
{
    public function __construct(
        private readonly CourseRepositoryInterface $courseRepository,
        private readonly KnowledgeStateRepositoryInterface $knowledgeRepository,
        private readonly LessonRepositoryInterface $lessonRepository,
        private readonly PromptBuilderService $promptBuilder,
        private readonly GeminiApiClient $geminiClient,
        private readonly TextToSpeechService $ttsService
    ) {}

    public function execute(
        string $studentId,
        string $courseId,
        ?string $requestedTopicId = null
    ): AdaptiveLessonResponseDTO {
        $topicMap = $this->courseRepository->getTopicMap($courseId);
        if (empty($topicMap)) {
            throw new InvalidArgumentException("Course topic map not found for course: {$courseId}");
        }

        // 1. Retrieve or initialize student's knowledge state
        $knowledgeState = $this->knowledgeRepository->findByStudentAndCourse($studentId, $courseId);
        if ($knowledgeState === null) {
            $knowledgeState = new StudentKnowledgeState(
                studentId: $studentId,
                courseId: $courseId,
                cognitiveStatus: CognitiveStatus::ActiveLearning
            );
        }

        // 2. Compute current Zone of Proximal Development
        $knowledgeState->recomputeZPD($topicMap);
        $this->knowledgeRepository->save($knowledgeState);

        // 3. Resolve target topic
        $targetTopicIdStr = $requestedTopicId;
        if (empty($targetTopicIdStr)) {
            $zpd = $knowledgeState->getZoneOfProximalDevelopment();
            $targetTopicIdStr = $zpd[0] ?? array_key_first($topicMap);
        }

        $topicId = new TopicId((string)$targetTopicIdStr);
        $topicMeta = $topicMap[$topicId->getValue()] ?? null;
        if ($topicMeta === null) {
            throw new InvalidArgumentException("Topic '{$topicId->getValue()}' does not exist in syllabus.");
        }

        // 4. Synthesize pedagogical prompt
        $promptData = $this->promptBuilder->buildLessonPrompt($knowledgeState, $topicId, $topicMeta);

        // 5. Invoke Gemini with strict JSON Schema Draft 2020-12 and silent auto-retry
        $schemaPath = base_path('app/Infrastructure/Validation/Schemas/adaptive_lesson_schema_2020_12.json');
        if (!file_exists($schemaPath)) {
            $schemaPath = __DIR__ . '/../../../Infrastructure/Validation/Schemas/adaptive_lesson_schema_2020_12.json';
        }

        $payload = $this->geminiClient->generateStructuredJson(
            $promptData['system_instruction'],
            $promptData['user_prompt'],
            $schemaPath
        );

        // 6. Map payload to Domain Entities
        $cards = array_map(function (array $c) {
            $speech = $c['speech_transcript'] ?? '';
            $optimizedSpeech = $this->ttsService->formatForSpeech($speech);

            return new ExplanationCard(
                cardId: (string)($c['card_id'] ?? bin2hex(random_bytes(4))),
                title: (string)($c['title'] ?? 'Concept Overview'),
                summary: (string)($c['summary'] ?? ''),
                contentMarkdown: (string)($c['content_markdown'] ?? ''),
                keyTakeaways: (array)($c['key_takeaways'] ?? []),
                analogy: $c['analogy'] ?? null,
                codeSnippet: $c['code_snippet'] ?? null,
                speechTranscript: $optimizedSpeech
            );
        }, $payload['cards'] ?? []);

        $questions = array_map(static function (array $q) {
            return new Question(
                questionId: (string)($q['question_id'] ?? bin2hex(random_bytes(4))),
                prompt: (string)($q['prompt'] ?? ''),
                options: (array)($q['options'] ?? []),
                correctOptionIndex: (int)($q['correct_option_index'] ?? 0),
                explanation: (string)($q['explanation'] ?? ''),
                misconceptionNotes: (array)($q['misconception_notes'] ?? []),
                hint: (string)($q['hint'] ?? ''),
                conceptTested: (string)($q['concept_tested'] ?? '')
            );
        }, $payload['questions'] ?? []);

        $lesson = new Lesson(
            lessonId: (string)($payload['lesson_id'] ?? ('les_' . bin2hex(random_bytes(6)))),
            topicId: $topicId,
            topicTitle: (string)($payload['topic_title'] ?? $topicMeta['title']),
            difficulty: DifficultyLevel::tryFrom((string)($payload['difficulty'] ?? '')) ?? DifficultyLevel::Intermediate,
            targetBloom: BloomTaxonomyLevel::tryFrom((string)($payload['target_bloom'] ?? '')) ?? BloomTaxonomyLevel::Understand,
            cards: $cards,
            questions: $questions,
            codeChallenge: $payload['code_challenge'] ?? null,
            zpdRationale: (string)($payload['zpd_rationale'] ?? '')
        );

        // 7. Cache ephemeral active lesson session for answer verification
        $this->lessonRepository->cacheActiveLesson($studentId, $lesson);

        return new AdaptiveLessonResponseDTO(
            lessonId: $lesson->getLessonId(),
            topicId: $lesson->getTopicId()->getValue(),
            topicTitle: $lesson->getTopicTitle(),
            difficulty: $lesson->getDifficulty()->value,
            targetBloom: $lesson->getTargetBloom()->value,
            zpdRationale: $lesson->getZpdRationale(),
            cards: array_map(static fn(ExplanationCard $c) => $c->toArray(), $lesson->getCards()),
            questions: array_map(static fn(Question $q) => $q->toArray(), $lesson->getQuestions()),
            codeChallenge: $lesson->getCodeChallenge(),
            currentKnowledgeState: $knowledgeState->toFirestore()
        );
    }
}
