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
