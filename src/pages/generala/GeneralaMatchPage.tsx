import { Link, useParams } from 'react-router-dom';
import {
  useGeneralaMatch,
  useSetGeneralaScore,
  useSetGeneralaTiros,
  useFinishGeneralaMatch,
} from '../../hooks/useGeneralaMatch';
import { usePlayers } from '../../hooks/usePlayers';
import { ScoreGrid } from '../../components/generala/ScoreGrid';

export function GeneralaMatchPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { data: match, isPending } = useGeneralaMatch(matchId);
  const { data: players = [] } = usePlayers();
  const setScore = useSetGeneralaScore(matchId ?? '');
  const setTiros = useSetGeneralaTiros(matchId ?? '');
  const finishMatch = useFinishGeneralaMatch(matchId ?? '');

  if (isPending) return <p className="p-4 text-slate-500">Loading…</p>;
  if (!match) return <p className="p-4 text-slate-500">Match not found.</p>;

  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? '…';
  const isComplete = match.status === 'completed';

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Generala</h1>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400">
          Home
        </Link>
      </div>

      {isComplete && (
        <div className="mt-4 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
          🏆 {nameOf(match.winnerId!)} wins!
        </div>
      )}

      <div className="mt-6">
        <ScoreGrid
          match={match}
          players={players}
          readOnly={isComplete}
          onSetScore={(playerId, category, value) => setScore.mutate({ playerId, category, value })}
          onSetTiros={(playerId, value) => setTiros.mutate({ playerId, value })}
        />
      </div>

      {!isComplete && (
        <button
          type="button"
          onClick={() => finishMatch.mutate()}
          disabled={finishMatch.isPending}
          className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white disabled:opacity-30"
        >
          Finish Match
        </button>
      )}
    </div>
  );
}
