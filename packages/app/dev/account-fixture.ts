/** Explicit dev-server fixture. Never imported by API entries or production bundles. */
import { createAccountHandlers } from "@weave/api/account";
import { AccountError, type AccountProvider } from "../../api/src/account-provider.ts";
import type { SavedInitiative } from "@weave/api/account-contract";
const sessions = new Map<string, string>();
const records = new Map<string, { owner: string; saved: SavedInitiative }>();
const requests = new Map<string, { input: string; saved: SavedInitiative }>();
const owner = (token: string) => {
  const id = sessions.get(token);
  if (!id) throw new AccountError(401, "sign_in_required");
  return id;
};
const provider: AccountProvider = {
  async requestCode(email) {
    if (!["example@weave.test", "other@weave.test"].includes(email))
      throw new AccountError(400, "invalid_email");
  },
  async verifyCode(email, code) {
    if (code !== "12345678" || !["example@weave.test", "other@weave.test"].includes(email))
      throw new AccountError(401, "invalid_code");
    const id = email.startsWith("example")
      ? "b1000000-0000-4000-8000-000000000001"
      : "b1000000-0000-4000-8000-000000000002";
    const token = `fixture.${id}.${crypto.randomUUID()}`;
    sessions.set(token, id);
    return { token, expiresIn: 3600 };
  },
  async authorize(token) {
    const id = owner(token);
    return { id, email: id.endsWith("1") ? "example@weave.test" : "other@weave.test" };
  },
  async signOut(token) {
    sessions.delete(token);
  },
  async list(token, offset) {
    const id = owner(token);
    return [...records.values()]
      .filter((row) => row.owner === id)
      .map(({ saved }) => ({
        id: saved.id,
        revision: saved.revision,
        name: String(saved.document.initiative.name),
        updatedAt: saved.updatedAt,
      }))
      .slice(offset, offset + 20);
  },
  async load(token, id) {
    const row = records.get(id);
    if (!row || row.owner !== owner(token)) throw new AccountError(404, "not_found");
    return row.saved;
  },
  async save(token, command) {
    const id = owner(token),
      key = `${id}:${command.requestId}`,
      input = JSON.stringify(command),
      previous = requests.get(key);
    if (previous) {
      if (previous.input !== input) throw new AccountError(409, "save_conflict");
      return previous.saved;
    }
    const row = records.get(command.id);
    if (row && row.owner !== id) throw new AccountError(404, "not_found");
    if ((row?.saved.revision ?? 0) !== command.expectedRevision) throw new AccountError(409, "save_conflict");
    const saved = {
      id: command.id,
      revision: command.expectedRevision + 1,
      document: command.document,
      updatedAt: new Date().toISOString(),
    };
    records.set(saved.id, { owner: id, saved });
    requests.set(key, { input, saved });
    return saved;
  },
};
export const accountFixture = createAccountHandlers({
  provider,
  cookieName: "weave_fixture_account",
  secureCookies: false,
  fixture: true,
});
