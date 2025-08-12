import { NextResponse } from 'next/server';

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

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(num, max));
}

export async function POST(request: Request) {
  const body = (await request.json()) as IdeaInput;

  const textScore =
    body.problem.length + body.solution.length + body.audience.length + body.monetization.length;
  const novelty = Math.abs(body.title.length - body.competition.length);
  const baseScore = clamp(Math.round(50 + (novelty / 2 + textScore / 80)), 10, 92);
  const saturation: AnalysisResult['saturationLevel'] = baseScore > 70 ? 'medium' : baseScore > 55 ? 'high' : 'low';

  const risks: AnalysisResult['risks'] = [
    { label: 'Market saturation', severity: saturation === 'high' ? 'high' : 'medium', note: 'Consider niche positioning and differentiated messaging.' },
    { label: 'Acquisition cost', severity: baseScore < 60 ? 'medium' : 'low', note: 'Explore organic channels and partnerships to reduce CAC.' },
    { label: 'Retention risk', severity: baseScore < 50 ? 'high' : 'medium', note: 'Double down on must-have use cases; validate problem severity.' },
  ];

  const competitors: Competitor[] = [
    { name: `${body.title.split(' ')[0] || 'Alpha'} Labs`, strength: 'Strong brand and funding', weakness: 'Enterprise-focused', url: 'https://example.com' },
    { name: 'NicheScout', strength: 'Great UX, quick onboarding', weakness: 'Limited datasets' },
    { name: 'TrendLens', strength: 'Powerful trend analytics', weakness: 'High price point' },
  ];

  const opportunities = [
    'Target underserved SMB segments with focused messaging',
    'Automate tedious workflows to increase perceived value',
    'Bundle competitor monitoring as an always-on feature',
  ];

  const result: AnalysisResult = {
    viabilityScore: baseScore,
    saturationLevel: saturation,
    risks,
    opportunities,
    competitors,
    notes: 'Mock analysis. Integrate real data sources and models to replace this endpoint.'
  };

  return NextResponse.json(result);
}