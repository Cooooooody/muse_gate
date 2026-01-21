type LogoutArgs = {
  signOut: (options?: { scope?: "local" | "global" | "others" }) => Promise<void>;
  onReset: () => void;
};

export async function performLogout({ signOut, onReset }: LogoutArgs) {
  onReset();
  try {
    await signOut({ scope: "local" });
  } catch {
    // Ignore sign-out errors; local state reset already performed.
  }
}
