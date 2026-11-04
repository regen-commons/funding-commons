import { join } from "node:path";
import { pathToFileURL } from "node:url";
import tokens from "@regen-commons/design-system/tokens.json" with { type: "json" };
import react from "@vitejs/plugin-react";
import { type Connect, defaultServerConditions, defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { answerApiRequest, type LoadEntry } from "./dev/api-bridge.ts";

/**
 * Answers /api/<name> from api/<name>.ts, the same entry files Vercel deploys, so the app
 * and its functions run from one server. The dev server loads the handlers' source;
 * `vite preview` imports the entries natively, so they load the compiled handlers in
 * packages/api/dist as deployed functions do.
 */
function apiRoutes(): Plugin {
  const serve = (apiDir: string, load: LoadEntry): Connect.NextHandleFunction => (request, response, next) => {
    answerApiRequest(request, response, apiDir, load).catch((error: unknown) => {
      if (response.headersSent) response.destroy();
      else next(error);
    });
  };
  return {
    name: "weave-api-routes",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api", serve(join(server.config.root, "api"), (name) => server.ssrLoadModule(`/api/${name}.ts`)));
    },
    configurePreviewServer(server) {
      const apiDir = join(server.config.root, "api");
      server.middlewares.use("/api", serve(apiDir, (name) => import(pathToFileURL(join(apiDir, `${name}.ts`)).href)));
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
        // The plugin turns these on for autoUpdate only when it injects the register
        // code itself; without them a new version waits until every tab is closed.
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,svg,woff2,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  // Workspace packages export their TypeScript source under the "source" condition, so
  // the dev server runs handlers from src/; deployed functions import the compiled files.
  ssr: {
    resolve: {
      conditions: ["source", ...defaultServerConditions],
      externalConditions: ["source", "node", "module-sync"],
    },
  },
});
