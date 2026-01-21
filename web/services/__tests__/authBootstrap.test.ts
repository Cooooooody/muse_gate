import { describe, expect, it, vi } from "vitest";
import { getSessionSafe } from "../authBootstrap";

describe("getSessionSafe", () => {
  it("returns session when getSession resolves", async () => {
    const session = { user: { id: "1" } };
    const getSession = vi.fn().mockResolvedValue({ data: { session } });

    const result = await getSessionSafe(getSession, 50);

    expect(result.session).toBe(session);
    expect(result.error).toBeNull();
  });

  it("returns error when getSession rejects", async () => {
    const getSession = vi.fn().mockRejectedValue(new Error("boom"));

    const result = await getSessionSafe(getSession, 50);

    expect(result.session).toBeNull();
    expect(result.error?.message).toBe("boom");
  });

  it("returns timeout error when getSession hangs", async () => {
    vi.useFakeTimers();
    const getSession = vi.fn().mockImplementation(() => new Promise(() => {}));

    const promise = getSessionSafe(getSession, 10);
    vi.advanceTimersByTime(11);

    const result = await promise;

    expect(result.session).toBeNull();
    expect(result.error?.message).toBe("timeout");
    vi.useRealTimers();
  });
});
