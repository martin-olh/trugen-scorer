import { GENERALA_CATEGORIES, type GeneralaMatch, type ID } from '../data/types';

export function getPlayerTotal(match: GeneralaMatch, playerId: ID): number {
  const scores = match.scores[playerId] ?? {};
  return GENERALA_CATEGORIES.reduce((sum, category) => sum + (scores[category] ?? 0), 0);
}

export function getTotals(match: GeneralaMatch): Record<ID, number> {
  return Object.fromEntries(match.players.map((id) => [id, getPlayerTotal(match, id)]));
}

export function resolveWinner(match: GeneralaMatch): ID | null {
  const totals = getTotals(match);
  const entries = Object.entries(totals);
  if (entries.length === 0) return null;
  const [winnerId] = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  return winnerId;
}
