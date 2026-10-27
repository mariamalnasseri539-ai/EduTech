<?php

declare(strict_types=1);

namespace App\UI\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CheckAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $role = $request->attributes->get('user_role') ?? $request->header('X-User-Role');

        if ($role === 'ADM' || $role === 'admin') {
            return $next($request);
        }

        $email = (string)$request->attributes->get('user_email', '');
        if (str_ends_with($email, '@admin.edu') || str_ends_with($email, '@smart-learning.edu')) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'error' => 'Forbidden: Administrative privileges (role: ADM) required.',
        ], 403);
    }
}
