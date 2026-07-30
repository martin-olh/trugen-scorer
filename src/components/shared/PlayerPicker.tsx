import { useState } from 'react';
import { usePlayers, useCreatePlayer } from '../../hooks/usePlayers';
import type { ID } from '../../data/types';

interface PlayerPickerProps {
  selected: ID[];
  onToggle: (id: ID) => void;
  max?: number;
}

export function PlayerPicker({ selected, onToggle, max }: PlayerPickerProps) {
  const { data: players = [], isPending } = usePlayers();
  const createPlayer = useCreatePlayer();
  const [newName, setNewName] = useState('');

  const atMax = max !== undefined && selected.length >= max;

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    createPlayer.mutate(name);
    setNewName('');
  };

  return (
    <div>
      {isPending && <p className="text-sm text-slate-500">Loading players…</p>}
      <div className="flex flex-wrap gap-2">
        {players.map((player) => {
          const isSelected = selected.includes(player.id);
          const disabled = !isSelected && atMax;
          return (
            <button
              key={player.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(player.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-30 ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
              }`}
            >
              {player.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
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
    </div>
  );
}
