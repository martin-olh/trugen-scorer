import Dexie, { type EntityTable } from 'dexie';
import type { Player, TrucoMatch, GeneralaMatch } from './types';

class TrugenScorerDB extends Dexie {
  players!: EntityTable<Player, 'id'>;
  trucoMatches!: EntityTable<TrucoMatch, 'id'>;
  generalaMatches!: EntityTable<GeneralaMatch, 'id'>;

  constructor() {
    super('trugen-scorer');
    this.version(1).stores({
      players: 'id, name, createdAt',
      trucoMatches: 'id, status, createdAt, *players',
      generalaMatches: 'id, status, createdAt, *players',
    });
  }
}

export const db = new TrugenScorerDB();
