-- 0023_bug_screenshots.sql
--
-- Extends error_reports (0021) to also carry user-initiated "report a
-- problem" submissions — triggered by shaking the device or a manual
-- button in Profile (mobile/src/lib/bugReport.ts) — alongside the
-- automatic crash reports it already holds, so admins review both
-- from the one admin/index.html tab instead of a second one. A
-- shake report carries a screenshot the user saw when they shook the
-- phone, stored in a private bucket rather than inline in the row —
-- an image easily exceeds what belongs in a text column.

alter table public.error_reports
  add column kind text not null default 'crash' check (kind in ('crash', 'user_report')),
  add column screenshot_path text;

-- Private: shake screenshots can show whatever the parent/child had
-- on screen (a child's name, progress, in-app text) — never made
-- public, only readable by admins via signed URL (same is_admin()
-- gate as everything else here).
insert into storage.buckets (id, name, public)
values ('bug-screenshots', 'bug-screenshots', false)
on conflict (id) do nothing;

create policy "Admins can view bug screenshots"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'bug-screenshots' and public.is_admin());

-- No insert/update/delete policy for anon/authenticated: uploads only
-- ever happen from report-error using the service role, which
-- bypasses storage RLS entirely — same write-only-from-service-role
-- shape as the error_reports table itself.
