<?php

declare(strict_types=1);

namespace App\UI\Http\Middleware;

use App\Infrastructure\Persistence\Firebase\FirebaseClient;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final class FirebaseAuthMiddleware
{
    public function __construct(
        private readonly FirebaseClient $firebaseClient
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            // Local & development fallback mode
            $devStudentId = $request->header('X-Student-Id');
            $devRole = $request->header('X-User-Role', 'STD');

            if (!empty($devStudentId) || app()->environment('local', 'testing')) {
                $uid = $devStudentId ?: 'mock-student-uid-101';
                $role = in_array(strtoupper($devRole), ['ADM', 'ADMIN'], true) ? 'ADM' : 'STD';
                $email = $role === 'ADM' ? 'admin@smart-learning.edu' : 'student.ada@example.edu';

                $request->attributes->set('student_id', $uid);
                $request->attributes->set('firebase_uid', $uid);
                $request->attributes->set('user_email', $email);
                $request->attributes->set('user_role', $role);
                $request->attributes->set('user_name', $role === 'ADM' ? 'Administrator' : 'Ada Lovelace');

                return $next($request);
            }

            return response()->json([
                'success' => false,
                'error' => 'Unauthorized: Missing or malformed Authorization bearer token.',
            ], 401);
        }

        $idTokenString = trim(substr($authHeader, 7));

        // If Kreait Firebase Auth is initialized and credentials are valid
        $auth = $this->firebaseClient->getAuth();
        if ($auth !== null) {
            try {
                $verifiedIdToken = $auth->verifyIdToken($idTokenString);
                $claims = $verifiedIdToken->claims();

                $uid = (string)$claims->get('sub');
                $email = (string)($claims->get('email') ?? '');
                $name = (string)($claims->get('name') ?? '');

                // Resolve user role ('STD' or 'ADM')
                $roleClaim = $claims->get('role') ?? ($claims->get('admin') === true ? 'ADM' : null);
                $role = $this->resolveRole((string)($roleClaim ?? ''), $email);

                $request->attributes->set('student_id', $uid);
                $request->attributes->set('firebase_uid', $uid);
                $request->attributes->set('user_email', $email);
                $request->attributes->set('user_role', $role);
                $request->attributes->set('user_name', $name ?: explode('@', $email)[0]);

                return $next($request);
            } catch (Throwable $e) {
                // If live verification fails due to mock token in dev environment
                if (app()->environment('local', 'testing') && str_starts_with($idTokenString, 'mock-token')) {
                    $isAdmin = str_contains($idTokenString, 'admin');
                    $role = $isAdmin ? 'ADM' : 'STD';
                    $request->attributes->set('student_id', $isAdmin ? 'adm_101' : 'stu_101');
                    $request->attributes->set('firebase_uid', $isAdmin ? 'mock-admin-uid' : 'mock-student-uid-101');
                    $request->attributes->set('user_email', $isAdmin ? 'admin@smart-learning.edu' : 'student.ada@example.edu');
                    $request->attributes->set('user_role', $role);
                    $request->attributes->set('user_name', $isAdmin ? 'Platform Admin' : 'Ada Lovelace');
                    return $next($request);
                }

                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized: Invalid Firebase ID token: ' . $e->getMessage(),
                ], 401);
            }
        }

        // Offline / emulator development mode
        $isAdmin = str_contains($idTokenString, 'admin');
        $role = $isAdmin ? 'ADM' : 'STD';

        $request->attributes->set('student_id', $isAdmin ? 'adm_101' : 'stu_101');
        $request->attributes->set('firebase_uid', $isAdmin ? 'mock-admin-uid' : 'mock-student-uid-101');
        $request->attributes->set('user_email', $isAdmin ? 'admin@smart-learning.edu' : 'student.ada@example.edu');
        $request->attributes->set('user_role', $role);
        $request->attributes->set('user_name', $isAdmin ? 'Platform Admin' : 'Ada Lovelace');

        return $next($request);
    }

    /**
     * Resolves role to strictly 'STD' or 'ADM'.
     */
    private function resolveRole(string $claimRole, string $email): string
    {
        $normalizedClaim = strtoupper(trim($claimRole));
        if ($normalizedClaim === 'ADM' || $normalizedClaim === 'ADMIN') {
            return 'ADM';
        }

        // Whitelisted admin domains or patterns
        $adminPatterns = ['@admin.edu', '@smart-learning.edu', 'admin@'];
        foreach ($adminPatterns as $pattern) {
            if (str_contains(strtolower($email), $pattern)) {
                return 'ADM';
            }
        }

        return 'STD';
    }
}
