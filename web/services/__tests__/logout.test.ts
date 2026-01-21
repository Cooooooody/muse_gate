import { describe, expect, it, vi } from "vitest";
import { performLogout } from "../logout";

describe("performLogout", () => {
  it("resets state even if signOut fails", async () => {
    const onReset = vi.fn();
    const signOut = vi.fn().mockRejectedValue(new Error("network"));

    await performLogout({ signOut, onReset });

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith();
  });
});
