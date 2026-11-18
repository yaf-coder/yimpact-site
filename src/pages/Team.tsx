import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MemberChip, MemberPanel } from '../components/MemberTile';
import type { Member } from '../components/MemberTile';
import { organizers } from '../content/organizers';

// Members fill a row up to this many, then a new row is spawned. Every row is
// centred, so the group stays symmetric however many people are in it. The
// count follows the screen (two on phones, three on tablets, five on desktops)
// and matches the tile widths below, so a row never wraps on its own.
const WIDE = '(min-width: 1024px)';
const MEDIUM = '(min-width: 640px)';

function perRowNow(): number {
  if (window.matchMedia(WIDE).matches) return 5;
  if (window.matchMedia(MEDIUM).matches) return 3;
  return 2;
}

function usePerRow(): number {
  const [perRow, setPerRow] = useState(perRowNow);
  useEffect(() => {
    const queries = [window.matchMedia(WIDE), window.matchMedia(MEDIUM)];
    const update = () => setPerRow(perRowNow());
    queries.forEach((query) => query.addEventListener('change', update));
    return () => queries.forEach((query) => query.removeEventListener('change', update));
  }, []);
  return perRow;
}

function intoRows(members: Member[], perRow: number): Member[][] {
  const rows: Member[][] = [];
  for (let index = 0; index < members.length; index += perRow) {
    rows.push(members.slice(index, index + perRow));
  }
  return rows;
}

export function Team() {
  const [openId, setOpenId] = useState<string | null>(null);
  const perRow = usePerRow();

  const director = organizers.filter((organizer) => organizer.rank === 'director');
  const chair = organizers.filter((organizer) => organizer.rank === 'chair');
  const board = organizers.filter((organizer) => organizer.rank === 'board');
  const executive = organizers.filter((organizer) => organizer.rank === 'executive');
  const leads = organizers.filter((organizer) => organizer.rank === 'team');

  // A rank with nobody in it renders no heading.
  const groups = (
    [
      { key: 'director', label: 'Director', members: director },
      { key: 'chair', label: 'Chair', members: chair },
      { key: 'board', label: 'Board', members: board },
      { key: 'executive', label: 'Executive council', members: executive },
      { key: 'leads', label: 'Leads', members: leads },
    ] as { key: string; label: string; members: Member[] }[]
  ).filter((group) => group.members.length > 0);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <Layout
      title="Team · Yale Impact Expo"
      description="The students who run the Yale Impact Expo."
    >
      <div className="wrap pb-20 pt-10 md:pt-14">
        <h1 className="display-1">Team</h1>

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.key} aria-labelledby={`rank-${group.key}`}>
              <h2 id={`rank-${group.key}`} className="display-3 mb-4 text-center">
                {group.label}
              </h2>

              <div className="space-y-4">
                {intoRows(group.members, perRow).map((row, rowIndex) => {
                  const openMember = row.find((member) => member.id === openId);
                  const panelId = `member-panel-${group.key}-${rowIndex}`;
                  return (
                    <div key={panelId}>
                      <ul className="flex flex-wrap justify-center gap-3.5">
                        {row.map((member) => (
                          <li key={member.id} className="w-[calc((100%-14px)/2)] max-w-[200px] sm:w-[calc((100%-28px)/3)] lg:w-[calc((100%-56px)/5)]">
                            <MemberChip
                              member={member}
                              isOpen={openId === member.id}
                              onToggle={() => toggle(member.id)}
                              panelId={panelId}
                            />
                          </li>
                        ))}
                      </ul>
                      {openMember ? <MemberPanel member={openMember} id={panelId} /> : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
