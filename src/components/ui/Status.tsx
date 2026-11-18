import type { ReactNode } from 'react';

// A wait state is one quiet line. There is no spinner.
export function PendingLabel({ children = 'Loading' }: { children?: ReactNode }) {
  return (
    <p className="text-sm text-ink-400" role="status">
      {children}
    </p>
  );
}

// No red: the rule and the word carry the meaning, which also keeps the
// contrast correct.
export function ErrorNote({
  title = 'Error',
  children,
  className = '',
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-l-2 border-bar py-1 pl-4 ${className}`} role="alert">
      <p className="text-sm font-medium text-ink-900">{title}</p>
      <p className="mt-1 max-w-[62ch] text-sm leading-[1.6] text-ink-500">{children}</p>
    </div>
  );
}

// The same note, without the alert role. Use it for a saved state.
export function DoneNote({
  title = 'Saved',
  children,
  className = '',
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-l-2 border-blue-500 py-1 pl-4 ${className}`} role="status">
      <p className="text-sm font-medium text-blue-700">{title}</p>
      <p className="mt-1 max-w-[62ch] text-sm leading-[1.6] text-ink-500">{children}</p>
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="text-ink-500">{children}</p>;
}
