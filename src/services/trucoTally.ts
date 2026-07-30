import type { TrucoMatch, TrucoTarget, ID } from '../data/types';

export interface TallyLayout {
  /** Points filled (0-5) for each square, in order. 5 = complete square + diagonal. */
  groups: number[];
  /** Index into `groups` after which the halfway divider should render. */
  halfwayGroupIndex: number;
}

export function getTallyLayout(score: number, targetScore: TrucoTarget): TallyLayout {
  const totalGroups = targetScore / 5;
  const halfwayGroupIndex = targetScore / 2 / 5;
  const groups = Array.from({ length: totalGroups }, (_, i) =>
    Math.min(5, Math.max(0, score - i * 5)),
  );
  return { groups, halfwayGroupIndex };
}

/** Pure state transition for a score change, shared by the repository (persistence)
 * and the mutation's optimistic update (immediate UI feedback) so both agree on
 * when a match completes. */
export function applyTrucoScore(match: TrucoMatch, playerId: ID, score: number): TrucoMatch {
  if (match.status === 'completed') return match;

  const clamped = Math.max(0, score);
  const scores = { ...match.scores, [playerId]: clamped };
  const winnerId =
    clamped >= match.targetScore
      ? playerId
      : (Object.entries(scores).find(([, s]) => s >= match.targetScore)?.[0] ?? null);

  return {
    ...match,
    scores,
    winnerId,
    status: winnerId ? 'completed' : 'in_progress',
    completedAt: winnerId ? new Date().toISOString() : null,
  };
}
