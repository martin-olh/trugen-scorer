import { Fragment } from 'react';
import { getTallyLayout } from '../../services/trucoTally';
import type { TrucoTarget } from '../../data/types';
import { TallySquare } from './TallySquare';

interface TallyScoreProps {
  score: number;
  targetScore: TrucoTarget;
}

export function TallyScore({ score, targetScore }: TallyScoreProps) {
  const { groups, halfwayGroupIndex } = getTallyLayout(score, targetScore);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {groups.map((filled, i) => (
        <Fragment key={i}>
          {i === halfwayGroupIndex && (
            <div className="mx-1 h-8 w-0.5 self-stretch bg-red-500 sm:h-10" aria-hidden />
          )}
          <TallySquare filled={filled as 0 | 1 | 2 | 3 | 4 | 5} />
        </Fragment>
      ))}
    </div>
  );
}
