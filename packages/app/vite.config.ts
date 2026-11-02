import { existsSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import tokens from "@regen-commons/design-system/tokens.json" with { type: "json" };
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

/**
 * Answers /api/<name> in development from api/<name>.ts, the same entry files Vercel
 * deploys, so the app and its functions run from one dev server.
 */
function apiRoutes(): Plugin {
  return {
    name: "weave-api-routes",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api", async (request, response, next) => {
        const name = (request.url ?? "").split("?")[0]?.replace(/^\//, "") ?? "";
        if (!/^[\w-]+$/.test(name)) return next();
        if (!existsSync(join(server.config.root, "api", `${name}.ts`))) {
          response.statusCode = 404;
          response.end();
          return;
        }
        try {
          const handlers: Record<string, unknown> = await server.ssrLoadModule(`/api/${name}.ts`);
          const method = request.method ?? "GET";
          const handler = handlers[method];
          if (typeof handler !== "function") {
            response.statusCode = 405;
            response.end();
            return;
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(request.headers)) {
            if (typeof value === "string") headers.set(key, value);
          }
          const body = method === "GET" || method === "HEAD" ? undefined : (Readable.toWeb(request) as ReadableStream);
          const url = new URL(request.originalUrl ?? request.url ?? "/", "http://localhost");
          const result: Response = await handler(new Request(url, { method, headers, body, duplex: "half" } as RequestInit));
          response.statusCode = result.status;
          result.headers.forEach((value, key) => response.setHeader(key, value));
          response.end(Buffer.from(await result.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    apiRoutes(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script",
      includeAssets: ["brand/icons.svg", "brand/logo/favicon.svg", "brand/logo/mark.svg"],
      manifest: {
        name: "Weave",
        short_name: "Weave",
        description: "Find partners and funding for regenerative work.",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        // The manifest cannot read CSS, so its colours come from the generated tokens.
        background_color: tokens.themes.light.surface,
        theme_color: tokens.themes.light.surface,
        icons: [{ src: "/brand/logo/mark.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
