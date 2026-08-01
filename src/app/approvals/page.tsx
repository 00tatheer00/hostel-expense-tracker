"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { UserProfile } from "@/types/auth";

export default function ApprovalsPage() {
  const { user, isLoading } = useAuth();
  const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const refreshUsers = React.useCallback(async () => {
    let list: UserProfile[] = [];

    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      if (data.profiles && data.profiles.length > 0) {
        list = data.profiles.map((p: any) => ({
          id: p.id,
          name: p.name || "Roommate",
          email: p.email || "",
          role: p.role || "Roommate",
          status: p.status || "approved",
        }));
      }
    } catch (e) {
      console.error("Failed to fetch profiles from API", e);
    }

    setAllUsers(list);
  }, []);

  React.useEffect(() => {
    refreshUsers();

    const handleStorage = () => refreshUsers();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("kamrakhata_data_change", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("kamrakhata_data_change", handleStorage);
    };
  }, [refreshUsers]);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Kya aap ${userName} ko Room 14 se remove/delete karna chahte hain?`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const res = await fetch(`/api/profiles?id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("kamrakhata_data_change"));
        refreshUsers();
      } else {
        alert(data.error || "Failed to remove roommate");
      }
    } catch (e: any) {
      alert("Error removing roommate: " + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  // Access control check for Room Admin
  if (!user || user.role !== "Room Admin") {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto my-12 text-center">
          <Card className="border-rose-500/30 bg-rose-500/5 shadow-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Icons.shieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
              <p className="text-xs text-muted-foreground">
                Yeh Member Directory page Room Admin ke liye hai.
              </p>
            </div>
            <Link href="/" className="inline-block">
              <Button size="sm" className="bg-primary text-primary-foreground font-semibold gap-2">
                <Icons.arrowLeft className="h-4 w-4" />
                <span>Return to Dashboard</span>
              </Button>
            </Link>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  const roommatesList = allUsers.filter((u) => !u.name?.toLowerCase().includes("admin") && !u.email?.toLowerCase().includes("admin"));

  return (
    <PageWrapper>
      <PageHeader
        title="Roommates Directory & Management"
        subtitle={`${siteConfig.roomNumber}, ${siteConfig.hostelName} - Live active registered roommates management.`}
        badge={
          <Badge variant="success" className="font-mono text-xs gap-1">
            <Icons.checkCircle className="h-3.5 w-3.5" />
            <span>{roommatesList.length} Active Members</span>
          </Badge>
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={refreshUsers}
            className="gap-2 text-xs font-semibold"
          >
            <Icons.refresh className="h-3.5 w-3.5" />
            <span>Refresh List</span>
          </Button>
        }
      />

      <div className="space-y-6">
        <Card className="border border-border/80 bg-card shadow-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>👥 Active Roommate Members ({roommatesList.length})</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Roommates registered in Room 14 portal. Admin unko yahan se remove/delete kar sakta hai.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            {roommatesList.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl space-y-2 bg-surface/20">
                <div className="h-10 w-10 mx-auto rounded-full bg-slate-500/10 text-slate-500 flex items-center justify-center">
                  <Icons.users className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No Registered Roommates Yet</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  When new roommates sign up on the registration form, their active accounts will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {roommatesList.map((aUser) => (
                  <div key={aUser.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <Avatar name={aUser.name} size="md" />
                      <div>
                        <span className="text-sm font-bold text-foreground">{aUser.name}</span>
                        <p className="text-xs text-muted-foreground font-mono">{aUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                        Active Member
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deletingId === aUser.id}
                        onClick={() => handleDeleteUser(aUser.id, aUser.name)}
                        className="text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1"
                      >
                        <Icons.trash className="h-3.5 w-3.5" />
                        <span>{deletingId === aUser.id ? "Deleting..." : "Remove Roommate"}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
