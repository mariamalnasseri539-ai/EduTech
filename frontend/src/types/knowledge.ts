export type CognitiveStatus =
  | 'Unassessed'
  | 'ActiveLearning'
  | 'Assessing'
  | 'GuidedReview'
  | 'Mastered';

export interface SkillScore {
  score: number;
  confidence_interval: number;
  attempts_count: number;
  last_assessed_at: string;
}

export interface WeaknessPoint {
  topic_id: string;
  concept_tag: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_at: string;
}

export interface StudentKnowledgeState {
  student_id: string;
  course_id: string;
  cognitive_status: CognitiveStatus;
  skill_scores: Record<string, SkillScore>;
  weakness_points: WeaknessPoint[];
  zpd_topics: string[];
  last_evaluated_at: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  target_concepts: string[];
  category: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  estimated_hours: number;
  topic_map: Record<string, SyllabusTopic>;
}
