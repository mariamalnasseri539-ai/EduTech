<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Firebase\Repositories;

use App\Domain\Learning\Repositories\PromptTemplateRepositoryInterface;
use App\Infrastructure\Persistence\Firebase\FirebaseClient;

final class FirestorePromptRepo implements PromptTemplateRepositoryInterface
{
    private const COLLECTION = 'prompt_templates';

    public function __construct(
        private readonly FirebaseClient $firebase
    ) {}

    public function getAllPrompts(?string $category = null): array
    {
        $all = $this->firebase->getAllDocuments(self::COLLECTION);

        // If collection is empty, seed initial high-quality defaults for all 4 categories
        if (empty($all)) {
            $seeded = $this->seedDefaultPrompts();
            $all = $seeded;
        }

        $list = array_values($all);

        if ($category !== null && $category !== '' && $category !== 'all') {
            $list = array_values(array_filter($list, static function ($p) use ($category) {
                return ($p['category'] ?? '') === $category;
            }));
        }

        // Sort by category and updatedAt/created
        usort($list, static function ($a, $b) {
            return strcmp((string)($b['updated_at'] ?? ''), (string)($a['updated_at'] ?? ''));
        });

        return $list;
    }

    public function getPrompt(string $promptId): ?array
    {
        return $this->firebase->getDocument(self::COLLECTION, $promptId);
    }

    public function getActivePrompt(string $category, ?string $courseId = null): ?array
    {
        $all = $this->getAllPrompts($category);

        // First look for course-specific active prompt
        if ($courseId !== null && $courseId !== '' && $courseId !== 'all') {
            foreach ($all as $prompt) {
                if (($prompt['is_active'] ?? false) && ($prompt['target_course_id'] ?? '') === $courseId) {
                    return $prompt;
                }
            }
        }

        // Fallback to active global prompt for this category
        foreach ($all as $prompt) {
            if ($prompt['is_active'] ?? false) {
                return $prompt;
            }
        }

        return $all[0] ?? null;
    }

    public function savePrompt(array $promptData): array
    {
        $promptId = (string)($promptData['id'] ?? ('prompt-' . bin2hex(random_bytes(4))));
        $promptData['id'] = $promptId;
        $now = date('c');

        if (!isset($promptData['created_at'])) {
            $promptData['created_at'] = $now;
        }
        $promptData['updated_at'] = $now;

        if (!isset($promptData['version'])) {
            $promptData['version'] = 1;
        } else {
            $promptData['version'] = (int)$promptData['version'] + 1;
        }

        // Defaults
        $promptData['is_active'] = (bool)($promptData['is_active'] ?? true);
        $promptData['model'] = (string)($promptData['model'] ?? 'gemini-1.5-pro');
        $promptData['temperature'] = (float)($promptData['temperature'] ?? 0.3);
        $promptData['max_tokens'] = (int)($promptData['max_tokens'] ?? 4096);
        $promptData['variables'] = (array)($promptData['variables'] ?? []);

        $this->firebase->setDocument(self::COLLECTION, $promptId, $promptData);
        return $promptData;
    }

    public function deletePrompt(string $promptId): bool
    {
        $this->firebase->deleteDocument(self::COLLECTION, $promptId);
        return true;
    }

    /**
     * Seeds initial production-grade prompts for the 4 core platform sections.
     *
     * @return array<string, array<string, mixed>>
     */
    private function seedDefaultPrompts(): array
    {
        $now = date('c');
        $defaults = [
            'prompt-placement-default' => [
                'id' => 'prompt-placement-default',
                'title' => 'أمر توليد امتحان تحديد المستوى التكيفي القياسي',
                'category' => 'placement_test',
                'target_course_id' => 'all',
                'target_course_title' => 'عام لكافة المقررات',
                'system_prompt' => "أنت خبير بيداغوجي ومصمم اختبارات تشخيصية تكيفية ذكية (Adaptive Diagnostic Assessment Expert). مهمتك هي صياغة أسئلة تقييم دقيقة لتحديد مستوى الطالب المعرفي بدقة (مبتدئ، متوسط، متقدم) في المقرر الدراسي المحدد وفق مستويات هرم بلوم المعرفي. يجب أن تكون الخيارات محكمة، والتغذية الراجعة التفسيرية واضحة ومقنعة.",
                'user_prompt_template' => "قم بإنشاء اختبار تحديد مستوى لمقرر \"{course_title}\".
عدد الأسئلة المطلوب: {question_count} أسئلة.
المفاهيم المحورية للمنهج:
{concept_topics}

توزيع الصعوبة المطلوب:
- 35% أسئلة تأسيسية (مستوى سهل / تذكر وفهم)
- 40% أسئلة تطبيقية (مستوى متوسط / تطبيق وممارسة وتحليل)
- 25% أسئلة متقدمة (مستوى متقدم / تقييم وابتكار وحل مشكلات غير مألوفة)

لكل سؤال:
1. نص السؤال بلغة عربية برمجية سليمة
2. 4 خيارات حصرية مع تحديد الخيار الصحيح بدقة
3. شروحات تفسيرية لكل خيار (لماذا هو صحيح أو خطأ)
4. المفاهيم الفرعية المستهدفة في شجرة المقرر.",
                'variables' => ['course_title', 'question_count', 'concept_topics', 'difficulty_distribution'],
                'model' => 'gemini-1.5-pro',
                'temperature' => 0.25,
                'max_tokens' => 4096,
                'is_active' => true,
                'version' => 1,
                'notes' => 'البرومبت الأساسي لتوليد اختبارات تحديد المستوى لكل طالب مع الحفاظ على معيار الصعوبة ومستويات بلوم.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            'prompt-slides-default' => [
                'id' => 'prompt-slides-default',
                'title' => 'أمر صياغة السلايدات والشروحات التعليمية المتسلسلة التفاعلية',
                'category' => 'static_slides',
                'target_course_id' => 'all',
                'target_course_title' => 'عام لكافة المقررات',
                'system_prompt' => "أنت كبير مهندسي التصميم التعليمي التفاعلي وخبير البيداغوجيا الرقمية في منصة مسار (MASAR). مهمتك هي توليد شرائح تعليمية ذكية، احترافية، وعالية التباين مخصصة لواجهة الطالب التكيفية.

يجب عليك الالتزام الصارم بالإلزاميات الهندسية والبيداغوجية الأربعة التالية:

1. قاعدة الألوان الصلبة الصارمة (Solid Colors Only - No Transparency):
   - يُمنع منعاً باتاً استخدام الألوان الشفافة أو الباهتة (ممنوع منعاً باتاً: Opacity, Alpha, Transparent, Faint backgrounds).
   - استخدام ألوان صلبة نقية (100% Solid Colors) ذات تباين عالي لضمان وضوح فائق وقراءة مريحة:
     * الخلفيات: أبيض صلب (#FFFFFF) أو رمادي داكن صلب (#1E1E1E / #121212).
     * ألوان التمييز والتأكيد: ذهبي مسار الصلب (#FFCB74)، زمردي صلب (#10B981)، أزرق صلب (#2563EB)، قرمزي صلب (#DC2626).
     * النصوص: أسود صلب (#111111) على الخلفيات الفاتحة، أو أبيض صلب (#FFFFFF) على الخلفيات الداكنة.

2. هيكلة التعاريف (Terms & Definitions Architecture):
   - إذا كان المحتوى يتضمن مصطلحات ومفاهيم تعريفية، يجب تقسيمه بدقة:
     * يُعرض 'اسم المصطلح' وجوباً باللغتين العربية والإنجليزية معاً بصيغة:
       [اسم المصطلح بالعربية] | [Term in English]
     * يُتبع اسم المصطلح بمكون تفاعلي قابل للطي والإسدال (Accordion / Dropdown Arrow).
     * عند الضغط على السهم المنسدل، يُسدل 'التعريف والشرح التفصيلي' باللغة العربية فقط (يمنع استخدام الإنجليزية داخل نص التعريف).

3. هيكلة القوائم والنقاط (Lists & Bulleted Points Architecture):
   - إذا كان المحتوى تعداداً نقطياً أو عناصر تسلسلية:
     * تُعرض 'النقطة الرئيسية' وجوباً باللغتين العربية والإنجليزية معاً بصيغة:
       [النقطة الرئيسية بالعربية] | [Main Concept in English]
     * تكون كل نقطة رئيسية مزودة بسهم منسدل قابل للتوسيع (Dropdown Arrow).
     * عند الإسدال، تُعرض 'النقاط الفرعية والتفاصيل التوضيحية' باللغة العربية فقط (يمنع وضع نصوص إنجليزية في التفاصيل المنسدلة).

4. المحتوى التفاعلي والأنيميشن (Interactive UI & Animations):
   - أي محتوى تعليمي، هندسي، أو تطبيقي لا يندرج تحت التعاريف أو القوائم (مثل: آليات العمل، محاكاة الذاكرة، خطوات الخوارزميات، تتبع الكود البرمجي، وتجنب الأخطاء):
     * يجب تحويله وجوباً إلى واجهات تفاعلية مرئية (Interactive UI Components).
     * يجب تزويده بحركات وتأثيرات تفاعلية حية (CSS Animations & Micro-interactions) مثل: كبسولات تفكيك المفهوم، مؤشرات التنفيذ الرادارية، ومحاكاة الذاكرة الحية لكسر الملل تماماً وتحفيز الطالب.",
                'user_prompt_template' => "قم بتوليد حزمة شرائح تعليمية تفاعلية بصرية عالية التباين لشرح المفهوم: \"{concept_title}\" ضمن مقرر \"{course_title}\".
المستوى المعرفي للطالب: {student_level}.
العناوين الفرعية والمخرجات المستهدفة:
{target_concepts}

المواصفات الإلزامية للمخرجات:
1. شريحة المصطلحات والتعاريف: عرض اسم المصطلح بالعربية والإنجليزية (عربي | English) متبوعاً بمكون منسدل (Accordion) يفتح التعريف بالعربية فقط.
2. شريحة النقاط والقواعد: عرض النقاط الرئيسية بالعربية والإنجليزية (عربي | English) مع سهم منسدل يعرض التفاصيل بالعربية فقط.
3. شريحة المحاكاة والتفاعل الحي: واجهة تفاعلية بأنيميشن جذاب تشرح آلية عمل المفهوم وتوزيعه بالذاكرة أو تتبع الكود بألوان صلبة (Solid Colors).
4. شريحة التحصين ومقارنة الأكواد: مقارنة بصرية مزدوجة بين الممارسة الخاطئة والممارسة الصحيحة المعتمدة بألوان صلبة ودون شفافية.",
                'variables' => ['course_title', 'concept_title', 'student_level', 'target_concepts', 'slide_count'],
                'model' => 'gemini-1.5-pro',
                'temperature' => 0.35,
                'max_tokens' => 4096,
                'is_active' => true,
                'version' => 3,
                'notes' => 'أمر متطور ومحدث: يفرض ألواناً صلبة (Solid Colors)، وهيكلة التعاريف ثنائية اللغة مع Accordion بالعربية فقط، وهيكلة النقاط مع سهم منسدل، والواجهات التفاعلية بأنيميشن جذاب.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            'prompt-code-default' => [
                'id' => 'prompt-code-default',
                'title' => 'أمر التحديات البرمجية والمحرر التفاعلي الحي',
                'category' => 'interactive_code',
                'target_course_id' => 'all',
                'target_course_title' => 'عام لكافة المقررات',
                'system_prompt' => "أنت مهندس برمجيات ومختبر جودة كود وخبير في بيئات التعلم التفاعلية (Interactive Code Engine & Automated Grader). تقوم بتوليد تحديات برمجية واقعية مع شفرة بداية (Boilerplate) وحالات اختبار (Test Cases) تغطي الحالات الطبيعية والحدية (Edge Cases).",
                'user_prompt_template' => "قم بإنشاء تحدي برمجي تطبيقي للمفهوم: \"{concept_title}\" بلغة \"{programming_language}\".
مستوى الطالب المستهدف: {student_level}.
العنوان الفرعي المطبق: {subtopic_title}.

المخرجات المطلوبة:
1. نص التحدي: وصف واضح للمشكلة الحياتية أو البرمجية والمخرجات المتوقعة.
2. الشفرة التأسيسية المبدئية (Starter Code): مع تعليقات TODO توجه الطالب.
3. الحل النموذجي المرجعي (Reference Solution).
4. حالات الاختبار الآلية (Test Cases):
   - حالتان معلنتان للطالب (Public Test Cases)
   - حالتان مخفيتان لتقييم الحالات الحدية (Hidden Edge Cases).
5. تلميحات ذكية متدرجة الصعوبة (Hints).",
                'variables' => ['concept_title', 'programming_language', 'student_level', 'subtopic_title'],
                'model' => 'gemini-1.5-pro',
                'temperature' => 0.2,
                'max_tokens' => 4096,
                'is_active' => true,
                'version' => 1,
                'notes' => 'يُستخدم لتوليد بيئة الاختبار والتنفيذ المباشر داخل محرك الكود التفاعلي.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            'prompt-quiz-default' => [
                'id' => 'prompt-quiz-default',
                'title' => 'أمر الامتحان الصغير السريع بعد نهاية الدرس (Micro-Quiz)',
                'category' => 'micro_quiz',
                'target_course_id' => 'all',
                'target_course_title' => 'عام لكافة المقررات',
                'system_prompt' => "أنت خبير قياس وتقويم تكويني سريع (Formative Check & Micro-Assessment). هدفك التحقق الفوري من استيعاب الطالب لأهم مخرجات الدرس قبل السماح له بالانتقال للدرس التالي في شجرة المفاهيم.",
                'user_prompt_template' => "قم بصياغة اختبار قصير ومكثف (Micro-Quiz) للدرس: \"{lesson_title}\" في مفهوم \"{concept_title}\".
عدد الأسئلة: {quiz_questions_count} أسئلة سريعة (من 2 إلى 4 أسئلة).
المخرجات التعليمية التي تم شرحها:
{learned_outcomes}

المواصفات:
- الأسئلة تركز على المفاهيم الجوهرية وتطبيق الشفرة البرمجية وتوقع المخرجات (Predict Output).
- كل سؤال يتضمن 4 خيارات واضحة مع إجابة نموذجية واحدة صحيحة.
- تغذية راجعة فورية ومباشرة تشرح سبب صحة الإجابة أو سبب الخطأ لتثبيت المعرفة.",
                'variables' => ['lesson_title', 'concept_title', 'quiz_questions_count', 'learned_outcomes'],
                'model' => 'gemini-1.5-flash',
                'temperature' => 0.3,
                'max_tokens' => 2048,
                'is_active' => true,
                'version' => 1,
                'notes' => 'الامتحان الصغير التكويني الذي يقدم فور انتهاء سلايدات الدرس لتأكيد الاستيعاب.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($defaults as $id => $doc) {
            $this->firebase->setDocument(self::COLLECTION, $id, $doc);
        }

        return $defaults;
    }
}
