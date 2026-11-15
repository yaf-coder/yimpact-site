import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { domainLabels } from '../content/sponsors';
import type { Placement } from './SponsorField';
import type { NewSponsor } from '../admin/sponsorStore';

interface AddSponsorDialogProps {
  placement: Placement;
  onImpactChange: (impact: number) => void;
  onClose: () => void;
  onAdd: (entry: NewSponsor) => Promise<{ error: string | null }>;
}

const MAX_LOGO_BYTES = 400 * 1024;

// The domain and the size range both come from where the organizer dropped the
// bubble. The slider cannot leave that range, which is what guarantees the
// field keeps its "higher means larger" order.
export function AddSponsorDialog({ placement, onImpactChange, onClose, onAdd }: AddSponsorDialogProps) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [impact, setImpact] = useState(placement.impact);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isPinned = placement.maxImpact <= placement.minImpact;

  function handleImpact(next: number) {
    setImpact(next);
    onImpactChange(next);
  }

  async function handleSubmit(submitEvent: FormEvent) {
    submitEvent.preventDefault();
    setError(null);

    const file = fileRef.current?.files?.[0];
    if (!name.trim()) {
      setError('Give the partner a name.');
      return;
    }
    if (!file) {
      setError('Choose a logo file.');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError('That logo is over 400 KB. Choose a smaller SVG or PNG.');
      return;
    }

    // Guard here rather than on the button. Enter submits without a click.
    if (isSaving) return;
    setIsSaving(true);
    const result = await onAdd({
      name: name.trim(),
      domain: placement.domain,
      impact,
      logoFile: file,
      websiteUrl: websiteUrl.trim() || undefined,
    });
    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 p-4 py-16">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-sponsor-heading"
        className="w-full max-w-[440px] overflow-hidden rounded-lg border border-line-strong bg-white"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="add-sponsor-heading" className="label text-ink-900">
            Add a partner
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="label text-ink-400 transition-colors duration-300 ease-out hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="border border-line bg-ink-50 px-4 py-3">
            <p className="label text-ink-400">Dropped in</p>
            <p className="mt-1 text-sm font-medium tracking-[-0.025em] text-ink-900">
              {domainLabels[placement.domain]}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              That position allows an impact between {placement.minImpact} and {placement.maxImpact}.
            </p>
          </div>

          <div>
            <label htmlFor="sponsor-name" className="label block text-ink-400">
              Name
            </label>
            <input
              id="sponsor-name"
              type="text"
              value={name}
              onChange={(changeEvent) => setName(changeEvent.target.value)}
              className="mt-2 w-full rounded-md border border-line-strong px-3 py-2.5 text-sm text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-700"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="sponsor-impact" className="label block text-ink-400">
                Bubble size
              </label>
              <span className="label text-ink-500">{impact}</span>
            </div>
            <input
              id="sponsor-impact"
              type="range"
              min={placement.minImpact}
              max={placement.maxImpact}
              step={1}
              value={impact}
              disabled={isPinned}
              onChange={(changeEvent) => handleImpact(Number(changeEvent.target.value))}
              className="mt-3 w-full accent-blue-700 disabled:opacity-40"
            />
            <p className="mt-1.5 text-xs text-ink-400">
              {isPinned
                ? 'The neighbours above and below leave only one size at this position. Drop it elsewhere for more room.'
                : `Bounded by the partners either side of the drop, so a bubble above this one is never smaller.`}
            </p>
          </div>

          <div>
            <label htmlFor="sponsor-logo" className="label block text-ink-400">
              Logo file
            </label>
            <input
              id="sponsor-logo"
              ref={fileRef}
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp"
              className="mt-2 w-full rounded-md border border-line-strong px-3 py-2.5 text-sm text-ink-700 file:mr-3 file:border-0 file:bg-ink-100 file:px-3 file:py-1.5 file:text-xs file:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-700"
            />
            <p className="mt-1.5 text-xs text-ink-400">SVG or PNG, under 400 KB. Square logos sit best in a bubble.</p>
          </div>

          <div>
            <label htmlFor="sponsor-site" className="label block text-ink-400">
              Website (optional)
            </label>
            <input
              id="sponsor-site"
              type="url"
              value={websiteUrl}
              placeholder="https://"
              onChange={(changeEvent) => setWebsiteUrl(changeEvent.target.value)}
              className="mt-2 w-full rounded-md border border-line-strong px-3 py-2.5 text-sm text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-700"
            />
          </div>

          {error ? (
            <p role="alert" className="border border-line-strong bg-ink-50 px-3 py-2 text-xs text-ink-900">
              {error}
            </p>
          ) : null}

          <p className="text-xs leading-[1.55] text-ink-400">
            Saved in this browser only. Nothing is published until the team wires this to a server.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-[4px] bg-blue-700 px-5 py-3 text-sm font-medium text-white transition-colors duration-300 ease-out hover:bg-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-bar/25 disabled:text-ink-500"
            >
              {isSaving ? 'Adding' : 'Add partner'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[4px] border border-line-strong px-5 py-3 text-sm font-medium text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
