<?php

declare(strict_types=1);

namespace App\Domain\Identity\Entities;

use DateTimeImmutable;

/**
 * Entity representing an administrator or curriculum designer.
 */
final class Admin
{
    /**
     * @param string $id
     * @param string $firebaseUid
     * @param string $email
     * @param string $displayName
     * @param array<string> $permissions
     * @param DateTimeImmutable $createdAt
     */
    public function __construct(
        private readonly string $id,
        private readonly string $firebaseUid,
        private readonly string $email,
        private readonly string $displayName,
        private readonly array $permissions = ['manage_syllabi', 'view_analytics'],
        private readonly DateTimeImmutable $createdAt = new DateTimeImmutable()
    ) {}

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

    /**
     * @return array<string>
     */
    public function getPermissions(): array
    {
        return $this->permissions;
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions, true) || in_array('*', $this->permissions, true);
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }
}
