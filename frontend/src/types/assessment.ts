export interface QuizSubmission {
  course_id: string;
  lesson_id: string;
  topic_id: string;
  question_id: string;
  selected_option: number;
  time_spent_seconds?: number;
}

export interface QuizResult {
  attempt_id: string;
  is_correct: boolean;
  selected_option: number;
  correct_option_index: number;
  feedback: string;
  new_mastery_score: number;
  cognitive_status: string;
  updated_zpd: string[];
}

export interface CodeSubmission {
  course_id: string;
  lesson_id: string;
  topic_id: string;
  code: string;
  language: string;
}

export interface TestCaseResult {
  test_index: number;
  passed: boolean;
  actual_output?: any;
  expected_output?: any;
  error_message?: string | null;
}

export interface CodeVerificationResult {
  submission_id: string;
  score: number;
  execution_status: 'PASSED' | 'FAILED' | 'SYNTAX_ERROR' | 'TIMEOUT' | 'LOGIC_ERROR';
  passed_test_cases: number;
  total_test_cases: number;
  ai_feedback: string;
  inferred_weaknesses: string[];
  refactored_solution: string;
  test_results: TestCaseResult[];
  new_topic_mastery: number;
  cognitive_status: string;
}
