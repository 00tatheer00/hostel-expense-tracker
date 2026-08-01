import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key);
}

// PUT /api/expenses/[id] - update an expense and its splits
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expenseId = params.id;
    const body = await req.json();
    const { amount, description, category, paidBy, splits } = body;

    if (!expenseId) {
      return NextResponse.json({ success: false, error: "Expense ID is required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // 1. Update expense record
    const { error: updateErr } = await supabase
      .from("expenses")
      .update({
        amount,
        description: description?.trim(),
        category,
        paid_by: paidBy,
      })
      .eq("id", expenseId);

    if (updateErr) {
      console.error("PUT expense update error:", updateErr);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // 2. Re-create splits if provided
    if (splits && Array.isArray(splits)) {
      // Delete existing splits for this expense
      await supabase.from("expense_splits").delete().eq("expense_id", expenseId);
      try {
        await supabase.from("splits").delete().eq("expense_id", expenseId);
      } catch {}

      const splitRecords = splits.map((s: any, idx: number) => ({
        id: s.id || `sp-${Date.now()}-${idx}`,
        expense_id: expenseId,
        user_id: s.userId || s.user_id,
        share_amount: s.shareAmount || s.share_amount,
        created_at: new Date().toISOString(),
      }));

      const { error: splitErr } = await supabase.from("expense_splits").insert(splitRecords);
      if (splitErr) {
        try {
          await supabase.from("splits").insert(splitRecords);
        } catch {}
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("PUT expense exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// DELETE /api/expenses/[id] - delete an expense
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expenseId = params.id;
    if (!expenseId) {
      return NextResponse.json({ success: false, error: "Expense ID is required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Delete splits first if cascade delete isn't enabled
    await supabase.from("expense_splits").delete().eq("expense_id", expenseId);
    try {
      await supabase.from("splits").delete().eq("expense_id", expenseId);
    } catch {}

    // Delete main expense
    const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
    if (error) {
      console.error("DELETE expense error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE expense exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
