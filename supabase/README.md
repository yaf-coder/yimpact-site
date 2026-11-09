# Backend setup

Do these steps in order. The order matters in step 4 and step 5.

## 1. Get the keys

1. Open the Supabase dashboard. Select your project.
2. Open **Project Settings**, then **API**.
3. Copy the **Project URL** and the **anon** key.
4. Copy `.env.example` to `.env.local` in the root of the repository. Write both
   values there.
5. In Vercel, open **Project**, then **Settings**, then **Environment
   Variables**. Add the same two names.

Do not copy the `service_role` key into `.env.local`. That key ignores every
policy in this project. Only `scripts/create-staff.mjs` needs it, and it reads
the key from the shell.

## 2. Turn email confirmation off

Open **Authentication**, then **Providers**, then **Email**. Turn **Confirm
email** off for the demo. If it stays on, a signup returns no session and the
site looks broken. Turn it on again before real use.

## 3. Run the migrations

Open the **SQL Editor**. Run each file in `supabase/migrations/` in number
order, from `0001` to `0015`.

| File | Content |
|---|---|
| `0001_roles_profiles.sql` | The four roles, the profile table, and approval |
| `0002_domain_restriction.sql` | The Yale email gate |
| `0003_access_token_hook.sql` | The role claim in the token |
| `0004_resources.sql` | The resource directory and its gate |
| `0005_chat.sql` | Conversations and messages |
| `0006_blog.sql` | The blog |
| `0007_sponsor_schedule.sql` | The sponsor schedule |
| `0008_storage.sql` | The blog image bucket |
| `0009_seed_demo.sql` | Invented rows and the 7 blog posts |
| `0010` to `0014` | Fixes to the blog and the partner roster |
| `0015_applications.sql` | Student applications, resumes, and the decision history |

## 4. Make the staff accounts

Do this **before** step 5. The hook in step 5 blocks an address that is not a
Yale address, and the staff accounts do not use one.

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY \
ADMIN_PASSWORD=... NEWS_PASSWORD=... SPONSOR_PASSWORD=... \
node scripts/create-staff.mjs
```

The script prints a user id for each account. Take the sponsor id and seed one
schedule:

```sql
insert into public.sponsor_schedule_items
  (sponsor_id, starts_at, ends_at, title, location)
values
  ('THE-SPONSOR-USER-ID', '2027-04-17T09:15:00-04:00',
   '2027-04-17T09:45:00-04:00', 'Opening remarks', 'Auditorium'),
  ('THE-SPONSOR-USER-ID', '2027-04-17T10:45:00-04:00',
   '2027-04-17T12:15:00-04:00', 'Judging block one', 'Exhibit Hall');
```

## 5. Turn the two hooks on

Open **Authentication**, then **Hooks**.

- **Customize Access Token** → `public.custom_access_token_hook`
- **Before User Created** → `public.before_user_created_hook`

If a hook raises an error, no user can sign in or register. Test with one
account first, and remember where the off switch is.

## 6. Check the gate

Run these in order. Stop at the first failure.

1. **Anonymous.** With no session, ask for the secrets with the anon key:

   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' \
     -H "apikey: YOUR-ANON-KEY" \
     "https://YOUR-PROJECT.supabase.co/rest/v1/resource_secrets?select=*"
   ```

   Expect `401` or `403`. **A `200` with `[]` means the revoke did not run.**

2. **The anonymous page.** Open `/resources` with no session. Read every
   response in the network tab. No address, no code, and no booking link may
   appear in any payload. This is the test that matters.

3. **A pending student.** Apply at `/signup` with every field and a PDF
   resume. The portal shows "Under review". The tiles show, the details do not.

4. **Approval.** Sign in as the admin, open `/portal/admin`, and approve the
   student. The student sees "Approved" after a page refresh. The details
   open with no new sign-in.

5. **An incomplete application.** Make a second student with no resume. The
   Approve button is disabled. A direct call to `approve_member` must fail.

6. **A second application.** Reject a student. As that student, change a
   field and select **Send application again**. The admin sees "Reapplied",
   and the earlier version with its resume.

7. **The resume bucket.** As a student, try to read the resume of another
   student. Expect a failure.

8. **The column grant.** As a student, try to make yourself an admin:

   ```bash
   curl -X PATCH -H "apikey: YOUR-ANON-KEY" \
     -H "Authorization: Bearer STUDENT-ACCESS-TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"role":"admin"}' \
     "https://YOUR-PROJECT.supabase.co/rest/v1/profiles?id=eq.STUDENT-ID"
   ```

   **Expect a failure.** A success means the column grant in `0001` is wrong,
   and every account is open.

9. **Storage.** Sign in as a student and try an upload to `blog-images`. Expect
   a failure.

Last, run the **Database Linter** in the dashboard. Fix every error.

## Notes

- Automatic approval is off from `0015`. Each student applies, and an admin
  approves or rejects the application. `approve_member` refuses an incomplete
  application. Each decision writes a snapshot to `application_decisions`.

- The site sends no decision email yet. To add one later, make a Database
  Webhook on insert into `application_decisions`. Point it at an Edge Function
  that sends the email. The frontend does not change.

- Do not add an update policy or a delete policy to the `resumes` bucket. Each
  snapshot points at an old file, and that file must stay.

- Chat polls every four seconds. To move to Realtime later, run
  `alter publication supabase_realtime add table public.messages;` and change
  `src/hooks/useConversation.ts`. Never add `resource_secrets` or `profiles` to
  that publication.

- A free project stops after about a week with no use. The Expo is months away,
  so set a reminder, or change to the Pro plan before the first invitation.
