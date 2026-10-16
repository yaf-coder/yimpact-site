import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Reveal } from '../components/ui/Reveal';
import { MemberChip, MemberPanel } from '../components/MemberTile';
import type { Member } from '../components/MemberTile';
import { AdminPanel } from '../components/AdminPanel';
import { adminOfficers, organizers } from '../content/organizers';

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

  const chair = organizers.filter((organizer) => organizer.rank === 'chair');
  const executive = organizers.filter((organizer) => organizer.rank === 'executive');
  const leads = organizers.filter((organizer) => organizer.rank === 'team');

  const groups: { key: string; label: string; members: Member[] }[] = [
    { key: 'chair', label: 'Chair', members: chair },
    { key: 'executive', label: 'Executive council', members: executive },
    { key: 'leads', label: 'Leads', members: leads },
  ];

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <Layout
      pattern="team"
      title="Team · Yale Impact Expo"
      description="The students who run the Yale Impact Expo, and the officers of the organization behind it."
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 md:px-10 md:py-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
          <Reveal>
            <h1 className="display-2">
              The Impact Expo <span className="accent-serif">Team</span>
            </h1>
          </Reveal>

          {/* The Expo team comes first in reading order, so on a narrow screen the
              officers fall below it; from xl they take the right-hand column. */}
          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-10">
            <div>
              <div className="border-b border-bar/25 pb-3">
                <h2 className="display-2">Expo team</h2>
              </div>

              <div className="mt-8 space-y-8">
                {groups.map((group, groupIndex) => (
                  <Reveal key={group.key}>
                    <section aria-labelledby={`rank-${group.key}`}>
                      <p id={`rank-${group.key}`} className="label text-center text-ink-400">
                        <span className="text-blue-500">{String(groupIndex + 1).padStart(2, '0')}</span>
                        <span className="px-2 text-ink-300">/</span>
                        {group.label}
                      </p>

                      <div className="mt-4 space-y-4">
                        {intoRows(group.members).map((row, rowIndex) => {
                          const openMember = row.find((member) => member.id === openId);
                          const panelId = `member-panel-${group.key}-${rowIndex}`;
                          return (
                            <div key={panelId}>
                              <ul className="flex flex-wrap justify-center gap-4">
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
                  </Reveal>
                ))}
              </div>
            </div>

            <AdminPanel officers={adminOfficers} openId={openId} onToggle={toggle} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
