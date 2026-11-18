import { useId } from 'react';
import type { ReactNode } from 'react';

interface FieldChildProps {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: FieldChildProps) => ReactNode;
}

// Field owns the id and hands it to the control. A render prop removes every
// chance of a label that points at the wrong control.
export function Field({ label, hint, error, className = '', children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">
        {label}
      </label>
      <div className="mt-1.5">{children({ id, describedBy, invalid: Boolean(error) })}</div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[13px] leading-[1.5] text-ink-400">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-[13px] leading-[1.5] text-ink-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}
