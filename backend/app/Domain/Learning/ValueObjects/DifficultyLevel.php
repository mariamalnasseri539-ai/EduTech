<?php

declare(strict_types=1);

namespace App\Domain\Learning\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object representing the difficulty tier of generated adaptive content.
 */
enum DifficultyLevel: string
{
    case Beginner = 'beginner';
    case Intermediate = 'intermediate';
    case Advanced = 'advanced';
    case Mastery = 'mastery';

    public function numericWeight(): float
    {
        return match ($this) {
            self::Beginner => 0.25,
            self::Intermediate => 0.50,
            self::Advanced => 0.75,
            self::Mastery => 1.00,
        };
    }

    public static function fromMasteryScore(float $score): self
    {
        return match (true) {
            $score < 0.35 => self::Beginner,
            $score < 0.70 => self::Intermediate,
            $score < 0.90 => self::Advanced,
            default => self::Mastery,
        };
    }

    public function next(): self
    {
        return match ($this) {
            self::Beginner => self::Intermediate,
            self::Intermediate => self::Advanced,
            self::Advanced, self::Mastery => self::Mastery,
        };
    }

    public function previous(): self
    {
        return match ($this) {
            self::Beginner => self::Beginner,
            self::Intermediate => self::Beginner,
            self::Advanced => self::Intermediate,
            self::Mastery => self::Advanced,
        };
    }
}
