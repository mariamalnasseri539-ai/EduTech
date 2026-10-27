<?php

declare(strict_types=1);

namespace App\Application\UseCases\Learning;

use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\Repositories\LessonRepositoryInterface;
use App\Domain\Learning\Services\PromptBuilderService;
use App\Domain\Learning\ValueObjects\TopicId;
use App\Infrastructure\AI\GeminiApiClient;
use InvalidArgumentException;

final class AskSmartAssistantUseCase
{
    public function __construct(
        private readonly CourseRepositoryInterface $courseRepository,
        private readonly KnowledgeStateRepositoryInterface $knowledgeRepository,
        private readonly LessonRepositoryInterface $lessonRepository,
        private readonly PromptBuilderService $promptBuilder,
        private readonly GeminiApiClient $geminiClient
    ) {}

    /**
     * @return array{response: string, topic_id: string, card_id: string}
     */
    public function execute(
        string $studentId,
        string $courseId,
        string $lessonId,
        string $cardId,
        string $studentQuestion
    ): array {
        $lesson = $this->lessonRepository->getActiveLesson($studentId, $lessonId);
        $cardTitle = 'Active Lesson Context';
        $cardMarkdown = '';
        $topicTitle = 'Computer Science Module';

        if ($lesson !== null) {
            $topicTitle = $lesson->getTopicTitle();
            foreach ($lesson->getCards() as $card) {
                if ($card->getCardId() === $cardId) {
                    $cardTitle = $card->getTitle();
                    $cardMarkdown = $card->getContentMarkdown();
                    break;
                }
            }
        }

        $knowledgeState = $this->knowledgeRepository->findByStudentAndCourse($studentId, $courseId);
        $mastery = 0.5;
        if ($knowledgeState !== null && $lesson !== null) {
            $score = $knowledgeState->getScoreForTopic($lesson->getTopicId());
            $mastery = $score?->getScore() ?? 0.5;
        }

        $promptData = $this->promptBuilder->buildSmartAssistantPrompt(
            studentQuestion: $studentQuestion,
            topicTitle: $topicTitle,
            activeCardTitle: $cardTitle,
            activeCardMarkdown: $cardMarkdown,
            masteryScore: $mastery
        );

        $responseMarkdown = $this->geminiClient->callGeminiApi(
            $promptData['system_instruction'],
            $promptData['user_prompt']
        );

        return [
            'response' => $responseMarkdown,
            'topic_id' => $lesson?->getTopicId()->getValue() ?? '',
            'card_id' => $cardId,
        ];
    }
}
