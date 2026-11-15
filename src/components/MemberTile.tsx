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

interface MemberChipProps {
  member: Member;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}

// A tile on the Team page: headshot, name and role. It opens the panel below.
export function MemberChip({ member, isOpen, onToggle, panelId }: MemberChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      className={`flex w-[168px] flex-col items-center gap-2 rounded-lg border px-3 py-[18px] text-center transition-colors duration-200 ease-out hover:border-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
        isOpen ? 'border-blue-700' : 'border-line-strong'
      }`}
    >
      <img
        src={asset(member.headshotUrl)}
        alt=""
        aria-hidden="true"
        width={76}
        height={76}
        className="h-[76px] w-[76px] rounded-full bg-ink-50 object-cover"
      />
      <span className="text-[15px] font-medium leading-[1.3]">{member.name}</span>
      <span className="text-sm text-ink-500">{member.role}</span>
    </button>
  );
}

interface MemberPanelProps {
  member: Member;
  id: string;
}

// The detail a tile opens, under the row, so each row stays centred whichever
// tile is open.
export function MemberPanel({ member, id }: MemberPanelProps) {
  return (
    <div
      id={id}
      className="mx-auto mt-4 flex max-w-[600px] flex-col gap-5 rounded-lg border border-line-strong p-[22px] text-left sm:flex-row sm:items-start"
    >
      <img
        src={asset(member.headshotUrl)}
        alt={member.name}
        width={96}
        height={96}
        className="h-24 w-24 shrink-0 rounded-full bg-ink-50 object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-medium">{member.name}</h3>
        <p className="mt-0.5 text-ink-500">{member.role}</p>
        {member.affiliation ? <p className="mt-2 text-sm text-ink-500">{member.affiliation}</p> : null}
        {member.bio ? <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.6] text-ink-700">{member.bio}</p> : null}
        {member.email ? <p className="mt-3 select-all text-blue-700">{member.email}</p> : null}
      </div>
    </div>
  );
}
