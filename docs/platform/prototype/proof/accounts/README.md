# Private account connection proof

November 5, 2026. **Fixture** rendering and HTTP proof, with separate disposable
PostgreSQL 17 policy proof. No hosted sign-in code, private member record or live
Supabase write was used.

## Rendered checks

- Chrome 149: keyboard email/code sign-in, invalid code preserving the input,
  sign-in recovery, explicit private save and the Saved header. A captured save
  request contained only `version`, `initiative`, `needs`, `offers`, `funding`.
  Synthetic unfinished source words and file bytes were absent. JavaScript saw no
  session cookie or localStorage Auth token.
- Brave 156, a fresh isolated browser context: signed in to the same synthetic
  account, listed the earlier saved card and loaded its initiative, need and offer
  into a fresh device draft. No local draft was sent merely by signing in.
- ChatGPT in-app browser: inspected Settings at 360 × 800 and 1280 × 900 in both
  themes, with native inputs, labels and keyboard submit. Primary and secondary
  actions remain readable, focus is visible, page title and h1 agree, and the
  account choices use the existing design-system forms and notices. The email
  step places focus on the code. Loading has a distinct confirmation with Cancel.
- In-app browser: added unfinished Describe words to a loaded card, returned to
  Settings, loaded the account card, restored the device backup, and verified the
  unfinished words remained in the Describe textarea. A fresh device with no
  stored draft correctly has no backup to list.
- Reduced motion was enabled for the desktop-browser checks. No new motion or
  CSS was introduced. The design checks cover both-theme contrast and tokens.

The five-minute review found misleading device-only copy in the card preview and
an unconditional backup-success sentence. Both were corrected. The interim entry
through Settings is recorded in DL-030 for maker review; contextual dialogs remain
later work. Screenshot export from the Chrome/Brave tools failed; the in-app
screenshots were inspected during the review and are not committed artifacts.

## Reproduce safely

Run `WEAVE_ACCOUNT_FIXTURE=1 bun run --filter @weave/app dev`. Open Settings and use
`example@weave.test` with `12345678`. The dev-only account transport is in memory,
never calls Supabase and sends no email. Complete and check a synthetic initiative,
needs and offers before saving. A second isolated browser can load that saved copy.
Restarting this server clears only its synthetic account records. The production
entry never reads `WEAVE_ACCOUNT_FIXTURE`.

## Automated evidence

`bun install --frozen-lockfile` changed no dependencies or lockfile. `bun run ci`
builds the app and API, tests sign-in cookie and request boundaries, native HTTP
Auth/RPC transport, revoked-session and provider failures, checked-document
roundtrips, retry identity, conflicting tabs, quota failure and backup recovery.
Production-bundle checks reject the fixture email, label and cookie name.

The website suite separately applies all seven migrations to disposable Postgres
17 with synthetic Auth stubs, then runs all seven SQL access suites. The Weave
suite proves owner reads, denied anonymous/non-owner/steward/spoofed-metadata
reads, unconfirmed/expired/revoked sessions, direct-write denial, complete save/load,
idempotent receipts, stale revisions, validation, private-only visibility and
30 acknowledged saves per account per hour with free retries.

This is not hosted Auth, SMTP, PostgREST or deployed route proof. The migration and
app PRs require independent Auth/RLS review and approved hosted configuration
before real sign-in can be verified. Account export/deletion, sharing, reminders,
editors and automatic refresh are outside this private connection.
