import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key);
}

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
