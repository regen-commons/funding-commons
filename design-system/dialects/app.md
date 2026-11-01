---
version: alpha
name: Regen Commons App Dialect
description: Rules for the Tend installable web app on top of the core system.
extends: ../../DESIGN.md
surface: app
---

# App dialect

Tend runs on phones first, often on weak connections, for people who may visit once a month. Plain task screens carry the work.

- **Theme:** follow the system. The control lives in settings with System, Light and Dark. No header toggle.
- **Type:** base 16 px. Inputs stay at 16 px, so phones do not zoom. Reading text uses `reading-lg` in conversation and `reading-md` in cards.
- **Navigation:** the product name top-left returns home. Bottom navigation on phones, header navigation from 900 px. Form pages keep only the name and save status.
- **Conversation:** one sentence per prompt, with the step map and the record always visible. Show `Assistant` and where it runs. Microphone and attach controls appear only when they work on this device.
- **Pencil and ink:** every derived value starts in pencil.
- **Saving:** `rc-save-status` is always visible during the intake. Offer saving inline once per seam, never as a modal. See [08-accounts-and-saving.md](../../docs/platform/08-accounts-and-saving.md).
- **Texture:** no grain or canvas on task screens. The mark is static.
- **Offline:** the three steps work offline with a typed draft. A notice says when something is waiting for a connection.
- **Performance:** first paint under two seconds on a mid-range phone. Models load only on a clear opt-in, with size and a cancel button.
