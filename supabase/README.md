# Muslim Kids World — Supabase backend

This directory holds the SQL migrations, RLS policies, and edge
functions for the app's real backend, built entirely as code so they
can be reviewed before being applied. A live project now exists
(`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
in `mobile/.env`) and its tables are up through migration `0006`.
**`0007_progress_tracking.sql` and the `get-child-progress` /
`record-quiz-result` functions have been written but not yet pushed to
that project** — the environment these were written in has no network
access to `supabase.co` (organization egress policy), so `supabase db
push` and `supabase functions deploy` for those two still need to be
run from a machine that does. See "Taking this live" below for the
exact commands. Most of the app — Quran, Dua, Stories, quiz content,
Games — still reads from `mobile/src/data/mock.ts`; only parent/child
onboarding and progress tracking call this backend so far.

## What's here

```
supabase/
├── migrations/           numbered SQL migrations (run in order)
│   ├── 0001_core_schema.sql        families, parents, children,
│   │                                family_codes, subscription_plans,
│   │                                subscriptions, child_progress
│   ├── 0002_content_tables.sql     quran_surahs, duas, stories,
│   │                                quizzes/quiz_questions, games,
│   │                                achievements, child_achievements
│   ├── 0003_daily_journey.sql      daily_journeys, daily_journey_items
│   ├── 0004_rls_policies.sql       Row Level Security for every table
│   ├── 0005_seed_content.sql       seeds subscription_plans + content
│   │                                tables with the same data currently
│   │                                hard-coded in mock.ts
│   └── 0007_progress_tracking.sql  adds child_progress lifetime totals
│                                    (total_questions_answered,
│                                    total_correct_answers) and the new
│                                    child_daily_activity table
└── functions/
    ├── generate-family-code/       parent generates a 6-digit code
    ├── redeem-family-code/         child device redeems a code once
    ├── get-child-progress/         child device reads its own progress
    ├── record-quiz-result/         child device reports a finished quiz
    └── _shared/cors.ts             shared CORS headers
```

The SQL has been validated by actually running it against a local
Postgres 16 instance (extensions, triggers, and RLS policies included) —
not just read for syntax — including a scripted check that a parent can
only see their own family's rows, that `anon`/`authenticated` cannot
write to content or `family_codes` tables directly, and that the
family-code binding logic behaves correctly under a simulated race
between two devices. It has not been run against an actual Supabase
project, so still treat first deployment as a real test.

## How the schema maps to the app

Every table mirrors a shape already used in `mobile/src/data/mock.ts` —
see the comment at the top of each migration file for the exact
mapping (e.g. `children` + `child_progress` together match the mock
`Child` type; `family_codes` is the server-side half of
`mobile/src/lib/deviceBinding.ts`). The goal is that swapping mock data
for real queries later is a small diff, not a rewrite.

## Taking this live

1. **Install the Supabase CLI** (if you don't have it):
   ```
   npm install -g supabase
   ```
   or see https://supabase.com/docs/guides/cli/getting-started for
   other install methods.

2. **Create a Supabase project** at https://supabase.com/dashboard if
   you don't already have one for this app.

3. **Initialize + link**, from the repo root:
   ```
   supabase init          # safe to run even though supabase/migrations
                           # and supabase/functions already exist — it
                           # only adds supabase/config.toml
   supabase login
   supabase link --project-ref <your-project-ref>
   ```

4. **Run the migrations** against your linked project:
   ```
   supabase db push
   ```
   This creates every table, trigger, and RLS policy in
   `supabase/migrations/`, and seeds `subscription_plans` plus the
   content tables (`0005_seed_content.sql`) with the same data
   currently hard-coded in `mobile/src/data/mock.ts`.

5. **Deploy the edge functions**:
   ```
   supabase functions deploy generate-family-code
   supabase functions deploy redeem-family-code
   supabase functions deploy get-child-progress
   supabase functions deploy record-quiz-result
   ```
   All four read `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` — Supabase injects these automatically
   into every deployed function, nothing to configure there.

6. **Set the two client env vars.**

   In `mobile/.env` (create it if it doesn't exist — Expo picks up any
   `EXPO_PUBLIC_*` var automatically, see
   https://docs.expo.dev/versions/v57.0.0/guides/environment-variables/):
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your anon/public key>
   ```
   Both values are on your Supabase project's dashboard under
   Settings → API.

   If the Next.js admin panel at the repo root ever needs
   server-side access (e.g. to manage content with the service role
   key, which must never ship to a client bundle), add the equivalent
   `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` pair to that project's
   Vercel settings (Project → Settings → Environment Variables) — this
   scaffold does not add any Next.js-side client, since the admin
   panel doesn't have one yet either.

7. **Regenerate real TypeScript types** (optional but recommended once
   a project exists — `mobile/src/lib/database.types.ts` is currently
   hand-written to match the migrations):
   ```
   supabase gen types typescript --linked > mobile/src/lib/database.types.ts
   ```

## What's still a stub / explicitly out of scope here

- **Parent + child onboarding, and child-side progress, are wired
  up.** `app/parent-auth.tsx`, `app/child-code.tsx`,
  `app/parent/family-code.tsx` call Supabase auth and the
  `generate-family-code` / `redeem-family-code` functions; the child
  app's Progress and Rewards tabs
  (`mobile/app/child/(tabs)/progress.tsx`, `rewards.tsx`) and the quiz
  screen (`mobile/app/child/quiz.tsx`) call `get-child-progress` /
  `record-quiz-result` through `mobile/src/lib/childProgress.ts`.
  Everything else (Quran, Dua, Stories, the quiz *content* itself,
  Games, the achievement-badge grid on the Rewards tab) still reads
  from `mobile/src/data/mock.ts` — swapping each of those over to the
  matching content table is still a follow-up, one screen at a time.
- **No child auth.** There is no separate Supabase auth role for a
  child's own session. Today, "child access" means either the parent's
  authenticated session (RLS-scoped to their family) or a service-role
  edge function — see the comment at the top of
  `supabase/migrations/0004_rls_policies.sql`, and the header comments
  on `get-child-progress` / `record-quiz-result`, which resolve a
  child device's family via `family_codes.bound_device_id` for exactly
  this reason. A real device-scoped child session (so a child's device
  can talk to the database directly, not just through edge functions)
  is future work.
- **Single-child-per-device assumption.** `get-child-progress` and
  `record-quiz-result` both resolve "the" child for a bound device as
  that family's oldest (first-created) child — matching the single
  `activeChild` the mock data always assumed. A family with more than
  one child, and a way for a device to pick which one it's playing as,
  is a follow-up.
- **The achievement-badge grid isn't real yet.** `child_progress`'s
  `badges_count` / `stars_count` / `active_days_count` are real
  numbers now, but which *specific* badges (`content.achievements.*`)
  a child has actually earned still comes from mock.ts's hard-coded
  `earned: true` flags — wiring that up needs the `achievements` /
  `child_achievements` tables from `0002_content_tables.sql` plus
  server-side criteria evaluation (e.g. "5-day streak" →
  `child_achievements` row), which this pass doesn't add.
- **No billing/payment provider integration.** `subscriptions` has the
  columns to represent App Store/Play Store/Stripe state
  (`external_provider`, `external_subscription_id`), but nothing
  writes to them yet — a real subscription still has to be created via
  `service_role` (e.g. from a billing webhook you'd add later).
- **No admin-panel content management UI.** Content tables are
  seeded once from mock data; there's no UI yet for editing
  quran_surahs/duas/stories/quizzes/games/achievements beyond running
  SQL or using the Supabase dashboard's table editor directly.
- **Family code revocation/rotation UI.** The schema supports revoking
  a code (`family_codes.revoked_at`) and generating a fresh one, but
  there's no function or screen exposing that yet — only issuing a new
  code (`generate-family-code`) and redeeming one
  (`redeem-family-code`) are implemented.
