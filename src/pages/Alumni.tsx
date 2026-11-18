import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { buttonClassNames } from '../components/ui/Button';
import { event } from '../content/event';
import { alumniCompanies, alumniDonors, yaleClubs } from '../content/alumni';
import type { AlumniEntry } from '../types/content';

const groups: { key: string; title: string; entries: AlumniEntry[] }[] = [
  { key: 'donors', title: 'Alumni donors', entries: alumniDonors },
  { key: 'companies', title: 'Companies', entries: alumniCompanies },
  { key: 'clubs', title: 'Yale clubs', entries: yaleClubs },
];

export function Alumni() {
  return (
    <Layout
      title="Alumni · Yale Impact Expo"
      description="The alumni donors, alumni-led companies, and Yale clubs whose contributions support the Yale Impact Expo."
    >
      <PageHeader
        title="Alumni"
        lede="The alumni donors, alumni-led companies and Yale clubs who support the Expo."
      />

      <div className="wrap pb-20 pt-10">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {groups.map((group) => (
            <section key={group.key} aria-labelledby={`alumni-${group.key}`}>
              <h2 id={`alumni-${group.key}`} className="display-3 mb-2">
                {group.title}
              </h2>
              <ul className="border-t border-line">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="border-b border-line py-3">
                    <p className="font-medium">{entry.name}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{entry.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-14 border-t border-line pt-8">
          <h2 className="display-2">Support the Expo</h2>
          <p className="mt-2 text-lg text-ink-500">Alumni can fund grants, back a track or mentor a team.</p>
          <a href={`mailto:${event.sponsorEmail}`} className={`${buttonClassNames('primary')} mt-5`}>
            {event.sponsorEmail}
          </a>
        </section>
      </div>
    </Layout>
  );
}
