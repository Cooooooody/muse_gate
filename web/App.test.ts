import { describe, expect, it } from "vitest";
import { __test_role } from "./App";
import { UserRole } from "./types";

describe("App role mapping", () => {
  it("maps admin email", () => {
    expect(__test_role("admin@test.com")).toBe(UserRole.ADMIN);
  });
});
