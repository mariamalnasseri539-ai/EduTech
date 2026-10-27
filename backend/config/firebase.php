<?php

declare(strict_types=1);

return [
    'default' => 'app',
    'projects' => [
        'app' => [
            'project_id' => env('FIREBASE_PROJECT_ID', 'smart-learning-platform-98dac'),
            'credentials' => env('FIREBASE_CREDENTIALS', storage_path('app/firebase/firebase-credentials.json')),
            'auth' => [
                'tenant_id' => env('FIREBASE_AUTH_TENANT_ID'),
            ],
            'firestore' => [
                'database' => env('FIREBASE_FIRESTORE_DATABASE', '(default)'),
            ],
        ],
    ],
];
