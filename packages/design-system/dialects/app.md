---
version: alpha
name: Regen Commons App Dialect
description: Rules for the Weave installable web app on top of the core system.
extends: ../../DESIGN.md
surface: app
---

# App dialect

Weave runs on phones first, often on weak connections, for people who may visit once a month. Plain task screens carry the work.

- **Theme:** follow the system. The control lives in settings with System, Light and Dark. No header toggle.
- **Type:** base 16 px. Inputs stay at 16 px, so phones do not zoom. Reading text uses `reading-lg` in conversation and `reading-md` in cards.
- **Navigation:** the product name top-left returns home. Home, Partners, Funding and Initiatives are separate pages. Bottom navigation on phones, header navigation from 900 px. Focused steps keep the name and save status; every page has the footer.
- **Lists:** full-width card grids, equal heights and two-line title space. Search, filter menus, removable chips, count and sort share one bar. Pages align with the logo; narrow tasks stay at that edge.
- **Conversation:** one sentence per prompt, with the step map and the record always visible. Show `Assistant` and where it runs. Microphone and attach controls appear only when they work on this device.
- **Pencil and ink:** every derived value starts in pencil.
- **Saving:** `rc-save-status` is always visible during the intake. Offer saving inline once per seam, never as a modal. See [08-accounts-and-saving.md](../../../docs/platform/08-accounts-and-saving.md).
- **Texture:** no grain or canvas on task screens. The mark is static.
- **Offline:** the three steps work offline with a typed draft. A notice says when something is waiting for a connection.
- **Performance:** first paint under two seconds on a mid-range phone. Models load only on a clear opt-in, with size and a cancel button.
