import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from './ui/Badge';
import { useAuth } from '../auth/useAuth';
import type { Resource, ResourceKind } from '../types/db';

const kindLabels: Record<ResourceKind, string> = {
  contact: 'Contact',
  office_hours: 'Office hours',
  promo_code: 'Promo code',
  tool_credit: 'Tool credit',
  link: 'Link',
  mentor: 'Mentor',
};

interface ResourceTileProps {
  resource: Resource;
  headingLevel: 2 | 3;
}

const textButton =
  'text-sm text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700';

// One resource as a ruled row: what it is and who offers it, what it covers,
// and its kind with the way in to the access details.
export function ResourceTile({ resource, headingLevel }: ResourceTileProps) {
  const { status, isApprovedMember } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const owner =
    resource.owner_kind === 'org'
      ? resource.org_name
      : [resource.person_name, resource.person_title, resource.person_affiliation].filter(Boolean).join(', ');

  return (
    <div className="grid gap-x-8 gap-y-1.5 py-[18px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_150px] lg:items-baseline">
      <div>
        <Heading className="font-medium leading-[1.35]">{resource.title}</Heading>
        <p className="mt-1 text-sm text-ink-400">{owner}</p>
      </div>
      <p className="text-[15px] leading-[1.55] text-ink-500">{resource.summary}</p>
      <div className="flex flex-col gap-1 lg:items-end lg:text-right">
        <span className="text-sm text-ink-400">{kindLabels[resource.kind]}</span>
        {status !== 'signedIn' ? (
          <Link to="/login" state={{ from: location.pathname }} className={textButton}>
            Log in for details
          </Link>
        ) : !isApprovedMember ? (
          <Badge>Pending approval</Badge>
        ) : (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((open) => !open)}
            className={textButton}
          >
            {isOpen ? 'Hide details' : 'Show details'}
          </button>
        )}
      </div>
      {status === 'signedIn' && isApprovedMember ? (
        <div id={panelId} hidden={!isOpen} className="lg:col-span-3">
          <AccessDetails resource={resource} />
        </div>
      ) : null}
    </div>
  );
}

// The gated half. It arrives only when Row Level Security allows it, so an
// empty secret means the reader may not see it.
function AccessDetails({ resource }: { resource: Resource }) {
  const secret = resource.secret;

  if (!secret) {
    return <p className="mt-2 text-sm text-ink-400">The team has not added the details for this one yet.</p>;
  }

  const rows: { term: string; value: ReactNode }[] = [];

  if (secret.contact_email) {
    rows.push({ term: 'Email', value: <span className="select-all">{secret.contact_email}</span> });
  }
  if (secret.contact_phone) {
    rows.push({ term: 'Phone', value: <span className="select-all">{secret.contact_phone}</span> });
  }
  if (secret.booking_url) {
    rows.push({ term: 'Book', value: <OutLink href={secret.booking_url} /> });
  }
  if (secret.promo_code) {
    rows.push({ term: 'Code', value: <span className="select-all font-medium">{secret.promo_code}</span> });
  }
  if (secret.redeem_url) {
    rows.push({ term: 'Redeem', value: <OutLink href={secret.redeem_url} /> });
  }
  if (secret.expires_on) {
    rows.push({ term: 'Expires', value: secret.expires_on });
  }

  return (
    <div className="mt-3 rounded-md bg-ink-50 px-4 py-3">
      <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[80px_minmax(0,1fr)]">
        {rows.map((row) => (
          <div key={row.term} className="contents">
            <dt className="text-ink-400">{row.term}</dt>
            <dd className="min-w-0 break-words">{row.value}</dd>
          </div>
        ))}
      </dl>
      {secret.instructions ? <p className="mt-2 text-sm text-ink-500">{secret.instructions}</p> : null}
    </div>
  );
}

function OutLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="break-all text-blue-700 underline">
      {href.replace(/^https?:\/\//, '')}
    </a>
  );
}
