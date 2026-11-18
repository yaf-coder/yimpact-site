import { createContext } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ProfileEdit, ProfileRow, UserRole } from '../types/db';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

// A signed-in account normally has one profile row. The row is missing when
// the account was made before the signup trigger existed. The portal must say
// so rather than wait for a row that never arrives.
export type ProfileStatus = 'loading' | 'ready' | 'missing';

export interface SignUpFields {
  fullName: string;
  school: string;
  program: string;
  gradYear: string;
  bio: string;
  resume: File;
}

export interface SignUpResult {
  error: string | null;
  // True when the project asks for email confirmation. Then signup gives no
  // session, and the resume upload waits for the first sign-in.
  needsConfirmation: boolean;
  // The account exists, but the resume did not upload.
  resumeError: string | null;
}

export interface AuthValue {
  status: AuthStatus;
  session: Session | null;
  profile: ProfileRow | null;
  profileStatus: ProfileStatus;
  role: UserRole | null;
  // True for an admin, or for an approved student or sponsor. This mirrors
  // app.is_approved_member in the database, but it controls the interface
  // only. Row Level Security is the real boundary.
  isApprovedMember: boolean;
  signIn(email: string, password: string): Promise<{ error: string | null }>;
  signUp(
    email: string,
    password: string,
    fields: SignUpFields,
  ): Promise<SignUpResult>;
  signOut(): Promise<void>;
  saveProfile(edit: ProfileEdit): Promise<{ error: string | null }>;
  refreshProfile(): Promise<void>;
  // Send a rejected application again. The status goes back to pending.
  resubmitApplication(): Promise<{ error: string | null }>;
}

export const AuthContext = createContext<AuthValue | null>(null);
