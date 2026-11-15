import { useActionState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Field } from '../../components/ui/Field';
import { Input, Textarea } from '../../components/ui/Input';
import { DoneNote, ErrorNote } from '../../components/ui/Status';
import { PortalNav } from '../../components/portal/PortalNav';
import { useAuth } from '../../auth/useAuth';

interface SaveState {
  error: string | null;
  // The moment of the last good save. It is also the form key.
  savedAt: number;
}

export function StudentProfile() {
  const { profile, saveProfile, isApprovedMember } = useAuth();

  const [state, submit, isPending] = useActionState<SaveState, FormData>(
    async (_previous, form) => {
      const year = String(form.get('grad_year') ?? '').replace(/\D/g, '');

      const { error } = await saveProfile({
        full_name: String(form.get('full_name') ?? '').trim(),
        school: String(form.get('school') ?? '').trim() || null,
        program: String(form.get('program') ?? '').trim() || null,
        grad_year: year ? Number(year) : null,
        bio: String(form.get('bio') ?? '').trim() || null,
        linkedin_url: String(form.get('linkedin_url') ?? '').trim() || null,
        portfolio_url: String(form.get('portfolio_url') ?? '').trim() || null,
      });

      return { error, savedAt: error ? 0 : Date.now() };
    },
    { error: null, savedAt: 0 },
  );

  if (!profile) return null;

  return (
    <Layout
      title="Profile · Yale Impact Expo"
      description="Edit your Yale Impact Expo student profile."
    >
      <PortalNav />
      <PageHeader title="Your profile" lede="The team uses this to match teams, mentors and partners." />

      <div className="wrap pt-8">
        {isApprovedMember ? (
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Approved</Badge>
            <p className="text-sm leading-[1.6] text-ink-500">
              You can read every access detail on the resources page.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Pending approval</Badge>
            <p className="text-sm leading-[1.6] text-ink-500">
              The team reviews your registration. The resource access details open once they approve
              it.
            </p>
          </div>
        )}
      </div>

      <form action={submit} key={state.savedAt}>
        <Section className="mt-8">
          <div className="grid max-w-[620px] gap-5">
            <Field label="Full name">
              {({ id }) => (
                <Input id={id} name="full_name" defaultValue={profile.full_name} required />
              )}
            </Field>

            <Field label="School" hint="Example: Yale College, or School of Management.">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  name="school"
                  defaultValue={profile.school ?? ''}
                  aria-describedby={describedBy}
                />
              )}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Programme">
                {({ id }) => (
                  <Input id={id} name="program" defaultValue={profile.program ?? ''} />
                )}
              </Field>

              <Field label="Graduation year">
                {({ id }) => (
                  <Input
                    id={id}
                    name="grad_year"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    defaultValue={profile.grad_year ?? ''}
                  />
                )}
              </Field>
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid max-w-[620px] gap-5">
            <Field
              label="About you"
              hint="Two or three sentences. The problem you care about is more useful than a list of courses."
            >
              {({ id, describedBy }) => (
                <Textarea
                  id={id}
                  name="bio"
                  rows={5}
                  defaultValue={profile.bio ?? ''}
                  aria-describedby={describedBy}
                />
              )}
            </Field>

            <Field label="LinkedIn">
              {({ id }) => (
                <Input
                  id={id}
                  name="linkedin_url"
                  type="url"
                  placeholder="https://www.linkedin.com/in/"
                  defaultValue={profile.linkedin_url ?? ''}
                />
              )}
            </Field>

            <Field label="Portfolio or website">
              {({ id }) => (
                <Input
                  id={id}
                  name="portfolio_url"
                  type="url"
                  placeholder="https://"
                  defaultValue={profile.portfolio_url ?? ''}
                />
              )}
            </Field>

            {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}
            {state.savedAt > 0 && !state.error ? (
              <DoneNote>Your profile is up to date.</DoneNote>
            ) : null}

            <div>
              <Button type="submit" isDisabled={isPending}>
                {isPending ? 'Saving' : 'Save profile'}
              </Button>
            </div>
          </div>
        </Section>
      </form>
    </Layout>
  );
}
