import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Section } from '../components/ui/Section';
import { buttonClassNames } from '../components/ui/Button';
import { LitGlobe } from '../components/globe/LitGlobe';
import { PlainList } from '../components/PlainList';
import { event } from '../content/event';
import { domainLabels, domainOrder } from '../content/sponsors';
import { organizers } from '../content/organizers';
import { tracks } from '../content/tracks';
import { faq } from '../content/faq';
import { asset } from '../lib/asset';
import type { OrganizerRank } from '../types/content';

const textLink =
  'text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700';

const rankOrder: Record<OrganizerRank, number> = { director: 0, chair: 1, board: 2, executive: 3, team: 4 };

// "corporate, government, ... and healthcare"
const fieldNames = domainOrder.map((domain) => domainLabels[domain].toLowerCase());
const fieldList = `${fieldNames.slice(0, -1).join(', ')} and ${fieldNames[fieldNames.length - 1]}`;

export function Home() {
  const everyone = [...organizers].sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank]);

  return (
    <Layout title="Yale Impact Expo" description={event.tagline}>
      {/* The title screen. On wide screens the copy sits on the left and the
          lit globe on the right, its light spilling back behind the copy. On
          narrow screens the globe is centred and draws the title around
          itself, so the heading below is kept for screen readers only. */}
      <div className="wrap pb-10 pt-4 md:pb-14 md:pt-8">
        <div className="flex flex-col items-center gap-4 text-center md:grid md:grid-cols-1 md:items-stretch md:text-left">
          <div className="contents md:relative md:z-10 md:col-start-1 md:row-start-1 md:flex md:w-[42%] md:flex-col md:items-start md:justify-center md:gap-6 md:self-center md:py-10">
            <h1 className="hero-title max-md:sr-only">
              <span className="hero-the">
                The <img src={asset('/brand/yale-wordmark.png')} alt="Yale" width={900} height={388} />
              </span>
              <span>Impact Expo</span>
            </h1>
            <p className="order-2 max-w-[54ch] text-lg leading-[1.55] text-ink-500 md:order-none">{event.tagline}</p>
            <div className="order-3 flex flex-wrap justify-center gap-3 md:order-none md:justify-start">
              <Link to="/students" className={buttonClassNames('primary')}>
                For students
              </Link>
              <Link to="/sponsors" className={buttonClassNames('secondary')}>
                For partners
              </Link>
            </div>
            <p className="order-4 text-ink-500 md:order-none">{event.expoDate}</p>
          </div>
          <LitGlobe className="order-1 h-[min(74svh,740px)] w-full md:order-none md:col-start-1 md:row-start-1 md:h-auto md:min-h-[min(74svh,680px)]" />
        </div>
      </div>

      <Section heading="What it is">
        <div className="max-w-[62ch] space-y-3.5 text-[17px] leading-[1.6] text-ink-500">
          <p>{event.mission}</p>
          <p>
            You don&rsquo;t need a full solution; you need an idea and the evidence to back up why it would work.
            Bring something good, and we&rsquo;ll help you make it real.
          </p>
        </div>
      </Section>

      <Section heading="Tracks">
        <PlainList columns={2} items={tracks.map((track) => ({ id: track.id, title: track.name, text: track.focus }))} />
      </Section>

      <Section heading="Partners">
        <p className="max-w-[62ch] text-lg text-ink-500">
          Partners come from {fieldList}. We are confirming them for 2027.
        </p>
        <p className="mt-5">
          <Link to="/sponsors" className={textLink}>
            Become a partner
          </Link>
        </p>
      </Section>

      <Section heading="When and where">
        <dl className="border-t border-line">
          {[
            { term: 'Expo weekend', value: event.expoDate },
            { term: 'Where', value: `${event.venueName}, ${event.venueAddress}` },
          ].map((row) => (
            <div key={row.term} className="grid gap-0.5 border-b border-line py-3.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-7">
              <dt className="text-ink-400">{row.term}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading="Team">
        <p className="max-w-[70ch] leading-[2] text-ink-400">
          {everyone.map((organizer, index) => (
            <span key={organizer.id}>
              <span className="whitespace-nowrap text-ink-500">
                <b className="font-medium text-ink-900">{organizer.name}</b> {organizer.role}
              </span>
              {index < everyone.length - 1 ? ' · ' : null}
            </span>
          ))}
        </p>
        <p className="mt-5">
          <Link to="/team" className={textLink}>
            Meet the team
          </Link>
        </p>
      </Section>

      <Section heading="Questions">
        <div className="faq border-t border-line">
          {faq.map((item) => (
            <details key={item.id} className="border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                {item.question}
              </summary>
              <p className="mb-4 max-w-[64ch] text-[15px] leading-[1.6] text-ink-500">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section heading="Contact">
        <dl className="border-t border-line">
          {[
            { term: 'Students', value: event.contactEmail },
            { term: 'Partners', value: event.sponsorEmail },
          ].map((row) => (
            <div key={row.term} className="grid gap-0.5 border-b border-line py-3.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-7">
              <dt className="text-ink-400">{row.term}</dt>
              <dd className="select-all text-blue-700">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </Layout>
  );
}
