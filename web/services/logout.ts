type LogoutArgs = {
  signOut: () => Promise<void>;
  onReset: () => void;
};

export async function performLogout({ signOut, onReset }: LogoutArgs) {
  onReset();
  try {
    await signOut();
  } catch {
    // Ignore sign-out errors; local state reset already performed.
  }
}
