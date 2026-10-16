import type { EventDetails } from '../types/content';

// The semester runs from a kickoff party in the autumn of 2026 to the
// exposition in the spring of 2027. The room is a placeholder. The team sets
// the firm values once the University calendar is confirmed.
export const event: EventDetails = {
  name: 'Yale Impact Expo',
  shortName: 'Impact Expo',
  tagline:
    'A semester-long social impact incubator where Yale students spend a term on a problem worth solving — and put the result in the hands of the communities, agencies, and institutions who can act on it.',
  mission:
    'We believe the best thinking on this campus should end up somewhere it does good. The Expo exists to point student ambition at real public problems, to hold that work to an evidence standard the people it affects would recognise, and to see it through to something that actually lands.',
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
