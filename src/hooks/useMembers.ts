import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ApplicationDecisionRow, ProfileRow } from '../types/db';
import type { LoadStatus } from './usePosts';

// Every profile, and the decision history of each student. Only an admin gets
// more than their own row back, and only an admin reads a decision.
export function useMembers() {
  const [members, setMembers] = useState<ProfileRow[]>([]);
  const [decisions, setDecisions] = useState<Map<string, ApplicationDecisionRow[]>>(new Map());
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let ignore = false;
    // Show the old list during a reload. The wait label is for the first load.
    if (attempt === 0) setStatus('loading');

    Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase
        .from('application_decisions')
        .select('*')
        .order('decided_at', { ascending: false }),
    ]).then(([profiles, history]) => {
      if (ignore) return;
      if (profiles.error || history.error) {
        setStatus('error');
        return;
      }

      // The rows arrive newest first, so each list is newest first.
      const byProfile = new Map<string, ApplicationDecisionRow[]>();
      for (const row of history.data as ApplicationDecisionRow[]) {
        const list = byProfile.get(row.profile_id) ?? [];
        list.push(row);
        byProfile.set(row.profile_id, list);
      }

      setMembers(profiles.data as ProfileRow[]);
      setDecisions(byProfile);
      setStatus('ready');
    });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  // approve_member checks the caller. A student who calls it gets error 42501.
  // It also refuses to approve an incomplete application.
  const decide = useCallback(
    async (userId: string, approve: boolean): Promise<{ error: string | null }> => {
      const { error } = await supabase.rpc('approve_member', {
        p_user_id: userId,
        p_approve: approve,
      });
      if (error) return { error: error.message };
      reload();
      return { error: null };
    },
    [reload],
  );

  return { members, decisions, status, decide, reload };
}
