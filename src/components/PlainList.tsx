interface PlainListItem {
  id: string;
  title: string;
  text: string;
}

interface PlainListProps {
  items: PlainListItem[];
  columns?: 1 | 2;
}

// A ruled list of a name and one line about it. Tracks and pathways use it,
// in place of a grid of text-only cards.
export function PlainList({ items, columns = 1 }: PlainListProps) {
  return (
    <ul className={`border-t border-line ${columns === 2 ? 'grid gap-x-10 md:grid-cols-2' : ''}`}>
      {items.map((item) => (
        <li key={item.id} className="grid gap-0.5 border-b border-line py-3.5">
          <span className="font-medium">{item.title}</span>
          <span className="text-[15px] leading-[1.55] text-ink-500">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
