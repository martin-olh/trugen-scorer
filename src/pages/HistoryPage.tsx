import { Link } from 'react-router-dom';
import { useTrucoMatches } from '../hooks/useTrucoMatch';
import { useGeneralaMatches } from '../hooks/useGeneralaMatch';
import { usePlayers } from '../hooks/usePlayers';

export function HistoryPage() {
  const { data: trucoMatches = [] } = useTrucoMatches();
  const { data: generalaMatches = [] } = useGeneralaMatches();
  const { data: players = [] } = usePlayers();

  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? '…';

  const entries = [
    ...trucoMatches.map((m) => ({
      id: m.id,
      href: `/truco/${m.id}`,
      game: 'Truco' as const,
      createdAt: m.createdAt,
      status: m.status,
      title: m.players.map(nameOf).join(' vs '),
      subtitle:
        m.status === 'completed' && m.winnerId
          ? `${nameOf(m.winnerId)} won · to ${m.targetScore}`
          : `In progress · to ${m.targetScore}`,
    })),
    ...generalaMatches.map((m) => ({
      id: m.id,
      href: `/generala/${m.id}`,
      game: 'Generala' as const,
      createdAt: m.createdAt,
      status: m.status,
      title: m.players.map(nameOf).join(', '),
      subtitle:
        m.status === 'completed' && m.winnerId ? `${nameOf(m.winnerId)} won` : 'In progress',
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Match History</h1>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400">
          Home
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link to={entry.href} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{entry.title}</p>
                <p className="text-sm text-slate-500">{entry.subtitle}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {entry.game}
              </span>
            </Link>
          </li>
        ))}
        {entries.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-500">No matches played yet.</li>
        )}
      </ul>
    </div>
  );
}
