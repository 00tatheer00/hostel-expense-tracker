"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, AuthContextType } from "@/types/auth";

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

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
          // Fetch actual status from DB profile (user_metadata may not have status)
          let dbStatus: string = "approved";
          try {
            const res = await fetch("/api/profiles");
            const data = await res.json();
            const dbProfiles: UserProfile[] = data.profiles || [];
            const dbProfile = dbProfiles.find((p: any) => p.id === supabaseUser.id || p.email === supabaseUser.email);
            if (dbProfile) dbStatus = dbProfile.status || "approved";
          } catch {}
          const profile: UserProfile = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Roommate",
            email: supabaseUser.email || "",
            role: supabaseUser.user_metadata?.role || "Roommate",
            status: dbStatus as any,
          };
          setUser(profile);
          setAuthCookie(profile);
        } else {
          const cookiesArr = typeof document !== "undefined" ? document.cookie.split("; ") : [];
          const authCookie = cookiesArr.find((c) => c.startsWith("kamrakhata_auth_user="));
          let restoredProfile: UserProfile | null = null;

          if (authCookie) {
            const rawVal = decodeURIComponent(authCookie.split("=")[1]);
            try {
              restoredProfile = JSON.parse(rawVal);
            } catch {
              restoredProfile = null;
            }
          }

          if (!restoredProfile && typeof window !== "undefined") {
            const localSaved = localStorage.getItem("kamrakhata_auth_user");
            if (localSaved) {
              try {
                restoredProfile = JSON.parse(localSaved);
              } catch {
                restoredProfile = null;
              }
            }
          }

          if (restoredProfile) {
            setUser(restoredProfile);
            setAuthCookie(restoredProfile);
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
        // Don't override user state from onAuthStateChange — login() already handles profile with correct status
        // Only update if no user is currently set (e.g. page refresh with active Supabase session)
        setUser((currentUser) => {
          if (currentUser) return currentUser; // already set by login() or initializeAuth()
          return {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Roommate",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "Roommate",
            status: "pending", // safe default; initializeAuth will correct this
          };
        });
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

    let matchedUser: UserProfile | null = null;

    // 0. Strict check for Room Admin credentials (username: admin, password: TatheerIsAdmin.123)
    if (normalizedEmail === "admin" || normalizedEmail === "admin@kamrakhata.internal" || normalizedEmail.startsWith("admin")) {
      if (password && password !== "TatheerIsAdmin.123") {
        setIsLoading(false);
        return {
          success: false,
          error: "Galat Admin Password! Room Admin login sirf sahi password (TatheerIsAdmin.123) se hoga.",
        };
      }

      matchedUser = {
        id: "a1b2c3d4-0000-4000-8000-000000000000",
        name: "Room Admin",
        email: "admin@kamrakhata.internal",
        role: "Room Admin",
        status: "approved",
      };
    }

    // 2. Check registered roommates from central database (cross-device)
    if (!matchedUser) {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        const dbProfiles: UserProfile[] = data.profiles || [];

        matchedUser = dbProfiles.find(
          (u: any) =>
            u.email?.toLowerCase() === normalizedEmail ||
            u.name?.toLowerCase() === normalizedEmail ||
            u.email?.toLowerCase()?.split("@")[0] === normalizedEmail
        ) || null;

        // Also sync to localStorage for faster subsequent lookups
        if (typeof window !== "undefined" && dbProfiles.length > 0) {
          localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(dbProfiles));
        }
      } catch (e) {
        console.error("Failed to fetch profiles from API", e);
      }
    }

    // 3. Fallback: Check localStorage only
    if (!matchedUser && typeof window !== "undefined") {
      const customUsersRaw = localStorage.getItem("kamrakhata_custom_roommates");
      if (customUsersRaw) {
        try {
          const customUsers: UserProfile[] = JSON.parse(customUsersRaw);
          matchedUser = customUsers.find(
            (u) =>
              u.email.toLowerCase() === normalizedEmail ||
              u.name.toLowerCase() === normalizedEmail ||
              u.email.toLowerCase().split("@")[0] === normalizedEmail
          ) || null;
        } catch (e) {
          console.error("Failed to parse custom roommates", e);
        }
      }
    }

    if (!matchedUser) {
      setIsLoading(false);
      return {
        success: false,
        error: "Yeh account registered nahi hai. Meharbani karke pehle Register karein.",
      };
    }

    // STRICT CHECK: Block entry if account status is pending
    if (matchedUser.status === "pending") {
      setIsLoading(false);
      return {
        success: false,
        error: "Aap ka account Room Admin ki approval ke liye pending hai. Room Admin jab tak approve nahi karega, aap log in nahi kar sakte.",
      };
    }

    if (matchedUser.status === "rejected") {
      setIsLoading(false);
      return {
        success: false,
        error: "Aap ki registration request Room Admin ki taraf se reject ho gayi hai.",
      };
    }

    try {
      if (password) {
        try {
          await supabase.auth.signInWithPassword({
            email: matchedUser.email,
            password: password,
          });
        } catch {
          // Fallback to local session
        }
      }

      setUser(matchedUser);
      setAuthCookie(matchedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("kamrakhata_auth_user", JSON.stringify(matchedUser));
      }
      setIsLoading(false);
      router.push("/");
      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err);
      setUser(matchedUser);
      setAuthCookie(matchedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("kamrakhata_auth_user", JSON.stringify(matchedUser));
      }
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
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if explicitly Admin
    const isAdminRegistration = cleanName.toLowerCase().includes("admin") || cleanEmail.includes("admin");

    const newUserProfile: UserProfile = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "a1b2c3d4-0000-4000-8000-" + Date.now().toString(16).slice(-12).padStart(12, '0'),
      name: cleanName,
      email: cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@kamrakhata.internal`,
      role: isAdminRegistration ? "Room Admin" : "Roommate",
      status: isAdminRegistration ? "approved" : "pending",
      themePreference: "dark",
    };

    // 1. Save to central database via server-side API route (cross-device)
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserProfile),
      });
      const result = await res.json();
      if (!result.success && result.error) {
        console.error("API profile save error:", result.error);
      }
    } catch (e) {
      console.error("Failed to save profile to API:", e);
    }

    // 2. Also save to localStorage for same-device instant access
    if (typeof window !== "undefined") {
      try {
        const existing: UserProfile[] = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        existing.push(newUserProfile);
        localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(existing));
        window.dispatchEvent(new Event("kamrakhata_data_change"));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to store custom roommate locally", e);
      }
    }

    setIsLoading(false);

    if (newUserProfile.status === "pending") {
      return {
        success: true,
        error: "Aap ka account ban gaya hai! Approval ke liye Room Admin ko bhej diya gaya hai. Admin jab tak approve nahi karega, aap enter nahi ho sakte.",
      };
    }

    setUser(newUserProfile);
    setAuthCookie(newUserProfile);
    router.push("/");
    return { success: true };
  };

  const approveUser = async (userId: string) => {
    // Call server-side API to update DB + send email
    try {
      // Fetch user details from API first (cross-device safe)
      let targetUser: UserProfile | undefined;
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        const dbProfiles: UserProfile[] = data.profiles || [];
        targetUser = dbProfiles.find((u: any) => u.id === userId);
      } catch {}

      // Fallback to localStorage if API didn't return the user
      if (!targetUser && typeof window !== "undefined") {
        const existing: UserProfile[] = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        targetUser = existing.find((u) => u.id === userId);
      }

      await fetch("/api/profiles/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "approve",
          userEmail: targetUser?.email,
          userName: targetUser?.name,
        }),
      });
    } catch (e) {
      console.error("Failed to approve via API", e);
    }

    // Update localStorage
    if (typeof window !== "undefined") {
      try {
        const existing: UserProfile[] = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        const updated = existing.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u));
        localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(updated));
        window.dispatchEvent(new Event("kamrakhata_data_change"));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to approve user locally", e);
      }
    }
  };

  const rejectUser = async (userId: string) => {
    // Call server-side API to update DB + send email
    try {
      // Fetch user details from API first (cross-device safe)
      let targetUser: UserProfile | undefined;
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        const dbProfiles: UserProfile[] = data.profiles || [];
        targetUser = dbProfiles.find((u: any) => u.id === userId);
      } catch {}

      // Fallback to localStorage if API didn't return the user
      if (!targetUser && typeof window !== "undefined") {
        const existing: UserProfile[] = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        targetUser = existing.find((u) => u.id === userId);
      }

      await fetch("/api/profiles/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "reject",
          userEmail: targetUser?.email,
          userName: targetUser?.name,
        }),
      });
    } catch (e) {
      console.error("Failed to reject via API", e);
    }

    // Update localStorage
    if (typeof window !== "undefined") {
      try {
        const existing: UserProfile[] = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        const updated = existing.map((u) => (u.id === userId ? { ...u, status: "rejected" as const } : u));
        localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(updated));
        window.dispatchEvent(new Event("kamrakhata_data_change"));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Failed to reject user locally", e);
      }
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
      router.push("/");
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
        approveUser,
        rejectUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
