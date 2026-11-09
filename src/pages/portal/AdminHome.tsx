import { useState } from 'react';
import type { ReactNode } from 'react';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { PortalNav } from '../../components/portal/PortalNav';
import { Badge } from '../../components/ui/Badge';
import { EmptyNote, ErrorNote, PendingLabel } from '../../components/ui/Status';
import { useMembers } from '../../hooks/useMembers';
import { missingFields, openResume } from '../../lib/application';
import type { ApplicationDecisionRow, MemberStatus, ProfileRow } from '../../types/db';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const statusLabels: Record<MemberStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

type Tab = 'review' | 'incomplete' | 'approved' | 'rejected' | 'all';

const tabLabels: Record<Tab, string> = {
  review: 'To review',
  incomplete: 'Incomplete',
  approved: 'Approved',
  rejected: 'Rejected',
  all: 'All',
};

const tabOrder: Tab[] = ['review', 'incomplete', 'approved', 'rejected', 'all'];

function tabOf(member: ProfileRow): Exclude<Tab, 'all'> {
  if (member.status === 'approved') return 'approved';
  if (member.status === 'rejected') return 'rejected';
  return missingFields(member).length > 0 ? 'incomplete' : 'review';
}

function formatDate(value: string | null): string {
  return value ? dateFormatter.format(new Date(value)) : 'not yet';
}

export function AdminHome() {
  const { members, decisions, status, decide } = useMembers();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('review');

  async function handleDecide(userId: string, approve: boolean) {
    setBusyId(userId);
    const result = await decide(userId, approve);
    setBusyId(null);
    setError(result.error);
  }

  const students = members.filter((member) => member.role === 'student');
  const staff = members.filter((member) => member.role !== 'student');

  const counts: Record<Tab, number> = {
    review: 0,
    incomplete: 0,
    approved: 0,
    rejected: 0,
    all: students.length,
  };
  for (const member of students) counts[tabOf(member)] += 1;

  // The oldest complete application comes first, so nobody waits longest.
  const visible = students
    .filter((member) => tab === 'all' || tabOf(member) === tab)
    .sort((a, b) =>
      tab === 'review'
        ? (a.submitted_at ?? a.created_at).localeCompare(b.submitted_at ?? b.created_at)
        : 0,
    );

  return (
    <Layout
      pattern="team"
      title="Applications · Yale Impact Expo"
      description="Review the student applications for the Yale Impact Expo."
    >
      <PortalNav />
      <PageHeader
        eyebrow="Admin"
        title="Applications"
        meta="Every student applies. Approve a complete application, or reject it. A rejected student can update the application and send it again, and each earlier version stays here."
      />

      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
          {error ? <ErrorNote className="mb-6">{error}</ErrorNote> : null}
          {status === 'loading' ? <PendingLabel /> : null}
          {status === 'error' ? <ErrorNote>The member list did not load.</ErrorNote> : null}

          {status === 'ready' ? (
            <>
              <section aria-labelledby="students-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-bar/25 pb-3">
                  <h2 id="students-heading" className="display-2">
                    Students
                  </h2>
                  <p className="label text-ink-400">{students.length} applications</p>
                </div>

                <div
                  role="group"
                  aria-label="Filter applications by status"
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {tabOrder.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      aria-pressed={tab === key}
                      className={`label border px-3 py-2 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                        tab === key
                          ? 'border-bar bg-ink-50 text-ink-900'
                          : 'border-bar/25 text-ink-400 hover:text-ink-900'
                      }`}
                    >
                      {tabLabels[key]} · {counts[key]}
                    </button>
                  ))}
                </div>

                {visible.length === 0 ? (
                  <p className="mt-6">
                    <EmptyNote>No applications here.</EmptyNote>
                  </p>
                ) : (
                  <ul className="mt-4 border-t border-bar/25">
                    {visible.map((member) => (
                      <ApplicationItem
                        key={member.id}
                        member={member}
                        history={decisions.get(member.id) ?? []}
                        isBusy={busyId === member.id}
                        onDecide={(approve) => handleDecide(member.id, approve)}
                        onError={setError}
                      />
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="staff-heading" className="mt-16">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-bar/25 pb-3">
                  <h2 id="staff-heading" className="display-2">
                    Partners and staff
                  </h2>
                  <p className="label text-ink-400">{staff.length} accounts</p>
                </div>
                <ul className="mt-2 border-t border-bar/25">
                  {staff.map((member) => (
                    <li
                      key={member.id}
                      className="grid gap-1 border-b border-bar/25 py-3.5 sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:gap-6"
                    >
                      <span className="text-sm leading-[1.4] text-ink-900">
                        {member.full_name || member.email}
                      </span>
                      <span className="font-mono text-xs text-ink-400">{member.email}</span>
                      <span className="label text-blue-500">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

function ApplicationItem({
  member,
  history,
  isBusy,
  onDecide,
  onError,
}: {
  member: ProfileRow;
  history: ApplicationDecisionRow[];
  isBusy: boolean;
  onDecide: (approve: boolean) => void;
  onError: (message: string | null) => void;
}) {
  const missing = missingFields(member);
  const isComplete = missing.length === 0;
  // A pending student with a rejection in the history has applied again.
  const hasReapplied = member.status === 'pending' && history.some((d) => d.decision === 'rejected');

  return (
    <li className="border-b border-bar/25 py-4">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-6">
        <div className="min-w-0">
          <p className="text-base leading-[1.35] tracking-[-0.025em] text-ink-900">
            {member.full_name || member.email}
          </p>
          <p className="mt-1 font-mono text-xs text-ink-400">{member.email}</p>
          <p className="mt-1 text-xs leading-[1.5] text-ink-500">
            {[member.school, member.program, member.grad_year].filter(Boolean).join(' · ') ||
              'No school details yet'}
          </p>
          <p className="label mt-1 text-ink-300">
            Account {formatDate(member.created_at)} · Submitted {formatDate(member.submitted_at)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {hasReapplied ? (
              <Badge className="border-bar text-ink-900">
                Reapplied · {history.length} earlier
              </Badge>
            ) : history.length > 0 && member.status === 'pending' ? (
              <Badge>{history.length} earlier decisions</Badge>
            ) : null}
            {!isComplete ? <Badge>Missing: {missing.join(', ')}</Badge> : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Badge>{statusLabels[member.status]}</Badge>
          {member.status !== 'approved' ? (
            <DecideButton
              onClick={() => onDecide(true)}
              isBusy={isBusy}
              isDisabled={!isComplete}
              title={isComplete ? undefined : 'Only a complete application can be approved.'}
            >
              Approve
            </DecideButton>
          ) : null}
          {member.status !== 'rejected' ? (
            <DecideButton onClick={() => onDecide(false)} isBusy={isBusy}>
              Reject
            </DecideButton>
          ) : null}
        </div>
      </div>

      <details className="group mt-3">
        <summary className="label cursor-pointer text-ink-400 transition-colors duration-300 ease-out hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
          Read the application
          {history.length > 0 ? ` and ${history.length} earlier` : ''}
        </summary>

        <div className="mt-4 grid gap-6 border-l-2 border-bar/25 pl-4">
          <ApplicationBody
            bio={member.bio}
            linkedin={member.linkedin_url}
            portfolio={member.portfolio_url}
            resumePath={member.resume_path}
            onError={onError}
          />

          {history.length > 0 ? (
            <div>
              <p className="label text-ink-900">Earlier decisions</p>
              <ol className="mt-3 grid gap-4">
                {history.map((decision, index) => (
                  <li key={decision.id} className="border border-bar/25 p-4">
                    <p className="label text-ink-400">
                      Application {history.length - index} ·{' '}
                      <span className="text-ink-900">
                        {decision.decision === 'approved' ? 'Approved' : 'Rejected'}
                      </span>{' '}
                      {formatDate(decision.decided_at)} · Submitted{' '}
                      {formatDate(decision.submitted_at)}
                    </p>
                    <p className="mt-2 text-sm text-ink-900">{decision.full_name}</p>
                    <p className="mt-1 text-xs leading-[1.5] text-ink-500">
                      {[decision.school, decision.program, decision.grad_year]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <div className="mt-3">
                      <ApplicationBody
                        bio={decision.bio}
                        linkedin={decision.linkedin_url}
                        portfolio={decision.portfolio_url}
                        resumePath={decision.resume_path}
                        onError={onError}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </details>
    </li>
  );
}

function ApplicationBody({
  bio,
  linkedin,
  portfolio,
  resumePath,
  onError,
}: {
  bio: string | null;
  linkedin: string | null;
  portfolio: string | null;
  resumePath: string | null;
  onError: (message: string | null) => void;
}) {
  async function handleResume() {
    if (!resumePath) return;
    const result = await openResume(resumePath);
    onError(result.error);
  }

  return (
    <div className="grid gap-3">
      <DetailRow label="About">
        {bio ? <span className="whitespace-pre-line">{bio}</span> : <EmptyNote>Not written.</EmptyNote>}
      </DetailRow>
      <DetailRow label="Resume">
        {resumePath ? (
          <TextButton onClick={handleResume}>Open the resume</TextButton>
        ) : (
          <EmptyNote>Not uploaded.</EmptyNote>
        )}
      </DetailRow>
      {linkedin ? (
        <DetailRow label="LinkedIn">
          <ExternalLink href={linkedin} />
        </DetailRow>
      ) : null}
      {portfolio ? (
        <DetailRow label="Website">
          <ExternalLink href={portfolio} />
        </DetailRow>
      ) : null}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-4">
      <p className="label text-ink-400">{label}</p>
      <div className="max-w-[62ch] text-sm leading-[1.6] text-ink-700">{children}</div>
    </div>
  );
}

const linkClass =
  'border-b border-bar/45 pb-0.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500';

function TextButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={linkClass}>
      {children}
    </button>
  );
}

// A student writes this address, so only an http or https address becomes a
// link. Anything else shows as text.
function ExternalLink({ href }: { href: string }) {
  if (!/^https?:\/\//i.test(href)) return <span className="break-all">{href}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkClass} break-all`}>
      {href}
    </a>
  );
}

function DecideButton({
  onClick,
  isBusy,
  isDisabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isBusy: boolean;
  isDisabled?: boolean;
  title?: string;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isBusy || isDisabled}
      title={title}
      className="label border border-bar/45 px-3 py-2 text-ink-900 transition-colors duration-300 ease-out hover:border-bar hover:bg-ink-50/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:border-bar/25 disabled:text-ink-400"
    >
      {isBusy ? 'Working' : children}
    </button>
  );
}
