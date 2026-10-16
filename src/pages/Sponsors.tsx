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
      pattern="none"
      title="Partners · Yale Impact Expo"
      description="The partners of the Yale Impact Expo across nine domains, from corporate and government to philanthropy and healthcare."
    >
      <PageHeader
        eyebrow={`${sponsors.length} partners · 9 domains`}
        title="Partners"
        meta={
          <>
            Our partners make Impact Expo possible. Interested in working with us?{' '}
            <a href="#partner-with-us" className="border-b border-bar/45 pb-0.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">
              Learn more here.
            </a>
          </>
        }
      />

      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
        {isAdmin ? (
          <div className="haze-inner mb-6 flex flex-wrap items-center justify-between gap-4 border border-bar/25 bg-ink-50/70 px-4 py-3">
            <p className="label text-ink-500">
              {isPlacing
                ? 'Drop the bubble where the partner belongs — the column sets the domain, the height sets the size range. Escape to cancel.'
                : 'Signed in as an organizer'}
            </p>
            <button
              type="button"
              onClick={() => setIsPlacing((current) => !current)}
              aria-label={isPlacing ? 'Cancel placing a partner' : 'Add a partner'}
              aria-pressed={isPlacing}
              className={`label flex shrink-0 items-center gap-2 border px-4 py-2.5 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                isPlacing
                  ? 'border-bar/45 text-ink-900 hover:border-bar'
                  : 'border-bar bg-ink-900 text-white hover:bg-blue-700'
              }`}
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

        <SponsorField
          items={items}
          isPlacing={isPlacing}
          onPlace={handlePlace}
          onCancelPlacing={() => setIsPlacing(false)}
          previewImpact={isPlacing ? 60 : placement?.impact ?? null}
          previewDomain={placement?.domain ?? null}
        />

        <p className="label mt-8 border-t border-bar/25 pt-4 text-ink-300">
          Outlined bubbles are placeholders. They give way as partners are confirmed.
        </p>

        {/* The "Learn more here" link in the page header lands here. The margin
            keeps the heading clear of the sticky header. */}
        <div id="partner-with-us" className="mt-14 scroll-mt-32 border-t border-bar/25 pt-8">
          <h2 className="display-2 max-w-[20ch]">
            We want to make an <span className="accent-serif">impact</span> with you.
          </h2>
          <p className="mt-4 max-w-[62ch] text-base leading-[1.6] text-ink-700">
            Becoming a partner starts with a conversation. Write to us and tell us which of the nine domains you sit
            in, and we will send you the partner brief. Together we work out where you fit best: judging, mentoring a
            team, offering resources to students, or funding continuation grants. Once we agree, we set up your
            partner account, where you can see your Expo schedule and reach our team directly.
          </p>
          <a href={`mailto:${event.sponsorEmail}`} className={`${buttonClassNames('primary')} mt-6`}>
            {event.sponsorEmail}
          </a>
        </div>
        </div>
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
