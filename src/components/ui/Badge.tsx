import type { ReactNode } from 'react';

interface BadgeProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function Badge({ id, children, className = '' }: BadgeProps) {
  return (
    <span
      id={id}
      className={`inline-flex items-center rounded-full border border-line-strong px-2.5 py-0.5 text-[13px] font-medium text-blue-700 ${className}`}
    >
      {children}
    </span>
  );
}
