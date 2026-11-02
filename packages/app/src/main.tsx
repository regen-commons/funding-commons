import "@regen-commons/design-system/css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("index.html must contain an element with the id root.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
