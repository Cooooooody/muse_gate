import { createClient } from "@supabase/supabase-js";

type SupabaseClient = ReturnType<typeof createClient>;

type QueryResult<T> = {
  data: T | null;
  error: null;
};

type StubQuery = {
  maybeSingle: <T>() => Promise<QueryResult<T>>;
};

type StubTable = {
  select: () => { eq: () => StubQuery };
  upsert: <T>(value: T) => Promise<QueryResult<T>>;
};

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;
const isTest = process.env.VITEST === "true" || process.env.NODE_ENV === "test";

const createStubClient = (): SupabaseClient => {
  const table: StubTable = {
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null, error: null })
      })
    }),
    upsert: async <T>(value: T) => ({ data: value, error: null })
  };

  return {
    from: () => table
  } as unknown as SupabaseClient;
};

export const supabase: SupabaseClient =
  isTest || !supabaseUrl || !supabaseAnonKey
    ? createStubClient()
    : createClient(supabaseUrl, supabaseAnonKey);
