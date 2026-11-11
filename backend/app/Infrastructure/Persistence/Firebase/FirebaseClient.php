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

        $this->loadLocalStore();
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
        $this->persistLocalStore();
    }

    /**
     * Deletes a document from a collection.
     *
     * @param string $collection
     * @param string $documentId
     */
    public function deleteDocument(string $collection, string $documentId): void
    {
        if ($this->firestore !== null) {
            $this->firestore->collection($collection)->document($documentId)->delete();
            return;
        }

        unset($this->localMemoryStore[$collection][$documentId]);
        $this->persistLocalStore();
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
    private function getStorageFilePath(): string
    {
        $path = storage_path('app/firestore_store.json');
        $dir = dirname($path);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $path;
    }

    private function loadLocalStore(): void
    {
        $file = $this->getStorageFilePath();
        if (file_exists($file)) {
            $content = file_get_contents($file);
            $parsed = json_decode($content, true);
            if (is_array($parsed) && !empty($parsed)) {
                $this->localMemoryStore = $parsed;
                return;
            }
        }
        $this->seedInitialCourseCatalog();
        $this->persistLocalStore();
    }

    private function persistLocalStore(): void
    {
        $file = $this->getStorageFilePath();
        file_put_contents($file, json_encode($this->localMemoryStore, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function seedInitialCourseCatalog(): void
    {
        // Python 101 Course
        $this->localMemoryStore['courses']['python-101'] = [
            'id' => 'python-101',
            'title' => 'أساسيات البرمجة بلغة Python',
            'description' => 'المسار التأسيسي الشامل لتعلم المنطق البرمجي، هياكل البيانات، والخوارزميات بلغة بايثون التكيفية.',
            'category' => 'علوم الحاسب والبرمجة',
            'level' => 'مبتدئ',
            'estimated_hours' => 20,
            'placement_test_questions_count' => 6,
            'topic_map' => [
                'py-variables' => [
                    'id' => 'py-variables',
                    'title' => 'المتغيرات وأنواع البيانات الأساسية',
                    'description' => 'مفهوم تخزين البيانات في الذاكرة، الأنواع العددية والنصية والمنطقية والتحويل بينها.',
                    'prerequisites' => [],
                    'target_concepts' => ['Variables', 'Data Types', 'Type Casting', 'Dynamic Typing'],
                    'category' => 'المفاهيم التأسيسية',
                    'order' => 1,
                    'bloom_level' => 'تذكر وفهم (Remember/Understand)',
                ],
                'py-conditionals' => [
                    'id' => 'py-conditionals',
                    'title' => 'الجمل الشرطية والتحكم في التدفق',
                    'description' => 'اتخاذ القرارات المنطقية باستخدام if, elif, else والمعاملات المنطقية.',
                    'prerequisites' => ['py-variables'],
                    'target_concepts' => ['Boolean Logic', 'If-Else Branching', 'Comparison Operators'],
                    'category' => 'التحكم في المسار',
                    'order' => 2,
                    'bloom_level' => 'تطبيق (Apply)',
                ],
                'py-loops' => [
                    'id' => 'py-loops',
                    'title' => 'الحلقات التكرارية والتكرار المنطقي',
                    'description' => 'تكرار المهام بكفاءة باستخدام حلقات for و while والتحكم عبر break و continue.',
                    'prerequisites' => ['py-conditionals'],
                    'target_concepts' => ['For Loops', 'While Loops', 'Loop Control', 'Range Function'],
                    'category' => 'التحكم في المسار',
                    'order' => 3,
                    'bloom_level' => 'تطبيق وتحليل (Apply/Analyze)',
                ],
                'py-data-structures' => [
                    'id' => 'py-data-structures',
                    'title' => 'هياكل البيانات: القوائم والقواميس',
                    'description' => 'التعامل مع مجموعات البيانات: Lists, Tuples, Dictionaries, Sets والعمليات عليها.',
                    'prerequisites' => ['py-loops'],
                    'target_concepts' => ['Lists & Tuples', 'Dictionaries', 'Key-Value Pairs', 'List Slicing'],
                    'category' => 'هياكل البيانات',
                    'order' => 4,
                    'bloom_level' => 'تطبيق وتحليل (Apply/Analyze)',
                ],
                'py-functions' => [
                    'id' => 'py-functions',
                    'title' => 'الدوال والبرمجة المعيارية',
                    'description' => 'بناء دوال قابلة لإعادة الاستخدام، المعاملات، القيم المرجعة، ونطاقات المتغيرات (Scope).',
                    'prerequisites' => ['py-data-structures'],
                    'target_concepts' => ['Functions Definition', 'Arguments & Return', 'Scope (LEGB)', 'Modularity'],
                    'category' => 'المعيارية المتقدمة',
                    'order' => 5,
                    'bloom_level' => 'تقييم وابتكار (Evaluate/Create)',
                ],
            ],
        ];

        // JavaScript Advanced Course
        $this->localMemoryStore['courses']['cs-advanced-js'] = [
            'id' => 'cs-advanced-js',
            'title' => 'Advanced JavaScript: Runtime Architecture & Concurrency',
            'description' => 'Zero-content adaptive course exploring the V8 runtime, Event Loop, closures, and asynchronous concurrency.',
            'category' => 'Computer Science',
            'level' => 'متقدم',
            'estimated_hours' => 24,
            'placement_test_questions_count' => 6,
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
            'enrolled_courses' => ['python-101', 'cs-advanced-js'],
            'preferred_language' => 'ar-SA',
            'created_at' => (new \DateTimeImmutable('-14 days'))->format(DATE_ATOM),
        ];
    }
}
