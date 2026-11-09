import { startTransition, useActionState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { DoneNote, ErrorNote } from '../components/ui/Status';
import { ApplicationFields, ResumeInput } from '../components/ApplicationFields';
import { useAuth } from '../auth/useAuth';
import { allowedDomainMessage, hasAllowedDomain } from '../lib/email';
import { checkResume, readApplicationFields, readResumeFile } from '../lib/application';

interface SignupState {
  error: string | null;
  needsConfirmation: boolean;
}

export function Signup() {
  const { status, signUp } = useAuth();

  const [state, submit, isPending] = useActionState<SignupState, FormData>(
    async (_previous, form) => {
      const email = String(form.get('email') ?? '').trim();
      const password = String(form.get('password') ?? '');
      const confirm = String(form.get('confirm') ?? '');
      const fullName = String(form.get('full_name') ?? '').trim();
      const resume = readResumeFile(form);
      const fail = (error: string) => ({ error, needsConfirmation: false });

      // The hook in the database is the real gate. This check runs first so
      // that the reader gets a clear message.
      if (!hasAllowedDomain(email)) return fail(allowedDomainMessage);
      if (!fullName) return fail('Write your full name.');

      const fields = readApplicationFields(form);
      if (fields.error !== null) return fail(fields.error);

      const resumeError = checkResume(resume);
      if (resumeError || !resume) return fail(resumeError ?? 'Upload your resume as a PDF.');

      if (password.length < 8) return fail('Use a password of eight characters or more.');
      if (password !== confirm) return fail('The two passwords are different.');

      const result = await signUp(email, password, {
        fullName,
        school: fields.school,
        program: fields.program,
        gradYear: String(fields.gradYear),
        bio: fields.bio,
        resume,
      });
      if (result.error) return fail(result.error);

      // A failed upload leaves a good account. The portal shows the
      // application as incomplete and asks for the resume again.
      return { error: null, needsConfirmation: result.needsConfirmation };
    },
    { error: null, needsConfirmation: false },
  );

  // A form `action` clears every field after it runs. This handler keeps the
  // values, so an error does not lose a long application.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(() => submit(form));
  }

  // Wait for the action to finish. The resume upload runs after the session
  // starts, and a redirect before then hides an error.
  if (status === 'signedIn' && !isPending) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <Layout
      pattern="students"
      title="Apply · Yale Impact Expo"
      description="Apply to the Yale Impact Expo with your Yale email address."
    >
      <PageHeader
        eyebrow="Students"
        title="Apply"
        meta="Open to every Yale student, in every school and every year. Free to take part. You do not need a team, a prototype, or a prior connection to a lab."
      />

      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
          <Reveal>
            <div className="mb-8 max-w-[620px] border-l-2 border-bar/45 bg-ink-50/70 p-4">
              <p className="label text-ink-900">This is an application</p>
              <p className="mt-2 max-w-[62ch] text-sm leading-[1.6] text-ink-700">
                Submitting this form creates your account, but it does not approve you. The team
                reviews every application. Only complete applications are considered, which means
                every field below plus your resume. You can follow your status in the portal.
              </p>
            </div>

            {state.needsConfirmation ? (
              <DoneNote title="Application received" className="max-w-[620px]">
                Check your inbox and confirm your email address. Then log in and upload your resume
                in the portal. The team cannot review your application until it is complete.
              </DoneNote>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-[620px] border border-bar/25 p-6">
                <div className="grid gap-5">
                  <Field label="Full name">
                    {({ id }) => (
                      <Input id={id} name="full_name" autoComplete="name" required />
                    )}
                  </Field>

                  <Field label="Yale email" hint="Use your yale.edu address.">
                    {({ id, describedBy }) => (
                      <Input
                        id={id}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        aria-describedby={describedBy}
                      />
                    )}
                  </Field>

                  <ApplicationFields />

                  <ResumeInput required />

                  <Field label="Password" hint="Eight characters or more.">
                    {({ id, describedBy }) => (
                      <Input
                        id={id}
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        aria-describedby={describedBy}
                      />
                    )}
                  </Field>

                  <Field label="Confirm password">
                    {({ id }) => (
                      <Input
                        id={id}
                        name="confirm"
                        type="password"
                        autoComplete="new-password"
                        required
                      />
                    )}
                  </Field>

                  {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}

                  <Button type="submit" isDisabled={isPending} className="w-full">
                    {isPending ? 'Submitting your application' : 'Submit application'}
                  </Button>
                </div>
              </form>
            )}

            <p className="mt-6 max-w-[62ch] text-sm leading-[1.6] text-ink-500">
              You can edit your application later in the portal. Already applied?{' '}
              <Link
                to="/login"
                className="border-b border-bar/45 pb-0.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Log in
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
