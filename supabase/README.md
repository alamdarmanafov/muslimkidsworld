# Muslim Kids World — Supabase backend

This directory holds the SQL migrations, RLS policies, and edge
functions for the app's real backend, built entirely as code so they
can be reviewed before being applied. Migrations run through `0016`
and every function below has been written and validated locally, but
**deploying a new migration/function to your linked project still
needs `supabase db push` / `supabase functions deploy` run from a
machine with network access to `supabase.co`** — see "Taking this
live" below for the exact commands and secrets each one needs. The
Quran is a real, live-fetched 114-surah feature (see
`0010_quran_verses.sql` and `supabase/scripts/import-quran.mjs`
below); Dua, Stories, quiz content, and Games still read from
`mobile/src/data/mock.ts` (see "What's still a stub" below for why).
Parent/child onboarding, the parent's real Children list, progress
tracking, achievement badges, account deletion, the real Parent Gate
PIN, push notifications, multi-child devices, device revocation, and
iOS in-app purchases all call this backend too.

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
│   ├── 0010_quran_verses.sql       adds a `chapter` number to
│   │                                quran_surahs (it only ever had 4
│   │                                hand-picked rows, keyed by slug,
│   │                                before) plus quran_verses /
│   │                                quran_translations — schema only,
│   │                                see scripts/import-quran.mjs below
│   │                                for how the actual 114 surahs get in
│   ├── 0011_push_tokens.sql        push_tokens table (Expo push tokens
│   │                                for parents and children)
│   ├── 0012_more_stories.sql       seeds the Nuh/Yusuf stories
│   ├── 0013_journey_tracking.sql   quran_done/dua_done/story_done/
│   │                                game_done on child_daily_activity
│   ├── 0014_active_child.sql       family_codes.active_child_id, for
│   │                                multi-child shared devices
│   ├── 0015_admin_panel.sql        parents.is_admin + admin RLS
│   │                                policies for admin/index.html
│   ├── 0016_iap.sql                subscription_plans.apple_product_id,
│   │                                for verify-apple-purchase
│   ├── 0017_category_stats.sql     child_category_stats, for the
│   │                                parent Weekly Report's
│   │                                strongest/weakest subject
│   ├── 0018_stories_world_tracking.sql  child_story_reads,
│   │                                child_world_visits — makes
│   │                                book-lover/storyteller/
│   │                                mosque-visitor awardable
│   └── 0019_screen_time.sql        families.daily_limit_minutes (a
│                                    real, shared setting — see its own
│                                    header comment for why it used to
│                                    be fake), child_daily_activity.
│                                    minutes_spent, and a trigger
│                                    hardening families.pin_hash
│                                    against direct client writes
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
    ├── register-push-token/        parent or child device registers an
    │                                Expo push token
    ├── send-daily-reminders/       cron-triggered: nudges children who
    │                                haven't opened the app today
    ├── revoke-device/              parent cuts off one connected device
    ├── mark-journey-item/          child device marks a Today's Journey
    │                                item (Quran/Dua/Story/Game) done
    ├── list-family-children/       shared device lists its family's children
    ├── set-active-child/           parent switches which child a shared
    │                                device is currently acting as
    ├── mark-story-read/            child device records which story it
    │                                opened, for book-lover/storyteller
    ├── mark-world-visit/            child device records visiting a
    │                                "Muslim World" site, for mosque-visitor
    ├── record-screen-time/          child device reports ~1 real minute
    │                                of foreground time
    ├── verify-apple-purchase/      confirms an App Store transaction
    │                                with Apple and updates `subscriptions`
    ├── apple-server-notifications/ Apple's own renewal/cancellation
    │                                webhook — re-verifies with Apple
    │                                rather than trusting the payload
    │                                (see its own header comment)
    └── _shared/                    cors.ts, push.ts (Expo push sender),
                                     notifyParents.ts (push to every
                                     parent in a family), resolveChild.ts
                                     (device → family → child lookup,
                                     shared by the child-facing
                                     functions above), achievements.ts
                                     (criteria evaluation, shared by
                                     record-quiz-result/mark-story-read/
                                     mark-world-visit), appleIap.ts (App
                                     Store Server API calls, shared by
                                     both Apple IAP functions)
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
   supabase functions deploy register-push-token
   supabase functions deploy send-daily-reminders
   supabase functions deploy revoke-device
   supabase functions deploy mark-journey-item
   supabase functions deploy list-family-children
   supabase functions deploy set-active-child
   supabase functions deploy mark-story-read
   supabase functions deploy mark-world-visit
   supabase functions deploy record-screen-time
   supabase functions deploy verify-apple-purchase
   supabase functions deploy apple-server-notifications
   ```
   All of these read `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` — Supabase injects these automatically
   into every deployed function, nothing to configure there.
   `verify-apple-purchase` and `apple-server-notifications` additionally
   need the `APPLE_IAP_*` secrets from step 12 below before they'll
   work.

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
     enable it, fill in the Team ID and Key ID, and add
     `com.muslimkidsworld.app` under "Authorized Client IDs" (this
     native flow uses the bundle ID directly — no Services ID or
     redirect URL needed, unlike Apple's web OAuth flow).
   - The "Secret Key" field wants a signed **JWT**, not the raw `.p8`
     contents — generate one with `supabase/scripts/generate-apple-secret.mjs`:
     ```
     cd supabase/scripts
     node generate-apple-secret.mjs --team <Team ID> --key <Key ID> \
       --client com.muslimkidsworld.app --p8 /path/to/AuthKey_XXXXXXXXXX.p8
     ```
     Paste the printed JWT into the Secret Key field. It's valid 180
     days — regenerate and re-paste before it expires (the `.p8` file
     and Key ID don't change).
   - This only works in a real build (EAS build / TestFlight), not
     Expo Go — `expo-apple-authentication` needs to be compiled in.

10. **Enable the Google auth provider**, for Sign in with Google
    (`mobile/src/lib/googleAuth.ts`, `app/parent-auth.tsx`) — iOS only:
    - In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
      create (or pick) a project, then Credentials → Create Credentials
      → OAuth client ID → Application type **iOS**. Bundle ID:
      `com.muslimkidsworld.app`.
    - Copy the generated **Client ID** (`....apps.googleusercontent.com`)
      and set it in `mobile/.env`:
      ```
      EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=<the client ID>
      ```
    - On the same client's details page, copy the **iOS URL scheme**
      (`com.googleusercontent.apps.<...>`) and paste it into
      `mobile/app.json`'s `@react-native-google-signin/google-signin`
      plugin config, replacing `REPLACE_WITH_IOS_CLIENT_ID`.
    - In the Supabase dashboard → Authentication → Providers → Google,
      enable it. Its form requires both a **Client ID** and a
      **Client Secret**, but an iOS OAuth client never has a secret —
      so create a second OAuth client, this time type **Web
      application** (Google Cloud Console → Credentials → Create
      Credentials → OAuth client ID → Web application), with
      Authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`
      (project-ref is in Project Settings → API → Project URL). Paste
      *that* client's ID + Secret into Supabase's Client ID / Client
      Secret fields, and add the original **iOS** client ID to
      "Authorized Client IDs" — that's the one actually used by native
      sign-in, the Web client only exists to satisfy this form.
    - This also only works in a real build, not Expo Go —
      `@react-native-google-signin/google-signin` needs to be compiled
      in, and changing `app.json`'s plugin config requires a fresh
      prebuild (a new EAS build).

11. **Push notifications** (`mobile/src/lib/pushNotifications.ts`,
    `register-push-token`, `record-quiz-result`,
    `send-daily-reminders`) — iOS only, via Expo's push service (no
    Firebase needed; Expo's service talks to APNs directly for iOS):
    - EAS manages the APNs push key automatically the first time you
      build with push notifications configured — no manual Apple
      Developer step needed, just run `eas build` and answer its
      credentials prompts (or `eas credentials` beforehand if you want
      to review them first).
    - Achievement-earned notifications to parents work automatically
      once a build with `expo-notifications` compiled in is installed
      and the parent has granted notification permission — no extra
      setup.
    - The daily reminder (`send-daily-reminders`) needs a cron job to
      actually call it — Supabase doesn't schedule edge functions on
      its own. In the Supabase Dashboard → SQL Editor, run once:
      ```sql
      create extension if not exists pg_cron with schema extensions;
      create extension if not exists pg_net with schema extensions;

      select cron.schedule(
        'send-daily-reminders',
        '0 15 * * *', -- 15:00 UTC ≈ 19:00 Baku time (UTC+4) — adjust as you like
        $$
        select net.http_post(
          url := 'https://<project-ref>.supabase.co/functions/v1/send-daily-reminders',
          headers := jsonb_build_object(
            'Authorization', 'Bearer <service role key, from Settings → API>',
            'Content-Type', 'application/json'
          )
        );
        $$
      );
      ```
      Re-run `cron.schedule` with the same job name any time to change
      the hour; `select cron.unschedule('send-daily-reminders');` to
      stop it.

12. **In-app purchases** (`mobile/src/lib/iap.ts`,
    `app/parent/(tabs)/premium.tsx`, `verify-apple-purchase`) — iOS
    only, via [expo-iap](https://github.com/hyodotdev/openiap) and the
    App Store Server API. The client asks the App Store to run the
    purchase, but a purchase is only ever recorded as real once our
    own backend has independently asked *Apple* whether that
    transaction is genuine and currently active — never taken on the
    client's word — so this step needs real App Store Connect
    products and a server API key before purchases work end to end.

    - **Create the subscription group and products**, in
      [App Store Connect](https://appstoreconnect.apple.com) → your
      app → Monetization → Subscriptions:
      - Make sure Agreements, Tax, and Banking (App Store Connect →
        Agreements, Tax, and Banking) are complete — Apple won't let a
        subscription go live otherwise, though you can create and test
        it in Sandbox before that's done.
      - Create one subscription group (e.g. "Muslim Kids World
        Premium"), then two auto-renewable subscriptions inside it,
        with **exactly** these product IDs — `0016_iap.sql` already
        maps these to the `single` / `family` plans:
        - `com.muslimkidsworld.app.single.monthly`
        - `com.muslimkidsworld.app.family.monthly`
      - Set each one's price, subscription duration, and localized
        display name/description to match `content.plans.*` in
        `mobile/src/i18n/locales/*.json`. The price shown in the app
        (`premium.tsx`) comes from the App Store itself once products
        load — the `$4.99`/`$7.99` strings in `mobile/src/data/mock.ts`
        are only the pre-load fallback.
      - If you ever change a plan's `slug` or add a new plan, add a
        matching `apple_product_id` to `subscription_plans` (SQL
        Editor: `update public.subscription_plans set apple_product_id
        = '...' where slug = '...';`) and create the matching product
        in App Store Connect — the two have to stay in sync by hand.

    - **Create an In-App Purchase API key**, in App Store Connect →
      Users and Access → Integrations → In-App Purchase: generate a
      key, note its **Key ID** and your account's **Issuer ID** (shown
      on the same page), and download the `.p8` file (only downloadable
      once). This is what lets `verify-apple-purchase` ask Apple
      directly "is transaction X real and active" instead of trusting
      whatever the client sends.

    - **Set the function's secrets**, from the repo root:
      ```
      supabase secrets set APPLE_IAP_KEY_ID=<Key ID>
      supabase secrets set APPLE_IAP_ISSUER_ID=<Issuer ID>
      supabase secrets set APPLE_IAP_PRIVATE_KEY="$(cat /path/to/SubscriptionKey_XXXXXXXXXX.p8)"
      supabase functions deploy verify-apple-purchase
      ```

    - **Testing**: use a
      [Sandbox Apple ID](https://developer.apple.com/apple-developer-program/sandbox/)
      signed into the Sandbox App Store account on your test device
      (Settings → App Store → Sandbox Account, on the device, not the
      simulator's regular Apple ID) and a real build (EAS build /
      TestFlight, not Expo Go — `expo-iap` needs to be compiled in).
      Sandbox purchases go through `verify-apple-purchase` exactly like
      production ones; the function tries Apple's production endpoint
      first and automatically falls back to the sandbox endpoint on a
      404, so no separate sandbox configuration is needed.
    - **Renewals/cancellations Apple processes on its own** (not just
      a purchase or "Restore purchases") reach `subscriptions` too, via
      `apple-server-notifications` — [App Store Server Notifications
      V2](https://developer.apple.com/documentation/appstoreservernotifications).
      Deploy it and turn off its JWT check (Apple can't send a
      Supabase key — this is already set in `supabase/config.toml`,
      just needs to actually be deployed):
      ```
      supabase functions deploy apple-server-notifications
      ```
      Then in App Store Connect → your app → App Information → App
      Store Server Notifications, set the **Production Server URL**
      (and, if you want sandbox notifications delivered too, the
      **Sandbox Server URL**) to:
      ```
      https://<project-ref>.supabase.co/functions/v1/apple-server-notifications
      ```
      Read `supabase/functions/apple-server-notifications/index.ts`'s
      header comment for why this doesn't need Apple's full x5c
      certificate-chain verification to be trustworthy: it never
      trusts the incoming notification's contents, only uses them to
      look up which family's subscription to re-check, then asks
      Apple's App Store Server API directly (the same
      `resolveSubscriptionFromApple()` call `verify-apple-purchase`
      uses) — the write always comes from that authenticated response,
      never from the notification body itself.
    - Both functions share `_shared/appleIap.ts` (JWT signing, calling
      Apple's API, decoding its JWS responses) — extend that one file
      if Apple's API surface changes rather than touching either
      function's own logic.

## Admin panel

`admin/index.html` — a single, dependency-free static file (loads
`@supabase/supabase-js` from a CDN, no build step) for editing the
content that's actually live-read from the database today: Quran text
and translations, and achievements. Duas, Stories, and Quiz content
still come from `mobile/src/data/mock.ts` + i18n, not these tables
(see the stub note below), so this deliberately doesn't cover them
yet — an editor for tables the app doesn't read would just be
confusing.

1. Run `0015_admin_panel.sql` (already included if you ran `supabase
   db push` per the steps above).
2. Flag your own account as admin, in the Supabase SQL Editor:
   ```sql
   update public.parents set is_admin = true where email = 'you@example.com';
   ```
3. Open `admin/index.html` directly in a browser (double-click it, or
   `open admin/index.html`) — no server needed. First run asks for
   your Project URL and anon key (Project Settings → API), which it
   saves only in that browser's `localStorage`. Then sign in with the
   same email/password as your parent account.
4. To share it with other admins without emailing a file around, host
   it anywhere that serves static files (Netlify, Vercel, GitHub
   Pages, an S3 bucket) — it's one HTML file, nothing to build.

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
- **Multi-child devices are supported.** `family_codes.active_child_id`
  (`0014_active_child.sql`) records which child a shared device is
  currently acting as; `_shared/resolveChild.ts` (used by
  `get-child-progress`, `record-quiz-result`, `mark-journey-item`,
  `register-push-token`) reads it, falling back to the family's oldest
  child when it's never been set — the original single-child
  behavior, unchanged for families that never touch this. Only a
  parent can change it: `app/child-select.tsx` lists the family's
  children (`list-family-children`, unauthenticated — the list itself
  isn't sensitive) and switching one in re-verifies the Parent Gate
  PIN server-side (`set-active-child`), since a child device has no
  parent auth session to authorize the write with otherwise.
- **The achievement-badge grid is fully real now, all 6 badges.**
  `_shared/achievements.ts` (extracted from `record-quiz-result`, now
  also called by `mark-story-read` and `mark-world-visit`) evaluates
  every achievement's `criteria` (`0008_achievement_criteria.sql`)
  against the child's up-to-date totals and awards a
  `child_achievements` row the moment it's met; `get-child-progress`
  returns the earned slugs and `app/child/(tabs)/rewards.tsx` only
  shows a badge as earned if it's in that list — `badges_count` is the
  real `child_achievements` row count, not a static number.
  `first-star` (`correct_answers`), `week-streak` (`streak`), and
  `quiz-master` (`questions_answered`) come from quiz results;
  `book-lover` / `storyteller` (`stories_read`, `child_story_reads`)
  come from opening a story (`app/child/stories/[id].tsx` calls
  `mark-story-read` alongside its existing `markJourneyItem("story")`);
  `mosque-visitor` (`world_visited`, `child_world_visits`) comes from
  opening the "mosque" site in the new "Muslim World" explore feature
  (`app/child/world.tsx`, `app/child/world/[id].tsx` — content in
  `mobile/src/data/mock.ts` `worldSites` + i18n
  `content.worldSites.*`, same deliberate mock.ts+i18n pattern as
  Stories/Dua, see below).
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
- **iOS in-app purchases are wired up; other providers aren't.**
  `verify-apple-purchase` and `apple-server-notifications` (see
  "In-app purchases" above) both write real `subscriptions` rows once
  they've independently confirmed a transaction with Apple —
  `external_provider` is `'apple'`, `external_subscription_id` is
  Apple's `originalTransactionId`. Between the two, both an in-app
  purchase/restore and a renewal/cancellation Apple processes on its
  own are covered; there's no Play Store or Stripe path at all, since
  the user scoped this pass to iOS only.
- **Admin panel covers Quran + achievements, not everything.**
  `admin/index.html` (see above) edits `quran_surahs`/`quran_verses`/
  `quran_translations` and `achievements` — the content types the app
  actually reads from the database. `duas`/`stories`/`quizzes`/`games`
  still read from `mobile/src/data/mock.ts` + i18n (see below), so an
  editor for those tables wouldn't do anything yet; extending the
  admin panel to them is only worthwhile once those screens move off
  mock data.
- **"Daily limit reached" push notification is built.**
  `families.daily_limit_minutes` (`0019_screen_time.sql`) is a real,
  parent-set, shared setting now — `app/parent/daily-limit.tsx` writes
  it directly (RLS-scoped, same as other parent writes), and
  `get-child-progress` returns it to the child app. Actual elapsed
  time is tracked too: `ScreenTimeTracker` (mounted in
  `app/child/_layout.tsx`) reports ~1 real foreground minute at a time
  to `record-screen-time`, which accumulates
  `child_daily_activity.minutes_spent` and pushes every parent once,
  the moment that day's total first reaches the limit (not on every
  call after, so it doesn't spam). The child home screen's progress
  bar (`app/child/(tabs)/index.tsx`) now reflects this real value
  instead of a fake per-item-minutes sum.
