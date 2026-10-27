import { AdaptiveLesson } from '../types/learning';
import { Course, StudentKnowledgeState } from '../types/knowledge';
import { QuizSubmission, QuizResult, CodeSubmission, CodeVerificationResult } from '../types/assessment';

const API_BASE = '/api';

export const apiClient = {
  async getCourses(): Promise<Course[]> {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (res.ok) {
        const data = await res.json();
        return data.courses;
      }
    } catch (e) {
      console.warn('API unavailable, using client-side mock catalog.');
    }

    return [
      {
        id: 'cs-advanced-js',
        title: 'Advanced JavaScript: Runtime Architecture & Concurrency',
        description: 'Zero-content adaptive track exploring the V8 runtime, Event Loop, closures, and microtask queuing.',
        category: 'Computer Science',
        estimated_hours: 24,
        topic_map: {
          'js-call-stack': {
            id: 'js-call-stack',
            title: 'The Execution Context & Call Stack',
            description: 'Execution contexts, lexical environments, variable hoisting, and stack frame lifecycle.',
            prerequisites: [],
            target_concepts: ['Execution Context', 'Call Stack', 'Variable Environment'],
            category: 'Runtime Fundamentals',
            order: 1,
          },
          'js-lexical-scope': {
            id: 'js-lexical-scope',
            title: 'Lexical Scope & Closures',
            description: 'Scope chain resolution, outer environment references, closure memory retention.',
            prerequisites: ['js-call-stack'],
            target_concepts: ['Scope Chain', 'Lexical Environment', 'Closures'],
            category: 'Runtime Fundamentals',
            order: 2,
          },
          'async-event-loop': {
            id: 'async-event-loop',
            title: 'Asynchronous Concurrency & The Event Loop',
            description: 'Non-blocking I/O, Web APIs, Macrotasks, Microtask queue ordering, and starvation.',
            prerequisites: ['js-call-stack', 'js-lexical-scope'],
            target_concepts: ['Event Loop', 'Microtask Queue', 'Macrotask Queue'],
            category: 'Concurrency',
            order: 3,
          },
          'promises-async-await': {
            id: 'promises-async-await',
            title: 'Promises & Async/Await Under the Hood',
            description: 'Promise state machines, thenable chaining, async/await coroutine desugaring.',
            prerequisites: ['async-event-loop'],
            target_concepts: ['Promise State Machine', 'Coroutine Desugaring'],
            category: 'Concurrency',
            order: 4,
          },
        },
      },
    ];
  },

  async getKnowledgeState(courseId: string): Promise<StudentKnowledgeState> {
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/knowledge-state`);
      if (res.ok) {
        const data = await res.json();
        return data.knowledge_state;
      }
    } catch (e) {
      console.warn('Backend unavailable, using initial student state.');
    }

    return {
      student_id: 'stu_101',
      course_id: courseId,
      cognitive_status: 'ActiveLearning',
      skill_scores: {
        'js-call-stack': { score: 0.88, confidence_interval: 0.12, attempts_count: 6, last_assessed_at: new Date().toISOString() },
        'js-lexical-scope': { score: 0.72, confidence_interval: 0.20, attempts_count: 4, last_assessed_at: new Date().toISOString() },
      },
      weakness_points: [
        {
          topic_id: 'async-event-loop',
          concept_tag: 'Async Closures in Loops',
          description: 'Confusion distinguishing function-scoped var from block-scoped let inside asynchronous timer callbacks.',
          severity: 'medium',
          detected_at: new Date().toISOString(),
        },
      ],
      zpd_topics: ['async-event-loop'],
      last_evaluated_at: new Date().toISOString(),
    };
  },

  async requestLesson(courseId: string, topicId?: string): Promise<AdaptiveLesson> {
    try {
      const res = await fetch(`${API_BASE}/lessons/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, topic_id: topicId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Falling back to local zero-content AI synthesis demo payload.');
    }

    // Default high-fidelity adaptive lesson demo
    return {
      lesson_id: 'les_' + Math.random().toString(36).substring(2, 9),
      topic_id: topicId || 'async-event-loop',
      topic_title: 'Asynchronous Concurrency & The Event Loop',
      difficulty: 'intermediate',
      target_bloom: 'apply',
      zpd_rationale: 'Dynamically generated for student Ada Lovelace based on prior high mastery in Execution Contexts (0.88) and active remediation needs in Async Closures.',
      cards: [
        {
          card_id: 'card-1',
          title: 'The Single Waiter Analogy: Non-Blocking I/O',
          summary: 'Understand how single-threaded engines handle concurrency without freezing.',
          content_markdown: `### The Single Waiter in a High-Volume Bistro\n\nImagine a bustling restaurant with **one waiter** (the JavaScript Call Stack) and an **industrial kitchen** (the Browser Web APIs / Libuv).\n\nIf the waiter had to wait 20 minutes at the stove for every steak to cook before taking the next customer's order, the entire dining room would freeze. Instead, the waiter sends the order to the kitchen, immediately attends to the next table, and only picks up the completed dish when notified via the order ticket queue.\n\n> **Core Principle:** JavaScript execution is single-threaded, but the host environment handles I/O concurrently.`,
          key_takeaways: [
            'Call Stack handles execution synchronously (LIFO).',
            'Async operations (timers, network, file I/O) are offloaded to background threads.',
            'The Event Loop coordinates between the stack and queues.',
          ],
          analogy: 'A restaurant waiter delegating cooking to kitchen staff while serving other patrons.',
          code_snippet: {
            language: 'javascript',
            code: `console.log('1: Order Taken');\nsetTimeout(() => console.log('3: Food Served'), 0);\nconsole.log('2: Water Poured');`,
            explanation: 'Message 3 logs last even with a 0ms delay because the Call Stack must be empty first.',
          },
          speech_transcript: 'Welcome to this adaptive module on the Event Loop. Think of the single thread as a busy restaurant waiter. Rather than waiting idly at the kitchen counter for food to cook, the waiter continues serving other guests and only delivers finished plates once their hands are free.',
        },
        {
          card_id: 'card-2',
          title: 'Microtasks vs Macrotasks: Priority Queuing',
          summary: 'Differentiate how Promises take absolute precedence over setTimeout callbacks.',
          content_markdown: `### The VIP Fast-Pass: Microtask Priority\n\nNot all async tasks have equal priority:\n\n1. **Microtask Queue:** Promise callbacks (\`.then()\`, \`catch()\`), \`queueMicrotask()\`, and \`process.nextTick()\`.  \n2. **Macrotask Queue:** \`setTimeout\`, \`setInterval\`, and I/O callbacks.\n\n**The Iron Rule:** The runtime engine will completely exhaust all queued Microtasks before running the next Macrotask.`,
          key_takeaways: [
            'Microtasks always drain to completion before the next Macrotask executes.',
            'Chained Promise resolutions can starve Macrotasks if not scheduled prudently.',
            'UI rendering occurs immediately after Microtask queue exhaustion.',
          ],
          analogy: 'VIP ticket holders boarding a flight prior to general boarding calls.',
          code_snippet: {
            language: 'javascript',
            code: `setTimeout(() => console.log('Macrotask: Timer'), 0);\nPromise.resolve().then(() => console.log('Microtask: VIP Promise'));\nconsole.log('Synchronous Stack');`,
            explanation: 'Outputs: Synchronous Stack -> Microtask: VIP Promise -> Macrotask: Timer.',
          },
          speech_transcript: 'Now let us examine task prioritization. Promises belong to the VIP Microtask queue, while timers belong to the standard Macrotask queue. The runtime always exhausts all microtasks before allowing a single macrotask to execute.',
        },
        {
          card_id: 'card-3',
          title: 'Remediation: Resolving Async Loop Closure Traps',
          summary: 'Targeted fix for loop variable capture inside asynchronous timers.',
          content_markdown: `### Pitfall Remediation: Variable Shadowing in Async Loops\n\nWhen using \`var\` in loops with asynchronous callbacks, all callbacks share the exact same variable reference:\n\n\`\`\`javascript\n// BUGGY: Logs 3, 3, 3\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n\n// CORRECT: Logs 0, 1, 2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n\`\`\`\n\nBy switching to \`let\`, each loop iteration produces an independent lexical scope binding.`,
          key_takeaways: [
            'var creates a single shared closure reference for all timer callbacks.',
            'let creates a distinct lexical scope per loop iteration.',
            'Pass variables as arguments or use block scoping to avoid stale captures.',
          ],
          analogy: 'Writing on a shared whiteboard versus handing each courier their own index card.',
          speech_transcript: 'Here is a critical pitfall resolution. When using loops with timers, traditional var declarations share a single mutable reference, resulting in repeated terminal values. Using let ensures every iteration receives an independent closure.',
        },
      ],
      questions: [
        {
          question_id: 'q1',
          prompt: 'What is the exact execution order of the following code?\n\nsetTimeout(() => console.log("A"), 0);\nPromise.resolve().then(() => console.log("B"));\nconsole.log("C");',
          options: ['A, B, C', 'C, A, B', 'C, B, A', 'B, C, A'],
          correct_option_index: 2,
          explanation: 'C executes synchronously first. Then the Microtask queue drains, executing B. Finally, the Macrotask queue executes A.',
          misconception_notes: {
            '0': 'Incorrect. Synchronous code on the stack must complete before any queued task runs.',
            '1': 'Incorrect. Promise microtasks have strict priority over setTimeout macrotasks.',
            '3': 'Incorrect. Synchronous console.log("C") runs before microtasks.',
          },
          hint: 'Remember: Synchronous stack first, then Microtask queue, then Macrotask queue.',
          concept_tested: 'Microtask vs Macrotask Queue Ordering',
        },
        {
          question_id: 'q2',
          prompt: 'Why does using "let" in a for loop resolve the issue of setTimeout logging the final index multiple times?',
          options: [
            'let makes setTimeout run synchronously.',
            'let creates a new lexical scope binding for each iteration of the loop.',
            'let increases the priority of the loop in the event loop.',
            'let prevents garbage collection of the console object.',
          ],
          correct_option_index: 1,
          explanation: 'In modern JavaScript, let in a for loop creates a fresh variable binding for every single iteration, preserving the specific value in each callback closure.',
          hint: 'Think about how block-scoping behaves compared to function-scoping.',
          concept_tested: 'Lexical Scope & Async Closures',
        },
      ],
      code_challenge: {
        title: 'Build a Microtask-Aware Task Scheduler',
        prompt: 'Implement a function `deferTask(fn, isUrgent)` that schedules `fn` via microtask if `isUrgent` is true (using queueMicrotask or Promise), and via macrotask (setTimeout 0) if false.',
        starter_code: `function deferTask(fn, isUrgent) {\n  // TODO: Implement microtask vs macrotask scheduling\n}`,
        solution_stub: `function deferTask(fn, isUrgent) {\n  if (isUrgent) {\n    queueMicrotask(fn);\n  } else {\n    setTimeout(fn, 0);\n  }\n}`,
        test_cases: [
          { input: ['fn', true], expected_output: 'microtask_scheduled' },
          { input: ['fn', false], expected_output: 'macrotask_scheduled' },
        ],
      },
    };
  },

  async askAssistant(courseId: string, lessonId: string, cardId: string, question: string): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/lessons/ask-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, card_id: cardId, question }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.response;
      }
    } catch (e) {
      console.warn('Assistant API offline, providing pedagogical simulated response.');
    }

    return `**AI Pedagogical Assistant:** Great question! In the context of this card, the runtime ensures that whatever is currently executing on the Call Stack will never be interrupted midway by an asynchronous callback. The Event Loop only intervenes once the stack is completely empty.`;
  },

  async submitQuiz(sub: QuizSubmission): Promise<QuizResult> {
    try {
      const res = await fetch(`${API_BASE}/assessment/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API offline, evaluating locally.');
    }

    const isCorrect = sub.selected_option === 2 || sub.selected_option === 1;
    return {
      attempt_id: 'att_' + Math.random().toString(36).substring(2, 9),
      is_correct: isCorrect,
      selected_option: sub.selected_option,
      correct_option_index: sub.question_id === 'q1' ? 2 : 1,
      feedback: isCorrect
        ? 'Correct! You demonstrated precise mastery of execution queue scheduling.'
        : 'Conceptual Gap Detected: Microtasks (Promises) strictly preempt Macrotasks (Timers).',
      new_mastery_score: isCorrect ? 0.82 : 0.65,
      cognitive_status: isCorrect ? 'ActiveLearning' : 'GuidedReview',
      updated_zpd: ['async-event-loop', 'promises-async-await'],
    };
  },

  async submitCode(sub: CodeSubmission): Promise<CodeVerificationResult> {
    try {
      const res = await fetch(`${API_BASE}/assessment/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API offline, validating code simulation locally.');
    }

    const hasQueueMicrotask = sub.code.includes('queueMicrotask') || sub.code.includes('Promise.resolve');
    const hasSetTimeout = sub.code.includes('setTimeout');
    const isPassing = hasQueueMicrotask && hasSetTimeout;

    return {
      submission_id: 'sub_' + Math.random().toString(36).substring(2, 9),
      score: isPassing ? 0.95 : 0.40,
      execution_status: isPassing ? 'PASSED' : 'LOGIC_ERROR',
      passed_test_cases: isPassing ? 2 : 1,
      total_test_cases: 2,
      ai_feedback: isPassing
        ? 'Excellent solution! You correctly utilized queueMicrotask for urgent tasks and setTimeout for standard macrotasks.'
        : 'Your code does not correctly differentiate between the microtask queue and macrotask queue. Ensure both paths are implemented.',
      inferred_weaknesses: isPassing ? [] : ['Microtask queue API usage'],
      refactored_solution: `function deferTask(fn, isUrgent) {\n  if (isUrgent) {\n    queueMicrotask(fn);\n  } else {\n    setTimeout(fn, 0);\n  }\n}`,
      test_results: [
        { test_index: 0, passed: isPassing, error_message: isPassing ? null : 'Expected microtask scheduling' },
        { test_index: 1, passed: true, error_message: null },
      ],
      new_topic_mastery: isPassing ? 0.91 : 0.68,
      cognitive_status: isPassing ? 'Mastered' : 'GuidedReview',
    };
  },
};
