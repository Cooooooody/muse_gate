export type GetSessionFn<TSession> = () => Promise<{ data: { session: TSession | null } }>;

type SessionResult<TSession> = {
  session: TSession | null;
  error: Error | null;
};

export async function getSessionSafe<TSession>(
  getSession: GetSessionFn<TSession>,
  timeoutMs = 8000
): Promise<SessionResult<TSession>> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const sessionResult = await Promise.race([
      getSession(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("timeout"));
        }, timeoutMs);
      })
    ]);

    return { session: sessionResult.data.session ?? null, error: null };
  } catch (error) {
    return { session: null, error: error instanceof Error ? error : new Error("unknown") };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
