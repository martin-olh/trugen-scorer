interface IncrementDecrementControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'lg';
}

export function IncrementDecrementControl({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = 'lg',
}: IncrementDecrementControlProps) {
  const buttonClass =
    size === 'lg'
      ? 'h-12 w-12 text-2xl'
      : 'h-8 w-8 text-lg';

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className={`${buttonClass} rounded-full bg-slate-200 font-bold text-slate-700 disabled:opacity-30 active:bg-slate-300 dark:bg-slate-700 dark:text-slate-100`}
        disabled={value - step < min}
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="min-w-[2ch] text-center text-xl font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        className={`${buttonClass} rounded-full bg-slate-200 font-bold text-slate-700 disabled:opacity-30 active:bg-slate-300 dark:bg-slate-700 dark:text-slate-100`}
        disabled={value + step > max}
        onClick={() => onChange(Math.min(max, value + step))}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
