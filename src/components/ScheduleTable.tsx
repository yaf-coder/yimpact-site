import type { ScheduleItem } from '../types/content';

interface ScheduleTableProps {
  items: ScheduleItem[];
  caption?: string;
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function ScheduleTable({ items, caption = 'The Saturday agenda for the Yale Impact Expo' }: ScheduleTableProps) {
  const sortedItems = [...items].sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-y border-line text-sm text-ink-400">
            <th scope="col" className="py-2.5 pr-5 font-normal">
              Time
            </th>
            <th scope="col" className="py-2.5 pr-5 font-normal">
              Session
            </th>
            <th scope="col" className="py-2.5 pr-5 font-normal">
              Track
            </th>
            <th scope="col" className="py-2.5 font-normal">
              Room
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id} className="border-b border-line align-top">
              <td className="whitespace-nowrap py-4 pr-5 text-sm tabular-nums text-ink-500">
                {formatTime(item.startsAt)}–{formatTime(item.endsAt)}
              </td>
              <td className="py-4 pr-5">
                <p className="text-[15px] font-medium">{item.title}</p>
                {item.description ? (
                  <p className="mt-1 max-w-[60ch] text-[15px] leading-[1.55] text-ink-500">{item.description}</p>
                ) : null}
              </td>
              <td className="py-4 pr-5 text-sm text-ink-500">{item.track ?? ''}</td>
              <td className="py-4 text-sm text-ink-500">{item.location ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
