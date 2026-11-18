import { supabase } from './supabase';
import type { ProfileRow } from '../types/db';
import { isYaleSchool } from '../content/schools';

// The range of the graduation year field. The database permits 2020 to 2040.
export const minGradYear = new Date().getFullYear();
export const maxGradYear = minGradYear + 7;

export const resumeMaxBytes = 5 * 1024 * 1024;

// The same rule as app.application_complete in migration 0015. The database
// is the real gate. This copy tells the student what is missing.
export function missingFields(profile: ProfileRow): string[] {
  const missing: string[] = [];
  if (!profile.full_name.trim()) missing.push('full name');
  if (!profile.school) missing.push('school');
  if (!profile.program?.trim()) missing.push('programme');
  if (!profile.grad_year) missing.push('graduation year');
  if (!profile.bio?.trim()) missing.push('about you');
  if (!profile.resume_path) missing.push('resume');
  return missing;
}

// Returns an error message, or null for a good file. An empty file input
// gives a File with size 0, so treat that as no file.
export function checkResume(file: File | null): string | null {
  if (!file || file.size === 0) return 'Upload your resume as a PDF.';
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) return 'The resume must be a PDF.';
  if (file.size > resumeMaxBytes) return 'The resume must be 5 MB or less.';
  return null;
}

export function readResumeFile(form: FormData): File | null {
  const value = form.get('resume');
  return value instanceof File && value.size > 0 ? value : null;
}

// Each upload gets a new path. The bucket has no update policy, so an old
// file stays and each decision snapshot keeps the file the admin saw.
export async function uploadResume(
  userId: string,
  file: File,
): Promise<{ path: string | null; error: string | null }> {
  const path = `${userId}/${Date.now()}.pdf`;
  const { error } = await supabase.storage
    .from('resumes')
    .upload(path, file, { contentType: 'application/pdf', upsert: false });
  if (error) return { path: null, error: error.message };
  return { path, error: null };
}

// Open a resume in a new tab. The bucket is private, so the link is signed
// and stops after one minute.
//
// Open the tab before the await. A browser blocks a tab that opens after an
// await, because the click is no longer the cause.
export async function openResume(path: string): Promise<{ error: string | null }> {
  const tab = window.open('', '_blank');
  const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 60);
  if (error || !data) {
    tab?.close();
    return { error: error?.message ?? 'The resume did not open.' };
  }
  if (tab) {
    tab.opener = null;
    tab.location.href = data.signedUrl;
  } else {
    window.location.href = data.signedUrl;
  }
  return { error: null };
}

// Read the four fields from a submitted form. Returns an error message when a
// value is not good.
export function readApplicationFields(form: FormData):
  | { error: string }
  | { error: null; school: string; program: string; gradYear: number; bio: string } {
  const school = String(form.get('school') ?? '').trim();
  const program = String(form.get('program') ?? '').trim();
  const year = Number(String(form.get('grad_year') ?? '').trim());
  const bio = String(form.get('bio') ?? '').trim();

  if (!isYaleSchool(school)) return { error: 'Select your school.' };
  if (!program) return { error: 'Write your degree programme or major.' };
  if (!Number.isInteger(year) || year < minGradYear || year > maxGradYear) {
    return { error: `Write a graduation year from ${minGradYear} to ${maxGradYear}.` };
  }
  if (!bio) return { error: 'Write a few sentences about you.' };

  return { error: null, school, program, gradYear: year, bio };
}
