-- Student applications.
--
-- A student registration is now an application. The account opens at once,
-- but the status stays pending until an admin approves it. An admin can
-- approve only a complete application: every required field and a resume.
--
-- Each decision writes a snapshot to application_decisions. A rejected student
-- can edit the profile and send the application again. The admin then sees
-- each earlier application as it was on the day of the decision.
--
-- This file is safe to run more than once.

-- 1. Approval is manual from now on.
update public.app_settings set value = 'false'::jsonb
where key = 'auto_approve_students';

-- 2. The status column. Migration 0001 makes it. This block repairs a
-- database where that part of 0001 did not run.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'member_status') then
    create type public.member_status as enum ('pending', 'approved', 'rejected');
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'status'
  ) then
    alter table public.profiles
      add column status public.member_status not null default 'pending';
  end if;
end;
$$;

alter table public.profiles add column if not exists resume_path text;
alter table public.profiles add column if not exists submitted_at timestamptz;

comment on column public.profiles.resume_path is
  'A path in the resumes bucket. A new upload gets a new path. An old file stays for the history.';
comment on column public.profiles.submitted_at is
  'The time the application became complete, or the time of the last resubmission.';

-- A student can point only at a file in their own folder.
alter table public.profiles drop constraint if exists profiles_resume_path_own_ck;
alter table public.profiles add constraint profiles_resume_path_own_ck
  check (resume_path is null or resume_path like (id::text || '/%'));

-- The same list is in src/content/schools.ts. Change both together.
-- NOT VALID keeps an old free-text value. The next save must use the list.
alter table public.profiles drop constraint if exists profiles_school_ck;
alter table public.profiles add constraint profiles_school_ck check (
  school is null or school in (
    'Yale College',
    'Graduate School of Arts and Sciences',
    'School of Architecture',
    'School of Art',
    'Divinity School',
    'David Geffen School of Drama',
    'School of Engineering & Applied Science',
    'School of the Environment',
    'Jackson School of Global Affairs',
    'Law School',
    'School of Management',
    'School of Medicine',
    'School of Music',
    'School of Nursing',
    'School of Public Health'
  )
) not valid;

grant update (resume_path) on table public.profiles to authenticated;

-- 3. Completeness. The portal shows the same rule in src/lib/application.ts.
create or replace function app.application_complete(p public.profiles)
returns boolean
language sql stable set search_path = ''
as $$
  select coalesce(btrim(p.full_name), '') <> ''
     and p.school is not null
     and coalesce(btrim(p.program), '') <> ''
     and p.grad_year is not null
     and coalesce(btrim(p.bio), '') <> ''
     and p.resume_path is not null
$$;

-- The trigger below runs as the student, so the student needs EXECUTE. The
-- function reads only the row it gets. It reads no table.
revoke execute on function app.application_complete(public.profiles) from public;
grant execute on function app.application_complete(public.profiles) to authenticated;

-- Set submitted_at the first time a pending application becomes complete.
create or replace function app.stamp_submitted_at() returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.role = 'student'
     and new.status = 'pending'
     and new.submitted_at is null
     and app.application_complete(new) then
    new.submitted_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_stamp_submitted_at on public.profiles;
create trigger profiles_stamp_submitted_at
before insert or update on public.profiles
for each row execute function app.stamp_submitted_at();

-- 4. The decision history. Only an admin reads it.
create table if not exists public.application_decisions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles on delete cascade,
  decision public.member_status not null check (decision in ('approved', 'rejected')),
  submitted_at timestamptz,
  decided_at timestamptz not null default now(),
  decided_by uuid references auth.users,
  -- The snapshot. These columns copy the profile at the time of the decision.
  full_name text not null,
  school text,
  program text,
  grad_year int,
  bio text,
  linkedin_url text,
  portfolio_url text,
  resume_path text
);
alter table public.application_decisions enable row level security;

create index if not exists application_decisions_profile_idx
  on public.application_decisions (profile_id, decided_at desc);

revoke all on table public.application_decisions from anon, authenticated;
grant select on table public.application_decisions to authenticated;

drop policy if exists "admin reads every decision" on public.application_decisions;
create policy "admin reads every decision" on public.application_decisions
  for select to authenticated
  using ((select app.is_admin()));

-- 5. The admin decision. This replaces the function in 0001.
create or replace function public.approve_member(p_user_id uuid, p_approve boolean default true)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v public.profiles;
begin
  if not app.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  select * into v from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'That account does not exist.' using errcode = 'P0002';
  end if;

  if v.role = 'student' and p_approve and not app.application_complete(v) then
    raise exception 'The application is not complete. It needs every required field and a resume.'
      using errcode = '22023';
  end if;

  update public.profiles
  set status = case when p_approve then 'approved'::public.member_status
                    else 'rejected'::public.member_status end,
      approved_at = case when p_approve then now() end,
      approved_by = (select auth.uid())
  where id = p_user_id;

  if v.role = 'student' then
    insert into public.application_decisions (
      profile_id, decision, submitted_at, decided_by,
      full_name, school, program, grad_year, bio,
      linkedin_url, portfolio_url, resume_path
    )
    values (
      v.id,
      case when p_approve then 'approved'::public.member_status
           else 'rejected'::public.member_status end,
      v.submitted_at,
      (select auth.uid()),
      v.full_name, v.school, v.program, v.grad_year, v.bio,
      v.linkedin_url, v.portfolio_url, v.resume_path
    );
  end if;
end;
$$;

revoke execute on function public.approve_member(uuid, boolean) from public, anon;
grant execute on function public.approve_member(uuid, boolean) to authenticated;

-- 6. A rejected student sends the application again.
create or replace function public.resubmit_application()
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v public.profiles;
begin
  select * into v from public.profiles where id = (select auth.uid()) for update;

  if not found or v.role <> 'student' then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if v.status <> 'rejected' then
    raise exception 'Only an application that was not approved can be sent again.'
      using errcode = '22023';
  end if;
  if not app.application_complete(v) then
    raise exception 'Complete every required field and upload a resume first.'
      using errcode = '22023';
  end if;

  update public.profiles
  set status = 'pending', approved_at = null, approved_by = null, submitted_at = now()
  where id = v.id;
end;
$$;

revoke execute on function public.resubmit_application() from public, anon;
grant execute on function public.resubmit_application() to authenticated;

-- 7. The resume bucket. It is private. Do not make it public.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, array['application/pdf'])
on conflict (id) do nothing;

-- There is no update policy and no delete policy. An old resume stays, so
-- each snapshot keeps the file the admin saw.
drop policy if exists "student adds own resume" on storage.objects;
create policy "student adds own resume" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "student reads own resume" on storage.objects;
create policy "student reads own resume" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "admin reads every resume" on storage.objects;
create policy "admin reads every resume" on storage.objects
  for select to authenticated
  using (bucket_id = 'resumes' and (select app.is_admin()));

-- 8. Every current student goes back to pending and must apply in full.
update public.profiles
set status = 'pending', approved_at = null, approved_by = null
where role = 'student';
