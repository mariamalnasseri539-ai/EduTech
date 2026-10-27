<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase\Repositories;

use App\Domain\Learning\Entities\ExplanationCard;
use App\Domain\Learning\Entities\Lesson;
use App\Domain\Learning\Entities\Question;
use App\Domain\Learning\Repositories\LessonRepositoryInterface;
use App\Domain\Learning\ValueObjects\BloomTaxonomyLevel;
use App\Domain\Learning\ValueObjects\DifficultyLevel;
use App\Domain\Learning\ValueObjects\TopicId;
use DateTimeImmutable;
use Illuminate\Support\Facades\Cache;

/**
 * Ephemeral in-memory/cache store for transient lesson sessions.
 * Never persists lesson content into Firestore (preserving Zero-Content paradigm).
 */
final class CacheLessonRepository implements LessonRepositoryInterface
{
    private static array $inMemoryLessons = [];

    public function cacheActiveLesson(string $studentId, Lesson $lesson, int $ttlSeconds = 3600): void
    {
        $key = "active_lesson_{$studentId}_{$lesson->getLessonId()}";
        $data = $lesson->toArray();

        try {
            Cache::put($key, $data, $ttlSeconds);
        } catch (\Throwable) {
            // In unit tests or minimal environments where Cache facade isn't booted
            self::$inMemoryLessons[$key] = $data;
        }
    }

    public function getActiveLesson(string $studentId, string $lessonId): ?Lesson
    {
        $key = "active_lesson_{$studentId}_{$lessonId}";
        $data = null;

        try {
            $data = Cache::get($key);
        } catch (\Throwable) {
            $data = self::$inMemoryLessons[$key] ?? null;
        }

        if ($data === null) {
            $data = self::$inMemoryLessons[$key] ?? null;
        }

        if ($data === null || !is_array($data)) {
            return null;
        }

        $cards = array_map(static function (array $c) {
            return new ExplanationCard(
                cardId: (string)$c['card_id'],
                title: (string)$c['title'],
                summary: (string)$c['summary'],
                contentMarkdown: (string)$c['content_markdown'],
                keyTakeaways: (array)($c['key_takeaways'] ?? []),
                analogy: $c['analogy'] ?? null,
                codeSnippet: $c['code_snippet'] ?? null,
                speechTranscript: (string)($c['speech_transcript'] ?? '')
            );
        }, $data['cards'] ?? []);

        $questions = array_map(static function (array $q) {
            return new Question(
                questionId: (string)$q['question_id'],
                prompt: (string)$q['prompt'],
                options: (array)($q['options'] ?? []),
                correctOptionIndex: (int)($q['correct_option_index'] ?? 0),
                explanation: (string)($q['explanation'] ?? ''),
                misconceptionNotes: (array)($q['misconception_notes'] ?? []),
                hint: (string)($q['hint'] ?? ''),
                conceptTested: (string)($q['concept_tested'] ?? '')
            );
        }, $data['questions'] ?? []);

        return new Lesson(
            lessonId: (string)$data['lesson_id'],
            topicId: new TopicId((string)$data['topic_id']),
            topicTitle: (string)$data['topic_title'],
            difficulty: DifficultyLevel::from((string)$data['difficulty']),
            targetBloom: BloomTaxonomyLevel::from((string)$data['target_bloom']),
            cards: $cards,
            questions: $questions,
            codeChallenge: $data['code_challenge'] ?? null,
            zpdRationale: (string)($data['zpd_rationale'] ?? ''),
            generatedAt: new DateTimeImmutable((string)($data['generated_at'] ?? 'now'))
        );
    }

    public function clearActiveLesson(string $studentId, string $lessonId): void
    {
        $key = "active_lesson_{$studentId}_{$lessonId}";
        try {
            Cache::forget($key);
        } catch (\Throwable) {
            unset(self::$inMemoryLessons[$key]);
        }
    }
}
