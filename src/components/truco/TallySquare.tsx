interface TallySquareProps {
  filled: 0 | 1 | 2 | 3 | 4 | 5;
}

export function TallySquare({ filled }: TallySquareProps) {
  const on = (n: number) => filled >= n;
  const stroke = (n: number) => (on(n) ? 'stroke-slate-900 dark:stroke-slate-100' : 'stroke-slate-300 dark:stroke-slate-700');

  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 sm:h-10 sm:w-10" fill="none">
      <line x1="2" y1="2" x2="2" y2="38" strokeWidth={3} strokeLinecap="round" className={stroke(1)} />
      <line x1="2" y1="2" x2="38" y2="2" strokeWidth={3} strokeLinecap="round" className={stroke(2)} />
      <line x1="38" y1="2" x2="38" y2="38" strokeWidth={3} strokeLinecap="round" className={stroke(3)} />
      <line x1="2" y1="38" x2="38" y2="38" strokeWidth={3} strokeLinecap="round" className={stroke(4)} />
      <line x1="2" y1="2" x2="38" y2="38" strokeWidth={3} strokeLinecap="round" className={stroke(5)} />
    </svg>
  );
}
