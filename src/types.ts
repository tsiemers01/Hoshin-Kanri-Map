export type QuadrantId = 'breakthrough' | 'annual' | 'initiatives' | 'metrics';

export interface HoshinItem {
  id: string;
  text: string;
  owner?: string;
}

export interface CorrelationKey {
  fromQuadrant: QuadrantId;
  fromItemId: string;
  toQuadrant: QuadrantId;
  toItemId: string;
}

export type CorrelationStrength = 'none' | 'weak' | 'strong';

export interface Correlation {
  key: string;
  strength: CorrelationStrength;
}

export interface HoshinData {
  title: string;
  breakthrough: HoshinItem[];
  annual: HoshinItem[];
  initiatives: HoshinItem[];
  metrics: HoshinItem[];
  correlations: Record<string, CorrelationStrength>;
}

export const QUADRANT_META: Record<QuadrantId, { label: string; subtitle: string; color: string }> = {
  breakthrough: {
    label: 'Breakthrough Objectives',
    subtitle: '3-5 Year Goals',
    color: 'var(--color-breakthrough)',
  },
  annual: {
    label: 'Annual Objectives',
    subtitle: '1 Year Goals',
    color: 'var(--color-annual)',
  },
  initiatives: {
    label: 'Key Initiatives',
    subtitle: 'Improvement Projects',
    color: 'var(--color-initiatives)',
  },
  metrics: {
    label: 'Targets & Metrics',
    subtitle: 'KPIs & Measures',
    color: 'var(--color-metrics)',
  },
};

export const ADJACENT_PAIRS: [QuadrantId, QuadrantId][] = [
  ['breakthrough', 'annual'],
  ['annual', 'initiatives'],
  ['initiatives', 'metrics'],
  ['metrics', 'breakthrough'],
];

export function correlationKey(
  q1: QuadrantId,
  id1: string,
  q2: QuadrantId,
  id2: string,
): string {
  return `${q1}:${id1}|${q2}:${id2}`;
}
