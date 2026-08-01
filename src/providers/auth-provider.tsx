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

    // Check pre-created accounts first
    let matchedRoommate = ROOMMATE_ACCOUNTS.find(
      (r) =>
        r.email.toLowerCase() === normalizedEmail ||
        r.name.toLowerCase() === normalizedEmail ||
        `${r.name.toLowerCase()}@gmail.com` === normalizedEmail
    );

    // If not preset, check local registered users
    if (!matchedRoommate && typeof window !== "undefined") {
      const customUsersRaw = localStorage.getItem("kamrakhata_custom_roommates");
      if (customUsersRaw) {
        try {
          const customUsers: UserProfile[] = JSON.parse(customUsersRaw);
          matchedRoommate = customUsers.find(
            (u) => u.email.toLowerCase() === normalizedEmail || u.name.toLowerCase() === normalizedEmail
          );
        } catch (e) {
          console.error("Failed to parse custom roommates", e);
        }
      }
    }

    // If still not found, allow login by creating user on the fly for smooth onboarding
    if (!matchedRoommate) {
      const formattedName = email.includes("@") ? email.split("@")[0] : email;
      matchedRoommate = {
        id: `rm-${Date.now()}`,
        name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
        email: email.includes("@") ? email : `${email.toLowerCase()}@kamrakhata.internal`,
        role: "Roommate",
      };
    }

    try {
      if (password) {
        try {
          await supabase.auth.signInWithPassword({
            email: matchedRoommate.email,
            password: password,
          });
        } catch {
          // Fallback to local session
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

  const register = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = createClient();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const newUserProfile: UserProfile = {
      id: `rm-${Date.now()}`,
      name: cleanName,
      email: cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@kamrakhata.internal`,
      role: "Roommate",
      themePreference: "dark",
    };

    // Save to local custom users store
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        existing.push(newUserProfile);
        localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(existing));
      } catch (e) {
        console.error("Failed to store custom roommate", e);
      }
    }

    try {
      if (password) {
        await supabase.auth.signUp({
          email: newUserProfile.email,
          password: password,
          options: {
            data: { name: cleanName },
          },
        });
      }
    } catch (err) {
      console.log("Supabase signup optional note:", err);
    }

    setUser(newUserProfile);
    setAuthCookie(newUserProfile);
    setIsLoading(false);
    router.push("/");
    return { success: true };
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
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
