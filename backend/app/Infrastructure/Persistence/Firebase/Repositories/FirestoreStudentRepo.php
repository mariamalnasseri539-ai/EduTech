<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase\Repositories;

use App\Domain\Identity\Entities\Student;
use App\Domain\Identity\Repositories\StudentRepositoryInterface;
use App\Infrastructure\Persistence\Firebase\FirebaseClient;

final class FirestoreStudentRepo implements StudentRepositoryInterface
{
    private const COLLECTION = 'students';

    public function __construct(
        private readonly FirebaseClient $firebase
    ) {}

    public function findByFirebaseUid(string $firebaseUid): ?Student
    {
        $doc = $this->firebase->getDocument(self::COLLECTION, $firebaseUid);
        if ($doc === null) {
            // Check by id or iterate
            $all = $this->firebase->getAllDocuments(self::COLLECTION);
            foreach ($all as $item) {
                if (($item['firebase_uid'] ?? '') === $firebaseUid) {
                    return Student::fromFirestore($item);
                }
            }
            return null;
        }

        return Student::fromFirestore($doc);
    }

    public function findById(string $id): ?Student
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);
        foreach ($all as $item) {
            if (($item['id'] ?? '') === $id) {
                return Student::fromFirestore($item);
            }
        }
        return null;
    }

    public function save(Student $student): void
    {
        $this->firebase->setDocument(
            self::COLLECTION,
            $student->getFirebaseUid(),
            $student->toFirestore()
        );
    }

    public function getAllStudents(): array
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);
        return array_map(static fn($data) => Student::fromFirestore($data), array_values($all));
    }
}
