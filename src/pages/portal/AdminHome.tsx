import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { PortalNav } from '../../components/portal/PortalNav';
import { Badge } from '../../components/ui/Badge';
import { EmptyNote, ErrorNote, PendingLabel } from '../../components/ui/Status';
import { useMembers } from '../../hooks/useMembers';
import type { MemberStatus } from '../../types/db';

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

export function AdminHome() {
  const { members, status, decide } = useMembers();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDecide(userId: string, approve: boolean) {
    setBusyId(userId);
    const result = await decide(userId, approve);
    setBusyId(null);
    setError(result.error);
  }

  const students = members.filter((member) => member.role === 'student');
  const staff = members.filter((member) => member.role !== 'student');

  return (
    <Layout
      title="Approvals · Yale Impact Expo"
      description="Approve the students who registered for the Yale Impact Expo."
    >
      <PortalNav />
      <PageHeader title="Approvals" />

      <div className="wrap pb-20 pt-10">
        <div>
          {error ? <ErrorNote className="mb-6">{error}</ErrorNote> : null}
          {status === 'loading' ? <PendingLabel /> : null}
          {status === 'error' ? <ErrorNote>The member list did not load.</ErrorNote> : null}

          {status === 'ready' ? (
            <>
              <section aria-labelledby="students-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
                  <h2 id="students-heading" className="display-2">
                    Students
                  </h2>
                  <p className="label text-ink-400">{students.length} registered</p>
                </div>

                {students.length === 0 ? (
                  <p className="mt-6">
                    <EmptyNote>Nobody has registered yet.</EmptyNote>
                  </p>
                ) : (
                  <ul className="mt-2 border-t border-line">
                    {students.map((member) => (
                      <li
                        key={member.id}
                        className="grid gap-2 border-b border-line py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                      >
                        <div className="min-w-0">
                          <p className="text-base leading-[1.35] tracking-[-0.025em] text-ink-900">
                            {member.full_name || member.email}
                          </p>
                          <p className="mt-1 text-xs text-ink-400">{member.email}</p>
                          <p className="mt-1 text-xs leading-[1.5] text-ink-500">
                            {[member.school, member.program, member.grad_year]
                              .filter(Boolean)
                              .join(' · ') || 'No school details yet'}
                          </p>
                          <p className="label mt-1 text-ink-300">
                            Registered {dateFormatter.format(new Date(member.created_at))}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                          <Badge>{statusLabels[member.status]}</Badge>
                          {member.status !== 'approved' ? (
                            <DecideButton
                              onClick={() => handleDecide(member.id, true)}
                              isBusy={busyId === member.id}
                            >
                              Approve
                            </DecideButton>
                          ) : null}
                          {member.status !== 'rejected' ? (
                            <DecideButton
                              onClick={() => handleDecide(member.id, false)}
                              isBusy={busyId === member.id}
                            >
                              Reject
                            </DecideButton>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="staff-heading" className="mt-16">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
                  <h2 id="staff-heading" className="display-2">
                    Partners and staff
                  </h2>
                  <p className="label text-ink-400">{staff.length} accounts</p>
                </div>
                <ul className="mt-2 border-t border-line">
                  {staff.map((member) => (
                    <li
                      key={member.id}
                      className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:gap-6"
                    >
                      <span className="text-sm leading-[1.4] text-ink-900">
                        {member.full_name || member.email}
                      </span>
                      <span className="text-xs text-ink-400">{member.email}</span>
                      <span className="text-sm text-ink-500">{member.role}</span>
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

function DecideButton({
  onClick,
  isBusy,
  children,
}: {
  onClick: () => void;
  isBusy: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isBusy}
      className="rounded-[4px] border border-line-strong px-3.5 py-1.5 text-[13px] font-medium text-ink-900 transition-colors duration-200 ease-out hover:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:text-ink-400"
    >
      {isBusy ? 'Working' : children}
    </button>
  );
}
