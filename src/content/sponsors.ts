import type { Domain, Sponsor } from '../types/content';

// The nine domains, in the order they run across the top of the Sponsors page.
export const domainOrder: Domain[] = [
  'corporate',
  'government',
  'law',
  'tech',
  'entrepreneurship',
  'academia',
  'philanthropy',
  'sustainability',
  'healthcare',
];

export const domainLabels: Record<Domain, string> = {
  corporate: 'Corporate',
  government: 'Government',
  law: 'Law',
  tech: 'Tech',
  entrepreneurship: 'Entrepreneurship',
  academia: 'Academia',
  philanthropy: 'Philanthropy',
  sustainability: 'Sustainability',
  healthcare: 'Healthcare',
};

export const domainSummaries: Record<Domain, string> = {
  corporate:
    'Employers and industry partners who fund the Expo, judge student work, and open real doors on the other side of it.',
  government:
    'Public agencies who bring live problem statements, policy pathways, and the chance to pilot student work in the field.',
  law: 'Firms and legal aid organizations who mentor teams through formation, governance, privacy, and civil rights questions.',
  tech: 'AI labs, platforms, and tooling partners who supply credits, infrastructure, and the engineering help to ship.',
  entrepreneurship:
    'Investors, accelerators, and founders who give teams office hours, honest feedback, and a route to a first round.',
  academia:
    'Faculty, labs, and research centers whose mentorship keeps every project evidence-based and academically serious.',
  philanthropy:
    'Foundations and trusts who fund continuation grants and hold the Expo to a standard of genuine public benefit.',
  sustainability:
    'Climate and energy partners working with teams on resilience, environmental justice, and the transition ahead.',
  healthcare:
    'Health systems and biosciences partners who ground student work in patient outcomes and community health equity.',
};

// Partners are added through the portal and live in the database. This list
// stays empty until the team confirms a partner it wants held in code.
export const sponsors: Sponsor[] = [];
