// The allowed signup domains. The database holds the same list in
// allowed_domains, and the before-user-created hook is the real gate. This
// copy exists so that the reader gets a clear message before the request runs.
const allowedDomains = ['yale.edu'];

// Compare the end of the domain. Do not compare the full domain.
// sm.yale.edu and som.yale.edu are real domains.
export function hasAllowedDomain(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at < 1) return false;

  const domain = email.slice(at + 1).toLowerCase().trim();
  return allowedDomains.some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
  );
}

export const allowedDomainMessage = 'Use your Yale email address to apply.';
