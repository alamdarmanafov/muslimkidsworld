-- 0030_admin_broadcasts.sql
--
-- Backs the "Bildirişlər" (Notifications) page in the root Next.js
-- admin dashboard (app/admin/notifications/page.tsx) — previously a
-- pure UI mockup: "sending" a notification only pushed a fake row
-- into local React state, and the "sent" history it showed on load
-- was hardcoded (lib/adminMock.ts's sentNotifications), not anything
-- that was ever actually delivered.
--
-- This table is written only by the admin-broadcast-notification edge
-- function (service role), right after it has actually sent the push
-- via Expo (see that function's header comment) — so every row here
-- reflects a real send, and sent_count is the real number of Expo
-- push tokens the send was attempted against.
create table public.admin_broadcasts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null check (audience in ('all_parents', 'premium_parents')),
  sent_count integer not null default 0,
  created_by uuid references public.parents (id) on delete set null,
  created_at timestamptz not null default now()
);

create index admin_broadcasts_created_at_idx on public.admin_broadcasts (created_at desc);

alter table public.admin_broadcasts enable row level security;

-- Read-only from the client side (admins list past sends); all writes
-- go through the edge function's service-role client, which checks
-- is_admin() itself before inserting — see admin-broadcast-notification.
create policy "Admins can view broadcasts"
  on public.admin_broadcasts for select
  to authenticated
  using (public.is_admin());
