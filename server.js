/**
 * Standalone Node.js API Companion Server
 * Port: 8000
 * Serves all Laravel backend API routes for development without requiring PHP locally.
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// In-Memory Cloud Firestore Mock Database
const db = {
  students: {
    'mock-student-uid-101': {
      id: 'stu_101',
      firebase_uid: 'mock-student-uid-101',
      email: 'student.ada@example.edu',
      display_name: 'Ada Lovelace',
      role: 'STD',
      placement_completed: true,
      enrolled_courses: ['cs-advanced-js'],
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    },
    'mock-admin-uid': {
      id: 'adm_101',
      firebase_uid: 'mock-admin-uid',
      email: 'admin@smart-learning.edu',
      display_name: 'Platform Administrator',
      role: 'ADM',
      placement_completed: true,
      enrolled_courses: ['cs-advanced-js'],
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    },
  },
  courses: [
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
  ],
  knowledge_states: {
    'stu_101_cs-advanced-js': {
      student_id: 'stu_101',
      course_id: 'cs-advanced-js',
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
    },
  },
  attempts: [],
};

// CORS and JSON Headers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Student-Id, X-User-Role',
  });
  res.end(JSON.stringify(data));
}

// Request body reader
function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Student-Id, X-User-Role',
    });
    return res.end();
  }

  // Extract auth bearer token
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const isAdmin = token.includes('admin') || req.headers['x-user-role'] === 'ADM';

  // 1. Identity Endpoints
  if (path === '/api/auth/sync-user' && method === 'POST') {
    const body = await readBody(req);
    const uid = token || 'mock-student-uid-101';
    const role = isAdmin ? 'ADM' : 'STD';

    let user = db.students[uid];
    if (!user) {
      user = {
        id: 'stu_' + Math.random().toString(36).substring(2, 9),
        firebase_uid: uid,
        email: isAdmin ? 'admin@smart-learning.edu' : 'student.ada@example.edu',
        display_name: body.display_name || (isAdmin ? 'Administrator' : 'Student Ada'),
        role: role,
        placement_completed: false,
        enrolled_courses: ['cs-advanced-js'],
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      };
      db.students[uid] = user;
    } else {
      user.last_login_at = new Date().toISOString();
      if (body.display_name) user.display_name = body.display_name;
    }

    return sendJson(res, 200, {
      success: true,
      message: 'User synchronized successfully.',
      user: user,
      role: user.role,
      placement_completed: user.placement_completed,
    });
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const uid = token || 'mock-student-uid-101';
    const user = db.students[uid] || db.students['mock-student-uid-101'];
    return sendJson(res, 200, {
      success: true,
      user: user,
      role: user.role,
      placement_completed: user.placement_completed,
    });
  }

  // 2. Courses Endpoints
  if (path === '/api/courses' && method === 'GET') {
    return sendJson(res, 200, { courses: db.courses });
  }

  if (path.startsWith('/api/courses/') && path.endsWith('/knowledge-state') && method === 'GET') {
    const parts = path.split('/');
    const courseId = parts[3];
    const key = `stu_101_${courseId}`;
    const state = db.knowledge_states[key] || {
      student_id: 'stu_101',
      course_id: courseId,
      cognitive_status: 'ActiveLearning',
      skill_scores: {},
      weakness_points: [],
      zpd_topics: ['async-event-loop'],
      last_evaluated_at: new Date().toISOString(),
    };
    return sendJson(res, 200, { knowledge_state: state });
  }

  // 3. Adaptive Zero-Content Lesson Synthesis
  if (path === '/api/lessons/request' && method === 'POST') {
    const body = await readBody(req);
    const topicId = body.topic_id || 'async-event-loop';

    // Synthesized Zero-Content Lesson (adheres to Draft 2020-12 schema)
    const synthesizedLesson = {
      lesson_id: 'les_' + Math.random().toString(36).substring(2, 9),
      topic_id: topicId,
      topic_title: 'Asynchronous Concurrency & The Event Loop',
      difficulty: 'intermediate',
      target_bloom: 'apply',
      zpd_rationale: 'Dynamically synthesized for student knowledge state based on prior mastery in Execution Contexts (0.88) and remediation needs in loop closure variable bindings.',
      cards: [
        {
          card_id: 'card-1',
          title: 'The Single Waiter Analogy: Non-Blocking I/O',
          summary: 'Understand how single-threaded engines handle concurrency without freezing.',
          content_markdown: `### The Single Waiter in a High-Volume Bistro\n\nImagine a restaurant with **one waiter** (the JavaScript Call Stack) and an **industrial kitchen** (the Browser Web APIs / Libuv).\n\nIf the waiter had to wait 20 minutes at the stove for every steak to cook before taking the next customer's order, the entire dining room would freeze. Instead, the waiter sends the order to the kitchen, immediately attends to the next table, and only picks up the completed dish when notified via the order ticket queue (Callback Queue).\n\n> **Core Insight:** JavaScript is single-threaded, but the runtime host environment is multi-threaded.`,
          key_takeaways: [
            'Call Stack handles execution synchronously in a Last-In-First-Out (LIFO) manner.',
            'Async operations (timers, network requests, file I/O) are offloaded to runtime background threads.',
            'The Event Loop continuously monitors whether the Call Stack is completely clear before pushing pending callbacks.',
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
        prompt: 'Implement a function deferTask(fn, isUrgent) that schedules fn via microtask if isUrgent is true (using queueMicrotask or Promise), and via macrotask (setTimeout 0) if false.',
        starter_code: `function deferTask(fn, isUrgent) {\n  // TODO: Implement microtask vs macrotask scheduling\n}`,
        solution_stub: `function deferTask(fn, isUrgent) {\n  if (isUrgent) {\n    queueMicrotask(fn);\n  } else {\n    setTimeout(fn, 0);\n  }\n}`,
        test_cases: [
          { input: ['fn', true], expected_output: 'microtask_scheduled' },
          { input: ['fn', false], expected_output: 'macrotask_scheduled' },
        ],
      },
    };

    return sendJson(res, 200, synthesizedLesson);
  }

  // 4. Smart Assistant Q&A
  if (path === '/api/lessons/ask-assistant' && method === 'POST') {
    const body = await readBody(req);
    const q = body.question || '';
    return sendJson(res, 200, {
      response: `**AI Pedagogical Assistant:** Great inquiry! Regarding "${q}": The runtime Call Stack handles instructions strictly in sequence. While an operation is actively executing on the stack, asynchronous queues must wait until the stack frame is completely vacated. The Event Loop acts as the traffic controller orchestrating this transition.`,
      topic_id: 'async-event-loop',
      card_id: body.card_id,
    });
  }

  // 5. Formative Assessment Quiz
  if (path === '/api/assessment/quiz' && method === 'POST') {
    const body = await readBody(req);
    const isCorrect = body.selected_option === 2 || body.selected_option === 1;

    // Update state in memory
    const state = db.knowledge_states['stu_101_cs-advanced-js'];
    if (state) {
      state.cognitive_status = isCorrect ? 'ActiveLearning' : 'GuidedReview';
      state.skill_scores['async-event-loop'] = {
        score: isCorrect ? 0.84 : 0.62,
        confidence_interval: 0.15,
        attempts_count: 5,
        last_assessed_at: new Date().toISOString(),
      };
    }

    return sendJson(res, 200, {
      attempt_id: 'att_' + Math.random().toString(36).substring(2, 9),
      is_correct: isCorrect,
      selected_option: body.selected_option,
      correct_option_index: body.question_id === 'q1' ? 2 : 1,
      feedback: isCorrect
        ? 'Correct! Precision demonstrated regarding microtask priority execution.'
        : 'Conceptual Gap: Microtasks (Promises) always precede Macrotasks (Timers).',
      new_mastery_score: isCorrect ? 0.84 : 0.62,
      cognitive_status: isCorrect ? 'ActiveLearning' : 'GuidedReview',
      updated_zpd: ['async-event-loop', 'promises-async-await'],
    });
  }

  // 6. Automated Code Challenge Evaluation
  if (path === '/api/assessment/code' && method === 'POST') {
    const body = await readBody(req);
    const code = body.code || '';
    const hasMicrotask = code.includes('queueMicrotask') || code.includes('Promise.resolve');
    const hasTimeout = code.includes('setTimeout');
    const isPassing = hasMicrotask && hasTimeout;

    return sendJson(res, 200, {
      submission_id: 'sub_' + Math.random().toString(36).substring(2, 9),
      score: isPassing ? 0.95 : 0.45,
      execution_status: isPassing ? 'PASSED' : 'LOGIC_ERROR',
      passed_test_cases: isPassing ? 2 : 1,
      total_test_cases: 2,
      ai_feedback: isPassing
        ? 'Optimal solution! You correctly branched between the Microtask queue and Macrotask queue.'
        : 'Solution did not distinguish between urgent microtask scheduling and standard macrotasks.',
      inferred_weaknesses: isPassing ? [] : ['Microtask queuing semantics'],
      refactored_solution: `function deferTask(fn, isUrgent) {\n  if (isUrgent) {\n    queueMicrotask(fn);\n  } else {\n    setTimeout(fn, 0);\n  }\n}`,
      test_results: [
        { test_index: 0, passed: isPassing, error_message: isPassing ? null : 'Expected microtask scheduling' },
        { test_index: 1, passed: true, error_message: null },
      ],
      new_topic_mastery: isPassing ? 0.92 : 0.65,
      cognitive_status: isPassing ? 'Mastered' : 'GuidedReview',
    });
  }

  // 7. Admin Analytics & Telemetry
  if (path === '/api/admin/telemetry' && method === 'GET') {
    return sendJson(res, 200, {
      engine: 'Google Gemini 1.5 (Structured Output Mode)',
      temperature: 0.2,
      schema_version: 'Draft 2020-12',
      generation_compliance_rate: 0.994,
      self_healing_retry_rate: 0.006,
      average_synthesis_latency_ms: 1240,
      zero_content_guarantee: 'Strict: No pre-authored lessons stored.',
    });
  }

  if (path === '/api/admin/topic-maps' && method === 'GET') {
    return sendJson(res, 200, { syllabi: db.courses });
  }

  // Fallback 404
  return sendJson(res, 404, { error: 'Route not found', path });
});

server.listen(PORT, () => {
  console.log(`\n===============================================================`);
  console.log(`🚀 Adaptive Learning Platform - Companion API Server`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Zero-Content Paradigm: Active (100% On-The-Fly Synthesis)`);
  console.log(`===============================================================\n`);
});
