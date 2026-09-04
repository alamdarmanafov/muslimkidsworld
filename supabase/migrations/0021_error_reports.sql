-- 0021_error_reports.sql
--
-- Own-infrastructure crash/error reporting (no third-party SDK like
-- Sentry — the app already has this admin panel + edge function
-- pattern for everything else, so reusing it here needs no new
-- account or vendor integration). Reports come from a global JS error
-- handler + ErrorBoundary in the mobile app (see report-error edge
-- function) and can arrive with no parent/device context at all — a
-- crash can happen before login or device binding — so every column
-- besides the message itself is nullable.

create table public.error_reports (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('parent', 'child')),
  device_id text,
  parent_id uuid references public.parents(id) on delete set null,
  message text not null,
  stack text,
  app_version text,
  platform text,
  created_at timestamptz not null default now()
);

create index error_reports_created_at_idx on public.error_reports (created_at desc);

-- Written only by report-error (service role, so it can accept a
-- report with no session at all) and read only by admins — same
-- write-only-from-service-role shape as device_lockouts
-- (0020_attempt_lockouts.sql), plus one admin-read policy so
-- admin/index.html can list them.
alter table public.error_reports enable row level security;

create policy "Admins can view error reports"
  on public.error_reports for select
  to authenticated
  using (public.is_admin());
