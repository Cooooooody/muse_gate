export type AuthSession<User> = {
  user?: User | null;
} | null;

export type AuthResponse<User> = {
  user?: User | null;
  session?: AuthSession<User>;
};

export function getUserFromAuthResponse<User>(response: AuthResponse<User>): User | null {
  if (response.user) {
    return response.user;
  }
  return response.session?.user ?? null;
}
