import { useMemo } from 'react';
import { useTrucoMatches } from './useTrucoMatch';
import { useGeneralaMatches } from './useGeneralaMatch';
import { getPlayerStats, getTrucoHeadToHead } from '../services/statsService';
import type { ID } from '../data/types';

export function usePlayerStats(playerId: ID | undefined) {
  const { data: trucoMatches = [], isPending: trucoPending } = useTrucoMatches();
  const { data: generalaMatches = [], isPending: generalaPending } = useGeneralaMatches();

  const stats = useMemo(
    () => (playerId ? getPlayerStats(playerId, trucoMatches, generalaMatches) : undefined),
    [playerId, trucoMatches, generalaMatches],
  );

  return { stats, isPending: trucoPending || generalaPending, trucoMatches, generalaMatches };
}

export function useTrucoHeadToHead(playerAId: ID | undefined, playerBId: ID | undefined) {
  const { data: trucoMatches = [], isPending } = useTrucoMatches();

  const headToHead = useMemo(
    () =>
      playerAId && playerBId
        ? getTrucoHeadToHead(playerAId, playerBId, trucoMatches)
        : undefined,
    [playerAId, playerBId, trucoMatches],
  );

  return { headToHead, isPending };
}
