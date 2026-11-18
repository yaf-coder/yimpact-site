import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { PortalNav } from '../../components/portal/PortalNav';
import { ScheduleTable } from '../../components/ScheduleTable';
import { EmptyNote, ErrorNote, PendingLabel } from '../../components/ui/Status';
import { buttonClassNames } from '../../components/ui/Button';
import { useAuth } from '../../auth/useAuth';
import { useSponsorSchedule } from '../../hooks/useSponsorSchedule';
import { sponsors } from '../../content/sponsors';
import { domainLabels } from '../../content/sponsors';
import { partnerFacts } from '../../content/sponsorPortal';

export function SponsorPortal() {
  const { profile } = useAuth();
  const { items, status } = useSponsorSchedule();

  // The organization details live in git. profiles.org_slug is the key.
  const org = sponsors.find((sponsor) => sponsor.id === profile?.org_slug);

  return (
    <Layout
      title="Partner portal · Yale Impact Expo"
      description="Your Yale Impact Expo schedule and partner details."
    >
      <PortalNav />
      <PageHeader title={org ? org.name : 'Partner portal'} />

      <Section>
        {org ? (
          <div className="mb-6 flex items-center gap-4">
            <img
              src={org.logoUrl}
              alt={org.name}
              width={48}
              height={48}
              className="shrink-0"
            />
            <div>
              <p className="text-base leading-[1.3] tracking-[-0.028em] text-ink-900">{org.name}</p>
              <p className="mt-0.5 text-sm text-ink-500">{domainLabels[org.domain]}</p>
            </div>
          </div>
        ) : (
          <p className="mb-6">
            <EmptyNote>
              The team has not linked your account to a partner organization yet.
            </EmptyNote>
          </p>
        )}

        <div className="border-t border-line">
          <dl>
            {partnerFacts.map((fact) => (
              <div
                key={fact.term}
                className="grid gap-0.5 border-b border-line py-3.5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-8"
              >
                <dt className="label text-ink-400">{fact.term}</dt>
                <dd className="text-base leading-[1.5] tracking-[-0.02em] text-ink-900">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section heading="Your Expo weekend">
        {status === 'loading' ? <PendingLabel /> : null}
        {status === 'error' ? <ErrorNote>The schedule did not load.</ErrorNote> : null}
        {status === 'ready' && items.length === 0 ? (
          <EmptyNote>The team publishes your blocks closer to the date.</EmptyNote>
        ) : null}
        {status === 'ready' && items.length > 0 ? <ScheduleTable items={items} /> : null}
      </Section>

      <Section heading="Messages">
        <p className="text-lg text-ink-500">Ask the team about judging, rooms or your agreement.</p>
        <Link to="/portal/messages" className={`${buttonClassNames('primary')} mt-5`}>
          Open messages
        </Link>
      </Section>
    </Layout>
  );
}
