import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_URL = "https://lrghckqrffqcnhfopkgs.supabase.co";
const FALLBACK_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZ2hja3FyZmZxY25oZm9wa2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTI4NDYsImV4cCI6MjEwMTA4ODg0Nn0.WCDM7AXfAwB9ip8xxXwIO_3QjP06R9GN9TkVt23sUU0";

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
