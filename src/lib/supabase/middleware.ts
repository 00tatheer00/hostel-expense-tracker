import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const FALLBACK_URL = "https://lrghckqrffqcnhfopkgs.supabase.co";
const FALLBACK_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZ2hja3FyZmZxY25oZm9wa2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTI4NDYsImV4cCI6MjEwMTA4ODg0Nn0.WCDM7AXfAwB9ip8xxXwIO_3QjP06R9GN9TkVt23sUU0";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/login";
  const publicPaths = ["/", "/login", "/register", "/guide"];
  const isPublicPage = publicPaths.includes(pathname);

  // Fast path: Check existing mock/app session cookie first
  const mockSessionCookie = request.cookies.get("kamrakhata_auth_user")?.value;
  let isAuthenticated = !!mockSessionCookie;

  // If already authenticated by cookie and not visiting /login, return fast without remote network call
  if (isAuthenticated && !isLoginPage) {
    return response;
  }

  // If unauthenticated and on a public page (except login check), allow fast without remote network call
  const hasSupabaseCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!isAuthenticated && isPublicPage && !hasSupabaseCookie) {
    return response;
  }

  // Check auth session via Supabase only if Supabase cookie exists and mock cookie is absent
  let user = null;
  if (!isAuthenticated && hasSupabaseCookie) {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      user = supabaseUser;
      if (user) isAuthenticated = true;
    } catch (err) {
      console.warn("Middleware Supabase getUser error:", err);
    }
  }

  if (!isAuthenticated && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}
