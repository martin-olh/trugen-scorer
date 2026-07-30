import { db } from '../db';
import type { ID, TrucoMatch, TrucoTarget } from '../types';
import { applyTrucoScore } from '../../services/trucoTally';

export const trucoMatchRepository = {
  async getAll(): Promise<TrucoMatch[]> {
    return db.trucoMatches.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: ID): Promise<TrucoMatch | undefined> {
    return db.trucoMatches.get(id);
  },

  async getForPlayer(playerId: ID): Promise<TrucoMatch[]> {
    return db.trucoMatches.where('players').equals(playerId).toArray();
  },

  async create(playerIds: [ID, ID], targetScore: TrucoTarget): Promise<TrucoMatch> {
    const match: TrucoMatch = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'in_progress',
      targetScore,
      players: playerIds,
      scores: { [playerIds[0]]: 0, [playerIds[1]]: 0 },
      winnerId: null,
    };
    await db.trucoMatches.add(match);
    return match;
  },

  async setScore(id: ID, playerId: ID, score: number): Promise<TrucoMatch> {
    const match = await db.trucoMatches.get(id);
    if (!match) throw new Error(`TrucoMatch ${id} not found`);

    const updated = applyTrucoScore(match, playerId, score);
    await db.trucoMatches.put(updated);
    return updated;
  },
};
