import { AiTelemetryData, AiLogEntry } from '../types';

export const INITIAL_AI_TELEMETRY: AiTelemetryData = {
  engine: 'Google Gemini 1.5 (Structured Output Mode)',
  temperature: 0.2,
  schemaVersion: 'Draft 2020-12 (Strict Typing)',
  generationComplianceRate: 99.4,
  selfHealingRetryRate: 0.6,
  averageSynthesisLatencyMs: 1240,
  zeroContentGuarantee: 'Strict: No pre-authored lessons stored.',
  activeRequestsCount: 3,
  dailyTotalSynthesized: 348,
  totalTokensProcessed: 1420500,
};

export const INITIAL_AI_LOGS: AiLogEntry[] = [
  {
    id: 'ai-log-1',
    timestamp: 'منذ 3 دقائق',
    action: 'توليد درس تكيفي آني (Adaptive Lesson Synthesis)',
    model: 'Gemini 1.5 Pro',
    latencyMs: 1180,
    status: 'SUCCESS',
    topicId: 'async-event-loop',
    studentId: 'usr-201',
  },
  {
    id: 'ai-log-2',
    timestamp: 'منذ 8 دقائق',
    action: 'تقييم كود برمجي (Automated Code Evaluation)',
    model: 'Gemini 1.5 Flash',
    latencyMs: 820,
    status: 'SUCCESS',
    topicId: 'async-event-loop',
    studentId: 'usr-202',
  },
  {
    id: 'ai-log-3',
    timestamp: 'منذ 15 دقيقة',
    action: 'إجابة استفسار بيداغوجي (Smart Pedagogical Q&A)',
    model: 'Gemini 1.5 Flash',
    latencyMs: 750,
    status: 'SUCCESS',
    topicId: 'js-lexical-scope',
    studentId: 'usr-203',
  },
  {
    id: 'ai-log-4',
    timestamp: 'منذ 28 دقيقة',
    action: 'إصلاح ذاتي لمخطط JSON (Self-Healing Schema Correction)',
    model: 'Gemini 1.5 Pro',
    latencyMs: 1640,
    status: 'HEALED',
    topicId: 'promises-async-await',
    studentId: 'usr-204',
  },
  {
    id: 'ai-log-5',
    timestamp: 'منذ 45 دقيقة',
    action: 'توليد أسئلة تشخيصية متفرعة (Formative Quiz Generation)',
    model: 'Gemini 1.5 Pro',
    latencyMs: 1310,
    status: 'SUCCESS',
    topicId: 'js-call-stack',
    studentId: 'usr-207',
  },
];

