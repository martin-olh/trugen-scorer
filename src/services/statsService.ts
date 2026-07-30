import type { GeneralaMatch, ID, TrucoMatch } from '../data/types';

export interface PlayerStats {
  trucoWins: number;
  trucoPlayed: number;
  generalaWins: number;
  generalaPlayed: number;
}

export function getPlayerStats(
  playerId: ID,
  trucoMatches: TrucoMatch[],
  generalaMatches: GeneralaMatch[],
): PlayerStats {
  const completedTruco = trucoMatches.filter(
    (m) => m.status === 'completed' && m.players.includes(playerId),
  );
  const completedGenerala = generalaMatches.filter(
    (m) => m.status === 'completed' && m.players.includes(playerId),
  );
  return {
    trucoWins: completedTruco.filter((m) => m.winnerId === playerId).length,
    trucoPlayed: completedTruco.length,
    generalaWins: completedGenerala.filter((m) => m.winnerId === playerId).length,
    generalaPlayed: completedGenerala.length,
  };
}

export interface HeadToHead {
  playerAWins: number;
  playerBWins: number;
  totalPlayed: number;
}

export function getTrucoHeadToHead(
  playerAId: ID,
  playerBId: ID,
  trucoMatches: TrucoMatch[],
): HeadToHead {
  const matches = trucoMatches.filter(
    (m) =>
      m.status === 'completed' &&
      m.players.includes(playerAId) &&
      m.players.includes(playerBId),
  );
  return {
    playerAWins: matches.filter((m) => m.winnerId === playerAId).length,
    playerBWins: matches.filter((m) => m.winnerId === playerBId).length,
    totalPlayed: matches.length,
  };
}
