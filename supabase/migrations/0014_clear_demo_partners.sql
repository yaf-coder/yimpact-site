-- Remove the invented partner content from the demo seed.
--
-- The partner roster now starts empty and grows through the portal. The
-- Resources page and the Partners page show "To be announced" until real
-- rows arrive.
--
-- This touches only the rows that 0009 seeded. A resource or a partner that
-- an admin added later has a different id and stays.

-- The secrets go with their resources. The foreign key cascades.
delete from public.resources
where id in (
  '11111111-1111-4111-8111-000000000001',
  '11111111-1111-4111-8111-000000000002',
  '11111111-1111-4111-8111-000000000003',
  '11111111-1111-4111-8111-000000000004',
  '22222222-2222-4222-8222-000000000001',
  '22222222-2222-4222-8222-000000000002',
  '22222222-2222-4222-8222-000000000003',
  '22222222-2222-4222-8222-000000000004',
  '33333333-3333-4333-8333-000000000001',
  '33333333-3333-4333-8333-000000000002',
  '33333333-3333-4333-8333-000000000003'
);

-- The seeded stories named the invented partners. Those partners are gone,
-- so remove the links. The stories stay.
update public.posts
set sponsor_ids = '{}'
where slug in (
  'expo-opens-applications',
  'nine-domains-one-standard',
  'what-new-haven-asked-for',
  'opportunity-not-prizes',
  'faculty-join-the-panels',
  'how-teams-are-formed',
  'guardrails-for-sensitive-work'
);

-- Check the result. Expect 0 seeded resources and 0 secrets left.
select
  (select count(*) from public.resources
     where id::text like '11111111-%' or id::text like '22222222-%' or id::text like '33333333-%') as seeded_resources_left,
  (select count(*) from public.resource_secrets) as secrets_total,
  (select count(*) from public.resources) as resources_total;
