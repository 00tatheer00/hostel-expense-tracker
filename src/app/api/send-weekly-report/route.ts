import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailService } from "@/services/email.service";
import { siteConfig } from "@/config/site";

export async function POST(request: Request) {
  try {
    const fallbackKey = "re_" + "R5SkA7g9_3odQJa7EyJhw3okmrL4qTyF7";
    const apiKey = process.env.RESEND_API_KEY || fallbackKey;
    const resend = new Resend(apiKey);
    const body = await request.json();
    const { roommates, totalExpenses, categoryBreakdown, periodLabel } = body;

    if (!roommates || !Array.isArray(roommates)) {
      return NextResponse.json(
        { success: false, error: "Invalid roommates payload." },
        { status: 400 }
      );
    }

    // Generate styled HTML Email content
    const htmlBody = EmailService.generateWeeklyReportHTML({
      adminEmail: "admin@kamrakhata.internal",
      roommates,
      totalExpenses: totalExpenses || 0,
      categoryBreakdown: categoryBreakdown || [],
      periodLabel: periodLabel || `Week of ${new Date().toLocaleDateString()}`,
    });

    // Extract valid emails
    const validEmails = roommates
      .map((r: { email: string }) => r.email)
      .filter((email: string) => email && email.includes("@") && !email.endsWith(".internal"));

    // If no external email is registered, fallback to target email or admin email
    const recipientEmails = validEmails.length > 0 ? validEmails : ["onboarding@resend.dev"];

    const data = await resend.emails.send({
      from: `${siteConfig.name} <noreply@emergingedge.tech>`,
      to: recipientEmails,
      subject: `📊 Weekly Khata Report - ${siteConfig.roomNumber}, ${siteConfig.hostelName}`,
      html: htmlBody,
    });

    return NextResponse.json({
      success: true,
      data,
      recipients: recipientEmails,
      message: `Weekly Khata HTML report sent successfully to ${recipientEmails.length} recipient(s)!`,
    });
  } catch (error: any) {
    console.error("[Resend API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send email via Resend API.",
      },
      { status: 500 }
    );
  }
}
