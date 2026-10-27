<?php

declare(strict_types=1);

namespace App\Domain\Identity\Repositories;

use App\Domain\Identity\Entities\Student;

/**
 * Interface for reading and persisting Student identity profiles in Cloud Firestore.
 */
interface StudentRepositoryInterface
{
    public function findByFirebaseUid(string $firebaseUid): ?Student;

    public function findById(string $id): ?Student;

    public function save(Student $student): void;

    /**
     * @return array<Student>
     */
    public function getAllStudents(): array;
}
