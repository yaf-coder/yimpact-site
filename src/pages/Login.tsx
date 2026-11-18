import { useActionState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { ErrorNote } from '../components/ui/Status';
import { useAuth } from '../auth/useAuth';
import { event } from '../content/event';

interface LoginState {
  error: string | null;
}

export function Login() {
  const { status, signIn } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [state, submit, isPending] = useActionState<LoginState, FormData>(
    async (_previous, form) => {
      const email = String(form.get('email') ?? '').trim();
      const password = String(form.get('password') ?? '');

      if (!email || !password) {
        return { error: 'Write your email address and your password.' };
      }

      return signIn(email, password);
    },
    { error: null },
  );

  // The role decides the destination. PortalIndex reads it and redirects.
  if (status === 'signedIn') {
    return <Navigate to={from ?? '/portal'} replace />;
  }

  return (
    <Layout
      title="Log in · Yale Impact Expo"
      description="Sign in to the Yale Impact Expo student, partner, and organizer portal."
    >
      <PageHeader title="Log in" />

      <div className="wrap pb-20 pt-10">
        <form action={submit} className="grid max-w-[460px] gap-[18px] rounded-lg border border-line-strong p-[26px]">
          <Field label="Email">
            {({ id, describedBy }) => (
              <Input id={id} name="email" type="email" autoComplete="email" required aria-describedby={describedBy} />
            )}
          </Field>

          <Field label="Password">
            {({ id, describedBy }) => (
              <Input
                id={id}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-describedby={describedBy}
              />
            )}
          </Field>

          {state.error ? <ErrorNote>{state.error}</ErrorNote> : null}

          <Button type="submit" isDisabled={isPending} className="w-full">
            {isPending ? 'Logging in' : 'Log in'}
          </Button>
        </form>

        <p className="mt-5 text-ink-500">
          New here?{' '}
          <Link to="/signup" className="text-blue-700 underline">
            Apply with your Yale email
          </Link>
          .
        </p>
        <p className="mt-2 text-ink-500">
          Partners get an account from the team. Write to{' '}
          <span className="select-all text-blue-700">{event.sponsorEmail}</span> if you need one.
        </p>
      </div>
    </Layout>
  );
}
