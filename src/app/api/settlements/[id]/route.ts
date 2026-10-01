import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";
import { isExpenseLocked } from "@/utils/month-utils";

// DELETE /api/settlements/[id] - delete a settlement
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const settlementId = params.id;
    if (!settlementId) {
      return NextResponse.json({ success: false, error: "Settlement ID is required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // 1. Fetch existing settlement to check lock status
    const { data: existing } = await supabase
      .from("settlements")
      .select("created_at")
      .eq("id", settlementId)
      .single();

    if (existing && isExpenseLocked(existing.created_at)) {
      return NextResponse.json(
        {
          success: false,
          error: "🔒 August 2026 settlement record locked hai. Isay delete nahi kiya ja sakta.",
        },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("settlements").delete().eq("id", settlementId);

    if (error) {
      console.error("DELETE settlement error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE settlement exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PUT /api/settlements/[id] - update an existing settlement
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const settlementId = params.id;
    if (!settlementId) {
      return NextResponse.json({ success: false, error: "Settlement ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { fromUser, toUser, amount, note } = body;

    const supabase = getServiceClient();

    // 1. Fetch existing settlement to check lock status
    const { data: existing } = await supabase
      .from("settlements")
      .select("created_at")
      .eq("id", settlementId)
      .single();

    if (existing && isExpenseLocked(existing.created_at)) {
      return NextResponse.json(
        {
          success: false,
          error: "🔒 August 2026 settlement record locked hai aur edit nahi kiya ja sakta.",
        },
        { status: 403 }
      );
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let finalFromUser = fromUser;
    let finalToUser = toUser;

    if (fromUser && !uuidRegex.test(fromUser)) {
      const { data: userMatch } = await supabase.from("users").select("id").ilike("name", fromUser).maybeSingle();
      if (userMatch?.id) finalFromUser = userMatch.id;
    }

    if (toUser && !uuidRegex.test(toUser)) {
      const { data: userMatch } = await supabase.from("users").select("id").ilike("name", toUser).maybeSingle();
      if (userMatch?.id) finalToUser = userMatch.id;
    }

    const updatePayload: Record<string, any> = {};
    if (finalFromUser) updatePayload.from_user = finalFromUser;
    if (finalToUser) updatePayload.to_user = finalToUser;
    if (amount !== undefined) updatePayload.amount = Number(amount);
    if (note !== undefined) updatePayload.note = note || null;

    const { error } = await supabase
      .from("settlements")
      .update(updatePayload)
      .eq("id", settlementId);

    if (error) {
      console.error("PUT settlement error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: settlementId });
  } catch (e: any) {
    console.error("PUT settlement exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

