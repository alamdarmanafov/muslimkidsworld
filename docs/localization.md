# Global Localization Strategy

Muslim Kids World is a global product. Language is **not** determined by IP
address alone — IP-based country detection, device language, and explicit
user choice are combined, because IP-only detection gets it wrong whenever
someone is traveling or their phone is already set to a different language
than their country's default.

## Resolution order

```
User Preference  >  Device Language  >  Country (from IP)
```

1. **Device language** is read first (e.g. `en`, `tr`, `ar`, `az`).
2. **Country** is derived from IP address (e.g. Azerbaijan → Azerbaijani,
   Turkey → Turkish, Saudi Arabia → Arabic, UK → English, Germany →
   German).
3. If device language and IP-derived country disagree, **device language
   wins**. Example: the device is physically in Azerbaijan but its system
   language is English → show English, not Azerbaijani.
4. Once the user picks a language explicitly (in onboarding or Settings),
   that **preference overrides everything** going forward.

## Onboarding

The app never silently forces a language. On first launch:

> Welcome! 👋
> We detected your language as English.
> [Continue in English]   [Change language]

Users can always change the language later from **Settings → Language**.

## Privacy

IP address is used **only** to infer country at a coarse level for
localization purposes (language default, regional pricing, seasonal
content). Precise GPS/location is not required and should not be
requested for this purpose.

## Launch languages

Initial supported languages:

| Flag | Language |
|---|---|
| 🇬🇧 | English |
| 🇸🇦 | Arabic |
| 🇹🇷 | Turkish |
| 🇦🇿 | Azerbaijani |
| 🇮🇩 | Indonesian |
| 🇲🇾 | Malay |
| 🇵🇰 | Urdu |
| 🇧🇩 | Bengali |
| 🇫🇷 | French |
| 🇩🇪 | German |

Additional languages are added later based on usage statistics.

## Content translation workflow

Because this is children's religious/educational content, machine
translation is never published directly. Every piece of translatable
content (questions, lessons, notifications, etc.) goes through:

```
🟡 AI Generated  →  🔵 Under Review  →  🟢 Published
```

A human reviewer must approve AI-generated translations before they go
live. Each translatable item is tracked per language with its own status,
e.g.:

> **Q-1024**
> - English: "What is Ramadan?" — 🟢 Published
> - Arabic: "ما هو رمضان؟" — 🟢 Published
> - Turkish: "Ramazan nedir?" — 🔵 Under Review

## Admin visibility

The Admin Dashboard's **Languages** settings page shows coverage per
language:

| Language | Status | Questions | Lessons |
|---|---|---|---|
| English | 🟢 | 1,240 | 180 |
| Arabic | 🟢 | 1,240 | 180 |
| Turkish | 🟢 | 1,100 | 165 |
| Azerbaijani | 🟢 | 800 | 120 |
| German | 🟡 | 400 | 60 |

Admins can translate/edit any content item per language from here.

## Language vs. Country

Language and country are stored and configured **separately**, not
coupled, since a country can contain multiple languages and a language can
span multiple countries:

- Country: UK 🇬🇧 → Language: English
- Country: Azerbaijan 🇦🇿 → Language: English *or* Azerbaijani

Keeping them independent enables future regional features without
re-architecting:

- Regional content
- Local Islamic events
- Local Ramadan/prayer timing
- Local currency
- Region-based subscription pricing
