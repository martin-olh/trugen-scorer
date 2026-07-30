import { useState } from 'react';
import {
  GENERALA_CATEGORIES,
  GENERALA_CATEGORY_LABELS,
  type GeneralaCategory,
  type GeneralaMatch,
  type ID,
  type Player,
} from '../../data/types';
import { getTotals } from '../../services/generalaScoring';
import { NumericKeypadModal } from './NumericKeypadModal';
import { TirosRow } from './TirosRow';

interface ScoreGridProps {
  match: GeneralaMatch;
  players: Player[];
  readOnly: boolean;
  onSetScore: (playerId: ID, category: GeneralaCategory, value: number) => void;
  onSetTiros: (playerId: ID, value: number) => void;
}

export function ScoreGrid({ match, players, readOnly, onSetScore, onSetTiros }: ScoreGridProps) {
  const [activeCell, setActiveCell] = useState<{ playerId: ID; category: GeneralaCategory } | null>(
    null,
  );

  const nameOf = (id: ID) => players.find((p) => p.id === id)?.name ?? '…';
  const totals = getTotals(match);

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 bg-white px-3 py-2 text-left dark:bg-slate-900" />
            {match.players.map((playerId) => (
              <th
                key={playerId}
                className="sticky top-0 z-10 whitespace-nowrap bg-white px-3 py-2 text-center font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100"
              >
                {nameOf(playerId)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GENERALA_CATEGORIES.map((category) => (
            <tr key={category} className="border-t border-slate-200 dark:border-slate-700">
              <th className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {GENERALA_CATEGORY_LABELS[category]}
              </th>
              {match.players.map((playerId) => {
                const value = match.scores[playerId]?.[category];
                return (
                  <td key={playerId} className="px-3 py-2 text-center">
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => setActiveCell({ playerId, category })}
                      className="h-9 w-14 rounded-md tabular-nums hover:bg-slate-100 disabled:hover:bg-transparent dark:hover:bg-slate-800"
                    >
                      {value ?? ''}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}

          <TirosRow match={match} readOnly={readOnly} onChange={onSetTiros} />

          <tr className="border-t-2 border-slate-400 dark:border-slate-500">
            <th className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 text-left text-sm font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100">
              Total
            </th>
            {match.players.map((playerId) => (
              <td
                key={playerId}
                className="px-3 py-2 text-center text-lg font-bold tabular-nums text-slate-900 dark:text-slate-100"
              >
                {totals[playerId]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {activeCell && (
        <NumericKeypadModal
          open
          title={`${nameOf(activeCell.playerId)} — ${GENERALA_CATEGORY_LABELS[activeCell.category]}`}
          initialValue={match.scores[activeCell.playerId]?.[activeCell.category]}
          onConfirm={(value) => onSetScore(activeCell.playerId, activeCell.category, value)}
          onClose={() => setActiveCell(null)}
        />
      )}
    </div>
  );
}
