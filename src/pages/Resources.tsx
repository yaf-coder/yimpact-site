import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { ResourceList } from '../components/ResourceList';
import { ErrorNote, PendingLabel } from '../components/ui/Status';
import { Badge } from '../components/ui/Badge';
import { Tabs, Tab } from '../components/ui/Tabs';
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
      title="Resources · Yale Impact Expo"
      description="Every offer our partners make to Expo teams: contacts, office hours, mentors, tool credits, and codes."
    >
      <PageHeader
        title="Resources"
        lede="What partners offer Expo teams. Approved students see the contact details, booking links and codes."
      >
        {authStatus === 'signedIn' ? null : (
          <Link to="/signup" className={buttonClassNames('primary')}>
            Apply
          </Link>
        )}
      </PageHeader>

      <div className="wrap pb-20 pt-10">
        {authStatus === 'signedIn' && !isApprovedMember ? (
          <p className="mb-6 text-ink-500">
            <Badge>Not approved yet</Badge> The details open once the team approves your application.
            Check your status in the{' '}
            <Link to="/portal" className="text-blue-700 underline">
              portal
            </Link>
            .
          </p>
        ) : null}

        {tabs.length > 0 ? (
          <Tabs label="Filter resources by kind">
            <Tab active={active === 'all'} count={resources.length} onClick={() => setActive('all')}>
              All
            </Tab>
            {tabs.map((kind) => (
              <Tab key={kind} active={active === kind} count={counts[kind]} onClick={() => setActive(kind)}>
                {kindLabels[kind]}
              </Tab>
            ))}
          </Tabs>
        ) : null}

        {status === 'loading' ? <PendingLabel /> : null}

        {status === 'error' ? (
          <ErrorNote>
            The resources did not load.{' '}
            <button type="button" onClick={retry} className="text-blue-700 underline">
              Try again
            </button>
            .
          </ErrorNote>
        ) : null}

        {status === 'ready' && resources.length === 0 ? (
          <p className="text-ink-500">Resources open as partners sign on.</p>
        ) : null}

        {status === 'ready' && resources.length > 0 ? <ResourceList resources={visible} headingLevel={2} /> : null}

        <p className="mt-7 text-sm text-ink-500">
          Partners can add a resource by writing to <span className="select-all text-blue-700">{event.sponsorEmail}</span>.
        </p>
      </div>
    </Layout>
  );
}
