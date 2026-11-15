import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { event } from '../../content/event';

interface LayoutProps {
  title: string;
  description: string;
  image?: string;
  children: ReactNode;
}

// Set or make one meta tag. Vite does not render a page on the server, so
// each page writes its own tags here.
function setMeta(attribute: 'name' | 'property', key: string, value: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}

// Each page sets its own title and description. This keeps the two in sync
// with the page content, because Vite does not render pages on the server.
//
// A card reader on Slack or LinkedIn does not run JavaScript, so these tags
// help a reader inside the site and not a card outside it. A server function
// for /blog/:slug is the real answer, and it is a later task.
export function Layout({ title, description, image, children }: LayoutProps) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (image) {
      setMeta('property', 'og:image', image);
    }
  }, [title, description, image]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-blue-700 focus:px-4 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="relative flex-1">
        {children}
      </main>
      <Footer contactEmail={event.contactEmail} sponsorEmail={event.sponsorEmail} />
    </div>
  );
}
