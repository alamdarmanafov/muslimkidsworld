# Muslim Kids World — Supabase backend

This directory holds the SQL migrations, RLS policies, and edge
functions for the app's real backend, built entirely as code so they
can be reviewed before being applied. A live project now exists
(`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
in `mobile/.env`) and its tables are up through migration `0008`, with
`get-child-progress` and `record-quiz-result` (achievement-aware)
deployed. **`0009_parent_pin.sql`, `0010_quran_verses.sql`, and the
`delete-account` / `set-parent-pin` / `verify-parent-pin` functions
have been written but not yet deployed to that project** — the
environment these were written in has no network access to
`supabase.co` (organization egress policy), so `supabase db push` and
`supabase functions deploy` for those still need to be run from a
machine that does. See "Taking this live" below for the exact
commands. The Quran is now a real, live-fetched 114-surah feature (see
`0010_quran_verses.sql` and `supabase/scripts/import-quran.mjs`
below) — everything else (Dua, Stories, quiz content, Games) still
reads from `mobile/src/data/mock.ts`. Parent/child onboarding, the
parent's real Children list (add/delete), progress tracking,
achievement badges, account deletion, and the real Parent Gate PIN
call this backend too.

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
│   ├── 0007_progress_tracking.sql  adds child_progress lifetime totals
│   │                                (total_questions_answered,
│   │                                total_correct_answers) and the new
│   │                                child_daily_activity table
│   ├── 0008_achievement_criteria.sql  seeds machine-readable unlock
│   │                                criteria onto the 6 achievements
│   │                                from 0005, so record-quiz-result
│   │                                can award them automatically
│   ├── 0009_parent_pin.sql         adds families.pin_hash — a real,
│   │                                parent-set Parent Gate PIN,
│   │                                replacing mock.ts's hard-coded
│   │                                "1234" every install used to share
│   └── 0010_quran_verses.sql       adds a `chapter` number to
│                                    quran_surahs (it only ever had 4
│                                    hand-picked rows, keyed by slug,
│                                    before) plus quran_verses /
│                                    quran_translations — schema only,
│                                    see scripts/import-quran.mjs below
│                                    for how the actual 114 surahs get
│                                    in
├── scripts/
│   └── import-quran.mjs            one-time script, run from a machine
│                                    with real internet access: pulls
│                                    all 114 surahs (Arabic + 4
│                                    translations) from a public Quran
│                                    API and upserts them into the
│                                    tables above — see its header
│                                    comment for why this is a script
│                                    you run rather than verse text
│                                    typed into a migration
└── functions/
    ├── generate-family-code/       parent generates a 6-digit code
    ├── redeem-family-code/         child device redeems a code once
    ├── get-child-progress/         child device reads its own progress
    ├── record-quiz-result/         child device reports a finished quiz
    ├── delete-account/             parent permanently deletes their account
    ├── set-parent-pin/             parent sets/changes the Parent Gate PIN
    ├── verify-parent-pin/          child device checks a PIN against it
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
   supabase functions deploy delete-account
   supabase functions deploy set-parent-pin
   supabase functions deploy verify-parent-pin
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

8. **Import the full Quran** (once, after `0010_quran_verses.sql` has
   been pushed) — from a machine with real internet access:
   ```
   cd supabase/scripts
   npm install
   SUPABASE_URL=https://<your-project-ref>.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=<service role key, from Settings → API> \
   node import-quran.mjs
   ```
   Takes a few minutes (114 surahs × Arabic + 4 translations, ~31,000
   rows). Safe to re-run — every write is an upsert.

9. **Enable the Apple auth provider**, for Sign in with Apple
   (`mobile/src/lib/appleAuth.ts`, `app/parent-auth.tsx`):
   - In [Apple Developer](https://developer.apple.com/account) →
     Certificates, Identifiers & Profiles → Identifiers, open the
     app's identifier (`com.muslimkidsworld.app`) and enable the
     "Sign in with Apple" capability.
   - Under Keys, create a new key with "Sign in with Apple" enabled;
     note its Key ID and download the `.p8` file (only downloadable
     once). Note your Team ID too (top-right of the Apple Developer
     dashboard).
   - In the Supabase dashboard → Authentication → Providers → Apple:
     enable it, paste in the Team ID, Key ID, and the `.p8` file's
     contents, and add `com.muslimkidsworld.app` under "Authorized
     Client IDs" (this native flow uses the bundle ID directly — no
     Services ID or redirect URL needed, unlike Apple's web OAuth
     flow).
   - This only works in a real build (EAS build / TestFlight), not
     Expo Go — `expo-apple-authentication` needs to be compiled in.

## What's still a stub / explicitly out of scope here

- **Parent + child onboarding, the parent's Children list, and
  child-side progress, are wired up.** `app/parent-auth.tsx`,
  `app/child-code.tsx`, `app/parent/family-code.tsx` call Supabase auth
  and the `generate-family-code` / `redeem-family-code` functions;
  `app/parent/add-child.tsx` and the parent's Children tab
  (`app/parent/(tabs)/children.tsx`) read/write the `children` table
  directly through `mobile/src/lib/children.ts` (RLS-scoped to the
  signed-in parent's family, no edge function needed since a parent
  has a real session); `app/parent/(tabs)/profile.tsx`'s Delete
  Account calls the `delete-account` function.
  `app/parent/parent-pin-setup.tsx` (parent sets/changes the PIN) and
  `app/parent-pin.tsx` (child device checks one) call `set-parent-pin`
  / `verify-parent-pin` through `mobile/src/lib/parentPin.ts` — the
  real PIN hash never reaches either client, both functions hash and
  compare server-side. The child app's
  Progress and Rewards tabs (`mobile/app/child/(tabs)/progress.tsx`,
  `rewards.tsx`) and the quiz screen (`mobile/app/child/quiz.tsx`)
  call `get-child-progress` / `record-quiz-result` through
  `mobile/src/lib/childProgress.ts`. The Quran (`app/child/quran.tsx`,
  `app/child/quran/[id].tsx`) is real too, via `mobile/src/lib/quran.ts`
  — all 114 surahs, Arabic text and 4 translations, from
  `quran_surahs`/`quran_verses`/`quran_translations` (see
  `0010_quran_verses.sql` and `scripts/import-quran.mjs` above).
  Everything else (Dua, Stories, the quiz *content* itself, Games, the
  achievement-badge grid on the Rewards tab) still reads from
  `mobile/src/data/mock.ts` — swapping each of those over to the
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
- **The achievement-badge grid is real for 3 of 6 badges.**
  `record-quiz-result` now evaluates each achievement's `criteria`
  (`0008_achievement_criteria.sql`) against the child's up-to-date
  totals and awards a `child_achievements` row the moment it's met;
  `get-child-progress` returns the earned slugs and
  `app/child/(tabs)/rewards.tsx` only shows a badge as earned if it's
  in that list — `badges_count` is the real `child_achievements` row
  count, not a static number. But only `first-star`
  (`correct_answers`), `week-streak` (`streak`), and `quiz-master`
  (`questions_answered`) are things this backend actually tracks yet;
  `book-lover` / `storyteller` (`stories_read`) and `mosque-visitor`
  (`world_visited`) have criteria seeded for documentation but are
  never awarded until Stories and the world map get their own
  read/visit tracking — a real follow-up, not started here.
- **Quiz content staying in `mock.ts` is deliberate, not an
  oversight.** The `quizzes` / `quiz_questions` tables and their seed
  (`0002_content_tables.sql`, `0005_seed_content.sql`) predate the
  category quiz screen (`app/child/quiz.tsx`) that now ships 5
  categories, difficulty levels, and foreign-language variants — one
  of which (`riyaziyyat`/math) generates its questions procedurally in
  `getQuizQuestions`/`buildMathProblem` rather than storing them at
  all. Moving quiz *content* to the database needs a schema that
  actually matches that shape (category, difficulty, target language,
  a way to represent "generated, not stored") — a redesign, not a
  wire-up — so it's left as its own future pass instead of forcing the
  current stale schema into use.
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
