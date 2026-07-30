import { db } from '../db';
import type { GeneralaCategory, GeneralaMatch, ID } from '../types';
import { resolveWinner } from '../../services/generalaScoring';

export const generalaMatchRepository = {
  async getAll(): Promise<GeneralaMatch[]> {
    return db.generalaMatches.orderBy('createdAt').reverse().toArray();
  },

  async getById(id: ID): Promise<GeneralaMatch | undefined> {
    return db.generalaMatches.get(id);
  },

  async getForPlayer(playerId: ID): Promise<GeneralaMatch[]> {
    return db.generalaMatches.where('players').equals(playerId).toArray();
  },

  async create(playerIds: ID[]): Promise<GeneralaMatch> {
    const match: GeneralaMatch = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'in_progress',
      players: playerIds,
      scores: Object.fromEntries(playerIds.map((id) => [id, {}])),
      tiros: Object.fromEntries(playerIds.map((id) => [id, 0])),
      winnerId: null,
    };
    await db.generalaMatches.add(match);
    return match;
  },

  async setScore(
    id: ID,
    playerId: ID,
    category: GeneralaCategory,
    value: number,
  ): Promise<GeneralaMatch> {
    const match = await db.generalaMatches.get(id);
    if (!match) throw new Error(`GeneralaMatch ${id} not found`);
    const updated: GeneralaMatch = {
      ...match,
      scores: {
        ...match.scores,
        [playerId]: { ...match.scores[playerId], [category]: value },
      },
    };
    await db.generalaMatches.put(updated);
    return updated;
  },

  async setTiros(id: ID, playerId: ID, value: number): Promise<GeneralaMatch> {
    const match = await db.generalaMatches.get(id);
    if (!match) throw new Error(`GeneralaMatch ${id} not found`);
    const updated: GeneralaMatch = {
      ...match,
      tiros: { ...match.tiros, [playerId]: Math.max(0, value) },
    };
    await db.generalaMatches.put(updated);
    return updated;
  },

  async finish(id: ID): Promise<GeneralaMatch> {
    const match = await db.generalaMatches.get(id);
    if (!match) throw new Error(`GeneralaMatch ${id} not found`);
    const updated: GeneralaMatch = {
      ...match,
      status: 'completed',
      completedAt: new Date().toISOString(),
      winnerId: resolveWinner(match),
    };
    await db.generalaMatches.put(updated);
    return updated;
  },
};
