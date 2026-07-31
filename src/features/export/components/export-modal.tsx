"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { Icons } from "@/lib/icons";

export function ExportModal() {
  const { expenses, roomBalances } = useExpenses();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const exportCSV = () => {
    const headers = "ID,Description,Amount,Category,PaidBy,Date\n";
    const rows = expenses
      .map(
        (e) =>
          `"${e.id}","${e.description}",${e.amount},"${e.category}","${e.payer?.name || e.paid_by}","${e.created_at}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `kamrakhata_expenses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const data = {
      expenses,
      roomBalances,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `kamrakhata_data_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-1.5 text-xs font-semibold"
      >
        <Icons.receipt className="h-3.5 w-3.5" />
        <span>Export Data</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <Card className="max-w-md w-full p-6 space-y-4 border border-border/80 bg-card shadow-card">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg font-bold">
                  Export Room Data
                </CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icons.logout className="h-4 w-4" />
                </button>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Download room expenses and balance records in your preferred format.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-3 pt-2">
              <Button
                onClick={exportCSV}
                className="w-full text-xs font-semibold justify-start gap-2 h-11"
              >
                <Icons.receipt className="h-4 w-4" />
                <span>Export as CSV Spreadsheet (.csv)</span>
              </Button>

              <Button
                variant="outline"
                onClick={exportJSON}
                className="w-full text-xs font-semibold justify-start gap-2 h-11"
              >
                <Icons.expenses className="h-4 w-4" />
                <span>Export raw JSON Dataset (.json)</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.print()}
                className="w-full text-xs font-semibold justify-start gap-2 h-11 text-muted-foreground"
              >
                <Icons.building className="h-4 w-4" />
                <span>Print Summary Document</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
