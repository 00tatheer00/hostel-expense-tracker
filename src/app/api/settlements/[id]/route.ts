import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";

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
