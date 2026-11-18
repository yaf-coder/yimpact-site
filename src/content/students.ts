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
  summary?: string;
}

// The semester, as a student goes through it.
export const studentSteps: StudentStep[] = [
  { id: 'apply', name: 'Apply', summary: "Apply on your own. You don't need an idea yet." },
  { id: 'join-a-team', name: 'Join a team', summary: 'You can also work alone.' },
  { id: 'build', name: 'Build, research or design', summary: 'Meet with mentors as you go.' },
  { id: 'pitch', name: 'Submit your pitch' },
  { id: 'presentation', name: 'Build your presentation' },
  { id: 'present', name: 'Present at the Expo' },
];

export interface ProjectExample {
  name: string;
  summary: string;
}

export interface ProjectType {
  id: 'technical' | 'policy' | 'research';
  heading: string;
  examples: ProjectExample[];
}

// The three kinds of project on the Students page, each with ideas students
// have raised. The page pairs each one with its own line drawing.
export const projectTypes: ProjectType[] = [
  {
    id: 'technical',
    heading: 'Do you have an idea for a project, startup, or product? Come pitch it.',
    examples: [
      {
        name: 'AI efficiency',
        summary:
          'An algorithm that cuts the energy and water AI models need to run, so data centers have a smaller environmental footprint.',
      },
      {
        name: 'Wildfire detection',
        summary: 'Using satellite images to spot wildfires early so firefighters can get to them sooner.',
      },
      {
        name: 'Crop disease detection',
        summary: "An app that lets farmers take a photo of a sick plant and find out what's wrong with it.",
      },
    ],
  },
  {
    id: 'policy',
    heading: 'Do you have a policy idea? Come draft it.',
    examples: [
      { name: 'New Haven housing', summary: 'A memo to the city on how to speed up repairs in public housing.' },
      { name: 'AI in hiring', summary: 'Rules for checking whether automated hiring tools are fair to applicants.' },
      { name: 'Legal aid access', summary: 'A plan to offer free legal help through public libraries.' },
    ],
  },
  {
    id: 'research',
    heading: 'Do you have a research question? Come investigate it.',
    examples: [
      {
        name: 'Bias in hospital algorithms',
        summary: 'Testing whether the software hospitals use to prioritize patients treats everyone equally.',
      },
      {
        name: 'Food insecurity in New Haven',
        summary: "Mapping which neighborhoods aren't getting enough food assistance.",
      },
      {
        name: 'AI growth and climate change',
        summary:
          'Studying how the global boom in AI data centers is adding to carbon emissions and water shortages, and which countries are feeling it most.',
      },
    ],
  },
];
