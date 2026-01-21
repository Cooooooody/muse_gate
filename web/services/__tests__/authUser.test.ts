import { describe, expect, it } from "vitest";
import { getUserFromAuthResponse } from "../authUser";

const makeUser = (id: string) => ({ id } as { id: string });

describe("getUserFromAuthResponse", () => {
  it("prefers data.user when present", () => {
    const user = makeUser("u1");
    const result = getUserFromAuthResponse({ user, session: null });

    expect(result).toBe(user);
  });

  it("falls back to session user when data.user missing", () => {
    const sessionUser = makeUser("u2");
    const result = getUserFromAuthResponse({ user: null, session: { user: sessionUser } });

    expect(result).toBe(sessionUser);
  });

  it("returns null when no user available", () => {
    const result = getUserFromAuthResponse({ user: null, session: null });

    expect(result).toBeNull();
  });
});
