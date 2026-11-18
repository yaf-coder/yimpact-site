import { useEffect, useState } from 'react';

// A font picker for local development only. App.tsx loads it behind
// import.meta.env.DEV, so it never reaches the built site. It swaps the three
// font settings in index.css (--font-serif, --font-sans, --font-button) on
// the page root, so every page updates in place. Delete this file once the
// fonts are chosen and written into index.css.

interface FontOption {
  name: string;
  stack: string;
  query: string; // The Google Fonts family parameter, with weights it really has.
}

const headingFonts: FontOption[] = [
  { name: 'EB Garamond', stack: "'EB Garamond', Georgia, serif", query: 'EB+Garamond:wght@400;500;600' },
  { name: 'Cormorant Garamond', stack: "'Cormorant Garamond', Georgia, serif", query: 'Cormorant+Garamond:wght@500;600' },
  { name: 'Libre Caslon Text', stack: "'Libre Caslon Text', Georgia, serif", query: 'Libre+Caslon+Text:wght@400;700' },
  { name: 'Libre Baskerville', stack: "'Libre Baskerville', Georgia, serif", query: 'Libre+Baskerville:wght@400;700' },
  { name: 'Crimson Pro', stack: "'Crimson Pro', Georgia, serif", query: 'Crimson+Pro:wght@400;500;600' },
  { name: 'Source Serif 4', stack: "'Source Serif 4', Georgia, serif", query: 'Source+Serif+4:wght@400;500;600' },
  { name: 'Newsreader', stack: "'Newsreader', Georgia, serif", query: 'Newsreader:wght@400;500;600' },
  { name: 'Fraunces', stack: "'Fraunces', Georgia, serif", query: 'Fraunces:wght@400;500;600' },
];

const textFonts: FontOption[] = [
  { name: 'IBM Plex Sans', stack: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif", query: 'IBM+Plex+Sans:wght@400;500;600' },
  { name: 'Public Sans', stack: "'Public Sans', 'Helvetica Neue', Arial, sans-serif", query: 'Public+Sans:wght@400;500;600' },
  { name: 'Source Sans 3', stack: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif", query: 'Source+Sans+3:wght@400;500;600' },
  { name: 'Libre Franklin', stack: "'Libre Franklin', 'Helvetica Neue', Arial, sans-serif", query: 'Libre+Franklin:wght@400;500;600' },
  { name: 'Instrument Sans', stack: "'Instrument Sans', 'Helvetica Neue', Arial, sans-serif", query: 'Instrument+Sans:wght@400;500;600' },
  { name: 'Hanken Grotesk', stack: "'Hanken Grotesk', 'Helvetica Neue', Arial, sans-serif", query: 'Hanken+Grotesk:wght@400;500;600' },
  { name: 'Work Sans', stack: "'Work Sans', 'Helvetica Neue', Arial, sans-serif", query: 'Work+Sans:wght@400;500;600' },
  { name: 'Atkinson Hyperlegible', stack: "'Atkinson Hyperlegible', 'Helvetica Neue', Arial, sans-serif", query: 'Atkinson+Hyperlegible:wght@400;700' },
];

const SAME_AS_TEXT = 'Same as text';
const buttonFonts: FontOption[] = [
  { name: SAME_AS_TEXT, stack: 'var(--font-sans)', query: '' },
  ...textFonts,
  ...headingFonts,
];

interface Choice {
  heading: string;
  text: string;
  button: string;
}

const DEFAULT: Choice = { heading: 'EB Garamond', text: 'Atkinson Hyperlegible', button: SAME_AS_TEXT };
const STORAGE_KEY = 'font-lab';

function readChoice(): Choice {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<Choice> | null;
    return { ...DEFAULT, ...saved };
  } catch {
    return DEFAULT;
  }
}

function find(list: FontOption[], name: string): FontOption {
  return list.find((font) => font.name === name) ?? list[0];
}

// One stylesheet per family, so a family that fails to load cannot take the
// others down with it.
function loadFonts() {
  const all = [...headingFonts, ...textFonts];
  for (const font of all) {
    const id = `font-lab-${font.query}`;
    if (document.getElementById(id)) continue;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.query}&display=swap`;
    document.head.appendChild(link);
  }
}

export default function FontLab() {
  const [choice, setChoice] = useState<Choice>(readChoice);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(loadFonts, []);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--font-serif', find(headingFonts, choice.heading).stack);
    root.setProperty('--font-sans', find(textFonts, choice.text).stack);
    root.setProperty('--font-button', find(buttonFonts, choice.button).stack);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    } catch {
      // Storage can be blocked. The picker still works for this visit.
    }
  }, [choice]);

  const field = (label: string, key: keyof Choice, list: FontOption[]) => (
    <label className="grid gap-1">
      <span className="text-[12px] text-ink-500">{label}</span>
      <select
        value={choice[key]}
        onChange={(event) => setChoice((current) => ({ ...current, [key]: event.target.value }))}
        className="rounded border border-line-strong bg-white px-2 py-1.5 text-[13px] text-ink-900"
      >
        {list.map((font) => (
          <option key={font.name} value={font.name}>
            {font.name}
          </option>
        ))}
      </select>
    </label>
  );

  // The panel sets its own system font, so it never changes while you pick.
  return (
    <div
      className="fixed bottom-4 right-4 z-[60] w-[230px] rounded-lg border border-line-strong bg-white p-3 text-ink-900 shadow-lg"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">Fonts (local only)</p>
        <button type="button" onClick={() => setIsOpen((open) => !open)} className="text-[12px] text-blue-700 underline">
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      {isOpen ? (
        <div className="mt-2.5 grid gap-2.5">
          {field('Headings', 'heading', headingFonts)}
          {field('Text', 'text', textFonts)}
          {field('Buttons', 'button', buttonFonts)}
          <button type="button" onClick={() => setChoice(DEFAULT)} className="justify-self-start text-[12px] text-blue-700 underline">
            Back to current fonts
          </button>
        </div>
      ) : null}
    </div>
  );
}
