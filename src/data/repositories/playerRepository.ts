import { db } from '../db';
import type { Player } from '../types';

export const playerRepository = {
  async getAll(): Promise<Player[]> {
    return db.players.orderBy('name').toArray();
  },

  async getById(id: string): Promise<Player | undefined> {
    return db.players.get(id);
  },

  async getByIds(ids: string[]): Promise<Player[]> {
    const players = await db.players.bulkGet(ids);
    return players.filter((p): p is Player => p !== undefined);
  },

  async create(name: string): Promise<Player> {
    const player: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    await db.players.add(player);
    return player;
  },

  async remove(id: string): Promise<void> {
    await db.players.delete(id);
  },
};
