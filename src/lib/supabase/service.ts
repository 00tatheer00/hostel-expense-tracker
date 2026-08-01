import { createClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://lrghckqrffqcnhfopkgs.supabase.co";
const FALLBACK_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZ2hja3FyZmZxY25oZm9wa2dzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTUxMjg0NiwiZXhwIjoyMTAxMDg4ODQ2fQ.OS6Hzljk0mK0v5r171nSMHcADS-EaC9uqR2Up5-Fu4g";

export function getServiceClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE_KEY;
  return createClient(url, key);
}
