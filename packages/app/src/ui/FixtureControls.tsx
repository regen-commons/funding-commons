import type { FixtureContext } from "../fixtures.ts";
import { navigate } from "../router.tsx";
export function FixtureControls({ fixture }: { fixture: FixtureContext }) {
  function set(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    navigate(`${url.pathname}${url.search}`);
  }
  return (
    <aside className="rc-notice" data-tone="info" aria-label="Example controls">
      <details className="rc-notice-body">
        <summary className="rc-footer-link">Fictional examples. Nothing is sent or saved.</summary>
        <div className="rc-action-bar">
          <div className="rc-field">
            <label htmlFor="example-scenario">Example initiative</label>
            <select
              className="rc-input"
              id="example-scenario"
              value={fixture.scenario}
              onChange={(event) => set("fixture", event.target.value)}
            >
              <option value="visitor">Not started</option>
              <option value="draft">Draft on this device</option>
              <option value="private">Saved privately</option>
              <option value="shared">Shared with the community</option>
            </select>
          </div>
          <div className="rc-field">
            <label htmlFor="example-state">Example state</label>
            <select
              className="rc-input"
              id="example-state"
              value={fixture.state}
              onChange={(event) => set("state", event.target.value)}
            >
              <option value="ready">Ready</option>
              <option value="empty">Empty</option>
              <option value="partial">Partial</option>
              <option value="loading">Loading</option>
              <option value="offline">Offline</option>
              <option value="error">Error</option>
              <option value="long">Long content</option>
            </select>
          </div>
        </div>
      </details>
    </aside>
  );
}
