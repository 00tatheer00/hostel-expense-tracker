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
