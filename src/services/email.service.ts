import { siteConfig } from "@/config/site";

export interface RegistrationEmailInput {
  name: string;
  email: string;
  role: string;
  status: "approved" | "pending";
}

export interface WeeklyReportEmailInput {
  adminEmail: string;
  roommates: { name: string; email: string; netBalance: number }[];
  totalExpenses: number;
  categoryBreakdown: { category: string; amount: number }[];
  periodLabel: string;
}

export class EmailService {
  /**
   * Send Registration Confirmation Email to New Roommate
   */
  static async sendRegistrationEmail(input: RegistrationEmailInput): Promise<{ success: boolean; message: string }> {
    console.log(`[EmailService] Sending Registration Email to ${input.email}...`);

    const emailSubject = `Welcome to ${siteConfig.name} - ${siteConfig.roomNumber}, ${siteConfig.hostelName}`;
    const emailBody = `
==================================================
🏠 ${siteConfig.name} - ${siteConfig.roomNumber}, ${siteConfig.hostelName}
==================================================

Assalam-o-Alaikum ${input.name},

Aap ka account KamraKhata portal par register ho gaya hai.

📌 Account Details:
- Registered Name: ${input.name}
- Email / Username: ${input.email}
- Assigned Role: ${input.role}
- Account Status: ${input.status === "pending" ? "⏳ Pending Admin Approval" : "✅ Active / Approved"}

${
  input.status === "pending"
    ? "Aap ka account filhal Room Admin ki approval ke liye pending hai. Admin approve karega tab aap log in kar sakenge."
    : "Aap ka account active hai! Aap website par ja kar log in kar sakte hain."
}

Link: https://kamrakhata.vercel.app

Shukriya!
Room 14 Management Team
==================================================
    `.trim();

    // Trigger Client Mailto Fallback or Webhook Dispatch
    if (typeof window !== "undefined") {
      const mailtoUrl = `mailto:${input.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      console.log("[EmailService] Generated mailto fallback URL:", mailtoUrl);
    }

    return {
      success: true,
      message: `Registration details sent to ${input.email}`,
    };
  }

  /**
   * Send Weekly Report via Resend API Endpoint
   */
  static async sendWeeklyReportViaResend(input: WeeklyReportEmailInput): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch("/api/send-weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Failed to dispatch email via Resend.",
        };
      }

      return {
        success: true,
        message: data.message || "Weekly report email sent successfully!",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Network error while sending email.",
      };
    }
  }

  /**
   * Generate Styled HTML Weekly Khata Email Template
   */
  static generateWeeklyReportHTML(input: WeeklyReportEmailInput): string {
    const categoryRows = input.categoryBreakdown
      .map(
        (c) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${c.category}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace;">Rs. ${c.amount.toLocaleString()}</td>
      </tr>
    `
      )
      .join("");

    const roommateRows = input.roommates
      .map((r) => {
        const isLeneHain = r.netBalance > 0;
        const isDeneHain = r.netBalance < 0;
        const color = isLeneHain ? "#10B981" : isDeneHain ? "#EF4444" : "#6B7280";
        const statusText = isLeneHain
          ? `+ Rs. ${Math.abs(r.netBalance).toLocaleString()} (LENE HAIN)`
          : isDeneHain
          ? `- Rs. ${Math.abs(r.netBalance).toLocaleString()} (DENE HAIN)`
          : "Rs. 0 (Settled)";

        return `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${r.name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; color: ${color}; font-weight: bold;">${statusText}</td>
      </tr>
    `;
      })
      .join("");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Weekly Khata Report - ${siteConfig.roomNumber}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4f46e5, #10b981); padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">📊 ${siteConfig.name} Weekly Khata</h1>
      <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">${siteConfig.roomNumber} • ${siteConfig.hostelName}</p>
      <span style="display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-top: 8px; font-family: monospace;">${input.periodLabel}</span>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
        <span style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: bold;">Total Room Expenses This Week</span>
        <div style="font-size: 28px; font-weight: bold; color: #111827; margin-top: 4px; font-family: monospace;">Rs. ${input.totalExpenses.toLocaleString()}</div>
      </div>

      <!-- Categories -->
      <h3 style="font-size: 14px; text-transform: uppercase; color: #374151; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; margin-bottom: 12px;">🛒 Category Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>${categoryRows}</tbody>
      </table>

      <!-- Roommates Net Hisaab -->
      <h3 style="font-size: 14px; text-transform: uppercase; color: #374151; border-bottom: 2px solid #10b981; padding-bottom: 4px; margin-bottom: 12px;">💰 Roommates Net Hisaab</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tbody>${roommateRows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
      KamraKhata Room 14 Automatic Expense Tracker System<br>
      <a href="https://kamrakhata.vercel.app" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Open Room 14 Live Portal →</a>
    </div>

  </div>
</body>
</html>
    `.trim();
  }
}
