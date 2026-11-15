import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { PortalNav } from '../../components/portal/PortalNav';
import { MessageThread } from '../../components/chat/MessageThread';
import { MessageComposer } from '../../components/chat/MessageComposer';
import { EmptyNote, ErrorNote, PendingLabel } from '../../components/ui/Status';
import { useConversation } from '../../hooks/useConversation';
import { useConversations } from '../../hooks/useConversations';
import { useAuth } from '../../auth/useAuth';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

// The inbox and one open thread, side by side.
export function AdminThread() {
  const { conversationId } = useParams();
  const { session } = useAuth();
  const { entries, status: listStatus } = useConversations();
  const { messages, status, send, isSending } = useConversation(conversationId, {
    findOwn: false,
  });

  const open = entries.find((entry) => entry.id === conversationId);

  return (
    <Layout
      title="Inbox · Yale Impact Expo"
      description="Every conversation with a student or a partner."
    >
      <PortalNav />
      <PageHeader title="Inbox" />

      <div className="wrap pb-20 pt-10">
        <div>
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
            <aside aria-labelledby="inbox-heading" className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-line">
                <div className="border-b border-line bg-ink-50 px-4 py-3">
                  <h2 id="inbox-heading" className="label text-ink-900">
                    Conversations
                  </h2>
                </div>

                {listStatus === 'loading' ? (
                  <div className="p-4">
                    <PendingLabel />
                  </div>
                ) : null}

                {listStatus === 'error' ? (
                  <div className="p-4">
                    <EmptyNote>The inbox did not load.</EmptyNote>
                  </div>
                ) : null}

                {listStatus === 'ready' && entries.length === 0 ? (
                  <div className="p-4">
                    <EmptyNote>Nobody has written yet.</EmptyNote>
                  </div>
                ) : null}

                <ul>
                  {entries.map((entry) => {
                    const isOpen = entry.id === conversationId;
                    return (
                      <li key={entry.id} className="border-b border-line last:border-b-0">
                        <Link
                          to={`/portal/admin/messages/${entry.id}`}
                          aria-current={isOpen ? 'true' : undefined}
                          className={`block p-4 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 ${
                            isOpen ? 'bg-ink-50' : 'hover:bg-ink-50'
                          }`}
                        >
                          <p className="text-sm font-medium leading-[1.3] tracking-[-0.025em] text-ink-900">
                            {entry.memberName}
                          </p>
                          <p className="mt-0.5 text-sm text-ink-500">{entry.memberRole}</p>
                          <p className="mt-1 text-[13px] text-ink-400">
                            {dateFormatter.format(new Date(entry.last_message_at))}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            <div>
              {!conversationId ? (
                <EmptyNote>Select a conversation on the left.</EmptyNote>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
                    <h2 className="display-3">{open?.memberName ?? 'Conversation'}</h2>
                    <p className="label text-ink-400">{open?.memberEmail}</p>
                  </div>

                  {status === 'error' ? (
                    <ErrorNote className="mb-4">The thread did not load.</ErrorNote>
                  ) : null}

                  <MessageThread
                    messages={messages}
                    status={status}
                    currentUserId={session?.user.id ?? null}
                    otherName={open?.memberName ?? 'Member'}
                  />
                  <MessageComposer onSend={send} isSending={isSending} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
