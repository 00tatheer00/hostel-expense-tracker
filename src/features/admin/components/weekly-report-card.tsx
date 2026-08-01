"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { WeeklyReportService } from "@/services/weekly-report.service";
import { EmailService } from "@/services/email.service";
import { siteConfig } from "@/config/site";
import { InfoPopover } from "@/components/common/info-popover";

export function WeeklyReportCard() {
  const { expenses, roomBalances, roommates } = useExpenses();
  const [emailStatus, setEmailStatus] = React.useState<string | null>(null);

  const totalWeeklyExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const periodLabel = `Week of ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const handleWhatsAppShare = () => {
    const reportText = WeeklyReportService.generateWhatsAppWeeklyReport(
      totalWeeklyExpenses,
      roomBalances,
      expenses
    );
    WeeklyReportService.shareToWhatsApp(reportText);
  };

  const handleSendEmailReport = async () => {
    setEmailStatus("Sending weekly HTML email report via Resend...");

    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "Grocery";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));

    const roommatesData = roomBalances.map((b) => ({
      name: b.user.name,
      email: b.user.email || `${b.user.name.toLowerCase()}@kamrakhata.internal`,
      netBalance: b.netBalance,
    }));

    const result = await EmailService.sendWeeklyReportViaResend({
      adminEmail: "admin@kamrakhata.internal",
      roommates: roommatesData,
      totalExpenses: totalWeeklyExpenses,
      categoryBreakdown,
      periodLabel,
    });

    if (result.success) {
      setEmailStatus(`✅ Resend Success: ${result.message}`);
    } else {
      // If RESEND_API_KEY is not set or failed, provide clear message and mailto fallback option
      setEmailStatus(`⚠️ ${result.error}`);

      if (typeof window !== "undefined") {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(
          `Weekly Khata Report - ${siteConfig.roomNumber}`
        )}&body=${encodeURIComponent(
          `Assalam-o-Alaikum Roommates,\n\nHere is the Weekly Khata Report for ${siteConfig.roomNumber}:\n\nTotal Weekly Expenses: Rs. ${totalWeeklyExpenses}\n\nView live report: https://kamrakhata.vercel.app`
        )}`;
        window.open(mailtoUrl, "_blank");
      }
    }

    setTimeout(() => setEmailStatus(null), 6000);
  };

  return (
    <Card className="border border-border/80 bg-card shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>📱 Weekly Khata Report & WhatsApp Broadcast</span>
              <Badge variant="success" className="text-[10px] font-mono">
                {periodLabel}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Room 14 ke kharchon ka weekly breakdown, HTML template aur 1-click WhatsApp broadcast
              <InfoPopover
                title="Weekly Report & WhatsApp Broadcast"
                explanation="Yahan se aap ek click par Room 14 ke weekly kharchon ka report WhatsApp group mein share kar sakte hain aur email par send kar sakte hain."
              />
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {emailStatus && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <Icons.checkCircle className="h-4 w-4 shrink-0" />
            <span>{emailStatus}</span>
          </div>
        )}

        {/* Live Preview Box */}
        <div className="p-4 rounded-xl border border-border/60 bg-surface/50 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/40 font-bold text-foreground">
            <span>🏠 {siteConfig.roomNumber} Weekly Report</span>
            <span>Total: Rs. {totalWeeklyExpenses.toLocaleString()}</span>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-muted-foreground text-[10px] uppercase">
              Roommates Net Hisaab:
            </span>
            {roomBalances.length === 0 ? (
              <p className="text-muted-foreground italic">No roommate data available</p>
            ) : (
              roomBalances.map((b) => {
                const isLene = b.netBalance > 0;
                const isDene = b.netBalance < 0;
                return (
                  <div key={b.user.id} className="flex items-center justify-between py-0.5">
                    <span>{b.user.name}:</span>
                    <span
                      className={`font-bold ${
                        isLene
                          ? "text-emerald-600 dark:text-emerald-400"
                          : isDene
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isLene
                        ? `+ Rs. ${b.netBalance.toLocaleString()} (LENE HAIN)`
                        : isDene
                        ? `- Rs. ${Math.abs(b.netBalance).toLocaleString()} (DENE HAIN)`
                        : "Rs. 0 (Settled)"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 gap-2 shadow-subtle"
          >
            <Icons.sparkles className="h-4 w-4" />
            <span>1-Click WhatsApp Group Broadcast</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleSendEmailReport}
            className="w-full sm:w-auto flex-1 font-semibold text-xs h-10 gap-2 border-primary/40 hover:border-primary"
          >
            <Icons.receipt className="h-4 w-4 text-primary" />
            <span>Send Email HTML Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
