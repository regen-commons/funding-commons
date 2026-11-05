import { useState } from "react";
import { applyTheme, readTheme, type Theme } from "../theme.ts";
import { Heading } from "../ui/Heading.tsx";
import { NarrowLayout } from "../ui/layouts.tsx";
export function Settings() {
  const [theme, setTheme] = useState(readTheme);
  return (
    <NarrowLayout>
      <Heading level={1} size="page">
        Settings
      </Heading>
      <section className="rc-field">
        <label htmlFor="appearance">Appearance</label>
        <select
          className="rc-input"
          id="appearance"
          value={theme}
          onChange={(event) => {
            const value = event.target.value as Theme;
            setTheme(value);
            applyTheme(value);
          }}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <p className="rc-hint">Choose a theme for this device.</p>
      </section>
    </NarrowLayout>
  );
}
