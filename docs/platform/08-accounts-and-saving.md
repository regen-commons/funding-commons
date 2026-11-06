# Saving initiatives and accounts

Status: proposed full flow; private account connection live · Updated: 5 November 2026
Companion documents: [PRD](04-prd.md) · [technical spec](05-technical-spec.md) · [DESIGN.md](../../DESIGN.md) · [example pages](../../packages/design-system/patterns/pages/finish.html)

This Step 0 revision places [prototype decisions 17 to 20 and 24](prototype/review-decisions.md#saving-sharing-and-partners), with the small-task presentation from decision 23. Two ways to be on Weave, partners for shared initiatives and one email door remain council proposals in [D26 to D28](open-decisions.md#for-the-council), recorded as proposed in [DL-019 to DL-021](../../packages/design-system/decision-log.md#dl-019-partners-are-for-shared-initiatives). The technical specification and example pages still describe parts of the earlier flow; their follow-up changes are tracked in the review decisions. Step 0 changed no schema, sign-in service or email.

People should give an email because it does something for them, not because a wall stops them. So saving is separate from sharing, and an email is only requested at the moment it helps. The rest of this document says how.

## Private account connection

The November 5 implementation connects a narrow private-saving flow to the existing
Regen Commons Website Supabase project (`ztygpuzldujfsqrubxic`). It is live at
[Weave](https://weave.regencommons.com) after authorized release. The rest of this document remains
the proposed full flow. This slice brings account saving forward from interface
Step 7; it does not require finishing the remaining fixture screens first.

- **Entry and choice.** Account in the header and Save or load your card on Finish
  open Settings. Email verification reveals the account's saved cards before a person
  chooses Save or Load. Signing in alone never sends the device card. Step 7 adds an explicitly opened contextual dialog and keeps Finish's
  email/code flow inline.
- **Stored copy.** Save sends the checked initiative, kept needs and offers and kept
  funding details only. Conversations, file bytes, open edits, assistant records and
  inferred confidence stay on the device. All server records are private and owner
  readable. Editors, public sharing, first-save mail, reminders and the membership
  handoff are outside this connection.
- **Sessions.** `/api/account` calls Supabase Auth and the `weave` RPCs using native
  fetch, a publishable key and the person's access token. The token stays in a Secure,
  HttpOnly, SameSite=Strict, host-only cookie for at most one hour. No refresh token
  is retained. Reauthentication preserves the device draft. Browser storage holds
  no Auth tokens; no Supabase SDK dependency or CSP widening is needed.
- **Recovery.** A persisted request UUID and expected server revision make retries
  idempotent and stale saves explicit. A lost response can be retried. Loading first
  archives the complete current device draft and files in the same IndexedDB
  transaction that replaces it. Settings can restore those backups. A quota or
  conflicting tab stops replacement, preserving the visible words. Signing out
  leaves device drafts and backups, as the UI explains for shared devices.
- **Identity and mail.** The shared Auth pool creates accounts without creating
  membership rows. Keep eight-digit codes and the current one-hour expiry. The
  website PR proposes generic sign-in template wording that works for both apps;
  it does not install the planned email hook or send a first-save email.

Server-only variables configured for the **Weave Vercel project**, production only:

| Variable | Value |
|---|---|
| `WEAVE_ACCOUNTS_ENABLED` | `true` only after the migration, Data API and mail checks |
| `WEAVE_SUPABASE_URL` | `https://ztygpuzldujfsqrubxic.supabase.co` |
| `WEAVE_SUPABASE_PUBLISHABLE_KEY` | The project's publishable key, held in server settings |
| `WEAVE_OTP_DIGITS` | `8`, matching the existing shared Auth setting |

The website repository owns `20261105082413_weave_private_accounts.sql`. The exact
migration is applied and recorded in hosted migration history. Its
[PR #12](https://github.com/regen-commons/website/pull/12) still needs approval from
someone other than its last pusher before GitHub will allow a merge. The independent
technical Auth/RLS review found no release blockers; it does not replace that
repository approval. Do not reapply or rename the migration. `weave` is exposed
through the Data API; `private` remains unexposed. No service-role key is used.
Disabling the
app flag stops its account route; removing `weave` from exposed schemas also stops
direct Data API access. Preserve stored rows during rollback.

[Production proof](prototype/proof/accounts/README.md#production-verification)
covers live code sign-in, private save, second-browser load and reload, backup
recovery, session-scoped sign-out and cross-account denial. Resend's reserved test
recipients simulated delivery; no personal inbox or existing steward account was
accessed. Both shared Auth templates now use the reviewed generic code wording.
The existing SMTP credentials, eight-digit codes and one-hour expiry were preserved.
Personal inbox delivery and the steward's own sign-in remain unverified. Local HTTP
and disposable PostgreSQL 17 proof cover the remaining failure boundaries.

## The decision

1. **Separate saving from sharing.** Saving keeps a private copy on the server. Sharing is a later, separate choice. The old flow tied both together at "publish".
2. **Show value first.** The whole conversation, first funding and the partner-match count work with no email. Partner cards depend on sharing, not saving.
3. **Ask for an email and nothing else.** No name, no password, no organisation, no boxes to tick.
4. **One email door.** Save, share, remind and introduce all save the current initiative to the verified email and resume the requested action. Never say "create an account". Say "Keep this initiative" and "Email me a code". Once signed in, the action happens without asking for the email again, with sharing and introduction confirmations preserved.
5. **Keep saving where the reason is.** On Finish and Partners before sharing, the share card explains what saving or sharing opens and holds the email field and code step. Unprompted saving stays inline, once per seam; Not now stays declined. Small tasks the person opens use a dialog on wide screens and a bottom sheet on phones. Never interrupt with an unsolicited dialog or wall. See [DL-027](../../packages/design-system/decision-log.md#dl-027-tooltips-pop-ups-for-small-tasks-and-settings-in-place).
6. **Give true reasons.** Work saved only in a browser can vanish. Say so where it is true, and do not invent any other pressure.

The books have no data on when to ask for sign-up. Krug's chapters on goodwill and mobile point this way, but this remains a hypothesis to test with people. See the [testing plan](../../packages/design-system/principles/usability-testing.md).

## Lifecycle

Draft is local storage state; Private and Shared are the two visibility choices. Withdrawn and Hidden describe record status or moderation, not additional visibility choices. People read the words in the second column. Removing the signed-in-only visibility level is proposed in D26.

| State | Label | Where it lives | Who can see it |
|---|---|---|---|
| Draft | Saved on this device only | The browser (IndexedDB) | Only that browser |
| Private | Private, for finding funding | `weave.initiatives`, `visibility = 'private'` | The owner and editors they add |
| Shared | Shared with the community | `visibility = 'public'` | Everyone through a public page and directory entry; onward sharing needs separate consent |
| Withdrawn | Withdrawn | `status = 'withdrawn'` | The owner, who can restore or delete it |
| Hidden | Hidden by a steward | `steward_hidden = true` | The owner and stewards, with a stated reason |

Rules:

- **Only the owner changes visibility.** A steward can hide a shared record, but never make a record more visible.
- **Moving to Private, or withdrawing,** stops future sharing and sends a retraction to connected networks.
- **Private initiatives get funding and partner counts.** The Partners share card shows how many partners match and how to share. There are no partner names, individual cards, reasons or veiled previews until sharing (give to get). Team slots also show counts only. Private initiatives never appear in anyone else's matches, lists, place pages or counts per initiative. The public directory remains browsable; this is the product's matching rule, not a promise to conceal public records.
- **Stewards cannot read private initiatives.** Nothing there has been shared, so there is nothing to tidy. Aggregate counts are fine.
- **An introduction shares with one person.** Introductions open with partner names, once your initiative is shared on the list. Asking for one then shows your full card to that recipient only, after you confirm, without changing what anyone else can see.
- **Returning to private stops future discovery and introductions.** Whether an already open introduction remains available is [D31](open-decisions.md#for-the-builders). The prototype keeps it open; that is a labelled fixture default until the policy is confirmed, not a live privacy promise.
- **One email can hold several initiatives.** An initiative can add editors later.

Examples:

- Ana finishes all three steps on her phone and closes the tab. She comes back the next day in the same browser, and the draft is there. No email was involved.
- Ana saves with her email, then signs in on a laptop. She sees her private initiative, funding matches and the share card with partner counts. Signing in does not open partner names.
- Ana chooses Shared with the community and confirms. Her public page and directory entry appear, and Partners and team slots can show candidates. Onward network sharing stays off until separately chosen.
- Ana taps Remind me for one fund. If signed out, she verifies her email, saves the initiative privately and enables that reminder; if signed in, it is enabled immediately. Neither path enables a weekly update.
- Ana started a second draft on the laptop before signing in. After the code she sees both, and chooses to keep them as two initiatives or replace the saved one. Nothing is silently overwritten.
- Ana types the wrong email. Nothing is created until a code is confirmed. She taps Wrong email?, fixes it, and her draft is untouched.
- A steward opens the desk. Ana's private initiative does not appear, and a direct query is refused by row-level security.
- A person with a private initiative tries to appear in a place page. They cannot, and the page tells them to choose who can see it.

## Never needs an email

- Browsing funders, programs, public initiatives, places and partnerships.
- Search and filters.
- The full three-step conversation, by typing, speaking or attaching a file.
- Local AI, and consenting to cloud AI for one step.
- Seeing funding matches and their reasons for a draft, plus the partner-match count and how to share. Individual partner reasons arrive with cards after sharing.
- Copying or downloading your own draft.
- Help, privacy pages, and the "still accurate" and unsubscribe links in email.

## What an email gets you

| A person wants to | So we ask when they tap | They get |
|---|---|---|
| Not lose their work | Save, in the status line or the panel | A private copy on any device |
| Hear before a fund closes | Remind me before it closes | One email about that fund, and nothing else unless they choose |
| Reach a partner | Ask for an introduction | A relayed message, because the other side needs a way to reply |
| Join a partnership | Ask to join | A place in it, with updates about it |
| Be found | Who can see it | A shareable page and a place in other people's matches |
| Claim an imported record | This is us | Control of a record someone else entered |
| Hear about their region | Send me a weekly update | A short weekly email, with a preview first |

Gated actions say so before the tap: "They need a way to reply, so this asks for your email." Every action needing an email uses the same door: code confirmation saves the current initiative to that email, privately unless the person separately confirms sharing. A known email follows the same flow; it is never disclosed before code confirmation.

## When we ask

An unprompted offer appears once per seam, inline. An explicit action opens in place over the current page when it does not already sit in a share card.

1. **After the first confirmed card.** The status line reads "Saved on this device only" and links to saving. Nothing else moves.
2. **When first funding appears.** Finish shows first funding, the share card and the person's card. Partners before sharing uses the same share card. The email and code stay inside it, next to the reason to save or share. The existing finish example needs updating with its pattern.
3. **At the action that needs it.** Remind me, Ask for an introduction, Ask to join, Who can see it.

Never at arrival, mid-recording or mid-edit, and never again after Not now, except when the person taps an action that needs it. Sign in, save, share and delete opened by the person use a dialog on wide screens and a bottom sheet on phones. The unprompted Finish prompt remains inline.

## The flow

The [code panel](../../packages/design-system/COMPONENTS.md#organisms) does this everywhere.

1. **Email.** One field. It requests a code and subscribes to nothing.
2. **Code.** One field with `autocomplete="one-time-code"` and `inputmode="numeric"`. It accepts a pasted code, with or without spaces. The page says where the code went, with Wrong email? and Send a new code after 60 seconds.
3. **Save, then resume.** After the code, save the current draft to the verified email, then complete the requested action in place. Save stores a private copy; Remind me enables the chosen reminder; Share and Ask for an introduction retain their explicit confirmation before publishing or sending. Do not send the person to a home page. Signing in still uses R40's merge without overwriting existing work.
4. **Confirm.** "Saved. Only you can see it." If the person then confirms sharing, show the shared state instead. The header shows Saved and an account button leading to Settings.
5. **First email.** A link back to the initiative, the card and the first matches. It should be worth opening. It is the only email they get until they choose more.
6. **Then choose.** Offer "Private, for finding funding" and "Shared with the community", with Private selected. Sharing onward is a separate, default-off choice. Ask about the weekly update separately, later, with a preview and nothing pre-selected.

### When things go wrong

| What happens | What the person sees | What must hold |
|---|---|---|
| The email is slow | It can take a minute to arrive. Check your spam folder if it does not. | The draft stays safe. The page survives a round trip to the mail app. |
| Wrong code | That code does not match. Check it, or send a new one. | What they typed stays. |
| Expired code | That code has expired. We can send a new one. | One tap to resend. |
| Rate limited | We have sent a few codes already. Try again in 10 minutes. | State the limit, never fail silently. |
| Offline | You are offline. Your work is saved on this device. We will try when you reconnect. | The draft is untouched. |
| Browser storage blocked or evicted | The draft on this device was lost. Anything you saved is still linked to your email. | Distinguish a local draft from saved initiatives; offer sign-in to recover saved work, and saving earlier on browsers known to evict. Never imply an unsaved draft can be recovered from the server. |
| Email already known | The same flow, which signs them in. | Never reveal whether an email exists before the code is confirmed. |
| Email never arrives | Show another way to get help. | A contact route for people stuck at this step. |

## Honest nudges

Things that make saving attractive without tricks:

- **The status line tells the truth.** "Saved on this device only" stays visible. iOS Safari can purge a site's storage after seven days without a visit, so on browsers that do this, say so.
- **The card grows.** As a person talks, their card fills in and capital tiles turn from pencil to ink. Keeping it feels natural. This is where the fun lives, along with the voice.
- **The first email has value.** It carries the card and the first matches.
- **Reminders are specific.** A one-tap reminder about one fund, tied to the funding pulse.
- **Real counts explain sharing.** The share card says how many partners match and what sharing opens. Use real numbers only, with a truthful zero state; never invent demand or show veiled partner cards.

Things we will not do: blurred previews, sign-up walls, partial results held back until an email arrives, fake urgency, streaks, pre-checked marketing boxes, repeated prompts after Not now, or a membership pitch straight after saving.

## Accounts are not membership

An account is an email that can sign in. Membership is a separate decision, made through the existing application on regencommons.com. Keep the two apart in language and in data.

- Saving never creates a `members` row and never implies membership.
- Membership lives in the footer, apart from saving and Settings' Leave actions. The separate application can pre-fill from the initiative through the planned membership handoff; saving never initiates it.
- This replaces the idea in earlier drafts that every account is a prospective member, and the target that 30 percent of accounts start an application. Track how many choose to apply, without a target that invites pressure.

## Privacy changes

The earlier promise, that drafts never leave the device until publishing, has to change. The new promise is:

> Your draft stays in your browser until you choose to save it. A saved initiative is private to you until you choose to share it.

The privacy page must say all of this plainly:

- Saving stores a copy on Regen Commons servers. Embeddings computed in the browser are stored with it, so matches can continue.
- People who administer the database can technically read stored records. They are bound by the published data policy. So the label "Only you" describes the product, and the privacy page explains the limit. If that is not acceptable for some groups, they can stay on a device-only draft.
- The matching job reads private embeddings through a restricted role, to produce funding matches and partner counts, without offering private initiatives as candidates to others.
- How to export everything and how to delete everything. Deleting an account deletes its private initiatives and retracts anything shared.

### What we store and what the assistant did

What we store opens over the current page as five short answers, about 55 words in total, with a link to the full data policy. Cover the local draft, the server copy linked to an email, private versus shared visibility, local processing and chosen cloud use, and export or deletion. The short answers do not replace the full policy's administrator-access limit or consent details.

What the assistant did is also a pop-up: one summary line, then one row per step showing where it ran and how many words went to the cloud, never the text. Keep this visible record on the device and allow export and consent withdrawal. It does not replace the server's consent and call audit required by R10; the technical specification owner must align both records before cloud services are connected. Per-field consent is still [D35](open-decisions.md#for-the-builders).

Settings can download a snapshot of this browser's draft and backups, including unfinished words and the original bytes of attached files. It can also download the assistant's metadata separately. Neither download fetches other account cards. Sign-out keeps the device copies. The private account release has no self-service server export or deletion; the delete dialog is a recoverable development example. The data policy explains how to contact Regen Commons about account copies.

## Technical changes

- **Schema proposal.** After council confirmation of D26, align the technical specification and migrations to `visibility in ('private','public')`, default `private`. A draft is not a database state. The spec still has the earlier three-value constraint; do not treat this document as an applied migration. `display_name` remains nullable, since no name is asked for. `digest_frequency` defaults to `off`.
- **Row-level security proposal.** The owner and editors read private rows; shared rows can be read publicly and by stewards. Policy tests must reject a steward reading a private initiative and reject private initiatives as candidates in others' matches. Align policies with the confirmed visibility choice before implementation.
- **Auth email.** Generic code wording is proposed for the private connection. The app-specific Send Email hook remains later work; template and delivery review are required before enabling this connection.
- **Code length.** The project uses eight digits today. Six is easier on phones and safe with attempt limits. It is a project-wide setting, so the steward desk changes too. See the [open decisions](open-decisions.md).
- **Creating users.** The Weave server requests Auth OTP with `create_user: true`. The steward desk stays as it is.
- **Shared limits.** Email rate limits and any captcha are project-wide, so public traffic can affect steward sign-in. Set limits with that in mind, and test them.
- **Sending volume.** Every save sends a code and a first email. Resend's free tier allows 100 emails a day, so move to the paid tier (USD 20) when daily sends approach 100, or before a large public invitation.
- **Draft merge.** On sign-in, compare local drafts with saved initiatives. Never overwrite. Use the local draft ID as an idempotency key, so a retry cannot create a duplicate.
- **Session.** The private connection uses the HttpOnly cookie described above. The earlier browser `localStorage` session proposal is superseded.
- **Mail-app round trip.** Keep the pending email and the action to resume in local storage, so returning from the mail app lands on the code step.

## What we measure

First-party, anonymous step counts only, with no third-party analytics. Watching people use it matters more than these numbers.

- Time from tapping save to saved, on a phone.
- Share of finished conversations that save.
- Share of people who return after choosing Not now.
- Share of saved initiatives that choose to be seen, and how long that takes.
- Codes requested against codes confirmed, and where people drop off.

Do not use accounts created as a measure of success.

## Considered and rejected

- **Anonymous Supabase sign-ins** before the email. They add a server copy nobody asked for, a merge problem and an abuse surface. The local draft already covers this need.
- **Holding matches back until an email arrives.** Funding matches and the partner teaser never wait for an email. Only partner names wait, and they wait for sharing, not for saving (R16): giving to the commons is the price, not an email.
- **Magic links only.** They break in mobile mail apps that open links in an internal browser. Code first, with a link as a secondary option.
- **Passwords and third-party sign-in.** More to manage, more to explain, and no benefit at this scale. R25 already excludes them.
- **Requiring an email at the start of the conversation.** It asks for trust before giving anything back.

## Build order

- **Phase 0:** local draft, status line, code panel and share card, private save, two visibility choices subject to D26, the auth email hook, partner counts with names opening on share, single-fund reminders through the email door, row-level security with tests. This removes the earlier instruction that reminders can wait; D28 asks the council to confirm that scope. The interface uses typed fixture adapters and keeps service entry points out of production until the separate sign-in and email track supplies them.
- **Phase 1:** the weekly update opt-in, draft merge across devices, export and delete, real-count sharing nudges.
- **Phase 2:** editors, per-recipient sharing for introductions, the claiming flow for imported records beyond the seed rows.

The interface handover includes introduction and data-control screens before their live services exist. Render only working fixture controls in development; do not imply an introduction was sent, an account deleted or an export completed against a real service until that adapter exists. The later phase dates above describe services, not permission to expose inert production controls.
