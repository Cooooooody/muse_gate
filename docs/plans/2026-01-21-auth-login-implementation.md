# Auth Login Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Supabase Auth-based login UI + profile bootstrap so users sign in and get a role-driven UI without backend changes.

**Architecture:** Frontend owns auth via `@supabase/supabase-js`; on successful login, the client upserts a `profiles` row keyed by `user_id` and uses the stored role (defaulted from email mapping) to drive UI state. Backend remains unchanged and continues serving business APIs.

**Tech Stack:** Vite + React + TypeScript, Supabase JS v2, MyBatis-Plus (backend unchanged).

### Task 1: Add a role-mapping utility with a unit test

**Files:**
- Create: `web/services/roleMapper.ts`
- Create: `web/services/__tests__/roleMapper.test.ts`
- Modify: `web/package.json`
- Create: `web/vitest.config.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { mapEmailToRole } from "../roleMapper";
import { UserRole } from "../../types";

describe("mapEmailToRole", () => {
  it("maps known local emails", () => {
    expect(mapEmailToRole("admin@musegate.local")).toBe(UserRole.ADMIN);
    expect(mapEmailToRole("sales@musegate.local")).toBe(UserRole.SALES);
    expect(mapEmailToRole("finance@musegate.local")).toBe(UserRole.FINANCE);
    expect(mapEmailToRole("client@musegate.local")).toBe(UserRole.CLIENT);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix web test`
Expected: FAIL with "Cannot find module '../roleMapper'" or similar.

**Step 3: Write minimal implementation**

```ts
import { UserRole } from "../types";

export function mapEmailToRole(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  if (normalized === "admin@musegate.local") return UserRole.ADMIN;
  if (normalized === "sales@musegate.local") return UserRole.SALES;
  if (normalized === "finance@musegate.local") return UserRole.FINANCE;
  if (normalized === "client@musegate.local") return UserRole.CLIENT;
  return UserRole.SALES;
}
```

**Step 4: Run test to verify it passes**

Run: `npm --prefix web test`
Expected: PASS (1 test suite).

**Step 5: Commit**

```bash
git add web/services/roleMapper.ts web/services/__tests__/roleMapper.test.ts web/package.json web/vitest.config.ts
git commit -m "test: add role mapping utility and vitest setup"
```

### Task 2: Add Supabase profile helpers

**Files:**
- Create: `web/services/profileApi.ts`
- Modify: `web/services/supabaseClient.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";
import { getProfile } from "../profileApi";

describe("getProfile", () => {
  it("returns null for missing profile", async () => {
    const { data, error } = await getProfile("missing");
    expect(error).toBeNull();
    expect(data).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix web test`
Expected: FAIL (module not found or missing exports).

**Step 3: Write minimal implementation**

```ts
import { supabase } from "./supabaseClient";
import type { Profile } from "../types";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();
  return { data: data ?? null, error };
}

export async function upsertProfile(profile: Profile) {
  return supabase.from("profiles").upsert(profile);
}
```

**Step 4: Run test to verify it passes**

Run: `npm --prefix web test`
Expected: PASS (mocked error handling may need adjustment).

**Step 5: Commit**

```bash
git add web/services/profileApi.ts web/services/supabaseClient.ts
git commit -m "feat: add profile helpers for supabase"
```

### Task 3: Wire login flow into the App shell

**Files:**
- Modify: `web/App.tsx`
- Modify: `web/components/Auth/LoginPage.tsx`
- Modify: `web/types.ts`

**Step 1: Write the failing test**

```ts
import { mapEmailToRole } from "./services/roleMapper";
import { UserRole } from "./types";

export function __test_role(email: string) {
  return mapEmailToRole(email);
}

if (__test_role("admin@musegate.local") !== UserRole.ADMIN) {
  throw new Error("role mapping failed");
}
```

**Step 2: Run test to verify it fails**

Run: `npm --prefix web test`
Expected: FAIL until App uses role mapping.

**Step 3: Write minimal implementation**

```tsx
// In App.tsx:
// - Read session with supabase.auth.getSession()
// - Render <LoginPage onLogin={handleLogin} /> when session missing
// - On login: map email -> role, upsert profile, set state
// - Add logout button: supabase.auth.signOut()
```

**Step 4: Run test to verify it passes**

Run: `npm --prefix web test`
Expected: PASS.

**Step 5: Commit**

```bash
git add web/App.tsx web/components/Auth/LoginPage.tsx web/types.ts
git commit -m "feat: add login flow and role bootstrap"
```

### Task 4: Manual verification

**Files:**
- Modify: `README.md`

**Step 1: Add manual verification steps**

```md
- Login with admin@musegate.local / admin and confirm role badge
- Login with finance@musegate.local / finance and confirm Finance panel accessible
- Logout and ensure app returns to login page
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add auth login verification steps"
```
