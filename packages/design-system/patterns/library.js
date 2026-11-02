// Pattern library behaviour: theme control, side-by-side themes, and each example's markup read from the page itself.
const THEME_KEY = "rc-theme";

function applyTheme(value) {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (value === "light" || value === "dark") {
    root.dataset.theme = value;
    meta.content = value;
  } else {
    delete root.dataset.theme;
    meta.content = "light dark";
  }
  try {
    if (value === "light" || value === "dark") localStorage.setItem(THEME_KEY, value);
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // Storage can be blocked. The choice still applies to this page.
  }
}

const themeSelect = document.querySelector("#theme");
if (themeSelect) {
  themeSelect.value = document.documentElement.dataset.theme ?? "system";
  themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
}

for (const stage of document.querySelectorAll("[data-theme-compare]")) {
  const source = stage.querySelector("template");
  for (const theme of ["light", "dark"]) {
    const section = document.createElement("div");
    section.dataset.theme = theme;
    section.setAttribute("aria-label", `${theme} theme`);
    section.setAttribute("role", "group");
    section.append(source.content.cloneNode(true));
    stage.append(section);
  }
}

function dedent(html) {
  const lines = html.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length);
  const margin = Math.min(...indents);
  return lines.map((line) => line.slice(margin)).join("\n");
}

for (const example of document.querySelectorAll("[data-example]")) {
  const details = document.createElement("details");
  details.className = "lib-source";
  const summary = document.createElement("summary");
  summary.textContent = "Show markup";
  const pre = document.createElement("pre");
  pre.textContent = dedent(example.innerHTML);
  details.append(summary, pre);
  example.after(details);
}

for (const button of document.querySelectorAll("[data-open-dialog]")) {
  button.addEventListener("click", () => document.getElementById(button.dataset.openDialog)?.showModal());
}
