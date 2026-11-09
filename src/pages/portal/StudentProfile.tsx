import { startTransition, useActionState, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Input } from '../../components/ui/Input';
import { DoneNote, ErrorNote } from '../../components/ui/Status';
import { ApplicationFields, ResumeInput } from '../../components/ApplicationFields';
import { PortalNav } from '../../components/portal/PortalNav';
import { useAuth } from '../../auth/useAuth';
import {
  checkResume,
  missingFields,
  openResume,
  readApplicationFields,
  readResumeFile,
  uploadResume,
} from '../../lib/application';
import type { ProfileRow } from '../../types/db';

interface SaveState {
  error: string | null;
  // The moment of the last good save. It is also the form key.
  savedAt: number;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function StudentProfile() {
  const { profile, saveProfile } = useAuth();

  const [state, submit, isPending] = useActionState<SaveState, FormData>(
    async (previous, form) => {
      if (!profile) return previous;
      const fail = (error: string) => ({ error, savedAt: previous.savedAt });

      const fullName = String(form.get('full_name') ?? '').trim();
      if (!fullName) return fail('Write your full name.');

      const fields = readApplicationFields(form);
      if (fields.error !== null) return fail(fields.error);

      // A new file is optional when a resume is already on file.
      const file = readResumeFile(form);
      let resumePath: string | undefined;
      if (file) {
        const fileError = checkResume(file);
        if (fileError) return fail(fileError);
        const upload = await uploadResume(profile.id, file);
        if (upload.error || !upload.path) return fail(upload.error ?? 'The resume did not upload.');
        resumePath = upload.path;
      } else if (!profile.resume_path) {
        return fail('Upload your resume as a PDF.');
      }

      const { error } = await saveProfile({
        full_name: fullName,
        school: fields.school,
        program: fields.program,
        grad_year: fields.gradYear,
        bio: fields.bio,
        linkedin_url: String(form.get('linkedin_url') ?? '').trim() || null,
        portfolio_url: String(form.get('portfolio_url') ?? '').trim() || null,
        ...(resumePath ? { resume_path: resumePath } : {}),
      });

      return error ? fail(error) : { error: null, savedAt: Date.now() };
    },
    { error: null, savedAt: 0 },
  );

  // A form `action` clears every field after it runs. This handler keeps the
  // values when the save fails.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(() => submit(form));
  }

  if (!profile) return null;

  return (
    <Layout
      pattern="students"
      title="Application · Yale Impact Expo"
      description="Your Yale Impact Expo student application."
    >
      <PortalNav />
      <PageHeader
        eyebrow="Portal"
        title="Your application"
        meta="The team reads this when they review your application, and later when they match teams, mentors, and partner introductions."
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-8 md:px-10">
        <ApplicationStatus profile={profile} />
      </div>

      <form onSubmit={handleSubmit} key={state.savedAt}>
        <Section index="01" eyebrow="School">
          <div className="grid max-w-[620px] gap-5">
            <Field label="Full name">
              {({ id }) => (
                <Input id={id} name="full_name" defaultValue={profile.full_name} required />
              )}
            </Field>

            <ApplicationFields
              school={profile.school}
              program={profile.program}
              gradYear={profile.grad_year}
              bio={profile.bio}
            />
          </div>
        </Section>

        <Section index="02" eyebrow="Resume and links">
          <div className="grid max-w-[620px] gap-5">
            {profile.resume_path ? <CurrentResume path={profile.resume_path} /> : null}

            <ResumeInput
              required={!profile.resume_path}
              hint={
                profile.resume_path
                  ? 'Optional. Upload a new PDF of 5 MB or less to replace the one on file.'
                  : 'Required. A PDF of 5 MB or less.'
              }
            />

            <Field label="LinkedIn" hint="Optional.">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  name="linkedin_url"
                  type="url"
                  placeholder="https://www.linkedin.com/in/"
                  defaultValue={profile.linkedin_url ?? ''}
                  aria-describedby={describedBy}
                />
              )}
            </Field>

            <Field label="Portfolio or website" hint="Optional.">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  name="portfolio_url"
                  type="url"
                  placeholder="https://"
                  defaultValue={profile.portfolio_url ?? ''}
                  aria-describedby={describedBy}
                />
              )}
            </Field>

            {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}
            {state.savedAt > 0 && !state.error ? (
              <DoneNote>Your application is up to date.</DoneNote>
            ) : null}

            <div>
              <Button type="submit" isDisabled={isPending}>
                {isPending ? 'Saving' : 'Save application'}
              </Button>
            </div>
          </div>
        </Section>
      </form>
    </Layout>
  );
}

// The status box at the top of the page. It reads the profile row, so it
// changes as soon as the row changes.
function ApplicationStatus({ profile }: { profile: ProfileRow }) {
  const { resubmitApplication } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const missing = missingFields(profile);

  async function handleResubmit() {
    setIsBusy(true);
    const result = await resubmitApplication();
    setIsBusy(false);
    setError(result.error);
  }

  if (profile.status === 'approved') {
    return (
      <StatusBox title="Approved" tone="done">
        Welcome to the Expo. You can read every access detail on the resources page.
      </StatusBox>
    );
  }

  if (profile.status === 'rejected') {
    return (
      <StatusBox title="Not approved">
        The team did not approve this application. You can update it below, save, and send it
        again. The team will review it as a new application.
        {missing.length > 0 ? (
          <span className="mt-2 block">
            Before you send it again, complete: {missing.join(', ')}.
          </span>
        ) : null}
        <span className="mt-4 block">
          <Button
            variant="secondary"
            onClick={handleResubmit}
            isDisabled={isBusy || missing.length > 0}
          >
            {isBusy ? 'Sending' : 'Send application again'}
          </Button>
        </span>
        {error ? <span className="mt-2 block text-ink-900">{error}</span> : null}
      </StatusBox>
    );
  }

  if (missing.length > 0) {
    return (
      <StatusBox title="Application incomplete">
        The team reviews only complete applications. Complete these fields and save: {missing.join(', ')}.
      </StatusBox>
    );
  }

  return (
    <StatusBox title="Under review" tone="done">
      {profile.submitted_at
        ? `Your application is complete. It reached the team on ${dateFormatter.format(new Date(profile.submitted_at))}.`
        : 'Your application is complete.'}{' '}
      The team will review it and your status will change here. You can still edit it below.
    </StatusBox>
  );
}

function StatusBox({
  title,
  tone = 'plain',
  children,
}: {
  title: string;
  tone?: 'plain' | 'done';
  children: ReactNode;
}) {
  const box = tone === 'done' ? 'border-blue-500 bg-blue-50' : 'border-bar bg-ink-50/70';
  const label = tone === 'done' ? 'text-blue-700' : 'text-ink-900';
  return (
    <div className={`max-w-[620px] border-l-2 p-4 ${box}`} role="status">
      <p className={`label ${label}`}>{title}</p>
      <div className="mt-2 max-w-[62ch] text-sm leading-[1.6] text-ink-700">{children}</div>
    </div>
  );
}

function CurrentResume({ path }: { path: string }) {
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    const result = await openResume(path);
    setError(result.error);
  }

  return (
    <div>
      <p className="label text-ink-400">Resume on file</p>
      <button
        type="button"
        onClick={handleOpen}
        className="mt-2 border-b border-bar/45 pb-0.5 text-sm text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
      >
        Open your resume
      </button>
      {error ? <p className="mt-2 text-xs text-ink-900">{error}</p> : null}
    </div>
  );
}
