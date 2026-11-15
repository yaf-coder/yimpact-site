import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode; // Buttons or anything else under the lede.
}

// The top of every page below the home page: a heading, an optional line
// under it, and a rule.
export function PageHeader({ title, lede, children }: PageHeaderProps) {
  return (
    <div className="border-b border-line">
      <div className="wrap pb-8 pt-10 md:pt-14">
        <h1 className="display-1 max-w-[22ch]">{title}</h1>
        {lede ? <p className="mt-3 max-w-[58ch] text-lg leading-[1.55] text-ink-500">{lede}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}
