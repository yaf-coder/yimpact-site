import { useEffect, useRef } from 'react';
import type { MessageRow } from '../../types/db';
import { EmptyNote, PendingLabel } from '../ui/Status';
import type { LoadStatus } from '../../hooks/usePosts';

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

interface MessageThreadProps {
  messages: MessageRow[];
  status: LoadStatus;
  currentUserId: string | null;
  otherName: string;
}

export function MessageThread({
  messages,
  status,
  currentUserId,
  otherName,
}: MessageThreadProps) {
  const listRef = useRef<HTMLOListElement>(null);

  // Scroll the container, not the window. scrollIntoView pulls the whole page
  // past the sticky header on every message.
  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight });
  }, [messages.length]);

  if (status === 'loading') {
    return (
      <div className="py-4">
        <PendingLabel>Loading messages</PendingLabel>
      </div>
    );
  }

  return (
    <ol
      ref={listRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Messages"
      className="flex max-h-[480px] flex-col gap-3 overflow-y-auto py-1"
    >
      {messages.length === 0 ? (
        <li>
          <EmptyNote>No messages yet.</EmptyNote>
        </li>
      ) : null}

      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;
        return (
          <li
            key={message.id}
            className={`max-w-[72%] rounded-[14px] px-4 py-3 max-sm:max-w-[88%] ${
              isOwn ? 'ml-auto rounded-br-[4px] bg-blue-700 text-white' : 'mr-auto rounded-bl-[4px] bg-ink-50'
            }`}
          >
            <p className="text-[13px] opacity-75">
              <span className="sr-only">{isOwn ? 'You wrote' : `${otherName} wrote`}</span>
              <span aria-hidden="true">{isOwn ? 'You' : otherName}</span>,{' '}
              <time dateTime={message.created_at}>{timeFormatter.format(new Date(message.created_at))}</time>
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-[1.55]">{message.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
