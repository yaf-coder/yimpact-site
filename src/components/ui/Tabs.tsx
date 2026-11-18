import type { ReactNode } from 'react';

// A row of filter buttons with a rule under it. The Record filters by
// section, Resources by kind.
export function Tabs({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mb-7 flex gap-0.5 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );
}

interface TabProps {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: ReactNode;
}

export function Tab({ active, onClick, count, children }: TabProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`-mb-px shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 ${
        active ? 'border-blue-700 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
      }`}
    >
      {children}
      {count !== undefined ? <span className="ml-1 font-normal text-ink-400">{count}</span> : null}
    </button>
  );
}
