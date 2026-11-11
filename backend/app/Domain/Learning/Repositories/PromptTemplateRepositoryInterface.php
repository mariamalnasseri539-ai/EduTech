<?php

declare(strict_types=1);

namespace App\Domain\Learning\Repositories;

interface PromptTemplateRepositoryInterface
{
    /**
     * Retrieve all prompt templates, optionally filtered by category.
     *
     * @param string|null $category
     * @return array<int, array<string, mixed>>
     */
    public function getAllPrompts(?string $category = null): array;

    /**
     * Retrieve a single prompt template by its ID.
     *
     * @param string $promptId
     * @return array<string, mixed>|null
     */
    public function getPrompt(string $promptId): ?array;

    /**
     * Retrieve the active prompt template for a specific category and course.
     *
     * @param string $category
     * @param string|null $courseId
     * @return array<string, mixed>|null
     */
    public function getActivePrompt(string $category, ?string $courseId = null): ?array;

    /**
     * Save (create or update) a prompt template in Cloud Firestore.
     *
     * @param array<string, mixed> $promptData
     * @return array<string, mixed>
     */
    public function savePrompt(array $promptData): array;

    /**
     * Delete a prompt template from Cloud Firestore.
     *
     * @param string $promptId
     * @return bool
     */
    public function deletePrompt(string $promptId): bool;
}
