import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import { usePlayerStats, useTrucoHeadToHead } from '../hooks/usePlayerStats';

export function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: players = [] } = usePlayers();
  const { stats } = usePlayerStats(playerId);
  const [opponentId, setOpponentId] = useState<string>('');
  const { headToHead } = useTrucoHeadToHead(playerId, opponentId || undefined);

  const player = players.find((p) => p.id === playerId);
  const opponents = players.filter((p) => p.id !== playerId);

  if (!player) return <p className="p-4 text-slate-500">Player not found.</p>;

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{player.name}</h1>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400">
          Home
        </Link>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.trucoWins ?? 0}
          </p>
          <p className="text-sm text-slate-500">Truco wins ({stats?.trucoPlayed ?? 0} played)</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats?.generalaWins ?? 0}
          </p>
          <p className="text-sm text-slate-500">
            Generala wins ({stats?.generalaPlayed ?? 0} played)
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase text-slate-500">
          Head-to-head (Truco)
        </h2>
        <select
          value={opponentId}
          onChange={(e) => setOpponentId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="">Choose an opponent…</option>
          {opponents.map((opponent) => (
            <option key={opponent.id} value={opponent.id}>
              {opponent.name}
            </option>
          ))}
        </select>

        {headToHead && (
          <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-center text-slate-900 dark:text-slate-100">
              <span className="text-2xl font-bold">{headToHead.playerAWins}</span>
              <span className="mx-2 text-slate-400">–</span>
              <span className="text-2xl font-bold">{headToHead.playerBWins}</span>
            </p>
            <p className="mt-1 text-center text-sm text-slate-500">
              {headToHead.totalPlayed} match{headToHead.totalPlayed === 1 ? '' : 'es'} played
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
