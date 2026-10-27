<?php

declare(strict_types=1);

return [
    'api_key' => env('GEMINI_API_KEY', ''),
    'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
    'temperature' => (float)env('GEMINI_TEMPERATURE', 0.2),
];
