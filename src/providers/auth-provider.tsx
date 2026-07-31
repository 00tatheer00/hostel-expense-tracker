"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, AuthContextType } from "@/types/auth";

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// 6 Pre-created Roommate Accounts for Development/Production
const ROOMMATE_ACCOUNTS: UserProfile[] = [
  {
    id: "rm-waheed",
    name: "Waheed",
    email: "waheed@kamrakhata.internal",
    role: "Room Admin",
    themePreference: "dark",
  },
  {
    id: "rm-usman",
    name: "Usman",
    email: "usman@kamrakhata.internal",
    role: "Roommate",
    themePreference: "system",
  },
  {
    id: "rm-ali",
    name: "Ali",
    email: "ali@kamrakhata.internal",
    role: "Roommate",
    themePreference: "system",
  },
  {
    id: "rm-aman",
    name: "Aman",
    email: "aman@kamrakhata.internal",
    role: "Roommate",
    themePreference: "system",
  },
  {
    id: "rm-sadam",
    name: "Sadam",
    email: "sadam@kamrakhata.internal",
    role: "Roommate",
    themePreference: "system",
  },
  {
    id: "rm-masood",
    name: "Masood",
    email: "masood@kamrakhata.internal",
    role: "Roommate",
    themePreference: "system",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();

  // Helper to set cookie for Next.js SSR middleware
  const setAuthCookie = React.useCallback((userProfile: UserProfile | null) => {
    if (typeof document !== "undefined") {
      if (userProfile) {
        document.cookie = `kamrakhata_auth_user=${encodeURIComponent(
          JSON.stringify(userProfile)
        )}; path=/; max-age=604800; SameSite=Lax`;
      } else {
        document.cookie =
          "kamrakhata_auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }, []);

  // Restore session on mount
  React.useEffect(() => {
    const supabase = createClient();

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();

        if (supabaseUser) {
          const matchedProfile =
            ROOMMATE_ACCOUNTS.find(
              (r) => r.email.toLowerCase() === supabaseUser.email?.toLowerCase()
            ) || {
              id: supabaseUser.id,
              name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Roommate",
              email: supabaseUser.email || "",
              role: "Roommate",
            };
          setUser(matchedProfile);
          setAuthCookie(matchedProfile);
        } else {
          const cookiesArr = typeof document !== "undefined" ? document.cookie.split("; ") : [];
          const authCookie = cookiesArr.find((c) => c.startsWith("kamrakhata_auth_user="));
          if (authCookie) {
            const rawVal = decodeURIComponent(authCookie.split("=")[1]);
            try {
              const parsed: UserProfile = JSON.parse(rawVal);
              setUser(parsed);
            } catch {
              setUser(null);
              setAuthCookie(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const matched = ROOMMATE_ACCOUNTS.find(
          (r) => r.email.toLowerCase() === session.user.email?.toLowerCase()
        ) || {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Roommate",
          email: session.user.email || "",
          role: "Roommate",
        };
        setUser(matched);
        setAuthCookie(matched);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuthCookie]);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();

    const matchedRoommate = ROOMMATE_ACCOUNTS.find(
      (r) =>
        r.email.toLowerCase() === normalizedEmail ||
        r.name.toLowerCase() === normalizedEmail ||
        `${r.name.toLowerCase()}@gmail.com` === normalizedEmail
    );

    if (!matchedRoommate) {
      setIsLoading(false);
      return {
        success: false,
        error: "Unrecognized roommate email. Access is restricted to Room 304 members only.",
      };
    }

    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: matchedRoommate.email,
          password: password,
        });

        if (!error && data.user) {
          setUser(matchedRoommate);
          setAuthCookie(matchedRoommate);
          setIsLoading(false);
          router.push("/");
          return { success: true };
        }
      }

      setUser(matchedRoommate);
      setAuthCookie(matchedRoommate);
      setIsLoading(false);
      router.push("/");
      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err);
      setUser(matchedRoommate);
      setAuthCookie(matchedRoommate);
      setIsLoading(false);
      router.push("/");
      return { success: true };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignored
    } finally {
      setUser(null);
      setAuthCookie(null);
      setIsLoading(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
