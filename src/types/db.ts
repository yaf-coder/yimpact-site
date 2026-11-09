// Database row types. The database uses snake case. The content types in
// src/types/content.ts use camel case. src/lib/adapters.ts joins the two.

export type UserRole = 'student' | 'sponsor' | 'admin' | 'announcements';
export type MemberStatus = 'pending' | 'approved' | 'rejected';

export interface ProfileRow {
  id: string;
  role: UserRole;
  status: MemberStatus;
  email: string;
  full_name: string;
  school: string | null;
  program: string | null;
  grad_year: number | null;
  bio: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  org_slug: string | null;
  resume_path: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string;
}

// The fields a student can change. The column grants in migrations 0001 and
// 0015 allow these and no others.
export interface ProfileEdit {
  full_name: string;
  school: string | null;
  program: string | null;
  grad_year: number | null;
  bio: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_path?: string;
}

// A snapshot of an application at the time of a decision. Only an admin
// reads these rows. Refer to migration 0015.
export interface ApplicationDecisionRow {
  id: string;
  profile_id: string;
  decision: 'approved' | 'rejected';
  submitted_at: string | null;
  decided_at: string;
  decided_by: string | null;
  full_name: string;
  school: string | null;
  program: string | null;
  grad_year: number | null;
  bio: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_path: string | null;
}

export type ResourceKind =
  | 'contact'
  | 'office_hours'
  | 'promo_code'
  | 'tool_credit'
  | 'link'
  | 'mentor';

export type ResourceOwnerKind = 'org' | 'person';

// The public half. Every reader gets this, including a reader with no account.
export interface ResourceRow {
  id: string;
  title: string;
  kind: ResourceKind;
  owner_kind: ResourceOwnerKind;
  org_slug: string | null;
  org_name: string | null;
  person_name: string | null;
  person_title: string | null;
  person_affiliation: string | null;
  summary: string;
  domain: string | null;
  sort_order: number;
}

// The gated half. Only an approved member gets this. Refer to migration 0004.
export interface ResourceSecretRow {
  contact_email: string | null;
  contact_phone: string | null;
  booking_url: string | null;
  promo_code: string | null;
  redeem_url: string | null;
  instructions: string | null;
  expires_on: string | null;
}

// The shape the resources hook gives to the page. `secret` is null for a
// reader who may not see the access details.
export interface Resource extends ResourceRow {
  secret: ResourceSecretRow | null;
}

export interface ConversationRow {
  id: string;
  member_id: string;
  subject: string;
  created_at: string;
  last_message_at: string;
}

export interface MessageRow {
  id: number;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  kicker: string;
  published_at: string;
  author: string;
  author_role: string;
  excerpt: string;
  body_text: string;
  cover_path: string | null;
  cover_alt: string;
  is_lead: boolean;
  is_published: boolean;
  sponsor_ids: string[] | null;
}

export interface SponsorScheduleRow {
  id: string;
  sponsor_id: string;
  starts_at: string;
  ends_at: string;
  title: string;
  location: string | null;
  description: string | null;
}
