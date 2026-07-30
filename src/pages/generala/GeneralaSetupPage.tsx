import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerPicker } from '../../components/shared/PlayerPicker';
import { useCreateGeneralaMatch } from '../../hooks/useGeneralaMatch';
import type { ID } from '../../data/types';

export function GeneralaSetupPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ID[]>([]);
  const createMatch = useCreateGeneralaMatch();

  const toggle = (id: ID) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const canStart = selected.length >= 2;

  const handleStart = async () => {
    if (!canStart) return;
    const match = await createMatch.mutateAsync(selected);
    navigate(`/generala/${match.id}`);
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">New Generala Match</h1>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase text-slate-500">
          Choose 2 or more players
        </h2>
        <PlayerPicker selected={selected} onToggle={toggle} />
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
