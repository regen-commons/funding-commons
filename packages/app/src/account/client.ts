import {
  parseSaved,
  parseSummaries,
  parseUser,
  record,
  type AccountUser,
  type InitiativeSummary,
} from "@weave/api/account-contract";
export class AccountFailure extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
export async function accountRequest(path = "", body?: unknown): Promise<Record<string, unknown>> {
  let response: Response;
  try {
    response = await fetch(`/api/account${path}`, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new AccountFailure("connection_failed");
  }
  let data: Record<string, unknown>;
  try {
    data = record(await response.json());
  } catch {
    throw new AccountFailure("account_unavailable");
  }
  if (!response.ok)
    throw new AccountFailure(typeof data.error === "string" ? data.error : "account_unavailable");
  return data;
}
export interface AccountState {
  available: boolean;
  otpDigits: number;
  fixture: boolean;
  user: AccountUser | null;
  items: InitiativeSummary[];
}
export function accountState(data: Record<string, unknown>): AccountState {
  if (data.available === false)
    return { available: false, otpDigits: 8, fixture: false, user: null, items: [] };
  if (
    data.available !== true ||
    !Number.isInteger(data.otpDigits) ||
    Number(data.otpDigits) < 6 ||
    Number(data.otpDigits) > 10
  )
    throw new AccountFailure("account_unavailable");
  return {
    available: true,
    otpDigits: Number(data.otpDigits),
    fixture: data.fixture === true,
    user: data.user === null ? null : parseUser(data.user),
    items: parseSummaries(data.items),
  };
}
export { parseSaved, parseUser };
export function assertAccount(data: Record<string, unknown>, expectedId: string): void {
  if (parseUser(data.user).id !== expectedId) throw new AccountFailure("account_changed");
}
export function accountMessage(error: unknown): string {
  const code = error instanceof AccountFailure ? error.code : "";
  return (
    (
      {
        invalid_code: "That code is invalid or expired. Request a new code and try again.",
        rate_limited: "Please wait before trying this account action again.",
        sign_in_required: "Your session ended. Sign in again. Your device draft is still here.",
        account_changed:
          "The signed-in account changed in another tab. Check the account shown here before saving again.",
        save_conflict:
          "This saved card changed elsewhere. Load its latest copy before saving again. Your device draft is still here.",
        sign_out_unconfirmed: "Sign-out could not be confirmed. Keep this device with you and try again.",
        connection_failed:
          "The connection failed. Your device draft is still here. Try again when you are online.",
        document_too_large: "This card is too large to save. Your device draft is still here.",
      } as Record<string, string>
    )[code] ??
    (error instanceof AccountFailure
      ? "Your account could not be reached. Your device draft is still here. Try again."
      : error instanceof Error
        ? error.message
        : "This change could not be completed. Your device draft is still here.")
  );
}
