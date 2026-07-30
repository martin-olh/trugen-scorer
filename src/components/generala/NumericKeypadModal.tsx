import { useState } from 'react';

interface NumericKeypadModalProps {
  open: boolean;
  title: string;
  initialValue: number | undefined;
  onConfirm: (value: number) => void;
  onClose: () => void;
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

export function NumericKeypadModal({
  open,
  title,
  initialValue,
  onConfirm,
  onClose,
}: NumericKeypadModalProps) {
  const [input, setInput] = useState(() => initialValue?.toString() ?? '');

  if (!open) return null;

  const handleKey = (key: string) => {
    if (key === 'C') {
      setInput('');
    } else if (key === '⌫') {
      setInput((prev) => prev.slice(0, -1));
    } else if (input.length < 3) {
      setInput((prev) => (prev === '0' ? key : prev + key));
    }
  };

  const handleConfirm = () => {
    onConfirm(input === '' ? 0 : Number(input));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl dark:bg-slate-800">
        <h2 className="text-center text-sm font-semibold uppercase text-slate-500">{title}</h2>
        <div className="my-4 text-center text-4xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
          {input || '0'}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DIGITS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKey(key)}
              className="rounded-lg bg-slate-100 py-4 text-xl font-semibold text-slate-800 active:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
