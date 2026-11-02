# Saving initiatives and accounts

Status: proposal · Date: 2026-10-31
Companion documents: [PRD](04-prd.md) · [technical spec](05-technical-spec.md) · [DESIGN.md](../../DESIGN.md) · [example pages](../../design-system/patterns/pages/finish.html)

People should give an email because it does something for them, not because a wall stops them. So saving is separate from sharing, and an email is only requested at the moment it helps. The rest of this document says how.

## The decision

1. **Separate saving from sharing.** Saving keeps a private copy on the server. Sharing is a later, separate choice. The old flow tied both together at "publish".
2. **Show value first.** The whole conversation, the first opportunities and the partner teaser work with no email.
3. **Ask for an email and nothing else.** No name, no password, no organisation, no boxes to tick.
4. **Never say "create an account".** Say "Keep this initiative" and "Email me a code". There is one door, and it has one family of verbs: save and sign in.
5. **Ask inline, once per moment.** No modal and no wall. If someone chooses Not now, that prompt stays gone.
6. **Give true reasons.** Work saved only in a browser can vanish. Say so where it is true, and do not invent any other pressure.

The books have no data on when to ask for sign-up. Krug's chapters on goodwill and mobile point this way, but this remains a hypothesis to test with people. See the [testing plan](../../design-system/principles/usability-testing.md).

## Lifecycle

An initiative moves through these states. People read the words in the second column.

| State | Label | Where it lives | Who can see it |
|---|---|---|---|
| Draft | Saved on this device only | The browser (IndexedDB) | Only that browser |
| Private | Only you | `weave.initiatives`, `visibility = 'private'` | The owner and editors they add |
| Network | People signed in | `visibility = 'network'` | Anyone signed in, narrowed by the access tier |
| Public | Anyone | `visibility = 'public'` | Everyone, plus any sharing the owner turned on |
| Withdrawn | Withdrawn | `status = 'withdrawn'` | The owner, who can restore or delete it |
| Hidden | Hidden by a steward | `steward_hidden = true` | The owner and stewards, with a stated reason |

Rules:

- **Only the owner changes visibility.** A steward can hide a shared record, but never make a record more visible.
- **Moving to Private, or withdrawing,** stops future sharing and sends a retraction to connected networks.
- **Private initiatives get funding matches and the partner teaser.** They see ranked opportunities and how many partners match and why, with names hidden; partner names open once they share (give to get). They never appear in anyone else's matches, lists, place pages or counts per initiative.
- **Stewards cannot read private initiatives.** Nothing there has been shared, so there is nothing to tidy. Aggregate counts are fine.
- **An introduction shares with one person.** Introductions open with partner names, once your initiative is shared on the list. Asking for one then shows your full card to that recipient only, after you confirm, without changing what anyone else can see.
- **One email can hold several initiatives.** An initiative can add editors later.

Examples:

- Ana finishes all three steps on her phone and closes the tab. She comes back the next day in the same browser, and the draft is there. No email was involved.
- Ana saves with her email, then signs in on a laptop. She sees her initiative, private, with her funding matches and the partner teaser.
- Ana started a second draft on the laptop before signing in. After the code she sees both, and chooses to keep them as two initiatives or replace the saved one. Nothing is silently overwritten.
- Ana types the wrong email. Nothing is created until a code is confirmed. She taps Wrong email?, fixes it, and her draft is untouched.
- A steward opens the desk. Ana's private initiative does not appear, and a direct query is refused by row-level security.
- A person with a private initiative tries to appear in a place page. They cannot, and the page tells them to choose who can see it.

## Never needs an email

- Browsing funders, programs, public initiatives, places and partnerships.
- Search and filters.
- The full three-step conversation, by typing, speaking or attaching a file.
- Local AI, and consenting to cloud AI for one step.
- Seeing funding matches for a draft and the partner teaser (how many partners match and why), with all of their reasons.
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

Gated actions say so before the tap: "They need a way to reply, so this asks for your email."

## When we ask

Each moment appears once, inline, in the flow of the page.

1. **After the first confirmed card.** The status line reads "Saved on this device only" and links to saving. Nothing else moves.
2. **When matches first appear.** The panel sits right after the first opportunities and the partner teaser, because the person has now seen what they would keep. See the [finish example](../../design-system/patterns/pages/finish.html).
3. **At the action that needs it.** Remind me, Ask for an introduction, Ask to join, Who can see it.

Never at arrival, never in a modal, never mid-recording or mid-edit, and never again after Not now, except when the person taps an action that needs it.

## The flow

The [code panel](../../design-system/COMPONENTS.md#organisms) does this everywhere.

1. **Email.** One field. It requests a code and subscribes to nothing.
2. **Code.** One field with `autocomplete="one-time-code"` and `inputmode="numeric"`. It accepts a pasted code, with or without spaces. The page says where the code went, with Wrong email? and Send a new code after 60 seconds.
3. **Resume.** After the code, finish exactly what the person was doing. Save the draft, set the reminder or send the introduction. Do not take them to a home page.
4. **Confirm.** "Saved. Only you can see it." The status line changes, and it stays visible.
5. **First email.** A link back to the initiative, the card and the first matches. It should be worth opening. It is the only email they get until they choose more.
6. **Then choose.** Ask who can see it, with Only you selected. Ask about the weekly update separately, later, with a preview and nothing pre-selected.

### When things go wrong

| What happens | What the person sees | What must hold |
|---|---|---|
| The email is slow | It can take a minute to arrive. Check your spam folder if it does not. | The draft stays safe. The page survives a round trip to the mail app. |
| Wrong code | That code does not match. Check it, or send a new one. | What they typed stays. |
| Expired code | That code has expired. We can send a new one. | One tap to resend. |
| Rate limited | We have sent a few codes already. Try again in 10 minutes. | State the limit, never fail silently. |
| Offline | You are offline. Your work is saved on this device. We will try when you reconnect. | The draft is untouched. |
| Browser storage blocked or evicted | Your browser did not keep your draft. | Say so plainly. Offer saving earlier on browsers known to evict. |
| Email already known | The same flow, which signs them in. | Never reveal whether an email exists before the code is confirmed. |
| Email never arrives | Show another way to get help. | A contact route for people stuck at this step. |

## Honest nudges

Things that make saving attractive without tricks:

- **The status line tells the truth.** "Saved on this device only" stays visible. iOS Safari can purge a site's storage after seven days without a visit, so on browsers that do this, say so.
- **The card grows.** As a person talks, their card fills in and capital tiles turn from pencil to ink. Keeping it feels natural. This is where the fun lives, along with the voice.
- **The first email has value.** It carries the card and the first matches.
- **Reminders are specific.** A one-tap reminder about one fund, tied to the funding pulse.
- **Real counts motivate sharing.** "Three groups nearby are looking for what you offer. They cannot see you yet." Use real numbers only, and never show this when the number is zero.

Things we will not do: blurred previews, sign-up walls, partial results held back until an email arrives, fake urgency, streaks, pre-checked marketing boxes, repeated prompts after Not now, or a membership pitch straight after saving.

## Accounts are not membership

An account is an email that can sign in. Membership is a separate decision, made through the existing application on regencommons.com. Keep the two apart in language and in data.

- Saving never creates a `members` row and never implies membership.
- The membership path appears later and in context, such as in settings or after a first accepted introduction, and it pre-fills the application.
- This replaces the idea in earlier drafts that every account is a prospective member, and the target that 30 percent of accounts start an application. Track how many choose to apply, without a target that invites pressure.

## Privacy changes

The earlier promise, that drafts never leave the device until publishing, has to change. The new promise is:

> Your draft stays in your browser until you choose to save it. A saved initiative is private to you until you choose to share it.

The privacy page must say all of this plainly:

- Saving stores a copy on Regen Commons servers. Embeddings computed in the browser are stored with it, so matches can continue.
- People who administer the database can technically read stored records. They are bound by the published data policy. So the label "Only you" describes the product, and the privacy page explains the limit. If that is not acceptable for some groups, they can stay on a device-only draft.
- The matching job reads private embeddings through a restricted role, to produce funding matches and the partner teaser.
- How to export everything and how to delete everything. Deleting an account deletes its private initiatives and retracts anything shared.

## Technical changes

- **Schema.** `visibility` becomes `('private','network','public')`, with a default of `private`. A draft is not a database state, because it never reaches the database. `display_name` becomes nullable, since no name is asked for. `digest_frequency` defaults to `off`.
- **Row-level security.** The owner and editors read private rows. Stewards read `network` and `public` rows only. Policy tests cover steward against private.
- **Auth email.** The project's sign-in template is worded for stewards. Move to the Send Email hook before any public test, branching on the requesting app.
- **Code length.** The project uses eight digits today. Six is easier on phones and safe with attempt limits. It is a project-wide setting, so the steward desk changes too. See the [open decisions](open-decisions.md).
- **Creating users.** The Weave client sends `shouldCreateUser: true`. The steward desk stays as it is.
- **Shared limits.** Email rate limits and any captcha are project-wide, so public traffic can affect steward sign-in. Set limits with that in mind, and test them.
- **Sending volume.** Every save sends a code and a first email. Resend's free tier allows 100 emails a day, so move to the paid tier (USD 20) when daily sends approach 100, or before a large public invitation.
- **Draft merge.** On sign-in, compare local drafts with saved initiatives. Never overwrite. Use the local draft ID as an idempotency key, so a retry cannot create a duplicate.
- **Session.** supabase-js keeps its session in `localStorage`, which relies on the strict content security policy in the spec.
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

- **Phase 0:** local draft, status line, code panel, private save, the visibility choice, the auth email hook, the partner teaser with names opening on share, row-level security with tests. Reminders can wait.
- **Phase 1:** reminders, the weekly update opt-in, draft merge across devices, export and delete, real-count sharing nudges.
- **Phase 2:** editors, per-recipient sharing for introductions, the claiming flow for imported records beyond the seed rows.
