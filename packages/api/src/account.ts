import { parseDocument, record, uuid } from "./account-contract.ts";
import { AccountError, createSupabaseAccountProvider, type AccountProvider } from "./account-provider.ts";
interface Options {
  provider: AccountProvider | null;
  secureCookies?: boolean;
  cookieName?: string;
  otpDigits?: number;
  fixture?: boolean;
}
async function boundedJson(request: Request): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length") ?? 0) > 65536)
    throw new AccountError(413, "request_too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new AccountError(400, "invalid_data");
  const chunks: Uint8Array[] = [];
  let bytes = 0,
    timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel();
  }, 10000);
  try {
    while (true) {
      const result = await reader.read();
      if (timedOut) throw new AccountError(408, "request_timeout");
      if (result.done) break;
      bytes += result.value.byteLength;
      if (bytes > 65536) {
        void reader.cancel();
        throw new AccountError(413, "request_too_large");
      }
      chunks.push(result.value);
    }
    const joined = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      joined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return record(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(joined)));
  } catch (error) {
    if (error instanceof AccountError) throw error;
    throw new AccountError(400, "invalid_data");
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
export function createAccountHandlers({
  provider,
  secureCookies = true,
  cookieName = "__Host-weave_account",
  otpDigits = 8,
  fixture = false,
}: Options) {
  const cookie = (token = "", seconds = 0) =>
    `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${seconds}${secureCookies ? "; Secure" : ""}`;
  const response = (status: number, body: unknown, setCookie?: string) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, no-store",
        Vary: "Cookie",
        ...(setCookie ? { "Set-Cookie": setCookie } : {}),
      },
    });
  const token = (request: Request) => {
    const values = (request.headers.get("cookie") ?? "")
      .split(";")
      .map((value) => value.trim())
      .filter((value) => value.startsWith(`${cookieName}=`));
    if (values.length !== 1) return null;
    const value = values[0]!.slice(cookieName.length + 1);
    return value.length <= 3800 && /^[-A-Za-z0-9_]+\.[-A-Za-z0-9_]+\.[-A-Za-z0-9_]+$/u.test(value)
      ? value
      : null;
  };
  const failure = (error: unknown) => {
    const known = error instanceof AccountError ? error : new AccountError(503, "account_unavailable");
    return response(known.status, { error: known.code }, known.status === 401 ? cookie() : undefined);
  };
  return {
    async GET(request: Request) {
      if (!provider) return response(200, { available: false });
      try {
        const access = token(request);
        if (!access) return response(200, { available: true, otpDigits, fixture, user: null, items: [] });
        const user = await provider.authorize(access);
        const params = new URL(request.url).searchParams,
          id = params.get("id");
        if (id) {
          if (!uuid(id)) throw new AccountError(400, "invalid_data");
          return response(200, { available: true, user, saved: await provider.load(access, id) });
        }
        const offset = Number(params.get("offset") ?? 0);
        if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10000)
          throw new AccountError(400, "invalid_data");
        return response(200, {
          available: true,
          otpDigits,
          fixture,
          user,
          items: await provider.list(access, offset),
        });
      } catch (error) {
        return failure(error);
      }
    },
    async POST(request: Request) {
      try {
        if (request.headers.get("origin") !== new URL(request.url).origin)
          throw new AccountError(403, "origin_required");
        if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json")
          throw new AccountError(415, "json_required");
        if (!provider) throw new AccountError(503, "accounts_not_configured");
        const body = await boundedJson(request);
        if (body.action === "request_code" || body.action === "verify_code") {
          if (
            typeof body.email !== "string" ||
            body.email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(body.email.trim())
          )
            throw new AccountError(400, "invalid_email");
          const email = body.email.trim().toLowerCase();
          if (body.action === "request_code") {
            await provider.requestCode(email);
            return response(200, { sent: true });
          }
          const code = typeof body.code === "string" ? body.code.replace(/\s+/gu, "") : "";
          if (!new RegExp(`^\\d{${otpDigits}}$`, "u").test(code)) throw new AccountError(400, "invalid_code");
          const session = await provider.verifyCode(email, code);
          let user;
          try {
            user = await provider.authorize(session.token);
          } catch (error) {
            try {
              await provider.signOut(session.token);
            } catch {}
            throw error;
          }
          return response(200, { user }, cookie(session.token, session.expiresIn));
        }
        const access = token(request);
        if (body.action === "sign_out") {
          if (access) await provider.signOut(access);
          return response(200, { signedOut: true }, cookie());
        }
        if (!access) throw new AccountError(401, "sign_in_required");
        const user = await provider.authorize(access);
        if (body.action === "save") {
          if (!uuid(body.accountId)) throw new AccountError(400, "invalid_data");
          if (body.accountId !== user.id) throw new AccountError(409, "account_changed");
          if (
            !uuid(body.id) ||
            !uuid(body.requestId) ||
            !Number.isSafeInteger(body.expectedRevision) ||
            Number(body.expectedRevision) < 0 ||
            Number(body.expectedRevision) >= 2147483647
          )
            throw new AccountError(400, "invalid_data");
          let document;
          try {
            document = parseDocument(body.document);
          } catch (error) {
            throw new AccountError(
              400,
              error instanceof Error && error.message === "document_too_large"
                ? "document_too_large"
                : "invalid_data",
            );
          }
          return response(200, {
            saved: await provider.save(access, {
              id: body.id,
              requestId: body.requestId,
              expectedRevision: Number(body.expectedRevision),
              document,
            }),
          });
        }
        throw new AccountError(400, "invalid_action");
      } catch (error) {
        return failure(error);
      }
    },
  };
}
function configuredHandlers() {
  const enabled = process.env.WEAVE_ACCOUNTS_ENABLED === "true",
    url = process.env.WEAVE_SUPABASE_URL,
    key = process.env.WEAVE_SUPABASE_PUBLISHABLE_KEY;
  const digits = Number(process.env.WEAVE_OTP_DIGITS ?? 8);
  const valid =
    enabled &&
    url === "https://ztygpuzldujfsqrubxic.supabase.co" &&
    key?.startsWith("sb_publishable_") &&
    Number.isInteger(digits) &&
    digits >= 6 &&
    digits <= 10;
  return createAccountHandlers({
    provider: valid && url && key ? createSupabaseAccountProvider(url, key) : null,
    otpDigits: digits,
  });
}
export const GET = (request: Request) => configuredHandlers().GET(request);
export const POST = (request: Request) => configuredHandlers().POST(request);
