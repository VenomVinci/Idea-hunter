export type IdeaInput = {
  title: string;
  problem: string;
  solution: string;
  audience: string;
  monetization: string;
  channels: string;
  competition: string;
};

export type Competitor = {
  name: string;
  strength: string;
  weakness: string;
  url?: string;
};

export type AnalysisResult = {
  viabilityScore: number; // 0-100
  saturationLevel: 'low' | 'medium' | 'high';
  risks: { label: string; severity: 'low' | 'medium' | 'high'; note: string }[];
  opportunities: string[];
  competitors: Competitor[];
  notes: string;
};