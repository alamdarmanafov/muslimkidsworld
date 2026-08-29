# Product Plan

Two products share one backend:

- **📱 Mobile App** — Parent + Child experiences
- **🖥️ Admin Dashboard** — platform administration

Principle: **parents pay, children use, admins manage.**

---

## 📱 Mobile App

### 1. Welcome / Onboarding

First launch:

> Muslim Kids World
> Learn • Play • Grow

Choice:
- 👨‍👩‍👧 I'm a Parent
- 🧒 I'm a Child

### 2. Parent Account

Registration via:
- Apple Login
- Google Login
- Email + Password (with email verification)

Then, **Create your family**:
- Parent name
- Country
- Language
- Parent PIN
- Face ID / Touch ID

### 3. Parent Dashboard (Home)

> Good evening, Ahmed 👋

**Your Family**
- 👦 Ali — 8, 🔥 7 day streak
- 👧 Leyla — 6, 🔥 12 day streak

**Quick Stats**: 🧠 questions completed · ✅ accuracy · ⏱ learning time · 🔥 streak · ⭐ XP

### 4. Child Management

**My Children** — each child has a card:

> Ali — 8 years old — Level 12 — 850 XP — 87% accuracy — 7 day streak

Actions: View Progress, Edit Profile, Deactivate.

### 5. Add Child

Parent → Add Child, entering: Name, Age, Gender, Avatar.

The system generates a one-time **Child Code** (e.g. `482719`, expires in 10
minutes). On the child's own device: **Enter Family Code** → the code links
that device's child profile to the family. The code is single-use.

### 6. Family Limit System

| Plan | Slots |
|---|---|
| Single Child | 1 child slot |
| Family | 3 child slots |

Backend shape:

```
Family
 ├── Subscription
 ├── Child Slot 1
 ├── Child Slot 2
 └── Child Slot 3
```

If all slots are full: `❌ No child slots available.` Sharing the code with
someone else does not create additional slots — a family cannot exceed its
plan's slot count.

### 7. Device Management

Parent Dashboard → Devices, per child (e.g. Ali: 📱 iPhone, 📱 iPad).

New device sign-in triggers: **"New device detected"** → parent must
**Approve / Reject**. This keeps account sharing under parental control.

### 8. Subscription

| Plan | Price | Children |
|---|---|---|
| Free | — | 1 child, Daily 10, basic lessons, basic world, limited rewards |
| Single Child | $4.99/mo or $39.99/yr | 1 child |
| Family | $7.99/mo or $59.99/yr | up to 3 children |

Parent Subscription screen shows: current plan, renewal date, children using
slots, and actions to Upgrade, Cancel subscription, Restore purchase.

### 9. Child App

Children never see the parent interface.

**Home**
> Hi Ali! 👋 🔥 7 Day Streak

- Today's Mission: 🧠 Daily 10
- 📚 Continue Learning
- 🎮 Games
- 🌳 Good Deeds

### 10. Daily 10

10 questions per day: 5 image questions (📸) + 5 text questions (📝).

Topics: Islam Basics, Quran, Prophets, Good Manners, Ramadan, Salah, Islamic
History, Halal & Haram. Difficulty scales with the child's age.

### 11. Rewards

On completing the Daily 10 (e.g. 8/10): ⭐ XP earned, 🔥 streak +1, 🎁 reward
unlocked. XP unlocks: avatars, clothes, room decorations, garden items, and
world items.

### 12. Muslim World (virtual world)

- 🏠 **Home** — the child's personal house
- 🕌 **Mosque** — mini lessons + activities
- 📚 **Knowledge Center** — lessons
- 🌳 **Good Deeds Garden** — grows as the child does good deeds
- 🌙 **Ramadan Village** — special seasonal area during Ramadan

### 13. Good Deeds

The child logs a deed (e.g. "Today I helped my parents.") or the parent
assigns a task (e.g. "❤️ Help your mom"). Completing it grows a 🌱 tree.
This uses **virtual** rewards only — no real-money rewards.

### 14. Parent Progress

> Ali — Weekly Report
> Questions: 70 · Correct: 61 · Accuracy: 87% · Learning time: 42 min
> Strong areas: 🕌 Islam Basics
> Needs practice: 📖 Quran Basics
> Streak: 🔥 7 days

### 15. Parent Notifications

Examples:
- 🎉 Ali completed today's Daily 10.
- 🔥 Ali reached a 7-day streak.
- 🏆 Ali unlocked a new reward.
- 📚 Ali hasn't completed today's lesson yet.

Parents can manage/mute these notifications.

### 16. Child Safety

On the child profile:
- No direct messaging
- No public chat
- No stranger interaction
- No advertising
- No payment
- No external links without parental controls

**Parent Gate**: entering Parent area, Subscription, Settings, Account
deletion, or Device management requires PIN / biometric authentication.

---

## 🖥️ Admin Dashboard

### 17. Admin Home

**Overview**: 👨‍👩‍👧 Parents · 👦 Children · 💳 Premium subscribers · 🔥 Active
today.

**Revenue**: MRR, ARR, new subscriptions, churn, renewals.

### 18. Users (Parents)

Search by name, email, country, subscription, registration date.

Parent profile shows: plan (e.g. 👑 Family), children (e.g. 3/3), devices,
subscription status. Actions: View, Suspend, Delete, Reset account.

### 19. Children

Admin can see: Child ID, age group, parent account, XP, level, streak, quiz
performance, last active.

> **Important**: minimize sensitive child data stored in the admin panel and
> enforce role-based access control.

### 20. Subscriptions

Admin manages Plans (Single Child, Family) and views status buckets: Active,
Cancelled, Trial, Expired, plus revenue.

### 21. Quiz Management

One of the most important admin areas.

Create Question: question text, image upload (📸), answers A–D, correct
answer, age range (e.g. 8–10), category (e.g. Islam Basics), difficulty
(⭐ Easy / Medium / Hard).

### 22. Lesson Management

Create Lesson: title (e.g. "The Five Pillars of Islam"), age range, content
(text, image, audio, video, quiz). Publishing flow: **Draft → Review →
Published**.

### 23. Game / World Management

Admin manages virtual-world content: buildings, avatar items, clothes,
decorations, rewards, XP values, unlock levels.

Example: "Golden Mosque" — unlocks at Level 15.

### 24. Events / Seasonal Content

Admin creates events (e.g. Ramadan Event) with: start/end dates, daily
missions, special quizzes, rewards, world decorations. The same system later
supports Eid, Hajj season, Islamic New Year, etc.

### 25. Notification Center

Create Notification: title (e.g. "New Daily Challenge! 🔥"), target audience
(all users, parents, specific age, specific country, premium users), and
schedule (date + time).

### 26. Analytics

- **Engagement**: DAU, WAU, MAU
- **Learning**: questions/day, completion rate, average score
- **Retention**: Day 1, Day 7, Day 30
- **Subscription**: conversion, churn, renewal
- **Most popular**: lessons, questions, games, rewards

### 27. Admin Settings

Languages, countries, subscription prices, age groups, XP system, reward
system, notifications, feature flags, privacy, terms, support.

### 28. Admin Roles

Not everyone gets full access:

| Role | Access |
|---|---|
| Super Admin | Everything |
| Content Manager | Quiz + lessons |
| Support | Users + subscriptions |
| Analyst | Analytics only |
| Moderator | Content review |

---

## MVP Scope

Keep the first version deliberately small.

**📱 App**
- Parent: registration, dashboard, add child, child code, subscription, progress
- Child: profile, Daily 10, XP, streak, basic rewards, basic world

**🖥️ Admin**
- Users, children, subscriptions, questions, lessons, rewards,
  notifications, basic analytics

**Later phases**: AI Question Generator, voice learning, Quran pronunciation
practice, free multiplayer challenges, a full Ramadan World, and a larger
virtual world.
