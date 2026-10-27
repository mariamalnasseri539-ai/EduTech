<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Assessment\Repositories\AttemptRepositoryInterface;
use App\Domain\Identity\Repositories\StudentRepositoryInterface;
use App\Domain\KnowledgeState\Repositories\KnowledgeStateRepositoryInterface;
use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\Repositories\LessonRepositoryInterface;
use App\Domain\Learning\Services\PromptBuilderService;
use App\Infrastructure\AI\GeminiApiClient;
use App\Infrastructure\ExternalServices\TextToSpeechService;
use App\Infrastructure\Persistence\Firebase\FirebaseClient;
use App\Infrastructure\Persistence\Firebase\Repositories\CacheLessonRepository;
use App\Infrastructure\Persistence\Firebase\Repositories\FirestoreAttemptRepo;
use App\Infrastructure\Persistence\Firebase\Repositories\FirestoreCourseRepo;
use App\Infrastructure\Persistence\Firebase\Repositories\FirestoreKnowledgeRepo;
use App\Infrastructure\Persistence\Firebase\Repositories\FirestoreStudentRepo;
use App\Infrastructure\Validation\JSONValidatorService;
use Illuminate\Support\ServiceProvider;

final class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Core Singletons
        $this->app->singleton(FirebaseClient::class);
        $this->app->singleton(JSONValidatorService::class);
        $this->app->singleton(PromptBuilderService::class);
        $this->app->singleton(TextToSpeechService::class);

        $this->app->singleton(GeminiApiClient::class, function ($app) {
            return new GeminiApiClient(
                validatorService: $app->make(JSONValidatorService::class),
                apiKey: config('gemini.api_key', env('GEMINI_API_KEY')),
                model: config('gemini.model', 'gemini-1.5-flash'),
                temperature: (float)config('gemini.temperature', 0.2),
                logger: $app->make('log')
            );
        });

        // Repository Bindings
        $this->app->bind(CourseRepositoryInterface::class, FirestoreCourseRepo::class);
        $this->app->bind(KnowledgeStateRepositoryInterface::class, FirestoreKnowledgeRepo::class);
        $this->app->bind(LessonRepositoryInterface::class, CacheLessonRepository::class);
        $this->app->bind(AttemptRepositoryInterface::class, FirestoreAttemptRepo::class);
        $this->app->bind(StudentRepositoryInterface::class, FirestoreStudentRepo::class);
    }
}
