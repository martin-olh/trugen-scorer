import { IncrementDecrementControl } from '../shared/IncrementDecrementControl';
import type { GeneralaMatch, ID } from '../../data/types';

interface TirosRowProps {
  match: GeneralaMatch;
  readOnly: boolean;
  onChange: (playerId: ID, value: number) => void;
}

export function TirosRow({ match, readOnly, onChange }: TirosRowProps) {
  return (
    <tr className="border-t border-slate-200 dark:border-slate-700">
      <th className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 text-left text-sm font-medium italic text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        Tiros
      </th>
      {match.players.map((playerId) => (
        <td key={playerId} className="px-3 py-2 text-center">
          {readOnly ? (
            <span className="tabular-nums text-slate-500">{match.tiros[playerId] ?? 0}</span>
          ) : (
            <IncrementDecrementControl
              size="sm"
              min={0}
              value={match.tiros[playerId] ?? 0}
              onChange={(value) => onChange(playerId, value)}
            />
          )}
        </td>
      ))}
    </tr>
  );
}
