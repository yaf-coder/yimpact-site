import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { SponsorField } from '../components/SponsorField';
import type { FieldItem, Placement } from '../components/SponsorField';
import { AddSponsorDialog } from '../components/AddSponsorDialog';
import { buttonClassNames } from '../components/ui/Button';
import { domainOrder } from '../content/sponsors';
import { event } from '../content/event';
import { useAdmin } from '../admin/AdminContext';
import { useSponsors } from '../admin/sponsorStore';

// Placeholder marks per domain, holding the shape of a column until partners
// displace them one for one.
const FILLER_PER_DOMAIN = 4;

export function Sponsors() {
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const { isAdmin } = useAdmin();
  const { sponsors, addSponsor } = useSponsors();

  const items = useMemo<FieldItem[]>(() => {
    const real: FieldItem[] = sponsors.map((sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      logoUrl: sponsor.logoUrl,
      domain: sponsor.domain,
      impact: sponsor.impact,
      to: `/sponsors/${sponsor.id}`,
      isFiller: false,
    }));

    const filler: FieldItem[] = domainOrder.flatMap((domain) => {
      const taken = sponsors.filter((sponsor) => sponsor.domain === domain).length;
      const remaining = Math.max(0, FILLER_PER_DOMAIN + 3 - taken);
      const smallest = sponsors
        .filter((sponsor) => sponsor.domain === domain)
        .reduce((low, sponsor) => Math.min(low, sponsor.impact), 100);

      // Filler always sits below every real partner in its column, and shrinks
      // as it goes, so the ordering rule holds for placeholders too.
      return Array.from({ length: remaining }, (_, index) => ({
        id: `filler-${domain}-${index}`,
        name: 'Space for a future partner',
        logoUrl: '/logos/filler/yale-placeholder.svg',
        domain,
        impact: Math.max(2, Math.min(smallest, 26) - 2 - index * 4),
        isFiller: true,
      }));
    });

    return [...real, ...filler];
  }, [sponsors]);

  function handlePlace(next: Placement) {
    setPlacement(next);
    setIsPlacing(false);
  }

  function closeDialog() {
    setPlacement(null);
  }

  return (
    <Layout
      title="Partners · Yale Impact Expo"
      description="The partners of the Yale Impact Expo across nine domains, from corporate and government to philanthropy and healthcare."
    >
      <PageHeader
        title="Partners"
        lede={
          sponsors.length > 0
            ? `${sponsors.length} partners across nine fields.`
            : 'Our first batch of partners will be announced soon.'
        }
      />

      <div className="wrap pb-20 pt-10">
        {isAdmin ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-md bg-ink-50 px-4 py-3">
            <p className="text-sm text-ink-500">
              {isPlacing
                ? 'Drop the bubble where the partner belongs. The column sets the field, the height sets the size. Escape cancels.'
                : 'Signed in as an organizer'}
            </p>
            <button
              type="button"
              onClick={() => setIsPlacing((current) => !current)}
              aria-label={isPlacing ? 'Cancel placing a partner' : 'Add a partner'}
              aria-pressed={isPlacing}
              className={buttonClassNames(isPlacing ? 'secondary' : 'primary')}
            >
              {isPlacing ? (
                'Cancel'
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add partner
                </>
              )}
            </button>
          </div>
        ) : null}

        {/* The bubble field shows once there are partners to show. Until then
            only organizers see it, so they can place the first ones. */}
        {isAdmin || sponsors.length > 0 ? (
          <SponsorField
            items={items}
            isPlacing={isPlacing}
            onPlace={handlePlace}
            onCancelPlacing={() => setIsPlacing(false)}
            previewImpact={isPlacing ? 60 : placement?.impact ?? null}
            previewDomain={placement?.domain ?? null}
          />
        ) : null}

        <section className={isAdmin || sponsors.length > 0 ? 'mt-14 border-t border-line pt-8' : undefined}>
          <h2 className="display-2">Become a partner</h2>
          <p className="mt-2 max-w-[60ch] text-lg leading-[1.55] text-ink-500">
            Write to us with your field and we will send the partner brief. Partners judge, mentor teams, offer
            resources or fund grants. Each partner gets an account with their Expo schedule.
          </p>
          <a href={`mailto:${event.sponsorEmail}`} className={`${buttonClassNames('primary')} mt-5`}>
            {event.sponsorEmail}
          </a>
        </section>
      </div>

      {placement ? (
        <AddSponsorDialog
          placement={placement}
          onImpactChange={(impact) => setPlacement((current) => (current ? { ...current, impact } : current))}
          onClose={closeDialog}
          onAdd={addSponsor}
        />
      ) : null}
    </Layout>
  );
}
