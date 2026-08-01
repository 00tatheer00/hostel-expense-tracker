import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getServiceClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key);
}

// PATCH /api/profiles/approve — approve or reject a user
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, userEmail, userName } = body;
    // action = "approve" | "reject"

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: "userId and action are required" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const supabase = getServiceClient();

    // Fetch existing user record from users table to preserve role
    const { data: targetUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    let currentRole = "Roommate";
    if (targetUser && targetUser.theme) {
      try {
        const parsed = JSON.parse(targetUser.theme);
        if (parsed && parsed.role) currentRole = parsed.role;
      } catch {}
    }

    const newThemeMetadata = JSON.stringify({
      role: currentRole,
      status: newStatus,
    });

    const { error } = await supabase
      .from("users")
      .update({ theme: newThemeMetadata })
      .eq("id", userId);

    if (error) {
      console.error("PATCH approve error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Send email notification to the user
    const recipientEmail = userEmail || targetUser?.email;
    const recipientName = userName || targetUser?.name;

    if (recipientEmail) {
      try {
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
          const resend = new Resend(resendKey);

          const isApproved = action === "approve";
          const subject = isApproved
            ? "✅ Your KamraKhata Account Has Been Approved!"
            : "❌ Your KamraKhata Registration Was Declined";

          const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800; letter-spacing:-0.5px;">
                🏠 KamraKhata
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:13px;">
                Room 14 • Al Syed Hostel Expense Tracker
              </p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding:0;">
              <div style="background-color:${isApproved ? "#ecfdf5" : "#fef2f2"}; padding:20px 40px; text-align:center; border-bottom:1px solid ${isApproved ? "#a7f3d0" : "#fecaca"};">
                <span style="font-size:40px;">${isApproved ? "✅" : "❌"}</span>
                <h2 style="margin:8px 0 0; color:${isApproved ? "#065f46" : "#991b1b"}; font-size:18px; font-weight:700;">
                  ${isApproved ? "Account Approved!" : "Registration Declined"}
                </h2>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0; color:#334155; font-size:15px; line-height:1.7;">
                Assalam-o-Alaikum <strong>${recipientName || "Roommate"}</strong>,
              </p>
              <p style="margin:16px 0; color:#475569; font-size:14px; line-height:1.7;">
                ${isApproved
                  ? "Great news! Your Room Admin has <strong style='color:#059669;'>approved</strong> your registration request. You can now log into KamraKhata and start tracking your room expenses."
                  : "Unfortunately, your Room Admin has <strong style='color:#dc2626;'>declined</strong> your registration request. If you believe this was a mistake, please contact your Room Admin directly."
                }
              </p>

              ${isApproved ? `
              <!-- CTA Button -->
              <div style="text-align:center; margin:28px 0;">
                <a href="https://hostel-expense-tracker-roan.vercel.app/login" 
                   style="display:inline-block; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#ffffff; text-decoration:none; padding:14px 40px; border-radius:12px; font-size:15px; font-weight:700; letter-spacing:0.3px;">
                  🔑 Log In Now
                </a>
              </div>
              ` : ""}

              <!-- Details Card -->
              <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin-top:20px;">
                <p style="margin:0 0 12px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
                  Account Details
                </p>
                <table width="100%" style="font-size:13px; color:#334155;">
                  <tr>
                    <td style="padding:6px 0; color:#94a3b8; width:120px;">Name</td>
                    <td style="padding:6px 0; font-weight:600;">${recipientName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#94a3b8;">Email</td>
                    <td style="padding:6px 0; font-weight:600;">${recipientEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#94a3b8;">Status</td>
                    <td style="padding:6px 0;">
                      <span style="display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; background:${isApproved ? "#ecfdf5" : "#fef2f2"}; color:${isApproved ? "#059669" : "#dc2626"}; border:1px solid ${isApproved ? "#a7f3d0" : "#fecaca"};">
                        ${isApproved ? "✅ Approved" : "❌ Rejected"}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; background-color:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="margin:0; color:#94a3b8; font-size:11px;">
                KamraKhata — Room 14, Al Syed Hostel
              </p>
              <p style="margin:4px 0 0; color:#cbd5e1; font-size:10px;">
                Automated notification • Do not reply to this email
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

          await resend.emails.send({
            from: "KamraKhata <onboarding@resend.dev>",
            to: [recipientEmail],
            subject,
            html: htmlBody,
          });
        }
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (e: any) {
    console.error("PATCH approve exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
