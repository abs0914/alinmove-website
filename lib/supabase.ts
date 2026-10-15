/**
 * Supabase server clients.
 *
 * - `createWaitlistClient()` — separate Supabase project for the customer
 *   waitlist table. Server-side only (uses service-role key).
 * - `createRiderAppClient()` — Rider App Supabase project for driver-apply
 *   inserts. Server-side only.
 * - `createSupabaseStorageClient()` — shares the waitlist Supabase project
 *   credentials but is intended for the "resumes" Storage bucket used by the
 *   Careers ATS. Server-side only.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let waitlistClient: SupabaseClient | null = null;
let riderAppClient: SupabaseClient | null = null;
let storageClient: SupabaseClient | null = null;

export function createWaitlistClient(): SupabaseClient {
  if (waitlistClient) return waitlistClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase waitlist client not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  waitlistClient = createClient(url, key, { auth: { persistSession: false } });
  return waitlistClient;
}

export function createRiderAppClient(): SupabaseClient {
  if (riderAppClient) return riderAppClient;
  const url = process.env.RIDER_APP_SUPABASE_URL;
  const key = process.env.RIDER_APP_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Rider App Supabase client not configured. Set RIDER_APP_SUPABASE_URL and RIDER_APP_SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  riderAppClient = createClient(url, key, { auth: { persistSession: false } });
  return riderAppClient;
}

export function createSupabaseStorageClient(): SupabaseClient {
  if (storageClient) return storageClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase storage client not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  storageClient = createClient(url, key, { auth: { persistSession: false } });
  return storageClient;
}

export const RESUMES_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";
