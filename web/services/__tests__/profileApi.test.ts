import { describe, expect, it } from "vitest";
import { getProfile } from "../profileApi";

describe("getProfile", () => {
  it("returns null for missing profile", async () => {
    const { data, error } = await getProfile("missing");
    expect(error).toBeNull();
    expect(data).toBeNull();
  });
});
