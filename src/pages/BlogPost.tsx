import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { formatPostDate, NewsList } from '../components/PostList';
import { ErrorNote, PendingLabel } from '../components/ui/Status';
import { usePost, usePosts } from '../hooks/usePosts';
import { NotFound } from './NotFound';

export function BlogPostPage() {
  const { slug } = useParams();
  const { post, status } = usePost(slug);
  const { posts } = usePosts();

  // Wait for the answer. The post is always missing on the first paint, so an
  // early return here shows the error 404 page for every story.
  if (status === 'loading') {
    return (
      <Layout title="Yale Impact Expo" description="A story from the Yale Impact Expo.">
        <div className="wrap pb-20 pt-10 [&>*]:max-w-[760px]">
          <PendingLabel>Loading the story</PendingLabel>
          <div aria-hidden="true" className="mt-6">
            <div className="h-10 w-full max-w-[24ch] bg-ink-50" />
            <div className="mt-3 h-10 w-full max-w-[18ch] bg-ink-50" />
            <div className="mt-6 h-3 w-full max-w-[60ch] bg-ink-50" />
            <div className="mt-2 h-3 w-full max-w-[52ch] bg-ink-50" />
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout title="Yale Impact Expo" description="A story from the Yale Impact Expo.">
        <div className="wrap pb-20 pt-10">
          <ErrorNote>The story did not load. Reload the page.</ErrorNote>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  const more = posts.filter((other) => other.slug !== post.slug).slice(0, 3);

  return (
    <Layout title={`${post.title} · Yale Impact Expo`} description={post.excerpt} image={post.coverUrl}>
      <article className="wrap pb-20 pt-10 [&>*]:max-w-[760px]">
        <p className="mb-5 text-sm text-ink-400">
          <Link to="/blog" className="text-ink-500 hover:text-ink-900 hover:underline">
            The Impact Record
          </Link>{' '}
          / {post.category}
        </p>

        <h1 className="display-1">{post.title}</h1>
        <p className="mt-3 text-[19px] leading-[1.55] text-ink-500">{post.excerpt}</p>

        <p className="mt-6 border-y border-line py-3 text-sm text-ink-400">
          <b className="font-medium text-ink-900">{post.author}</b>
          {post.authorRole ? `, ${post.authorRole}` : null} · {formatPostDate(post.publishedAt)}
        </p>

        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.coverAlt ?? ''}
            width={960}
            height={640}
            className="mt-8 aspect-[3/2] w-full rounded-md bg-ink-50 object-cover"
          />
        ) : null}

        <div className="mt-7 max-w-[66ch] space-y-5 text-[17px] leading-[1.75] text-ink-700">
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {more.length > 0 ? (
          <section className="mt-14 border-t border-line pt-8" aria-labelledby="more-heading">
            <h2 id="more-heading" className="display-2 mb-4">
              More stories
            </h2>
            <NewsList posts={more} />
          </section>
        ) : null}
      </article>
    </Layout>
  );
}
