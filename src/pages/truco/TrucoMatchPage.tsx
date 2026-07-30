import { Link, useParams } from 'react-router-dom';
import { useTrucoMatch, useSetTrucoScore } from '../../hooks/useTrucoMatch';
import { usePlayers } from '../../hooks/usePlayers';
import { TallyScore } from '../../components/truco/TallyScore';
import { IncrementDecrementControl } from '../../components/shared/IncrementDecrementControl';

export function TrucoMatchPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { data: match, isPending } = useTrucoMatch(matchId);
  const { data: players = [] } = usePlayers();
  const setScore = useSetTrucoScore(matchId ?? '');

  if (isPending) return <p className="p-4 text-slate-500">Loading…</p>;
  if (!match) return <p className="p-4 text-slate-500">Match not found.</p>;

  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? '…';
  const isComplete = match.status === 'completed';

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Truco to {match.targetScore}
        </h1>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400">
          Home
        </Link>
      </div>

      {isComplete && (
        <div className="mt-4 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
          🏆 {nameOf(match.winnerId!)} wins!
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {match.players.map((playerId) => (
          <div key={playerId} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {nameOf(playerId)}
              </span>
              <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {match.scores[playerId]}
              </span>
            </div>

            <TallyScore score={match.scores[playerId]} targetScore={match.targetScore} />

            {!isComplete && (
              <div className="mt-4">
                <IncrementDecrementControl
                  value={match.scores[playerId]}
                  min={0}
                  onChange={(value) => setScore.mutate({ playerId, score: value })}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
