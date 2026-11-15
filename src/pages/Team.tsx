import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { MemberChip, MemberPanel } from '../components/MemberTile';
import type { Member } from '../components/MemberTile';
import { organizers } from '../content/organizers';

// Members fill a row up to this many, then a new row is spawned. Every row is
// centred, so the group stays symmetric however many people are in it.
const PER_ROW = 3;

function intoRows(members: Member[]): Member[][] {
  const rows: Member[][] = [];
  for (let index = 0; index < members.length; index += PER_ROW) {
    rows.push(members.slice(index, index + PER_ROW));
  }
  return rows;
}

export function Team() {
  const [openId, setOpenId] = useState<string | null>(null);

  const director = organizers.filter((organizer) => organizer.rank === 'director');
  const chair = organizers.filter((organizer) => organizer.rank === 'chair');
  const executive = organizers.filter((organizer) => organizer.rank === 'executive');
  const leads = organizers.filter((organizer) => organizer.rank === 'team');

  // A rank with nobody in it renders no heading.
  const groups = (
    [
      { key: 'director', label: 'Director', members: director },
      { key: 'chair', label: 'Chair', members: chair },
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
                {intoRows(group.members).map((row, rowIndex) => {
                  const openMember = row.find((member) => member.id === openId);
                  const panelId = `member-panel-${group.key}-${rowIndex}`;
                  return (
                    <div key={panelId}>
                      <ul className="flex flex-wrap justify-center gap-3.5">
                        {row.map((member) => (
                          <li key={member.id}>
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
