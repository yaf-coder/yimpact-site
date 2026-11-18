import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { allowedDomainMessage, hasAllowedDomain } from '../lib/email';
import { uploadResume } from '../lib/application';
import type { ProfileEdit, ProfileRow } from '../types/db';
import { AuthContext } from './context';
import type {
  AuthStatus,
  AuthValue,
  ProfileStatus,
  SignUpFields,
  SignUpResult,
} from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('loading');

  // The session effect. Do not await a Supabase call inside the callback.
  // The client holds a lock during that callback and an await deadlocks it.
  useEffect(() => {
    let ignore = false;

    supabase.auth.getSession().then(({ data }) => {
      if (ignore) return;
      setSession(data.session);
      setStatus(data.session ? 'signedIn' : 'signedOut');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setStatus(next ? 'signedIn' : 'signedOut');
    });

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id ?? null;

  // The profile effect. A slow answer must not replace a newer one, so the
  // cleanup sets the ignore flag.
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setProfileStatus('loading');
      return;
    }

    let ignore = false;
    setProfileStatus('loading');

    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (ignore) return;
        const row = (data as ProfileRow | null) ?? null;
        setProfile(row);
        setProfileStatus(row ? 'ready' : 'missing');
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    // The token carries a stale role and status until it refreshes. Ask for a
    // new token first, then read the row.
    await supabase.auth.refreshSession();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    const row = (data as ProfileRow | null) ?? null;
    setProfile(row);
    setProfileStatus(row ? 'ready' : 'missing');
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fields: SignUpFields): Promise<SignUpResult> => {
      if (!hasAllowedDomain(email)) {
        return { error: allowedDomainMessage, needsConfirmation: false, resumeError: null };
      }

      // These fields go to user_metadata. The signup trigger copies them into
      // the profile row once. The role never comes from here.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fields.fullName,
            school: fields.school,
            program: fields.program,
            grad_year: fields.gradYear,
            bio: fields.bio,
          },
        },
      });
      if (error) return { error: error.message, needsConfirmation: false, resumeError: null };

      // Without a session, storage refuses the upload. The portal asks for the
      // resume after the first sign-in.
      const user = data.user;
      if (!data.session || !user) {
        return { error: null, needsConfirmation: true, resumeError: null };
      }

      const upload = await uploadResume(user.id, fields.resume);
      if (upload.error || !upload.path) {
        return { error: null, needsConfirmation: false, resumeError: upload.error };
      }

      const { data: row, error: saveError } = await supabase
        .from('profiles')
        .update({ resume_path: upload.path })
        .eq('id', user.id)
        .select()
        .maybeSingle();
      if (saveError) {
        return { error: null, needsConfirmation: false, resumeError: saveError.message };
      }
      if (row) {
        setProfile(row as ProfileRow);
        setProfileStatus('ready');
      }
      return { error: null, needsConfirmation: false, resumeError: null };
    },
    [],
  );

  const resubmitApplication = useCallback(async () => {
    const { error } = await supabase.rpc('resubmit_application');
    if (error) return { error: error.message };
    await refreshProfile();
    return { error: null };
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const saveProfile = useCallback(
    async (edit: ProfileEdit) => {
      if (!userId) return { error: 'You are not signed in.' };

      const { data, error } = await supabase
        .from('profiles')
        .update(edit)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) return { error: error.message };
      setProfile((data as ProfileRow | null) ?? null);
      return { error: null };
    },
    [userId],
  );

  const value = useMemo<AuthValue>(() => {
    const role = profile?.role ?? null;
    const isApprovedMember =
      role === 'admin' ||
      ((role === 'student' || role === 'sponsor') && profile?.status === 'approved');

    return {
      status,
      session,
      profile,
      profileStatus,
      role,
      isApprovedMember: Boolean(isApprovedMember),
      signIn,
      signUp,
      signOut,
      saveProfile,
      refreshProfile,
      resubmitApplication,
    };
  }, [
    status,
    session,
    profile,
    profileStatus,
    signIn,
    signUp,
    signOut,
    saveProfile,
    refreshProfile,
    resubmitApplication,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
