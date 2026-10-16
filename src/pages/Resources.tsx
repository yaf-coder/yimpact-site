import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { ResourceList } from '../components/ResourceList';
import { ErrorNote, PendingLabel } from '../components/ui/Status';
import { buttonClassNames } from '../components/ui/Button';
import { useResources } from '../hooks/useResources';
import { useAuth } from '../auth/useAuth';
import { event } from '../content/event';
import type { ResourceKind } from '../types/db';

const kindOrder: ResourceKind[] = [
  'contact',
  'office_hours',
  'mentor',
  'tool_credit',
  'promo_code',
  'link',
];

const kindLabels: Record<ResourceKind, string> = {
  contact: 'Contacts',
  office_hours: 'Office hours',
  mentor: 'Mentors',
  tool_credit: 'Tool credits',
  promo_code: 'Promo codes',
  link: 'Links',
};

type KindFilter = ResourceKind | 'all';

export function Resources() {
  const { resources, status, retry } = useResources();
  const { status: authStatus, isApprovedMember } = useAuth();
  const [active, setActive] = useState<KindFilter>('all');

  const counts = useMemo(() => {
    const map = {} as Record<ResourceKind, number>;
    for (const kind of kindOrder) {
      map[kind] = resources.filter((resource) => resource.kind === kind).length;
    }
    return map;
  }, [resources]);

  const visible = useMemo(
    () => (active === 'all' ? resources : resources.filter((r) => r.kind === active)),
    [resources, active],
  );

  // A kind with no rows must not render an empty tab.
  const tabs = kindOrder.filter((kind) => counts[kind] > 0);

  return (
    <Layout
      pattern="partner"
      title="Resources · Yale Impact Expo"
      description="Every offer our partners make to Expo teams: contacts, office hours, mentors, tool credits, and codes."
    >
      <PageHeader
        eyebrow={
          status !== 'ready' ? 'Resources' : resources.length > 0 ? `${resources.length} resources` : 'To be announced'
        }
        title={
          <>
            What our partners put on the <span className="accent-serif">table</span>
          </>
        }
        meta="Every reader can see what is on offer. Registered students see the contact details, the booking links, and the codes behind each one."
      />

      {tabs.length > 0 ? (
        <div className="sticky top-[var(--header-h)] z-30 border-y border-bar/25 bg-white/90 backdrop-blur-md">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div
              role="group"
              aria-label="Filter resources by kind"
              className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <KindTab
                label="All"
                count={resources.length}
                active={active === 'all'}
                onClick={() => setActive('all')}
              />
              {tabs.map((kind) => (
                <KindTab
                  key={kind}
                  label={kindLabels[kind]}
                  count={counts[kind]}
                  active={active === kind}
                  onClick={() => setActive(kind)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
          {authStatus === 'signedIn' && !isApprovedMember ? (
            <div className="mb-8 border-l-2 border-bar/45 bg-ink-50/70 p-4">
              <p className="label text-ink-900">Pending approval</p>
              <p className="mt-2 max-w-[62ch] text-sm leading-[1.6] text-ink-700">
                The team reviews your registration. The access details open as soon as they approve it.
              </p>
            </div>
          ) : null}

          {status === 'loading' ? <PendingLabel /> : null}

          {status === 'error' ? (
            <ErrorNote>
              The resources did not load.{' '}
              <button
                type="button"
                onClick={retry}
                className="border-b border-bar/45 pb-0.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Try again
              </button>
              .
            </ErrorNote>
          ) : null}

          {status === 'ready' && resources.length === 0 ? (
            <div>
              <p className="label text-blue-500">To be announced</p>
              <p className="mt-2 max-w-[62ch] text-base leading-[1.6] text-ink-700">
                Partner resources open as partners sign on: contacts, office hours, mentors, and tool credits.
              </p>
            </div>
          ) : null}

          {status === 'ready' && resources.length > 0 ? (
            <Reveal>
              <ResourceList resources={visible} headingLevel={2} />
            </Reveal>
          ) : null}

          <div className="mt-16 border-t border-bar/25 pt-8">
            <h2 className="display-2 max-w-[20ch]">
              Students: register to unlock the <span className="accent-serif">details</span>
            </h2>
            <p className="mt-4 max-w-[62ch] text-base leading-[1.6] text-ink-700">
              Registration is free and open to every Yale student. Partners who want to add a resource
              to this page can write to us.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {authStatus === 'signedIn' ? null : (
                <Link to="/signup" className={buttonClassNames('primary')}>
                  Register
                </Link>
              )}
              <a href={`mailto:${event.sponsorEmail}`} className={buttonClassNames('secondary')}>
                Add a resource
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface KindTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function KindTab({ label, count, active, onClick }: KindTabProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`label flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500 ${
        active ? 'border-bar text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-900'
      }`}
    >
      {label}
      <span className={active ? 'text-blue-500' : 'text-ink-300'}>{count}</span>
    </button>
  );
}
