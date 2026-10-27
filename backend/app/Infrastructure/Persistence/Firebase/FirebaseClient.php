<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase;

use Google\Cloud\Firestore\FirestoreClient;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Contract\Firestore;
use Kreait\Firebase\Factory;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Service providing initialized connections to Cloud Firestore and Firebase Auth.
 * Includes resilient local caching fallback if running offline or in unit tests.
 */
final class FirebaseClient
{
    private ?FirestoreClient $firestore = null;
    private ?Auth $auth = null;
    private array $localMemoryStore = [];

    public function __construct(
        private readonly ?LoggerInterface $logger = null
    ) {
        $this->initializeFirebase();
    }

    private function initializeFirebase(): void
    {
        $credentialsPath = config('firebase.projects.app.credentials') ?? env('FIREBASE_CREDENTIALS');

        if (!empty($credentialsPath) && file_exists((string)$credentialsPath)) {
            try {
                $factory = (new Factory())->withServiceAccount($credentialsPath);
                $this->auth = $factory->createAuth();
                $firestoreComponent = $factory->createFirestore();
                $this->firestore = $firestoreComponent->database();
                $this->logger?->info('Firebase successfully connected to live Cloud Firestore.');
                return;
            } catch (Throwable $e) {
                $this->logger?->warning('Failed initializing live Firebase SDK: ' . $e->getMessage() . '. Falling back to local emulator state.');
            }
        } else {
            $this->logger?->notice('FIREBASE_CREDENTIALS not specified or file not found. Operating with in-memory persistence adapter.');
        }

        $this->seedInitialCourseCatalog();
    }

    public function getFirestore(): ?FirestoreClient
    {
        return $this->firestore;
    }

    public function getAuth(): ?Auth
    {
        return $this->auth;
    }

    public function isLive(): bool
    {
        return $this->firestore !== null;
    }

    /**
     * Reads a document from a collection.
     *
     * @param string $collection
     * @param string $documentId
     * @return array<string, mixed>|null
     */
    public function getDocument(string $collection, string $documentId): ?array
    {
        if ($this->firestore !== null) {
            $snapshot = $this->firestore->collection($collection)->document($documentId)->snapshot();
            return $snapshot->exists() ? (array)$snapshot->data() : null;
        }

        return $this->localMemoryStore[$collection][$documentId] ?? null;
    }

    /**
     * Writes or overwrites a document in a collection.
     *
     * @param string $collection
     * @param string $documentId
     * @param array<string, mixed> $data
     */
    public function setDocument(string $collection, string $documentId, array $data): void
    {
        if ($this->firestore !== null) {
            $this->firestore->collection($collection)->document($documentId)->set($data, ['merge' => true]);
            return;
        }

        $this->localMemoryStore[$collection][$documentId] = $data;
    }

    /**
     * Queries all documents in a collection.
     *
     * @param string $collection
     * @return array<string, array<string, mixed>>
     */
    public function getAllDocuments(string $collection): array
    {
        if ($this->firestore !== null) {
            $docs = [];
            foreach ($this->firestore->collection($collection)->documents() as $doc) {
                if ($doc->exists()) {
                    $docs[$doc->id()] = (array)$doc->data();
                }
            }
            return $docs;
        }

        return $this->localMemoryStore[$collection] ?? [];
    }

    /**
     * Seeds initial course topic maps / syllabi in local store.
     * Note: strictly zero-content—only titles, prerequisites, and target concepts!
     */
    private function seedInitialCourseCatalog(): void
    {
        $this->localMemoryStore['courses']['cs-advanced-js'] = [
            'id' => 'cs-advanced-js',
            'title' => 'Advanced JavaScript: Runtime Architecture & Concurrency',
            'description' => 'Zero-content adaptive course exploring the V8 runtime, Event Loop, closures, and asynchronous concurrency.',
            'category' => 'Computer Science',
            'estimated_hours' => 24,
            'topic_map' => [
                'js-call-stack' => [
                    'id' => 'js-call-stack',
                    'title' => 'The Execution Context & Call Stack',
                    'description' => 'Execution contexts, lexical environments, variable hoisting, and stack frame lifecycle.',
                    'prerequisites' => [],
                    'target_concepts' => ['Execution Context', 'Call Stack', 'Variable Environment', 'Hoisting'],
                    'category' => 'Runtime Fundamentals',
                    'order' => 1,
                ],
                'js-lexical-scope' => [
                    'id' => 'js-lexical-scope',
                    'title' => 'Lexical Scope & Closures',
                    'description' => 'Scope chain resolution, outer environment references, closure memory retention.',
                    'prerequisites' => ['js-call-stack'],
                    'target_concepts' => ['Scope Chain', 'Lexical Environment', 'Closures', 'Memory Leaks'],
                    'category' => 'Runtime Fundamentals',
                    'order' => 2,
                ],
                'async-event-loop' => [
                    'id' => 'async-event-loop',
                    'title' => 'Asynchronous Concurrency & The Event Loop',
                    'description' => 'Non-blocking I/O, Web APIs, Macrotasks, Microtask queue ordering, and starvation.',
                    'prerequisites' => ['js-call-stack', 'js-lexical-scope'],
                    'target_concepts' => ['Event Loop', 'Microtask Queue', 'Macrotask Queue', 'Non-blocking I/O'],
                    'category' => 'Concurrency',
                    'order' => 3,
                ],
                'promises-async-await' => [
                    'id' => 'promises-async-await',
                    'title' => 'Promises & Async/Await Under the Hood',
                    'description' => 'Promise state machines, thenable chaining, async/await coroutine desugaring.',
                    'prerequisites' => ['async-event-loop'],
                    'target_concepts' => ['Promise State Machine', 'Coroutine Desugaring', 'Error Propagation'],
                    'category' => 'Concurrency',
                    'order' => 4,
                ],
                'memory-garbage-collection' => [
                    'id' => 'memory-garbage-collection',
                    'title' => 'V8 Memory Management & Garbage Collection',
                    'description' => 'Scavenger nursery, Mark-Sweep-Compact, generational hypothesis, heap profiling.',
                    'prerequisites' => ['js-lexical-scope'],
                    'target_concepts' => ['V8 Heap', 'Mark-Sweep', 'Generational GC', 'Memory Allocation'],
                    'category' => 'Systems Optimization',
                    'order' => 5,
                ],
            ],
        ];

        // Seed a sample student
        $this->localMemoryStore['students']['mock-student-uid-101'] = [
            'id' => 'stu_101',
            'firebase_uid' => 'mock-student-uid-101',
            'email' => 'student.ada@example.edu',
            'display_name' => 'Ada Lovelace',
            'enrolled_courses' => ['cs-advanced-js'],
            'preferred_language' => 'en-US',
            'created_at' => (new \DateTimeImmutable('-14 days'))->format(DATE_ATOM),
        ];

        // Seed initial knowledge state
        $this->localMemoryStore['knowledge_states']['stu_101_cs-advanced-js'] = [
            'student_id' => 'stu_101',
            'course_id' => 'cs-advanced-js',
            'cognitive_status' => 'ActiveLearning',
            'skill_scores' => [
                'js-call-stack' => [
                    'score' => 0.88,
                    'confidence_interval' => 0.12,
                    'attempts_count' => 6,
                    'last_assessed_at' => (new \DateTimeImmutable('-2 days'))->format(DATE_ATOM),
                ],
                'js-lexical-scope' => [
                    'score' => 0.72,
                    'confidence_interval' => 0.20,
                    'attempts_count' => 4,
                    'last_assessed_at' => (new \DateTimeImmutable('-1 day'))->format(DATE_ATOM),
                ],
            ],
            'weakness_points' => [
                [
                    'topic_id' => 'async-event-loop',
                    'concept_tag' => 'Async Closures in Loops',
                    'description' => 'Confusion distinguishing function-scoped var from block-scoped let inside asynchronous timer callbacks.',
                    'severity' => 'medium',
                    'detected_at' => (new \DateTimeImmutable('-1 day'))->format(DATE_ATOM),
                ],
            ],
            'zpd_topics' => ['async-event-loop', 'memory-garbage-collection'],
            'last_evaluated_at' => (new \DateTimeImmutable())->format(DATE_ATOM),
        ];
    }
}
