# Backend Architecture (Core Entities)

Core entities:

- `Parent`
- `Child`
- `Family`
- `Subscription`
- `ChildSlot`
- `Device`
- `Question`
- `Answer`
- `Lesson`
- `QuizResult`
- `XP`
- `Reward`
- `WorldItem`
- `Mission`
- `Notification`
- `Event`

## Primary relationship

```
Parent
  ↓
Family
  ↓
Subscription
  ↓
Child Slots
  ↓
Children
```

This structure lets the Single Child (1 slot) and Family (3 slots)
subscription tiers be enforced consistently: a `Family` owns a
`Subscription`, the subscription's plan determines the number of
`ChildSlot`s available, and a `Child` can only be created or linked while a
free slot exists.

## Localization data shape

Content and users carry **language** and **country** as separate,
independently-set fields (see [`localization.md`](localization.md)):

- `Country` drives IP-based defaults, regional pricing, and local event
  timing (e.g. local Ramadan/prayer times).
- `Language` drives what content is rendered, and is resolved from
  device language, IP-derived country, and explicit user preference, in
  that priority order.

Translatable content (`Question`, `Lesson`, `Notification`, etc.) is stored
per-language with a review status (see localization workflow), not
machine-translated and published directly.
