<?php

declare(strict_types=1);

namespace App\Domain\KnowledgeState\Enums;

/**
 * Represents the current cognitive processing status of a student within an educational track.
 */
enum CognitiveStatus: string
{
    case Unassessed = 'Unassessed';
    case ActiveLearning = 'ActiveLearning';
    case Assessing = 'Assessing';
    case GuidedReview = 'GuidedReview';
    case Mastered = 'Mastered';

    public function label(): string
    {
        return match ($this) {
            self::Unassessed => 'Unassessed - Diagnostic Placement Pending',
            self::ActiveLearning => 'Active Learning - Conceptual Assimilation',
            self::Assessing => 'Assessing - Formative Knowledge Verification',
            self::GuidedReview => 'Guided Review - Targeted Misconception Remediation',
            self::Mastered => 'Mastered - Competency Verified',
        };
    }

    public function allowsNextTopic(): bool
    {
        return $this === self::Mastered;
    }
}
