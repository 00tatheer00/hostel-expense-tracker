"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { Icons } from "@/lib/icons";

export function SettingsCard() {
  const [currency, setCurrency] = React.useState<string>("INR (Rs.)");
  const [landingPage, setLandingPage] = React.useState<string>("Dashboard (/)");

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* App Preferences */}
      <Card className="border border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-bold">
            App Preferences
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Customize display, theme, and default navigation settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Theme Mode */}
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground block">
                Appearance & Theme
              </span>
              <span className="caption text-xs text-muted-foreground">
                Switch between warm neutral light mode and dark mode
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* Currency Format */}
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground block">
                Currency Display Format
              </span>
              <span className="caption text-xs text-muted-foreground">
                Standard currency symbol for room calculations
              </span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border border-input bg-background text-foreground"
            >
              <option value="INR (Rs.)">INR (Rs.)</option>
              <option value="USD ($)">USD ($)</option>
            </select>
          </div>

          {/* Default Landing Page */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground block">
                Default Landing Page
              </span>
              <span className="caption text-xs text-muted-foreground">
                Page loaded when opening KamraKhata
              </span>
            </div>
            <select
              value={landingPage}
              onChange={(e) => setLandingPage(e.target.value)}
              className="h-9 px-3 text-xs font-medium rounded-lg border border-input bg-background text-foreground"
            >
              <option value="Dashboard (/)">Dashboard (/)</option>
              <option value="Expenses (/expenses)">Expenses (/expenses)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* About Application */}
      <Card className="border border-border/80 bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="font-heading text-lg font-bold flex items-center space-x-2">
                <Icons.building className="h-5 w-5 text-primary" />
                <span>About {siteConfig.name}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {siteConfig.description}
              </CardDescription>
            </div>
            <Badge variant="success" className="font-mono text-xs">
              v1.0.0 Stable
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="p-3 rounded-xl bg-surface/40 border border-border/50 text-xs text-muted-foreground leading-relaxed space-y-1">
            <div className="flex items-center justify-between font-mono font-semibold text-foreground">
              <span>Room Number:</span>
              <span>{siteConfig.roomNumber}</span>
            </div>
            <div className="flex items-center justify-between font-mono font-semibold text-foreground">
              <span>Hostel Block:</span>
              <span>{siteConfig.hostelName}</span>
            </div>
            <div className="flex items-center justify-between font-mono font-semibold text-foreground">
              <span>Fixed Roommates:</span>
              <span>{siteConfig.totalRoommates} Members</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
