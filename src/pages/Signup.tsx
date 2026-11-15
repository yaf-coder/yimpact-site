import { useActionState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { ErrorNote } from '../components/ui/Status';
import { useAuth } from '../auth/useAuth';
import { allowedDomainMessage, hasAllowedDomain } from '../lib/email';

interface SignupState {
  error: string | null;
}

export function Signup() {
  const { status, signUp } = useAuth();

  const [state, submit, isPending] = useActionState<SignupState, FormData>(
    async (_previous, form) => {
      const email = String(form.get('email') ?? '').trim();
      const password = String(form.get('password') ?? '');
      const confirm = String(form.get('confirm') ?? '');

      // The hook in the database is the real gate. This check runs first so
      // that the reader gets a clear message.
      if (!hasAllowedDomain(email)) {
        return { error: allowedDomainMessage };
      }
      if (password.length < 8) {
        return { error: 'Use a password of eight characters or more.' };
      }
      if (password !== confirm) {
        return { error: 'The two passwords are different.' };
      }

      return signUp(email, password, {
        fullName: String(form.get('full_name') ?? '').trim(),
        school: String(form.get('school') ?? '').trim(),
        program: String(form.get('program') ?? '').trim(),
        gradYear: String(form.get('grad_year') ?? '').trim(),
      });
    },
    { error: null },
  );

  if (status === 'signedIn') {
    return <Navigate to="/portal" replace />;
  }

  return (
    <Layout
      title="Register · Yale Impact Expo"
      description="Register for the Yale Impact Expo with your Yale email address."
    >
      <PageHeader title="Register" lede="Free for every Yale student. You do not need a team or a prototype." />

      <div className="wrap pb-20 pt-10">
            <form action={submit} className="max-w-[460px] rounded-lg border border-line-strong p-[26px]">
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

                <Field label="School">
                  {({ id, describedBy }) => (
                    <Input id={id} name="school" aria-describedby={describedBy} />
                  )}
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Programme">
                    {({ id, describedBy }) => (
                      <Input id={id} name="program" aria-describedby={describedBy} />
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
                        placeholder="2028"
                      />
                    )}
                  </Field>
                </div>

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
                  {isPending ? 'Creating the account' : 'Create account'}
                </Button>
              </div>
            </form>

            <p className="mt-5 text-ink-500">
              Already registered?{' '}
              <Link to="/login" className="text-blue-700 underline">
                Log in
              </Link>
              .
            </p>
      </div>
    </Layout>
  );
}
