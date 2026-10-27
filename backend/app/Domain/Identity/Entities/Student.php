<?php

declare(strict_types=1);

namespace App\Domain\Identity\Entities;

use DateTimeImmutable;

/**
 * Entity representing an authenticated student profile.
 * Stored in Firestore under students/{firebaseUid}
 */
final class Student
{
    /**
     * @param string $id
     * @param string $firebaseUid
     * @param string $email
     * @param string $displayName
     * @param string $role 'STD' for Student, 'ADM' for Admin
     * @param bool $placementCompleted
     * @param array<string> $enrolledCourses
     * @param string $preferredLanguage
     * @param DateTimeImmutable $createdAt
     * @param DateTimeImmutable|null $lastLoginAt
     */
    public function __construct(
        private readonly string $id,
        private readonly string $firebaseUid,
        private readonly string $email,
        private string $displayName,
        private string $role = 'STD',
        private bool $placementCompleted = false,
        private array $enrolledCourses = [],
        private string $preferredLanguage = 'en-US',
        private readonly DateTimeImmutable $createdAt = new DateTimeImmutable(),
        private ?DateTimeImmutable $lastLoginAt = null
    ) {
        $this->lastLoginAt = $lastLoginAt ?? new DateTimeImmutable();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getFirebaseUid(): string
    {
        return $this->firebaseUid;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getDisplayName(): string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $name): void
    {
        $this->displayName = $name;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): void
    {
        $this->role = in_array($role, ['STD', 'ADM'], true) ? $role : 'STD';
    }

    public function isPlacementCompleted(): bool
    {
        return $this->placementCompleted;
    }

    public function setPlacementCompleted(bool $completed): void
    {
        $this->placementCompleted = $completed;
    }

    /**
     * @return array<string>
     */
    public function getEnrolledCourses(): array
    {
        return $this->enrolledCourses;
    }

    public function enrollCourse(string $courseId): void
    {
        if (!in_array($courseId, $this->enrolledCourses, true)) {
            $this->enrolledCourses[] = $courseId;
        }
    }

    public function getPreferredLanguage(): string
    {
        return $this->preferredLanguage;
    }

    public function setPreferredLanguage(string $lang): void
    {
        $this->preferredLanguage = $lang;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getLastLoginAt(): ?DateTimeImmutable
    {
        return $this->lastLoginAt;
    }

    public function recordLogin(): void
    {
        $this->lastLoginAt = new DateTimeImmutable();
    }

    /**
     * @return array<string, mixed>
     */
    public function toFirestore(): array
    {
        return [
            'id' => $this->id,
            'firebase_uid' => $this->firebaseUid,
            'email' => $this->email,
            'display_name' => $this->displayName,
            'role' => $this->role,
            'placement_completed' => $this->placementCompleted,
            'enrolled_courses' => $this->enrolledCourses,
            'preferred_language' => $this->preferredLanguage,
            'created_at' => $this->createdAt->format(DATE_ATOM),
            'last_login_at' => $this->lastLoginAt?->format(DATE_ATOM),
        ];
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromFirestore(array $data): self
    {
        $createdAt = isset($data['created_at'])
            ? new DateTimeImmutable((string)$data['created_at'])
            : new DateTimeImmutable();

        $lastLoginAt = isset($data['last_login_at'])
            ? new DateTimeImmutable((string)$data['last_login_at'])
            : new DateTimeImmutable();

        return new self(
            id: (string)($data['id'] ?? $data['firebase_uid'] ?? ''),
            firebaseUid: (string)($data['firebase_uid'] ?? ''),
            email: (string)($data['email'] ?? ''),
            displayName: (string)($data['display_name'] ?? 'Student'),
            role: (string)($data['role'] ?? 'STD'),
            placementCompleted: (bool)($data['placement_completed'] ?? false),
            enrolledCourses: (array)($data['enrolled_courses'] ?? []),
            preferredLanguage: (string)($data['preferred_language'] ?? 'en-US'),
            createdAt: $createdAt,
            lastLoginAt: $lastLoginAt
        );
    }
}
