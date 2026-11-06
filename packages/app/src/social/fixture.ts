/** Development-only adapter. It sends nothing, stores nothing and grants no real access. */
export type Visibility = "private" | "public";
export interface SocialState {
  email: string | null;
  saved: boolean;
  visibility: Visibility;
  onward: boolean;
  reminders: readonly string[];
  introductions: readonly string[];
  notifications: { funding: boolean; partners: boolean; introductions: boolean };
}
export interface SocialService {
  snapshot(): SocialState;
  requestCode(email: string): Promise<void>;
  verifyCode(email: string, code: string): Promise<void>;
  save(): Promise<void>;
  share(visibility: Visibility, onward: boolean): Promise<void>;
  remind(id: string): Promise<void>;
  introduce(ids: readonly string[], note: string): Promise<void>;
  notify(kind: "funding" | "partners" | "introductions", enabled: boolean): Promise<void>;
  deleteAccount(): Promise<void>;
}
export function createSocialFixture(scenario: "visitor" | "draft" | "private" | "shared"): SocialService {
  let pending = "";
  let state: SocialState = {
    email: scenario === "private" || scenario === "shared" ? "example@weave.test" : null,
    saved: scenario === "private" || scenario === "shared",
    visibility: scenario === "shared" ? "public" : "private",
    onward: false,
    reminders: [],
    introductions: [],
    notifications: { funding: false, partners: false, introductions: false },
  };
  function verified() {
    if (!state.email) throw new Error("Verify the example code first.");
  }
  return {
    snapshot: () => ({ ...state, reminders: [...state.reminders], introductions: [...state.introductions] }),
    async requestCode(email) {
      if (email !== "example@weave.test")
        throw new Error("Use example@weave.test in this fictional example.");
      pending = email;
    },
    async verifyCode(email, code) {
      if (!pending || email !== pending || code !== "12345678")
        throw new Error("That example code does not match. Try 12345678.");
      state = { ...state, email };
      pending = "";
    },
    async save() {
      verified();
      state = { ...state, saved: true };
    },
    async share(visibility, onward) {
      verified();
      if (!state.saved) throw new Error("Save the example card first.");
      state = {
        ...state,
        visibility,
        onward: visibility === "public" && onward,
        notifications: {
          ...state.notifications,
          partners: visibility === "public" && state.notifications.partners,
        },
      };
    },
    async remind(id) {
      verified();
      if (!state.saved) throw new Error("Save the example card first.");
      state = { ...state, reminders: [...new Set([...state.reminders, id])] };
    },
    async introduce(ids, note) {
      verified();
      if (!state.saved || state.visibility !== "public")
        throw new Error("Share the example initiative first.");
      if (note.length > 1000 || !ids.length)
        throw new Error("Choose a partner and keep the note under 1,000 characters.");
      state = { ...state, introductions: [...new Set([...state.introductions, ...ids])] };
    },
    async notify(kind, enabled) {
      verified();
      if (kind === "partners" && enabled && state.visibility !== "public")
        throw new Error("Share the example before asking for partner updates.");
      state = { ...state, notifications: { ...state.notifications, [kind]: enabled } };
    },
    async deleteAccount() {
      verified();
      state = {
        email: null,
        saved: false,
        visibility: "private",
        onward: false,
        reminders: [],
        introductions: [],
        notifications: { funding: false, partners: false, introductions: false },
      };
    },
  };
}
