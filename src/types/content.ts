// The nine partner domains, in the order they appear across the top of the
// Sponsors page.
export type Domain =
  | 'corporate'
  | 'government'
  | 'law'
  | 'tech'
  | 'entrepreneurship'
  | 'academia'
  | 'philanthropy'
  | 'sustainability'
  | 'healthcare';

export type SponsorTier = 'lead' | 'partner' | 'supporting';

export interface Sponsor {
  id: string;
  name: string;
  domain: Domain;
  tier: SponsorTier;
  // Impact, 0-100. Drives bubble diameter directly, so it is a continuous
  // value rather than one of a few fixed sizes. Within a domain column a
  // higher impact always sits higher and draws larger.
  impact: number;
  logoUrl: string;
  websiteUrl?: string;
  blurb?: string; // One or two sentences. The /sponsors page shows it.
  featured: boolean; // True if the home page shows this sponsor.
}

// The Expo team runs in four ranks, widest at the bottom.
export type OrganizerRank = 'director' | 'chair' | 'executive' | 'team';

export interface Organizer {
  id: string;
  name: string;
  role: string; // Example: "Executive Director, Partnerships"
  rank: OrganizerRank;
  affiliation?: string; // Example: "Yale '27, Computer Science"
  headshotUrl: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
}

export interface ScheduleItem {
  id: string;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  title: string;
  description?: string;
  location?: string;
  track?: string; // Null for a plenary item.
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// A project track. Tracks organize judging, mentorship, partner placement,
// and opportunity pathways.
export interface Track {
  id: string;
  name: string;
  focus: string;
  examples: string;
}

// One of the routes a strong team can take out of the Expo.
export interface Pathway {
  id: string;
  name: string;
  summary: string;
}

export type BlogCategory = 'Campus' | 'Partners' | 'Research' | 'New Haven' | 'Opinion' | 'Announcements';

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  kicker: string; // The short line above the headline. Example: "Expo 2026".
  publishedAt: string; // ISO 8601
  author: string;
  authorRole: string;
  excerpt: string;
  body: string[]; // One string per paragraph.
  lead: boolean; // True for the story that leads The Impact Record.
  sponsorIds?: string[]; // Partners whose page also carries this story.
  coverUrl?: string; // The image the announcements form uploads.
  coverAlt?: string;
}

export interface EventDetails {
  name: string;
  shortName: string;
  tagline: string;
  mission: string;
  dateLabel: string; // Shown to readers. The team sets a firm date later.
  expoSeason: string; // Example: "spring 2027". Goes into a sentence, so lower case.
  startsAt: string;
  endsAt: string;
  venueName: string;
  venueAddress: string;
  mapUrl?: string;
  contactEmail: string;
  sponsorEmail: string;
}

// One line on the Alumni page: a donor, an alumni-led company, or a Yale club.
export interface AlumniEntry {
  id: string;
  name: string;
  detail: string;
}
