<?php

declare(strict_types=1);

namespace App\Domain\Learning\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object representing a unique topic identifier in the course syllabus.
 */
final readonly class TopicId
{
    private string $value;

    public function __construct(string $value)
    {
        $trimmed = trim($value);
        if (empty($trimmed)) {
            throw new InvalidArgumentException('Topic ID cannot be empty.');
        }

        if (!preg_match('/^[a-z0-9\-_.]+$/i', $trimmed)) {
            throw new InvalidArgumentException("Topic ID '{$trimmed}' contains invalid characters. Use alphanumeric, dashes, dots, or underscores.");
        }

        $this->value = $trimmed;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(TopicId $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
