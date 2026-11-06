import { SignOutAction } from "./SignOutAction.tsx";
import { useEffect, useId, useState } from "react";
import { parseSummaries, type InitiativeSummary } from "@weave/api/account-contract";
import { useDraft } from "../describe/use-draft.ts";
import { revise } from "../describe/contracts.ts";
import type { DraftBackup } from "../describe/repository.ts";
import { accountKey, loadedDraft, saveCommand } from "./document.ts";
import { accountMessage, accountRequest, parseSaved, assertAccount, AccountFailure } from "./client.ts";
import { useAccount } from "./context.tsx";
function pendingEmail(): string {
  try {
    const value = sessionStorage.getItem("weave-pending-email");
    return value && value.length <= 254 ? value : "";
  } catch {
    return "";
  }
}
function pendingResendAt(): number {
  try {
    const value = Number(sessionStorage.getItem("weave-code-resend-at"));
    return Number.isFinite(value) ? Math.min(value, Date.now() + 60000) : 0;
  } catch {
    return 0;
  }
}
export function AccountSection({
  compact = false,
  autoFocus = false,
  showLeave = true,
}: {
  compact?: boolean;
  autoFocus?: boolean;
  showLeave?: boolean;
}) {
  const id = useId();
  const Title = compact ? "h3" : "h2";
  const { state, refresh, clear } = useAccount();
  const { controller, draft, ready, storage } = useDraft();
  const [email, setEmail] = useState(pendingEmail);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(() => !!pendingEmail());
  const [focusCode, setFocusCode] = useState(false);
  useEffect(() => {
    if (sent && (autoFocus || focusCode)) document.getElementById(`${id}-code`)?.focus();
  }, [sent, id, autoFocus, focusCode]);
  const [resendAt, setResendAt] = useState(() => (pendingEmail() ? pendingResendAt() : 0));
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!sent || Date.now() >= resendAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [sent, resendAt]);
  useEffect(() => {
    try {
      if (sent) sessionStorage.setItem("weave-pending-email", email);
      else sessionStorage.removeItem("weave-pending-email");
    } catch {}
  }, [email, sent]);
  function startCooldown() {
    const requestedAt = Date.now();
    setResendAt(requestedAt + 60000);
    setNow(requestedAt);
    try {
      sessionStorage.setItem("weave-code-resend-at", String(requestedAt + 60000));
    } catch {}
  }
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (failed && !busy && sent) document.getElementById(`${id}-code`)?.focus();
  }, [failed, busy, sent, id]);
  const [selected, setSelected] = useState<InitiativeSummary | null>(null);
  const [backups, setBackups] = useState<DraftBackup[]>([]);
  const [backup, setBackup] = useState<DraftBackup | null>(null);
  const [extra, setExtra] = useState<InitiativeSummary[]>([]);
  const [more, setMore] = useState(true);
  const key = accountKey(draft),
    saved = draft.account.saved;
  const currentSaved = !!state?.user && saved?.owner === state.user.id && saved.contentKey === key;
  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      await action();
    } catch (error) {
      if (error instanceof AccountFailure && error.code === "sign_in_required") clear();
      if (error instanceof AccountFailure && error.code === "account_changed") {
        try {
          await refresh();
        } catch {
          clear();
        }
        setSelected(null);
        setExtra([]);
      }
      setMessage(accountMessage(error));
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void controller
      .backups()
      .then(setBackups)
      .catch(() => {});
  }, [controller]);
  async function save() {
    const user = state?.user;
    if (!user) throw new Error("Sign in before saving.");
    const { binding, command } = saveCommand(controller.getSnapshot().draft, user.id);
    controller.change((current) => revise(current, { account: { ...current.account, pending: binding } }));
    await controller.settled();
    if (controller.getSnapshot().storage !== "saved")
      throw new Error(
        "Your save request could not be kept safely on this device. Copy your words and try device storage again first.",
      );
    const receipt = parseSaved((await accountRequest("", { action: "save", ...command })).saved);
    if (receipt.id !== command.id || JSON.stringify(receipt.document) !== binding.contentKey)
      throw new AccountFailure("account_unavailable");
    controller.change((current) =>
      revise(current, {
        account: {
          saved: {
            id: receipt.id,
            owner: user.id,
            revision: receipt.revision,
            contentKey: binding.contentKey,
          },
          pending: null,
        },
      }),
    );
    await refresh();
    setExtra([]);
    setMore(true);
    setMessage(
      accountKey(controller.getSnapshot().draft) === binding.contentKey
        ? "Your checked card is saved privately in your account."
        : "The earlier checked card was saved. Your latest changes are still on this device; save again when ready.",
    );
  }
  async function load() {
    if (!selected || !state?.user) return;
    const user = state.user;
    const result = await accountRequest(`?id=${encodeURIComponent(selected.id)}`);
    assertAccount(result, user.id);
    const saved = parseSaved(result.saved);
    await controller.replace(loadedDraft(saved, user.id));
    setBackups(await controller.backups());
    setSelected(null);
    setMessage("Your saved card is loaded. Any previous device draft is kept in Device backups below.");
  }
  return (
    <section className="rc-stack" aria-labelledby={`${id}-title`} aria-busy={busy}>
      <Title className="rc-heading" data-size="section" id={`${id}-title`}>
        {compact ? "Keep this initiative" : "Your account"}
      </Title>
      {import.meta.env.DEV && state?.fixture && (
        <p className="rc-notice" data-tone="info">
          Local account example. Use example@weave.test and code 12345678. No email is sent.
        </p>
      )}
      {!state ? (
        <>
          <p>Account access could not be checked yet.</p>
          <button
            className="rc-button"
            data-variant="secondary"
            type="button"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await refresh();
              })
            }
          >
            Check account access
          </button>
        </>
      ) : !state.available ? (
        <p>Account saving is not available yet. Your draft stays on this device.</p>
      ) : !state.user ? (
        <>
          <p>
            Sign in to save a private copy of your checked card, needs, offers and kept funding details.
            Conversations, files, unfinished edits and assistant records stay on this device.
          </p>
          <p className="rc-meta">
            Signing in creates an account if needed. It does not make you a Regen Commons member or share your
            card.
          </p>
          <form
            className="rc-stack"
            onSubmit={(event) => {
              event.preventDefault();
              void run(async () => {
                if (sent) {
                  await accountRequest("", { action: "verify_code", email, code });
                  await refresh();
                  setCode("");
                  setSent(false);
                  setExtra([]);
                  setMore(true);
                  setMessage(
                    "You are signed in. Choose whether to save this device card or load a saved one.",
                  );
                } else {
                  await accountRequest("", { action: "request_code", email });
                  setSent(true);
                  setFocusCode(true);
                  startCooldown();
                  setMessage(
                    "If sign-in is available for this address, a code is on its way. Check your inbox and spam folder.",
                  );
                }
              });
            }}
          >
            <div className="rc-field">
              <label htmlFor={`${id}-email`}>Email address</label>
              <input
                className="rc-input"
                id={`${id}-email`}
                autoFocus={autoFocus && !sent}
                data-task-focus={(autoFocus && !sent) || undefined}
                type="email"
                autoComplete="email"
                spellCheck={false}
                enterKeyHint="done"
                maxLength={254}
                required
                value={email}
                disabled={sent || busy}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {sent && (
              <div className="rc-field">
                <label htmlFor={`${id}-code`}>Sign-in code</label>
                <input
                  className="rc-input"
                  id={`${id}-code`}
                  autoFocus={autoFocus || focusCode}
                  data-task-focus={autoFocus || undefined}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern={`[0-9]{${state.otpDigits}}`}
                  minLength={state.otpDigits}
                  maxLength={state.otpDigits * 2}
                  required
                  value={code}
                  disabled={busy}
                  onChange={(event) => setCode(event.target.value.replace(/\s/gu, ""))}
                />
                <p className="rc-hint">
                  Enter the {state.otpDigits}-digit code from your email. Request a new code if it has
                  expired.
                </p>
              </div>
            )}
            <div className="rc-action-bar">
              <button className="rc-button" data-variant="primary" disabled={busy} type="submit">
                {sent ? "Sign in" : "Email a sign-in code"}
              </button>
              {sent && (
                <>
                  <button
                    className="rc-button"
                    data-variant="secondary"
                    disabled={busy || now < resendAt}
                    type="button"
                    onClick={() =>
                      void run(async () => {
                        await accountRequest("", { action: "request_code", email });
                        startCooldown();
                        setMessage("If sign-in is available, another code is on its way.");
                      })
                    }
                  >
                    {now < resendAt ? `Resend code in ${Math.ceil((resendAt - now) / 1000)}s` : "Resend code"}
                  </button>
                  <button
                    className="rc-button"
                    data-variant="quiet"
                    disabled={busy}
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setCode("");
                      setMessage("");
                    }}
                  >
                    Change email
                  </button>
                </>
              )}
            </div>
          </form>
        </>
      ) : (
        <>
          <p>Signed in as {state.user.email}.</p>
          <p>
            Your checked card, needs, offers and kept funding details are saved only when you choose Save.
            They stay private to this account. Your conversations, files, unfinished edits and assistant
            records stay on this device.
          </p>
          <p className="rc-meta">
            This session lasts up to one hour. Sign in again when it ends. Signing out leaves the device draft
            and its backups in this browser; clear this site’s browser storage when leaving a shared device.
          </p>
          {!key && (
            <p>
              Check your initiative, needs and offers, and keep or cancel open funding changes before saving.
            </p>
          )}
          <div className="rc-action-bar">
            <button
              className="rc-button"
              data-variant="primary"
              type="button"
              disabled={busy || !ready || !key || storage !== "saved" || currentSaved}
              onClick={() => void run(save)}
            >
              {currentSaved ? "Checked card saved" : "Save checked card privately"}
            </button>
            {showLeave && (
              <SignOutAction
                disabled={busy}
                onBusyChange={setBusy}
                onResult={(text, failed) => {
                  setMessage(text);
                  setFailed(failed);
                  if (!failed) {
                    setSelected(null);
                    setExtra([]);
                  }
                }}
              />
            )}
          </div>
          <h3 className="rc-heading" data-size="section">
            Your saved cards
          </h3>
          {!state.items.length && !extra.length ? (
            <p>No cards saved in this account yet.</p>
          ) : (
            <ul className="rc-stack">
              {[...state.items, ...extra].map((item) => (
                <li key={item.id}>
                  <p>
                    <strong>{item.name}</strong>
                    <br />
                    <span className="rc-meta">Saved {new Date(item.updatedAt).toLocaleString()}</span>
                  </p>
                  <button
                    className="rc-button"
                    data-variant="secondary"
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setSelected(item);
                      setBackup(null);
                    }}
                  >
                    Load {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {more && (extra.length ? extra.length % 20 === 0 : state.items.length === 20) && (
            <button
              className="rc-button"
              data-variant="secondary"
              type="button"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  const result = await accountRequest(`?offset=${state.items.length + extra.length}`);
                  assertAccount(result, state.user!.id);
                  const page = parseSummaries(result.items);
                  setExtra((current) => [
                    ...current,
                    ...page.filter((item) => ![...state.items, ...current].some((old) => old.id === item.id)),
                  ]);
                  setMore(page.length === 20);
                })
              }
            >
              More saved cards
            </button>
          )}
          <button
            className="rc-button"
            data-variant="quiet"
            type="button"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await refresh();
                setExtra([]);
                setMore(true);
                setMessage("Saved cards refreshed.");
              })
            }
          >
            Refresh saved cards
          </button>
        </>
      )}
      {selected && (
        <section className="rc-notice" data-tone="warning" aria-label="Confirm loading">
          <div className="rc-notice-body">
            <p>
              Load {selected.name}? The current device draft, including its conversations and files, will be
              backed up in this browser first. Loading stops if that backup cannot be stored.
            </p>
            <div className="rc-action-bar">
              <button
                className="rc-button"
                data-variant="primary"
                type="button"
                disabled={busy}
                onClick={() => void run(load)}
              >
                Back up this draft and load
              </button>
              <button
                className="rc-button"
                data-variant="quiet"
                type="button"
                disabled={busy}
                onClick={() => setSelected(null)}
              >
                Cancel loading
              </button>
            </div>
          </div>
        </section>
      )}
      {!compact && backups.length > 0 && (
        <section className="rc-stack" aria-labelledby={`${id}-backups`}>
          <h3 className="rc-heading" data-size="section" id={`${id}-backups`}>
            Device backups
          </h3>
          <p>
            These drafts and their files are kept only in this browser. Restoring one backs up the current
            draft first.
          </p>
          <ul className="rc-stack">
            {backups.map((item) => (
              <li key={item.key}>
                <button
                  className="rc-button"
                  data-variant="secondary"
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBackup(item);
                    setSelected(null);
                  }}
                >
                  Restore {item.draft.confirmed?.name || item.draft.proposal?.name || "untitled draft"},{" "}
                  {new Date(item.draft.updatedAt).toLocaleString()}
                </button>
              </li>
            ))}
          </ul>
          {backup && (
            <div className="rc-action-bar">
              <button
                className="rc-button"
                data-variant="primary"
                type="button"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await controller.replace(backup.draft);
                    setBackups(await controller.backups());
                    setBackup(null);
                    setMessage("Device backup restored. The previous draft was backed up first.");
                  })
                }
              >
                Back up this draft and restore
              </button>
              <button
                className="rc-button"
                data-variant="quiet"
                type="button"
                disabled={busy}
                onClick={() => setBackup(null)}
              >
                Cancel restoring
              </button>
            </div>
          )}
        </section>
      )}
      {compact && (
        <p>
          <a href="/settings">Saved cards and device backups</a>
        </p>
      )}
      {busy && <p role="status">Connecting to your account</p>}
      {message && (
        <p className="rc-notice" data-tone={failed ? "warning" : "info"} role={failed ? "alert" : "status"}>
          {message}
        </p>
      )}
    </section>
  );
}
