import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayers, useCreatePlayer, useRemovePlayer } from '../hooks/usePlayers';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import type { ID } from '../data/types';

export function HomePage() {
  const { data: players = [] } = usePlayers();
  const createPlayer = useCreatePlayer();
  const removePlayer = useRemovePlayer();
  const [newName, setNewName] = useState('');
  const [pendingRemoveId, setPendingRemoveId] = useState<ID | null>(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    createPlayer.mutate(name);
    setNewName('');
  };

  const pendingRemove = players.find((p) => p.id === pendingRemoveId);

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">TRUGEN Scorer</h1>

      <section className="mt-8 grid grid-cols-2 gap-3">
        <Link
          to="/truco/new"
          className="rounded-xl bg-indigo-600 px-4 py-6 text-center text-lg font-semibold text-white"
        >
          + Truco
        </Link>
        <Link
          to="/generala/new"
          className="rounded-xl bg-emerald-600 px-4 py-6 text-center text-lg font-semibold text-white"
        >
          + Generala
        </Link>
      </section>

      <Link to="/history" className="mt-4 block text-center text-sm text-indigo-600 dark:text-indigo-400">
        View match history →
      </Link>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase text-slate-500">Players</h2>
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          {players.map((player) => (
            <li key={player.id} className="flex items-center justify-between px-4 py-3">
              <Link
                to={`/players/${player.id}`}
                className="font-medium text-slate-900 dark:text-slate-100"
              >
                {player.name}
              </Link>
              <button
                type="button"
                onClick={() => setPendingRemoveId(player.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
          {players.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500">No players yet — add one below.</li>
          )}
        </ul>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add new player"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-30 dark:bg-slate-100 dark:text-slate-900"
          >
            Add
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={pendingRemoveId !== null}
        title={`Remove ${pendingRemove?.name ?? 'player'}?`}
        message="This won't delete their past match history, but they'll be removed from the roster."
        confirmLabel="Remove"
        onCancel={() => setPendingRemoveId(null)}
        onConfirm={() => {
          if (pendingRemoveId) removePlayer.mutate(pendingRemoveId);
          setPendingRemoveId(null);
        }}
      />
    </div>
  );
}
