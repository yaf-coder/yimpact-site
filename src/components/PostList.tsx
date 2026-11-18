import { Link } from 'react-router-dom';
import type { BlogPost } from '../types/content';

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function formatPostDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

// An upload has no known size, so the box holds a fixed ratio. Section 3.9 of
// BUILD_SPEC.md needs a width and a height on every image.
function Cover({ post, className = '' }: { post: BlogPost; className?: string }) {
  if (!post.coverUrl) return null;

  return (
    <img
      src={post.coverUrl}
      alt={post.coverAlt ?? ''}
      width={960}
      height={640}
      loading="lazy"
      className={`aspect-[3/2] w-full rounded-md bg-ink-50 object-cover ${className}`}
    />
  );
}

const titleLink =
  'no-underline hover:text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700';

function Byline({ post }: { post: BlogPost }) {
  return (
    <p className="mt-2 text-sm text-ink-400">
      {formatPostDate(post.publishedAt)} · {post.author}
    </p>
  );
}

// The lead story on The Impact Record.
export function LeadStory({ post }: { post: BlogPost }) {
  return (
    <article className="border-b border-line pb-8">
      <Cover post={post} className="mb-6" />
      <h2 className="display-1 max-w-[26ch] text-[clamp(1.9rem,3.6vw,2.6rem)]">
        <Link to={`/blog/${post.slug}`} className={titleLink}>
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-[60ch] text-lg leading-[1.55] text-ink-500">{post.excerpt}</p>
      <Byline post={post} />
    </article>
  );
}

// A story in the grid under the lead.
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="h-full border-t border-line-strong pt-3.5">
      <Cover post={post} className="mb-4" />
      <h3 className="text-[17px] font-medium leading-[1.35] [text-wrap:balance]">
        <Link to={`/blog/${post.slug}`} className={titleLink}>
          {post.title}
        </Link>
      </h3>
      <Byline post={post} />
    </article>
  );
}

// Titles and dates, one per row. The home page and the foot of a story use it.
export function NewsList({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="border-t border-line" aria-busy={posts.length === 0}>
      {posts.map((post) => (
        <li key={post.slug} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line py-3.5">
          <Link to={`/blog/${post.slug}`} className={`font-medium ${titleLink}`}>
            {post.title}
          </Link>
          <span className="whitespace-nowrap text-sm text-ink-400">{formatPostDate(post.publishedAt)}</span>
        </li>
      ))}
    </ul>
  );
}

// Bars that hold the same geometry while the stories load. There is no pulse.
export function PostListSkeleton() {
  return (
    <>
      <p className="sr-only" role="status">
        Loading stories
      </p>
      <div aria-hidden="true">
        <div className="border-b border-line pb-8">
          <div className="h-9 w-full max-w-[24ch] bg-ink-50" />
          <div className="mt-3 h-9 w-full max-w-[18ch] bg-ink-50" />
          <div className="mt-5 h-3 w-full max-w-[60ch] bg-ink-50" />
          <div className="mt-2 h-3 w-full max-w-[52ch] bg-ink-50" />
        </div>
        <ul className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <li key={index} className="border-t border-line pt-3.5">
              <div className="h-5 w-full bg-ink-50" />
              <div className="mt-2 h-5 w-3/4 bg-ink-50" />
              <div className="mt-3 h-3 w-1/2 bg-ink-50" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
