-- 0011_push_tokens.sql
-- Stores Expo push tokens for parents and children, written by the
-- register-push-token edge function (service role — the same
-- device-bound-child pattern as get-child-progress / record-quiz-result
-- covers children, who have no auth session to be RLS-scoped by).
-- Read by record-quiz-result (achievement-earned notification) and
-- send-daily-reminders, both also service role.

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('parent', 'child')),
  owner_id uuid not null,
  expo_push_token text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_push_tokens_owner on public.push_tokens (owner_type, owner_id);

alter table public.push_tokens enable row level security;

-- A signed-in parent can see/manage their own token rows directly
-- (used if the client ever needs to unregister one, e.g. on sign-out).
-- Child rows are written only by register-push-token via the service
-- role key, same as child_progress / child_daily_activity.
create policy "Parents can manage their own push tokens"
  on public.push_tokens for all
  to authenticated
  using (owner_type = 'parent' and owner_id = auth.uid())
  with check (owner_type = 'parent' and owner_id = auth.uid());

create trigger set_push_tokens_updated_at
  before update on public.push_tokens
  for each row execute function public.set_updated_at();
