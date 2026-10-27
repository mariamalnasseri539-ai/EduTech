<?php

declare(strict_types=1);

namespace App\UI\Http\Controllers;

use App\Domain\Identity\Entities\Student;
use App\Domain\Identity\Repositories\StudentRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AuthController
{
    public function __construct(
        private readonly StudentRepositoryInterface $studentRepository
    ) {}

    /**
     * Verifies Firebase token and synchronizes the student document in Firestore.
     * Endpoint: POST /api/auth/sync-user
     */
    public function syncUser(Request $request): JsonResponse
    {
        $firebaseUid = (string)$request->attributes->get('firebase_uid');
        $email = (string)$request->attributes->get('user_email');
        $role = (string)$request->attributes->get('user_role', 'STD');
        $defaultName = (string)$request->attributes->get('user_name');

        // Optional request inputs
        $displayName = $request->input('display_name', $defaultName) ?: explode('@', $email)[0];

        $student = $this->studentRepository->findByFirebaseUid($firebaseUid);

        if ($student === null) {
            // New user registration in Firestore
            $studentId = 'stu_' . substr(md5($firebaseUid), 0, 10);
            $student = new Student(
                id: $studentId,
                firebaseUid: $firebaseUid,
                email: $email,
                displayName: $displayName,
                role: $role,
                placementCompleted: false,
                enrolledCourses: ['cs-advanced-js']
            );
            $this->studentRepository->save($student);
        } else {
            // Existing user login sync
            $student->recordLogin();
            if (!empty($displayName) && $displayName !== $student->getDisplayName()) {
                $student->setDisplayName($displayName);
            }
            if ($role === 'ADM') {
                $student->setRole('ADM');
            }
            $this->studentRepository->save($student);
        }

        return response()->json([
            'success' => true,
            'message' => 'User identity synchronized successfully.',
            'user' => $student->toFirestore(),
            'role' => $student->getRole(),
            'placement_completed' => $student->isPlacementCompleted(),
        ]);
    }

    /**
     * Retrieves the current authenticated user profile.
     * Endpoint: GET /api/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        $firebaseUid = (string)$request->attributes->get('firebase_uid');
        $student = $this->studentRepository->findByFirebaseUid($firebaseUid);

        if ($student === null) {
            return $this->syncUser($request);
        }

        return response()->json([
            'success' => true,
            'user' => $student->toFirestore(),
            'role' => $student->getRole(),
            'placement_completed' => $student->isPlacementCompleted(),
        ]);
    }
}
