// The schools of Yale University. Source: the Yale Registrar and the Yale
// catalog, November 2026.
// Migration 0015 holds the same list in a check constraint. Change both
// together.
export const yaleSchools = [
  'Yale College',
  'Graduate School of Arts and Sciences',
  'School of Architecture',
  'School of Art',
  'Divinity School',
  'David Geffen School of Drama',
  'School of Engineering & Applied Science',
  'School of the Environment',
  'Jackson School of Global Affairs',
  'Law School',
  'School of Management',
  'School of Medicine',
  'School of Music',
  'School of Nursing',
  'School of Public Health',
] as const;

export type YaleSchool = (typeof yaleSchools)[number];

export function isYaleSchool(value: string): value is YaleSchool {
  return (yaleSchools as readonly string[]).includes(value);
}
