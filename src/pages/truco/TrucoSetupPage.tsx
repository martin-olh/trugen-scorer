import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerPicker } from '../../components/shared/PlayerPicker';
import { useCreateTrucoMatch } from '../../hooks/useTrucoMatch';
import { TRUCO_TARGETS } from '../../lib/constants';
import type { ID, TrucoTarget } from '../../data/types';

export function TrucoSetupPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ID[]>([]);
  const [target, setTarget] = useState<TrucoTarget>(30);
  const createMatch = useCreateTrucoMatch();

  const toggle = (id: ID) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id].slice(0, 2),
    );
  };

  const canStart = selected.length === 2;

  const handleStart = async () => {
    if (!canStart) return;
    const match = await createMatch.mutateAsync({
      players: selected as [ID, ID],
      targetScore: target,
    });
    navigate(`/truco/${match.id}`);
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">New Truco Match</h1>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase text-slate-500">
          Choose 2 players
        </h2>
        <PlayerPicker selected={selected} onToggle={toggle} max={2} />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase text-slate-500">Target score</h2>
        <div className="flex gap-2">
          {TRUCO_TARGETS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTarget(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                target === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        disabled={!canStart || createMatch.isPending}
        onClick={handleStart}
        className="mt-8 w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white disabled:opacity-30"
      >
        Start Match
      </button>
    </div>
  );
}
