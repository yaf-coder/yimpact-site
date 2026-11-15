import { useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Tabs, Tab } from '../components/ui/Tabs';
import { LeadStory, PostCard, PostListSkeleton } from '../components/PostList';
import { ErrorNote } from '../components/ui/Status';
import { usePosts } from '../hooks/usePosts';
import type { BlogCategory } from '../types/content';

const categories: BlogCategory[] = ['Announcements', 'Campus', 'Partners', 'Research', 'New Haven', 'Opinion'];

type CategoryFilter = BlogCategory | 'all';

export function Blog() {
  const { posts, status, retry } = usePosts();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const visible = useMemo(
    () => (activeCategory === 'all' ? posts : posts.filter((post) => post.category === activeCategory)),
    [posts, activeCategory],
  );

  const lead = visible.find((post) => post.lead) ?? visible[0];
  const rest = visible.filter((post) => post !== lead);

  return (
    <Layout
      title="The Impact Record · Yale Impact Expo"
      description="The Impact Record: reporting from the Yale Impact Expo on the programme, its partners, its research, and its work in New Haven."
    >
      <PageHeader title="The Impact Record" />

      <div className="wrap pb-20 pt-10">
        <Tabs label="Filter stories by section">
          <Tab active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
            All
          </Tab>
          {categories.map((category) => (
            <Tab key={category} active={activeCategory === category} onClick={() => setActiveCategory(category)}>
              {category}
            </Tab>
          ))}
        </Tabs>

        {status === 'loading' ? <PostListSkeleton /> : null}

        {status === 'error' ? (
          <ErrorNote>
            The stories did not load.{' '}
            <button type="button" onClick={retry} className="text-blue-700 underline">
              Try again
            </button>
            .
          </ErrorNote>
        ) : null}

        {status === 'ready' ? (
          <>
            {lead ? <LeadStory post={lead} /> : <p className="text-ink-500">No stories in this section yet.</p>}
            {rest.length > 0 ? (
              <ul className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
    </Layout>
  );
}
