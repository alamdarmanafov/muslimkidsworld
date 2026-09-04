-- 0022_contact_messages.sql
--
-- Parent-facing "contact us" — replaces the privacy policy's dead
-- "questions can be sent to the app's support email" line (there was
-- no real address configured) with an actual in-app form the parent
-- can write to and check back on, answered from the admin panel
-- rather than an inbox nobody's watching.
--
-- No edge function needed: a signed-in parent already has a direct,
-- RLS-scoped insert/select path (same shape as `children` in
-- 0004_rls_policies.sql), and only the admin reply needs the
-- is_admin() gate from 0015_admin_panel.sql.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  subject text,
  message text not null,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create index contact_messages_parent_id_idx on public.contact_messages (parent_id);
create index contact_messages_status_idx on public.contact_messages (status);

alter table public.contact_messages enable row level security;

create policy "Parents can send their own contact messages"
  on public.contact_messages for insert
  to authenticated
  with check (parent_id = auth.uid());

create policy "Parents can view their own contact messages"
  on public.contact_messages for select
  to authenticated
  using (parent_id = auth.uid());

create policy "Admins can view all contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

-- Only the reply/status fields are meant to change after the fact —
-- there's no "with check" restricting which columns an update can
-- touch (Postgres RLS can't do column-level checks), so this relies
-- on admin/index.html only ever writing admin_reply/status/replied_at,
-- the same trust boundary every other admin-only policy here has.
create policy "Admins can reply to contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
