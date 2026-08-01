import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key);
}

// GET /api/profiles — fetch all profiles from Supabase users table (Real data only)
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
          // Standard string theme fallback
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

// POST /api/profiles — create new profile in Supabase users table
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, role, status } = body;

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
      return NextResponse.json({ success: false, error: "This email is already registered." }, { status: 409 });
    }

    // Ensure valid UUID format for id required by Postgres users table
    let validUuid = id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!validUuid || !uuidRegex.test(validUuid)) {
      validUuid = crypto.randomUUID();
    }

    const metaRole = role || (cleanName.toLowerCase().includes("admin") || cleanEmail.includes("admin") ? "Room Admin" : "Roommate");
    const metaStatus = status || (metaRole === "Room Admin" ? "approved" : "pending");

    const themeMetadata = JSON.stringify({
      role: metaRole,
      status: metaStatus,
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

    return NextResponse.json({ success: true, id: validUuid });
  } catch (e: any) {
    console.error("POST profiles exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
