import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { PortalNav } from '../../components/portal/PortalNav';
import { MessageThread } from '../../components/chat/MessageThread';
import { MessageComposer } from '../../components/chat/MessageComposer';
import { ErrorNote } from '../../components/ui/Status';
import { useConversation } from '../../hooks/useConversation';
import { useAuth } from '../../auth/useAuth';

// One thread. The other side is the Expo team.
export function Messages() {
  const { session } = useAuth();
  const { messages, status, send, isSending } = useConversation();

  return (
    <Layout
      title="Messages · Yale Impact Expo"
      description="Message the Yale Impact Expo team."
    >
      <PortalNav />
      <PageHeader title="Messages" lede="Write to the Expo team." />

      <div className="wrap pb-20 pt-10">
        <div className="max-w-[760px]">
          {status === 'error' ? (
            <ErrorNote className="mb-4">The messages did not load. Reload the page.</ErrorNote>
          ) : null}

          <MessageThread
            messages={messages}
            status={status}
            currentUserId={session?.user.id ?? null}
            otherName="Expo team"
          />
          <MessageComposer onSend={send} isSending={isSending} />
        </div>
      </div>
    </Layout>
  );
}
