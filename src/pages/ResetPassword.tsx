import { useActionState, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { ErrorNote, DoneNote, PendingLabel } from '../components/ui/Status';
import { supabase } from '../lib/supabase';

// Two stages live on one page.
//
// 1. Request. A signed-out reader writes an email address. Supabase sends a
//    recovery link to that address.
// 2. Confirm. The reader opens the link. Supabase sends them back here with
//    the recovery tokens in the URL hash, and the form sets a new password.
//
// The global client has detectSessionInUrl false (see lib/supabase.ts), so
// this page reads the hash itself rather than let the client process it.

type Recovery =
  | { kind: 'tokens'; accessToken: string; refreshToken: string }
  | { kind: 'error'; message: string }
  | null;

function readRecovery(): Recovery {
  const raw = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!raw) return null;

  const params = new URLSearchParams(raw);

  // An expired or re-used link returns an error rather than tokens.
  const error = params.get('error_description') ?? params.get('error');
  if (error) {
    return { kind: 'error', message: error.replace(/\+/g, ' ') };
  }

  const type = params.get('type');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (type === 'recovery' && accessToken && refreshToken) {
    return { kind: 'tokens', accessToken, refreshToken };
  }

  return null;
}

interface RequestState {
  error: string | null;
  sent: boolean;
}

interface ConfirmState {
  error: string | null;
  done: boolean;
}

export function ResetPassword() {
  // Read the hash once. A later render must not re-read a cleaned address bar.
  const [recovery] = useState<Recovery>(readRecovery);
  const isConfirm = recovery !== null;

  const [sessionReady, setSessionReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(
    recovery?.kind === 'error' ? recovery.message : null,
  );

  // Turn the recovery tokens into a session so updateUser can set the password.
  useEffect(() => {
    if (recovery?.kind !== 'tokens') return;
    let ignore = false;

    supabase.auth
      .setSession({
        access_token: recovery.accessToken,
        refresh_token: recovery.refreshToken,
      })
      .then(({ error }) => {
        if (ignore) return;
        if (error) {
          setLinkError(error.message);
          return;
        }
        setSessionReady(true);
        // Take the tokens out of the address bar once they are in use.
        window.history.replaceState(null, '', window.location.pathname);
      });

    return () => {
      ignore = true;
    };
  }, [recovery]);

  const [reqState, reqSubmit, reqPending] = useActionState<RequestState, FormData>(
    async (_previous, form) => {
      const email = String(form.get('email') ?? '').trim();
      if (!email) {
        return { error: 'Write your email address.', sent: false };
      }

      // The link must return to this same page. BASE_URL carries any path
      // prefix and ends with a slash.
      const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) {
        return { error: error.message, sent: false };
      }
      return { error: null, sent: true };
    },
    { error: null, sent: false },
  );

  const [confState, confSubmit, confPending] = useActionState<ConfirmState, FormData>(
    async (_previous, form) => {
      const password = String(form.get('password') ?? '');
      const confirm = String(form.get('confirm') ?? '');

      if (password.length < 8) {
        return { error: 'Use a password of eight characters or more.', done: false };
      }
      if (password !== confirm) {
        return { error: 'The two passwords are different.', done: false };
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { error: error.message, done: false };
      }
      return { error: null, done: true };
    },
    { error: null, done: false },
  );

  return (
    <Layout
      pattern="login"
      title="Reset your password · Yale Impact Expo"
      description="Reset the password for your Yale Impact Expo portal account."
    >
      <PageHeader
        eyebrow="Portal"
        title={isConfirm ? 'Set a new password' : 'Reset your password'}
        meta={
          isConfirm
            ? 'Write a new password for your account. Then sign in with it.'
            : 'Write your email address. We send a link to it. The link opens a form for a new password.'
        }
      />

      <div className="mx-auto max-w-[1200px] px-4 pb-8 sm:px-6 md:px-10">
        <div className="haze px-5 py-8 sm:px-7 md:px-10 md:py-12">
          <Reveal>
            {isConfirm ? (
              <div className="max-w-[520px] border border-bar/25 p-6">
                {confState.done ? (
                  <DoneNote title="Password changed">
                    Your password is set. You are signed in now.{' '}
                    <Link
                      to="/portal"
                      className="border-b border-bar/45 pb-0.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar"
                    >
                      Go to the portal
                    </Link>
                    .
                  </DoneNote>
                ) : linkError ? (
                  <div className="grid gap-5">
                    <ErrorNote title="The link does not work">
                      {linkError}. A recovery link works one time and expires after an hour. Ask
                      for a new one.
                    </ErrorNote>
                    <a
                      href={`${import.meta.env.BASE_URL}reset-password`}
                      className="label text-ink-500 transition-colors duration-300 ease-out hover:text-ink-900"
                    >
                      Request a new link →
                    </a>
                  </div>
                ) : !sessionReady ? (
                  <PendingLabel>Checking the link</PendingLabel>
                ) : (
                  <form action={confSubmit} className="grid gap-5">
                    <Field label="New password" hint="Eight characters or more.">
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

                    <Field label="Confirm new password">
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

                    {confState.error ? <ErrorNote>{confState.error}</ErrorNote> : null}

                    <Button type="submit" isDisabled={confPending} className="w-full">
                      {confPending ? 'Setting the password' : 'Set new password'}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="max-w-[520px] border border-bar/25 p-6">
                  {reqState.sent ? (
                    <DoneNote title="Check your email">
                      If an account uses that address, a link is on the way. Open the link to set a
                      new password. The link expires after an hour.
                    </DoneNote>
                  ) : (
                    <form action={reqSubmit} className="grid gap-5">
                      <Field label="Email">
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

                      {reqState.error ? <ErrorNote>{reqState.error}</ErrorNote> : null}

                      <Button type="submit" isDisabled={reqPending} className="w-full">
                        {reqPending ? 'Sending the link' : 'Send reset link'}
                      </Button>
                    </form>
                  )}
                </div>

                <p className="mt-6 max-w-[62ch] text-sm leading-[1.6] text-ink-500">
                  Remembered it?{' '}
                  <Link
                    to="/login"
                    className="border-b border-bar/45 pb-0.5 text-ink-900 transition-colors duration-300 ease-out hover:border-bar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                  >
                    Log in
                  </Link>
                  .
                </p>
              </>
            )}
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
