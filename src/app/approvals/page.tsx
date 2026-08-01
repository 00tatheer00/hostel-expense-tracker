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

import { EmailService } from "@/services/email.service";

import { createClient } from "@/lib/supabase/client";

export default function ApprovalsPage() {
  const { user, approveUser, rejectUser, isLoading } = useAuth();
  const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);

  const refreshUsers = React.useCallback(async () => {
    let list: UserProfile[] = [];

    // 1. PRIMARY: Fetch from server-side API (central database — cross-device)
    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      if (data.profiles && data.profiles.length > 0) {
        list = data.profiles.map((p: any) => ({
          id: p.id,
          name: p.name || "Roommate",
          email: p.email || "",
          role: p.role || "Roommate",
          status: p.status || "pending",
        }));

        // Sync API data to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(list));
          window.dispatchEvent(new Event("kamrakhata_data_change"));
        }
      }
    } catch (e) {
      console.error("Failed to fetch profiles from API", e);
    }

    // 2. FALLBACK: If API returned nothing, check localStorage
    if (list.length === 0 && typeof window !== "undefined") {
      try {
        const stored: UserProfile[] = JSON.parse(
          localStorage.getItem("kamrakhata_custom_roommates") || "[]"
        );
        list = stored;
      } catch (e) {
        console.error("Failed to fetch from localStorage", e);
      }
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

  const handleApprove = async (uId: string, uEmail: string, uName: string) => {
    await approveUser(uId);
    // Email is sent by the server-side API automatically
    await refreshUsers();
  };

  const handleReject = async (uId: string, uEmail: string, uName: string) => {
    await rejectUser(uId);
    // Email is sent by the server-side API automatically
    await refreshUsers();
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
                Yeh Approvals page Room Admin ke liye hai. Roommates ko yahan access nahi mil sakta.
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

  const pendingUsers = allUsers.filter((u) => u.status === "pending");
  const approvedUsers = allUsers.filter((u) => u.status === "approved" || !u.status);

  return (
    <PageWrapper>
      <PageHeader
        title="Roommate Approvals"
        subtitle={`${siteConfig.roomNumber}, ${siteConfig.hostelName} - Review and approve new roommate registrations.`}
        badge={
          <Badge variant={pendingUsers.length > 0 ? "warning" : "success"} className="font-mono text-xs gap-1">
            {pendingUsers.length > 0 ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{pendingUsers.length} Action Required</span>
              </>
            ) : (
              <>
                <Icons.checkCircle className="h-3.5 w-3.5" />
                <span>All Approved</span>
              </>
            )}
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
        {/* Pending Requests Section */}
        <Card className="border border-border/80 bg-card shadow-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>⏳ Pending Registration Requests</span>
              <Badge variant={pendingUsers.length > 0 ? "warning" : "secondary"} className="text-xs font-mono">
                {pendingUsers.length} Pending
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              New roommates whose account signups are waiting for your approval.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl space-y-2 bg-surface/20">
                <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Icons.checkCircle className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No Pending Registration Requests</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  All registered roommate accounts are approved. When a new roommate signs up, their request will instantly appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((pUser) => (
                  <div
                    key={pUser.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 gap-3 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar name={pUser.name} size="md" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{pUser.name}</h4>
                        <p className="text-xs text-muted-foreground font-mono">{pUser.email}</p>
                        <Badge variant="warning" className="text-[9px] font-mono mt-1">
                          Pending Admin Approval
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(pUser.id, pUser.email, pUser.name)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold gap-1.5 shadow-md border-0"
                      >
                        <Icons.check className="h-4 w-4" />
                        <span>Approve (Allow Entry & Email)</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(pUser.id, pUser.email, pUser.name)}
                        className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs font-semibold gap-1"
                      >
                        <Icons.x className="h-4 w-4" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Members List */}
        <Card className="border border-border/80 bg-card shadow-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>✅ Active Approved Members ({approvedUsers.length})</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Roommates who have been approved and can log into Room 14 portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="divide-y divide-border/60">
              {approvedUsers.map((aUser) => (
                <div key={aUser.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar name={aUser.name} size="sm" />
                    <div>
                      <span className="text-xs font-bold text-foreground">{aUser.name}</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{aUser.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                    {aUser.role || "Approved Member"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
