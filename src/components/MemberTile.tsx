import { asset } from '../lib/asset';

export interface Member {
  id: string;
  name: string;
  role: string;
  affiliation?: string;
  headshotUrl: string;
  bio?: string;
  email?: string;
}

// Every tile on the Team page is 200px wide, officers and Expo team alike.
interface MemberChipProps {
  member: Member;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}

// The pyramid tile. Headshot, name, title — nothing else until it is opened.
export function MemberChip({ member, isOpen, onToggle, panelId }: MemberChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      className={`haze-inner group flex w-[200px] flex-col overflow-hidden border text-left transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        isOpen ? 'border-bar' : 'border-bar/25 hover:border-bar/45'
      }`}
    >
      <img
        src={asset(member.headshotUrl)}
        alt=""
        aria-hidden="true"
        width={200}
        height={128}
        className={`h-[128px] w-full shrink-0 bg-ink-50 object-cover transition-[filter] duration-500 ease-out ${
          isOpen ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
        }`}
      />
      <span className="block border-t border-bar/25 px-3 py-3">
        <span className="block truncate text-sm font-medium leading-[1.25] tracking-[-0.03em] text-ink-900">
          {member.name}
        </span>
        <span className="label mt-1.5 block truncate text-blue-500">{member.role}</span>
      </span>
    </button>
  );
}

interface MemberPanelProps {
  member: Member;
  id: string;
  compact?: boolean; // True inside the narrow admin column.
}

// The detail that a tile opens, rendered beneath the row so that the pyramid
// stays symmetric no matter which tile is selected.
export function MemberPanel({ member, id, compact = false }: MemberPanelProps) {
  return (
    <div id={id} className="haze-inner mt-4 border border-bar bg-white/70">
      <div className={`flex flex-col gap-4 p-5 ${compact ? '' : 'sm:flex-row sm:items-start'}`}>
        <img
          src={asset(member.headshotUrl)}
          alt={member.name}
          width={96}
          height={96}
          className="haze-inner h-24 w-24 shrink-0 bg-ink-50 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="display-3">{member.name}</h3>
          <p className="label mt-1.5 text-blue-500">{member.role}</p>
          {member.affiliation ? <p className="mt-1 text-xs text-ink-400">{member.affiliation}</p> : null}
          {member.bio ? (
            <p className="mt-3 max-w-[68ch] text-sm leading-[1.65] text-ink-700">{member.bio}</p>
          ) : null}
          {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="label mt-4 inline-flex items-center border border-bar/45 px-4 py-2.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Contact me
          </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
