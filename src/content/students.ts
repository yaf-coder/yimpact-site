// The student walkthrough video. Paste the YouTube video id here — the part
// after `v=` in the watch URL — and the player replaces the placeholder frame
// on the Students page.
export const walkthroughVideoId = '';

export const walkthroughTitle = 'What the Yale Impact Expo is, and how to get involved';

export const walkthroughSummary =
  'A short walkthrough from the team: what the Expo asks of you, what a semester looks like week by week, and what strong teams leave with.';

export interface StudentStep {
  id: string;
  name: string;
  timing: string;
  summary: string;
}

// The semester, as a student experiences it.
export const studentSteps: StudentStep[] = [
  {
    id: 'apply',
    name: 'Apply',
    timing: 'Before week 1',
    summary: "Submit your initial pitch. You don't need a team or prototype at this stage, just an idea!",
  },
  {
    id: 'form-a-team',
    name: 'Form a team',
    timing: 'Weeks 1–2',
    summary: 'Find 2–3 other people to work alongside.',
  },
  {
    id: 'research',
    name: 'Research',
    timing: 'Weeks 3–6',
    summary:
      "Define the problem you're trying to solve. Start fleshing out a final pitch and consult our partners. You'll be paired with a mentor who will help guide you.",
  },
  {
    id: 'build',
    name: 'Build, analyze, or design',
    timing: 'Weeks 7–13',
    summary:
      'Make the thing: a prototype, an empirical study, a policy memo, a venture or nonprofit proposal, a governance framework, or a pilot plan.',
  },
  {
    id: 'present',
    name: 'Present at the Expo',
    timing: 'Expo weekend',
    summary: 'Showcase your work to industry professionals and our partners across nine domains!',
  },
];
