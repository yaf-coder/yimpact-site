import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PostCard } from '../components/PostList';
import { buttonClassNames } from '../components/ui/Button';
import { domainLabels } from '../content/sponsors';
import { usePosts } from '../hooks/usePosts';
import { useSponsors } from '../admin/sponsorStore';
import { asset } from '../lib/asset';
import { NotFound } from './NotFound';
import type { SponsorTier } from '../types/content';

const tierLabel: Record<SponsorTier, string> = {
  lead: 'Lead partner',
  partner: 'Partner',
  supporting: 'Supporting partner',
};

export function SponsorDetail() {
  const { sponsorId } = useParams();
  const { sponsors } = useSponsors();
  const { posts } = usePosts();
  const sponsor = sponsors.find((entry) => entry.id === sponsorId);

  if (!sponsor) {
    return <NotFound />;
  }

  // The stories arrive after the first paint. The section below stays empty
  // until then.
  const stories = posts.filter((post) => post.sponsorIds?.includes(sponsor.id));

  return (
    <Layout
      title={`${sponsor.name} · Yale Impact Expo`}
      description={sponsor.blurb ?? `${sponsor.name} is a partner of the Yale Impact Expo.`}
    >
      <div className="wrap pb-20 pt-10">
        <p className="mb-5 text-sm text-ink-400">
          <Link to="/sponsors" className="text-ink-500 hover:text-ink-900 hover:underline">
            Partners
          </Link>{' '}
          / {domainLabels[sponsor.domain]}
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border border-line-strong">
            <img src={asset(sponsor.logoUrl)} alt="" className="h-1/2 w-1/2 object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="display-1">{sponsor.name}</h1>
            <p className="mt-1 text-ink-500">{tierLabel[sponsor.tier]}</p>
          </div>
        </div>

        {sponsor.blurb ? (
          <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-500">{sponsor.blurb}</p>
        ) : null}

        {sponsor.websiteUrl ? (
          <a href={sponsor.websiteUrl} target="_blank" rel="noreferrer" className={`${buttonClassNames('primary')} mt-6`}>
            Website
          </a>
        ) : null}

        <section className="mt-14 border-t border-line pt-8" aria-labelledby="sponsor-stories-heading">
          <h2 id="sponsor-stories-heading" className="display-2">
            Stories
          </h2>
          {stories.length > 0 ? (
            <ul className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-ink-500">No stories about this partner yet.</p>
          )}
        </section>
      </div>
    </Layout>
  );
}
