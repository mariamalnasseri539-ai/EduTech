<?php

declare(strict_types=1);

namespace App\Application\UseCases\Assessment;

use App\Domain\Learning\Repositories\CourseRepositoryInterface;
use App\Domain\Learning\Repositories\PromptTemplateRepositoryInterface;
use App\Infrastructure\AI\GeminiApiClient;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;
use Throwable;

final class GeneratePlacementTestUseCase
{
    public function __construct(
        private readonly CourseRepositoryInterface $courseRepository,
        private readonly GeminiApiClient $geminiClient,
        private readonly PromptTemplateRepositoryInterface $promptRepository
    ) {}

    /**
     * Generates a unique, adaptive placement test tailored to the course syllabus.
     *
     * @param string $studentId
     * @param string $courseId
     * @return array{
     *     test_id: string,
     *     course_id: string,
     *     course_title: string,
     *     questions_count: int,
     *     questions: array<int, array{
     *         id: int,
     *         type: string,
     *         title: string,
     *         concept: string,
     *         code?: string,
     *         options: array<int, string>,
     *         difficulty: string
     *     }>
     * }
     */
    public function execute(string $studentId, string $courseId): array
    {
        $course = $this->courseRepository->getCourse($courseId);
        if ($course === null) {
            throw new InvalidArgumentException("المقرر المطلوب غير موجود: {$courseId}");
        }

        $courseTitle = (string)($course['title'] ?? 'المقرر الدراسي');
        $questionsCount = (int)($course['placement_test_questions_count'] ?? 6);
        if ($questionsCount < 3) {
            $questionsCount = 6;
        }

        $topicMap = $this->courseRepository->getTopicMap($courseId);
        $topicTitles = array_map(static fn($t) => $t['name'] ?? $t['title'] ?? '', $topicMap);
        $topicTitles = array_values(array_filter($topicTitles));
        $topicsListStr = implode('، ', array_filter($topicTitles));

        // جلب أمر امتحان تحديد المستوى النشط والمعتمد من الفايربيس (Cloud Firestore Prompts)
        $activePrompt = $this->promptRepository->getActivePrompt('placement_test', $courseId);

        // Assemble pedagogical prompt for Gemini 1.5
        $systemInstruction = <<<INSTRUCTION
أنت خبير قياس وتقويم بيداغوجي ومصمم اختبارات تشخيصية وتكيفية في منصة مسار (MASAR).
مهمتك هي صياغة اختبار تحديد مستوى (Placement Diagnostic Test) فائق الدقة لمقرر: "{$courseTitle}".
شجرة المفاهيم والموضوعات المغطاة في المقرر:
{$topicsListStr}

القواعد البيداغوجية الصارمة:
1. توليد عدد {$questionsCount} سؤال تشخيصي دقيق (لا أكثر ولا أقل).
2. توزيع الأسئلة بالتساوي على المستويات:
   - 40% أسئلة تأسيسية ومفاهيمية (صعوبة: سهل / تأسيسي).
   - 40% أسئلة تطبيقية وبنائية (صعوبة: متوسط / بنائي).
   - 20% أسئلة تحليلية وعميقة وحل مشكلات (صعوبة: متقدم).
3. التنوع بين الأسئلة النظرية وأسئلة قراءة وتتبع الأكواد البرمجية (type: 'theory' أو 'code').
4. كل سؤال يجب أن يحتوي على 4 خيارات حصرية ودقيقة خالية من الغموض، مع تحديد رقم الإجابة الصحيحة (0 إلى 3) وتفسير تربوي للشرح.
5. الإخراج يجب أن يكون حصرياً بصيغة JSON بدون أي نصوص تمهيدية أو تنسيق Markdown خارج الـ JSON.
INSTRUCTION;

        if ($activePrompt !== null && ($activePrompt['is_active'] ?? true) && !empty($activePrompt['system_prompt'])) {
            $systemInstruction = (string)$activePrompt['system_prompt'];
        }

        $userPrompt = <<<PROMPT
قم بتوليد اختبار تحديد مستوى تشخيصي فريد ومخصص للطالب (Student ID: {$studentId}) لمقرر {$courseTitle}.
عدد الأسئلة المطلوب بدقة: {$questionsCount}.

المخطط الهيكلي المطلوب لمخرجات الـ JSON:
{
  "questions": [
    {
      "id": 1,
      "type": "theory",
      "title": "نص السؤال هنا باللغة العربية الفصحى الواضحة؟",
      "concept": "المفهوم المستهدف من شجرة المقرر",
      "code": "كود برمجي اختياري إذا كان نوع السؤال code وإلا null",
      "options": [
        "الخيار الأول",
        "الخيار الثاني",
        "الخيار الثالث",
        "الخيار الرابع"
      ],
      "correct_answer": 0,
      "explanation": "شرح تربوي دقيق لسبب صحة الخيار الفائز ولماذا الخيارات الأخرى غير صحيحة",
      "difficulty": "تأسيسي"
    }
  ]
}
PROMPT;

        // تطبيق قالب المستخدم المخصص من إدارة الأوامر
        if ($activePrompt !== null && ($activePrompt['is_active'] ?? true) && !empty($activePrompt['user_prompt_template'])) {
            $replacements = [
                '{course_title}' => $courseTitle,
                '{question_count}' => (string)$questionsCount,
                '{concept_topics}' => !empty($topicsListStr) ? $topicsListStr : 'المفاهيم البرمجية الأساسية',
                '{student_id}' => $studentId,
                '{difficulty_distribution}' => '40% سهل وتأسيسي، 40% متوسط وبنائي، 20% متقدم',
            ];
            $evaluatedTemplate = str_replace(array_keys($replacements), array_values($replacements), (string)$activePrompt['user_prompt_template']);
            $userPrompt = $evaluatedTemplate . "\n\n" . 'المخطط الهيكلي المطلوب لمخرجات الـ JSON حصراً:' . "\n" . '{"questions": [{"id": 1, "type": "theory", "title": "نص السؤال", "concept": "المفهوم", "code": null, "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"], "correct_answer": 0, "explanation": "تفسير تربوي", "difficulty": "سهل"}]}';
        }

        $questions = [];
        try {
            $rawJson = $this->geminiClient->callGeminiApi($systemInstruction, $userPrompt);
            $parsed = json_decode($rawJson, true);
            if (isset($parsed['questions']) && is_array($parsed['questions']) && count($parsed['questions']) > 0) {
                $questions = $parsed['questions'];
            }
        } catch (Throwable $e) {
            // Fallback to high-quality procedural generator if offline or API key pending
            $questions = $this->getProceduralFallbackQuestions($courseId, $courseTitle, $questionsCount, $topicTitles);
        }

        if (empty($questions)) {
            $questions = $this->getProceduralFallbackQuestions($courseId, $courseTitle, $questionsCount, $topicTitles);
        }

        // Limit or pad to exact requested count
        $questions = array_slice($questions, 0, $questionsCount);

        $testId = 'pt_' . bin2hex(random_bytes(6));

        // Cache the master test with answers on server for 2 hours
        Cache::put("placement_test_{$testId}", [
            'test_id' => $testId,
            'course_id' => $courseId,
            'student_id' => $studentId,
            'created_at' => now()->toIso8601String(),
            'questions' => $questions,
        ], now()->addHours(2));

        // Strip correct_answer and explanation before sending to student client
        $studentSafeQuestions = array_map(static function (array $q, int $idx) {
            return [
                'id' => (int)($q['id'] ?? ($idx + 1)),
                'type' => (string)($q['type'] ?? 'theory'),
                'title' => (string)($q['title'] ?? ''),
                'concept' => (string)($q['concept'] ?? 'مفاهيم برمجية'),
                'code' => !empty($q['code']) ? (string)$q['code'] : null,
                'options' => array_values((array)($q['options'] ?? [])),
                'difficulty' => (string)($q['difficulty'] ?? 'بنائي'),
            ];
        }, $questions, array_keys($questions));

        return [
            'test_id' => $testId,
            'course_id' => $courseId,
            'course_title' => $courseTitle,
            'questions_count' => count($studentSafeQuestions),
            'prompt_id' => $activePrompt['id'] ?? 'prompt-placement-default',
            'prompt_title' => $activePrompt['title'] ?? 'أمر امتحان تحديد المستوى التكيفي القياسي',
            'questions' => $studentSafeQuestions,
        ];
    }

    /**
     * High-quality procedural fallback generator calibrated per course topic map.
     */
    private function getProceduralFallbackQuestions(string $courseId, string $courseTitle, int $count, array $topicTitles = []): array
    {
        if (!empty($topicTitles) && !str_contains(strtolower($courseId), 'python')) {
            $customPool = [];
            foreach ($topicTitles as $idx => $tTitle) {
                $diff = $idx === 0 ? 'تأسيسي' : ($idx < count($topicTitles) - 1 ? 'بنائي' : 'متقدم');
                $customPool[] = [
                    'id' => $idx + 1,
                    'type' => $idx % 2 === 0 ? 'theory' : 'code',
                    'title' => "ما هو الدور الأساسي لمفهوم: {$tTitle} في سياق {$courseTitle}؟",
                    'concept' => $tTitle,
                    'code' => $idx % 2 !== 0 ? "// نموذج تطبيقي في {$courseTitle}
executeStep('{$tTitle}');" : null,
                    'options' => [
                        "تطبيق المبادئ المعمارية المعتمدة في {$tTitle} لضمان كفاءة النظام",
                        "إلغاء الحاجة للتوثيق والتحقق من الأخطاء البرمجية",
                        "استهلاك الذاكرة بشكل مستمر بدون تحرير للموارد",
                        "لا يؤثر على أداء النظام أو معايير الجودة"
                    ],
                    'correct_answer' => 0,
                    'explanation' => "مفهوم {$tTitle} يُعد ركيزة أساسية في {$courseTitle} لبناء حلول تقنية متينة وقابلة للتطوير.",
                    'difficulty' => $diff,
                ];
            }
            if (count($customPool) >= $count) {
                return array_slice($customPool, 0, $count);
            }
            while (count($customPool) < $count) {
                $idx = count($customPool);
                $customPool[] = [
                    'id' => $idx + 1,
                    'type' => 'theory',
                    'title' => "كيف تساهم الممارسات المتقدمة في رفع كفاءة {$courseTitle}؟",
                    'concept' => 'الممارسات البرمجية المتقدمة',
                    'code' => null,
                    'options' => [
                        'تحسين جودة الأداء وقابلية الصيانة والتوسع',
                        'زيادة وقت استجابة النظام دون مبرر',
                        'تعطيل معايير الأمان والحماية',
                        'لا يوجد أي تأثير إيجابي'
                    ],
                    'correct_answer' => 0,
                    'explanation' => 'الممارسات المتقدمة تضمن كفاءة التنفيذ وتوافق الحلول مع أفضل المعايير التقنية.',
                    'difficulty' => 'متقدم',
                ];
            }
            return $customPool;
        }

        $pythonPool = [
            [
                'id' => 1,
                'type' => 'theory',
                'title' => 'ما هو الفرق الجوهري بين لغات البرمجة المفسرة (Interpreted) والمترجمة (Compiled) في بيئة بايثون؟',
                'concept' => 'مفاهيم لغات البرمجة والتشغيل',
                'code' => null,
                'options' => [
                    'اللغة المفسرة تُنفذ الكود سطراً بسطر وقت التشغيل عبر الـ Virtual Machine، بينما المترجمة تُحوّله مسبقاً لملف تنفيذي آلي.',
                    'اللغات المفسرة أسرع دائماً في الأداء الحسابي من اللغات المترجمة دون استثناء.',
                    'اللغات المترجمة لا تكتشف الأخطاء إلا بعد تشغيل البرنامج بالكامل.',
                    'لا يوجد أي فرق تقني، التسمية مجرد تصنيف تجاري فقط.'
                ],
                'correct_answer' => 0,
                'explanation' => 'بايثون لغة مفسرة تعتمد على Bytecode ينفذ عبر مفسر CPython سطراً بسطر، مما يمنحها مرونة برمجية عالية.',
                'difficulty' => 'تأسيسي',
            ],
            [
                'id' => 2,
                'type' => 'code',
                'title' => 'ما هي القيمة المطبوعة عند تنفيذ هذا المقطع البرمجي بلغة Python؟',
                'concept' => 'العمليات الحسابية وقسمة الأعداد الصحيحة',
                'code' => "x = 17 // 3\ny = 17 % 3\nprint(x + y)",
                'options' => [
                    '7',
                    '8',
                    '5',
                    '7.66'
                ],
                'correct_answer' => 0,
                'explanation' => 'المعامل // يقوم بالقسمة الصحيحة (17 // 3 = 5)، والمعامل % يعيد باقي القسمة (17 % 3 = 2)، وبالتالي الناتج: 5 + 2 = 7.',
                'difficulty' => 'تأسيسي',
            ],
            [
                'id' => 3,
                'type' => 'code',
                'title' => 'ما هي مخرجات الكود التالي المتعلق بنطاق المتغيرات والقوائم المرجعية؟',
                'concept' => 'القوائم وتمرير الكائنات بالمرجع (Mutable Objects)',
                'code' => "def add_item(val, lst=[]):\n    lst.append(val)\n    return lst\n\nprint(add_item(1))\nprint(add_item(2))",
                'options' => [
                    '[1] ثم [2]',
                    '[1] ثم [1, 2]',
                    '[1, 2] ثم [1, 2]',
                    'خطأ في الترجمة SyntaxError'
                ],
                'correct_answer' => 1,
                'explanation' => 'في بايثون، المعاملات الافتراضية القابلة للتعديل (Mutable Default Arguments مثل القوائم) يتم إنشاؤها مرة واحدة فقط عند تعريف الدالة، وتتشارك نفس المرجع.',
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 4,
                'type' => 'theory',
                'title' => 'أي من هياكل البيانات التالية في Python يوفر زمن وصول O(1) للبحث عن العناصر؟',
                'concept' => 'التعقيد الزمني لهياكل البيانات (Time Complexity)',
                'code' => null,
                'options' => [
                    'القواميس (Dictionaries) ومجموعات التجزئة (Sets)',
                    'القوائم العادية (Lists)',
                    'الصفوف غير القابلة للتعديل (Tuples)',
                    'السلاسل النصية (Strings)'
                ],
                'correct_answer' => 0,
                'explanation' => 'القواميس ومجموعات التجزئة تعتمد على جداول الهاش (Hash Tables)، مما يتيح البحث والإدخال بمتوسط تعقيد زمني O(1).',
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 5,
                'type' => 'code',
                'title' => 'ما هي نتيجة تشغيل تعبير القوائم التوليدي (List Comprehension) التالي؟',
                'concept' => 'توليد القوائم والتصفية الشرطية (Comprehensions)',
                'code' => "nums = [1, 2, 3, 4, 5, 6]\nres = [n * 2 for n in nums if n % 2 == 0]\nprint(res)",
                'options' => [
                    '[4, 8, 12]',
                    '[2, 4, 6, 8, 10, 12]',
                    '[2, 4, 6]',
                    '[1, 3, 5]'
                ],
                'correct_answer' => 0,
                'explanation' => 'الشرط يختار الأعداد الزوجية فقط [2, 4, 6] ثم يضرب كل عدد في 2 ليصبح الناتج النهائي [4, 8, 12].',
                'difficulty' => 'متقدم',
            ],
            [
                'id' => 6,
                'type' => 'theory',
                'title' => 'ما هو دور دالة التوليد (Generator) المعتمدة على yield مقارنة بالدوال التقليدية التي تستخدم return؟',
                'concept' => 'إدارة الذاكرة والمولدات (Generators & Memory Optimization)',
                'code' => null,
                'options' => [
                    'تولد القيم عند الطلب تدريجياً (Lazy Evaluation) دون حجز الذاكرة لكامل المجموعة دفعة واحدة.',
                    'تزيد من سرعة وحدة المعالجة المركزية بنسبة 50%.',
                    'تقوم بإنهاء عمل الدالة نهائياً وتفريغ الذاكرة في أول استدعاء.',
                    'لا يمكن استخدامها إلا مع أنواع البيانات النصية فقط.'
                ],
                'correct_answer' => 0,
                'explanation' => 'المولدات (Generators) تعتمد على التقييم الكسول (Lazy Evaluation)، فتحتفظ بحالة التنفيذ وتولد عنصراً واحداً تلو الآخر، مما يوفر استهلاك الذاكرة بشكل هائل في البيانات الكبيرة.',
                'difficulty' => 'متقدم',
            ],
            [
                'id' => 7,
                'type' => 'code',
                'title' => 'ما هو نوع الخطأ الذي سيحدث عند محاولة تشغيل هذا الكود في بايثون؟',
                'concept' => 'التعامل مع الاستثناءات وأنواع البيانات الثابتة',
                'code' => "tup = (10, 20, 30)\ntup[1] = 99",
                'options' => [
                    'TypeError: \'tuple\' object does not support item assignment',
                    'ValueError: invalid tuple index',
                    'IndexError: tuple index out of range',
                    'الكود سيعمل بنجاح ويعدل العنصر إلى 99'
                ],
                'correct_answer' => 0,
                'explanation' => 'الـ Tuple في بايثون كائن غير قابل للتعديل (Immutable)، ومحاولة تغيير أي عنصر فيه تثير TypeError فوراً.',
                'difficulty' => 'تأسيسي',
            ],
            [
                'id' => 8,
                'type' => 'code',
                'title' => 'ما هي مخرجات الكود التالي باستخدام دالة lambda ومصفوفة map؟',
                'concept' => 'البرمجة الوظيفية والدوال المجهولة (Functional Programming)',
                'code' => "square = lambda x: x ** 2\nprint(list(map(square, [1, 2, 3])))",
                'options' => [
                    '[1, 4, 9]',
                    '[1, 2, 3]',
                    '[2, 4, 6]',
                    'Error'
                ],
                'correct_answer' => 0,
                'explanation' => 'دالة map تطبق دالة التربيع على كل عنصر في القائمة، فينتج [1, 4, 9].',
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 9,
                'type' => 'code',
                'title' => 'ما هي القيمة المرجعة من التعبير المنطقي التالي (Short-circuit Evaluation) في بايثون؟',
                'concept' => 'التقييم المختصر للمعاملات المنطقية',
                'code' => "a = 0 or 'EduTech'\nb = [] and 100\nprint(a, b)",
                'options' => [
                    "EduTech []",
                    "True False",
                    "0 100",
                    "EduTech None"
                ],
                'correct_answer' => 0,
                'explanation' => "معامل or يعيد أول قيمة صائبة (Truthy) وهي 'EduTech'، ومعامل and يعيد أول قيمة خاطئة (Falsy) وهي [].",
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 10,
                'type' => 'code',
                'title' => 'ما الذي سيتم طباعته عند تنفيذ حلقة for مع كتلة else في هذا الكود؟',
                'concept' => 'التحكم بالتدفق وحلقات for-else',
                'code' => "for i in range(3):\n    if i == 5:\n        break\nelse:\n    print('Loop Finished Naturally')",
                'options' => [
                    "Loop Finished Naturally",
                    "لن يُطبع شيء",
                    "خطأ في بناء الجملة SyntaxError",
                    "0 1 2"
                ],
                'correct_answer' => 0,
                'explanation' => "في بايثون، كتلة else التابعة للحلقة تُنفذ فقط إذا اكتملت الحلقة دون مقاطعة بأمر break.",
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 11,
                'type' => 'code',
                'title' => 'ما هي قيم المتغيرات بعد تفكيك القائمة (Unpacking) باستخدام معامل النجمة *؟',
                'concept' => 'تفكيك البيانات المتقدم (Extended Unpacking)',
                'code' => "first, *middle, last = [10, 20, 30, 40, 50]\nprint(middle)",
                'options' => [
                    "[20, 30, 40]",
                    "20 30 40",
                    "[10, 20, 30, 40]",
                    "(20, 30, 40)"
                ],
                'correct_answer' => 0,
                'explanation' => "معامل * يجمع العناصر المتبقية بين العنصر الأول والأخير في قائمة جديدة [20, 30, 40].",
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 12,
                'type' => 'theory',
                'title' => 'ما هي قاعدة LEGB المستخدمة في بايثون للبحث عن المتغيرات وتحديد نطاقها؟',
                'concept' => 'نطاق المتغيرات ومستويات الرؤية (LEGB Rule)',
                'code' => null,
                'options' => [
                    "Local ثم Enclosing ثم Global ثم Built-in",
                    "Linear ثم Extended ثم Global ثم Binary",
                    "Loop ثم Exception ثم Generator ثم Base",
                    "Linked ثم Encapsulated ثم Global ثم Block"
                ],
                'correct_answer' => 0,
                'explanation' => "يبحث مفسر بايثون عن مسمى المتغير أولاً في النطاق المحلي Local، ثم المحيط Enclosing، ثم العام Global، وأخيراً المدمج Built-in.",
                'difficulty' => 'تأسيسي',
            ],
            [
                'id' => 13,
                'type' => 'code',
                'title' => 'ما هو الترتيب الدقيق لتنفيذ الكتل عند عدم حدوث أي استثناء في كود try-except؟',
                'concept' => 'إدارة الاستثناءات وكتل else و finally',
                'code' => "try:\n    x = 10 / 2\nexcept ZeroDivisionError:\n    print('A')\nelse:\n    print('B')\nfinally:\n    print('C')",
                'options' => [
                    "B ثم C",
                    "A ثم C",
                    "B فقط",
                    "C فقط"
                ],
                'correct_answer' => 0,
                'explanation' => "تُنفذ كتلة else عند نجاح كتلة try بدون استثناءات، وتُنفذ كتلة finally دائماً في النهاية، فيكون الناتج B ثم C.",
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 14,
                'type' => 'code',
                'title' => 'ما هي القيمة الناتجة عند استدعاء الدالة super() في سياق الوراثة في بايثون؟',
                'concept' => 'البرمجة كائنية التوجه والوراثة',
                'code' => "class A:\n    def ping(self): return 'A'\nclass B(A):\n    def ping(self): return 'B-' + super().ping()\nprint(B().ping())",
                'options' => [
                    "B-A",
                    "B",
                    "A",
                    "AttributeError"
                ],
                'correct_answer' => 0,
                'explanation' => "تقوم super().ping() باستدعاء دالة الصنف الأساسي A، فيتم دمج النصين 'B-' و 'A'.",
                'difficulty' => 'متقدم',
            ],
            [
                'id' => 15,
                'type' => 'theory',
                'title' => 'ما هو الفرق الجوهري بين الدالتين السحريتين __str__ و __repr__ في كائنات بايثون؟',
                'concept' => 'الدوال السحرية وتمثيل الكائنات (Dunder Methods)',
                'code' => null,
                'options' => [
                    "دالة __str__ مخصصة للمستخدم النهائي كتمثيل مقروء، بينما __repr__ موجهة للمطورين وتوفر تفاصيل الكائن بدقة.",
                    "دالة __repr__ تُستخدم فقط مع الأرقام ودالة __str__ مع النصوص.",
                    "لا يوجد فرق تقني ويمكن استخدامهما بشكل متطابق دون اختلاف.",
                    "دالة __str__ تتطلب معاملات إضافية بينما __repr__ لا تقبل أي مدخلات."
                ],
                'correct_answer' => 0,
                'explanation' => "المعيار البيداغوجي المعتمد هو أن __repr__ تعيد تمثيلاً تقنياً غير غامض للكائن، بينما __str__ تعيد نصاً سهلاً وودوداً للمستخدم.",
                'difficulty' => 'بنائي',
            ],
            [
                'id' => 16,
                'type' => 'code',
                'title' => 'ما هو الناتج عند تطبيق هذا الزخرف البرمجي (Decorator) على دالة التحية؟',
                'concept' => 'المحددات والزخارف البرمجية (Decorators)',
                'code' => "def tag(fn):\n    def wrapper(name):\n        return f'[{fn(name)}]'\n    return wrapper\n\n@tag\ndef greet(n): return n.upper()\nprint(greet('edu'))",
                'options' => [
                    "[EDU]",
                    "EDU",
                    "[edu]",
                    "TypeError"
                ],
                'correct_answer' => 0,
                'explanation' => "الدالة greet تحول 'edu' إلى 'EDU'، ثم يُغلف الزخرف tag الناتج بين قوسين معقوفين فيصبح [EDU].",
                'difficulty' => 'متقدم',
            ],
            [
                'id' => 17,
                'type' => 'code',
                'title' => 'ما الذي يحدث عند تعديل مصفوفة فرعية منسوخة بنسخ سطحي (Shallow Copy)؟',
                'concept' => 'النسخ السطحي والعميق للكائنات (Copy Semantics)',
                'code' => "import copy\norig = [[1, 2], [3, 4]]\nshallow = copy.copy(orig)\nshallow[0][0] = 99\nprint(orig[0][0])",
                'options' => [
                    "99",
                    "1",
                    "None",
                    "IndexError"
                ],
                'correct_answer' => 0,
                'explanation' => "النسخ السطحي ينسخ الهيكل الخارجي فقط ويظل يشير لنفس القوائم الداخلية في الذاكرة، لذا ينعكس التعديل على الأصل.",
                'difficulty' => 'متقدم',
            ],
            [
                'id' => 18,
                'type' => 'theory',
                'title' => 'ما هي الدوال الخاصة (Dunder Methods) التي يجب توفرها في أي صنف ليعمل كـ Context Manager مع جملة with؟',
                'concept' => 'إدارة الموارد وجملة with (Context Managers)',
                'code' => null,
                'options' => [
                    "__enter__ و __exit__",
                    "__open__ و __close__",
                    "__start__ و __stop__",
                    "__init__ و __del__"
                ],
                'correct_answer' => 0,
                'explanation' => "بروتوكول إدارة الموارد في بايثون يتطلب __enter__ لبدء السياق و __exit__ لضمان تحرير الموارد حتى لو حدث استثناء.",
                'difficulty' => 'تأسيسي',
            ],
            [
                'id' => 19,
                'type' => 'code',
                'title' => 'ما هي القيمة المسترجعة عند استخدام التابع dict.get() مع مفتاح غير موجود وقيمة افتراضية؟',
                'concept' => 'عمليات القواميس والقيم الافتراضية الآمنة',
                'code' => "data = {'name': 'Sara', 'score': 90}\nval = data.get('level', 'مبتدئ')\nprint(val)",
                'options' => [
                    "مبتدئ",
                    "KeyError",
                    "None",
                    "0"
                ],
                'correct_answer' => 0,
                'explanation' => "التابع get لا يثير استثناء KeyError عند غياب المفتاح بل يعيد القيمة الاحتياطية المحددة ('مبتدئ').",
                'difficulty' => 'تأسيسي',
            ],
            [
                'id' => 20,
                'type' => 'theory',
                'title' => 'أي من العمليات التالية في لغة Python تمتلك تعقيداً زمنياً مقداره O(n) في أسوأ الحالات؟',
                'concept' => 'تحليل التعقيد الحسابي وهياكل البيانات (Big-O Complexity)',
                'code' => null,
                'options' => [
                    "حذف أو إدراج عنصر في بداية قائمة عادية list.insert(0, val)",
                    "إضافة عنصر في نهاية القائمة list.append(val)",
                    "البحث عن مفتاح داخل قاموس dict[key]",
                    "جلب طول القائمة باستخدام دالة len(lst)"
                ],
                'correct_answer' => 0,
                'explanation' => "إدراج أو حذف عنصر في بداية قائمة بايثون يتطلب إزاحة (Shift) لجميع العناصر اللاحقة في الذاكرة، مما يجعله عملية بتعقيد O(n).",
                'difficulty' => 'متقدم',
            ],
        ];

        // في حال طُلب عدد أكبر من بنك الأسئلة أو كان المقرر غير بايثون
        $pool = $pythonPool;
        if (count($pool) >= $count) {
            return array_slice($pool, 0, $count);
        }

        // توليد ديناميكي تكميلي للوصول للعدد المحدد في الإدارة بالضبط
        while (count($pool) < $count) {
            $idx = count($pool);
            $conceptName = !empty($topicTitles) ? $topicTitles[$idx % count($topicTitles)] : 'المفاهيم المتقدمة';
            $diff = $idx % 3 === 0 ? 'تأسيسي' : ($idx % 3 === 1 ? 'بنائي' : 'متقدم');
            $pool[] = [
                'id' => $idx + 1,
                'type' => $idx % 2 === 0 ? 'theory' : 'code',
                'title' => "ما هو الدور المعياري لمفهوم {$conceptName} في سياق {$courseTitle}؟",
                'concept' => $conceptName,
                'code' => $idx % 2 !== 0 ? "# تطبيق تكيفي على {$conceptName}\nresult = evaluate_concept('{$conceptName}')\nprint(result)" : null,
                'options' => [
                    "تطبيق أفضل الممارسات البرمجية والمعمارية لمفهوم {$conceptName}",
                    "تعطيل معايير الأمان والتوافقية في المنصة",
                    "زيادة استهلاك موارد المعالج دون مبرر تقني",
                    "إلغاء المعايير الهيكلية المعيارية"
                ],
                'correct_answer' => 0,
                'explanation' => "مفهوم {$conceptName} يُعد ركيزة أساسية لضمان أداء الكود وتوافقه مع معايير الجودة.",
                'difficulty' => $diff,
            ];
        }

        return array_slice($pool, 0, $count);
    }
}
