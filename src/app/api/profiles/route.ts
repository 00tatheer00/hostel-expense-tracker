import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getServiceClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key);
}

// GET /api/profiles — fetch all registered roommates from Supabase users table
export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data: usersData, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET users error:", error);
      return NextResponse.json({ profiles: [], error: error.message }, { status: 200 });
    }

    const profiles = (usersData || []).map((u: any) => {
      let role = "Roommate";
      let status = "approved";

      if (u.name?.toLowerCase().includes("admin") || u.email?.toLowerCase().includes("admin")) {
        role = "Room Admin";
      }

      if (u.theme) {
        try {
          const parsed = JSON.parse(u.theme);
          if (parsed && typeof parsed === "object") {
            if (parsed.role) role = parsed.role;
            if (parsed.status) status = parsed.status;
          }
        } catch {
          // Fallback
        }
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role,
        status,
        avatarColor: u.avatar_color || "#10B981",
        created_at: u.created_at,
      };
    });

    return NextResponse.json({ profiles });
  } catch (e: any) {
    console.error("GET profiles exception:", e);
    return NextResponse.json({ profiles: [], error: e.message }, { status: 500 });
  }
}

// POST /api/profiles — instant roommate registration (Direct entry + Email credentials)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, password, role } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check for duplicate email in users table
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, error: "Yeh email pehle se registered hai." }, { status: 409 });
    }

    // Generate valid UUID for id
    let validUuid = id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!validUuid || !uuidRegex.test(validUuid)) {
      validUuid = crypto.randomUUID();
    }

    const assignedRole = role || (cleanName.toLowerCase().includes("admin") || cleanEmail.includes("admin") ? "Room Admin" : "Roommate");
    const assignedPassword = password && password.trim() ? password.trim() : `${cleanName.split(" ")[0]}123`;

    // Store metadata in theme column
    const themeMetadata = JSON.stringify({
      role: assignedRole,
      status: "approved",
      password: assignedPassword,
    });

    const { error } = await supabase.from("users").insert({
      id: validUuid,
      name: cleanName,
      email: cleanEmail,
      avatar_color: "#10B981",
      theme: themeMetadata,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("POST users registration error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Send styled welcome email with credentials via Resend
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);

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
            <td style="background: linear-gradient(135deg, #4f46e5, #10b981); padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800; letter-spacing:-0.5px;">
                🏠 Welcome to KamraKhata!
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:13px;">
                Room 14 • Al Syed Hostel Expense Tracker
              </p>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="padding:0;">
              <div style="background-color:#ecfdf5; padding:20px 40px; text-align:center; border-bottom:1px solid #a7f3d0;">
                <span style="font-size:40px;">🎉</span>
                <h2 style="margin:8px 0 0; color:#065f46; font-size:18px; font-weight:700;">
                  Account Successfully Created!
                </h2>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0; color:#334155; font-size:15px; line-height:1.7;">
                Assalam-o-Alaikum <strong>${cleanName}</strong>,
              </p>
              <p style="margin:16px 0; color:#475569; font-size:14px; line-height:1.7;">
                Aap ka KamraKhata account Room 14 expense tracker par successfully register ho gaya hai. Aap ab instant log in karke apne room expenses track kar sakte hain.
              </p>

              <!-- Credentials Card -->
              <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin:20px 0;">
                <p style="margin:0 0 12px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
                  🔑 Your Login Credentials
                </p>
                <table width="100%" style="font-size:13px; color:#334155;">
                  <tr>
                    <td style="padding:6px 0; color:#94a3b8; width:120px;">Name</td>
                    <td style="padding:6px 0; font-weight:600;">${cleanName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#94a3b8;">Email / Username</td>
                    <td style="padding:6px 0; font-weight:600; font-family:monospace;">${cleanEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#94a3b8;">Password</td>
                    <td style="padding:6px 0; font-weight:600; font-family:monospace; color:#4f46e5;">${assignedPassword}</td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center; margin:28px 0 12px;">
                <a href="https://hostel-expense-tracker-roan.vercel.app/login" 
                   style="display:inline-block; background:linear-gradient(135deg,#4f46e5,#10b981); color:#ffffff; text-decoration:none; padding:14px 40px; border-radius:12px; font-size:15px; font-weight:700; letter-spacing:0.3px;">
                  🔑 Log In Now
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px; background-color:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="margin:0; color:#94a3b8; font-size:11px;">
                KamraKhata — Room 14, Al Syed Hostel
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
          to: [cleanEmail],
          subject: `🎉 Welcome to KamraKhata Room 14 - Login Credentials`,
          html: htmlBody,
        });
      }
    } catch (emailErr) {
      console.error("Welcome email send error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      id: validUuid,
      credentials: { email: cleanEmail, password: assignedPassword },
    });
  } catch (e: any) {
    console.error("POST profiles exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
