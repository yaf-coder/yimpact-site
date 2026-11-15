import type { EventDetails } from '../types/content';

// The semester runs from a kickoff party in the autumn of 2026 to the
// exposition in the spring of 2027. The room is a placeholder. The team sets
// the firm values once the University calendar is confirmed.
export const event: EventDetails = {
  name: 'Yale Impact Expo',
  shortName: 'Impact Expo',
  tagline:
    'A semester-long incubator where Yale students work on a real public problem and hand the result to the people who can act on it.',
  mission:
    'Students pick a public problem, research it with faculty and partners, and build something: a tool, a study, a policy memo, a venture or a pilot plan.',
  dateLabel: 'Kickoff autumn 2026 · Expo weekend spring 2027',
  expoSeason: 'spring 2027',
  startsAt: '2027-04-16T17:00:00-04:00',
  endsAt: '2027-04-18T16:00:00-04:00',
  venueName: 'Yale University',
  venueAddress: 'New Haven, Connecticut',
  contactEmail: 'hello@yaleimpactexpo.org',
  sponsorEmail: 'yafee.khan@yale.edu',
};

// The kickoff party opens the semester. The Students page shows this date.
export const kickoffAt = '2026-09-18T18:00:00-04:00';
export const kickoffLabel = 'Kickoff party · Friday 18 September 2026';
