export interface TranscriptSegment {
  startTimeSec: number;
  durationSec: number;
  text: string;
}

export interface TopicSummary {
  id: string;
  title: string;
  startTimeSec: number;
  endTimeSec: number;
  summary: string;
  bullets: string[];
}

export interface QuizQuestion {
  id: string;
  timestampSec: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface AnalysisResponse {
  topics: TopicSummary[];
  quizzes: QuizQuestion[];
}