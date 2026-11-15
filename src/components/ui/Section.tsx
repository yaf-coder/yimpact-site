import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  heading?: string;
  children: ReactNode;
  className?: string;
}

// A band of the page: a rule above, a heading, then the content.
export function Section({ id, heading, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`border-t border-line ${className}`}>
      <div className="wrap py-14 md:py-16">
        {heading ? <h2 className="display-2 mb-5">{heading}</h2> : null}
        {children}
      </div>
    </section>
  );
}
