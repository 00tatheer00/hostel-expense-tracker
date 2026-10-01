import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";

// GET /api/settlements - fetch all settlements
export async function GET() {
  try {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("settlements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET settlements error:", error);
      return NextResponse.json({ settlements: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json(
      { settlements: data || [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (e: any) {
    console.error("GET settlements exception:", e);
    return NextResponse.json({ settlements: [], error: e.message }, { status: 500 });
  }
}

// POST /api/settlements - record a new settlement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, fromUser, toUser, amount, note } = body;

    if (!fromUser || !toUser || !amount) {
      return NextResponse.json(
        { success: false, error: "fromUser, toUser, and amount are required" },
        { status: 400 }
      );
    }

    if (fromUser === toUser) {
      return NextResponse.json(
        { success: false, error: "Sender aur Recipient roommates alag hone chahiye." },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    
    let settlementId = id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!settlementId || !uuidRegex.test(settlementId)) {
      settlementId = crypto.randomUUID();
    }

    let finalFromUser = fromUser;
    let finalToUser = toUser;

    const userLookups: PromiseLike<any>[] = [];
    if (fromUser && !uuidRegex.test(fromUser)) {
      userLookups.push(
        supabase
          .from("users")
          .select("id")
          .ilike("name", fromUser)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.id) finalFromUser = data.id;
          })
      );
    }

    if (toUser && !uuidRegex.test(toUser)) {
      userLookups.push(
        supabase
          .from("users")
          .select("id")
          .ilike("name", toUser)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.id) finalToUser = data.id;
          })
      );
    }

    if (userLookups.length > 0) {
      await Promise.all(userLookups);
    }

    const { error } = await supabase.from("settlements").insert({
      id: settlementId,
      from_user: finalFromUser,
      to_user: finalToUser,
      amount: Number(amount),
      note: note || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("POST settlement error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: settlementId });
  } catch (e: any) {
    console.error("POST settlement exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
