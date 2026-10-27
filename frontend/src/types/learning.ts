export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'mastery';

export type BloomTaxonomyLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
}

export interface ExplanationCard {
  card_id: string;
  title: string;
  summary: string;
  content_markdown: string;
  key_takeaways: string[];
  analogy?: string | null;
  code_snippet?: CodeSnippet | null;
  speech_transcript: string;
}

export interface Question {
  question_id: string;
  prompt: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  misconception_notes?: Record<string, string>;
  hint: string;
  concept_tested: string;
}

export interface TestCase {
  input: any;
  expected_output: any;
  is_hidden?: boolean;
}

export interface CodeChallenge {
  title: string;
  prompt: string;
  starter_code: string;
  solution_stub: string;
  test_cases: TestCase[];
}

export interface AdaptiveLesson {
  lesson_id: string;
  topic_id: string;
  topic_title: string;
  difficulty: DifficultyLevel;
  target_bloom: BloomTaxonomyLevel;
  zpd_rationale: string;
  cards: ExplanationCard[];
  questions: Question[];
  code_challenge?: CodeChallenge | null;
  generated_at?: string;
  current_knowledge_state?: any;
}
