# API package

Use the [root guide](../../AGENTS.md) for shared workflow. `@weave/api` holds Weave's
server functions: the consented cloud AI proxy, sharing, introductions, the pulse and
the catalog, as [spec 2](../../docs/platform/05-technical-spec.md#2-system-context)
lists. Today it has one, the health check. This whole package is a critical surface:
read every touched line and prove the failure paths.

## How a handler is deployed

Vercel only serves functions from `api/` under a project's root directory, and the
Weave project's root is `packages/app`. So each handler lives here, in
`src/<name>.ts`, exported through this package's `exports`, and
`packages/app/api/<name>.ts` re-exports it in one line. Write no logic in the entry
file. Handlers use the Web signature: export `GET`, `POST` and so on, taking a
`Request` and returning a `Response`. They run on the Node runtime, never Edge.

`bun run build` type-checks: Vercel compiles the handlers when it deploys the app.
In development, the app's Vite server answers `/api/*` from the same entry files.

## Boundaries

- Secrets live only in Vercel and Supabase settings. Never commit one, log one or
  return one. No service-role key: data calls use the person's own token, so
  row-level security still applies.
- Validate methods, bodies, identifiers and sizes at the handler boundary, and cap
  bodies at 64 KB. Write endpoints require a same-origin `Origin` header and JSON.
- Give every outbound call a timeout. Return stable error codes, never a raw provider
  response or personal data, and log neither.
- Cloud AI runs only after consent that names the provider, model, region and
  retention, and records hashes and derived fields, not prompts
  ([spec 6.6](../../docs/platform/05-technical-spec.md#66-consented-cloud-fallback-r10)).
- Local and test runs use synthetic providers. A fixture must never fall through to a
  live service.

## Checks

| When | Run |
|---|---|
| Any change | `bun run --filter @weave/api test` and `bun run --filter @weave/api typecheck` |
| A new or renamed handler | Also `bun run --filter @weave/app test`, which checks every entry file |
| Before merge | A preview deployment answering the route, labeled `preview` |
