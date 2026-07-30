export type ID = string;

export interface Player {
  id: ID;
  name: string;
  createdAt: string;
}

export type TrucoTarget = 20 | 30 | 40;
export type MatchStatus = 'in_progress' | 'completed';

export interface TrucoMatch {
  id: ID;
  createdAt: string;
  completedAt: string | null;
  status: MatchStatus;
  targetScore: TrucoTarget;
  players: [ID, ID];
  scores: Record<ID, number>;
  winnerId: ID | null;
}

export const GENERALA_CATEGORIES = [
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'DOBLE_PAR',
  'FULL',
  'POKER',
  'ESCALERA',
  'GENERALA',
] as const;

export type GeneralaCategory = (typeof GENERALA_CATEGORIES)[number];

export const GENERALA_CATEGORY_LABELS: Record<GeneralaCategory, string> = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  DOBLE_PAR: 'Doble Par',
  FULL: 'Full',
  POKER: 'Poker',
  ESCALERA: 'Escalera',
  GENERALA: 'Generala',
};

export interface GeneralaMatch {
  id: ID;
  createdAt: string;
  completedAt: string | null;
  status: MatchStatus;
  players: ID[];
  scores: Record<ID, Partial<Record<GeneralaCategory, number>>>;
  tiros: Record<ID, number>;
  winnerId: ID | null;
}
