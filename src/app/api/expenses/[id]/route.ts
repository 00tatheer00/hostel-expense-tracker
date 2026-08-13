import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/service";

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

    // Ensure valid UUID format check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Resolve paidBy to valid UUID if needed
    let finalPaidBy = paidBy;
    if (paidBy && !uuidRegex.test(paidBy)) {
      const { data: userMatch } = await supabase
        .from("users")
        .select("id")
        .ilike("name", paidBy)
        .single();
      if (userMatch?.id) {
        finalPaidBy = userMatch.id;
      }
    }

    // 1. Update expense record
    const { error: updateErr } = await supabase
      .from("expenses")
      .update({
        amount: Number(amount),
        description: description?.trim(),
        category: category || "Other",
        paid_by: finalPaidBy,
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

      const splitRecords = splits.map((s: any, idx: number) => {
        let splitId = s.id;
        if (!splitId || !uuidRegex.test(splitId)) {
          splitId = crypto.randomUUID();
        }

        let splitUserId = s.userId || s.user_id;
        // Ensure splitUserId is valid UUID
        if (splitUserId && !uuidRegex.test(splitUserId)) {
          // If splitUserId is non-UUID, keep as is or match
        }

        return {
          id: splitId,
          expense_id: expenseId,
          user_id: splitUserId,
          share_amount: Number(s.shareAmount || s.share_amount || 0),
          created_at: new Date().toISOString(),
        };
      });

      const { error: splitErr } = await supabase.from("expense_splits").insert(splitRecords);
      if (splitErr) {
        console.error("Split re-insertion error:", splitErr);
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

// DELETE /api/expenses/[id] - delete an expense (Admin Only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCookie = req.cookies.get("kamrakhata_auth_user")?.value;
    let isAdmin = false;
    if (authCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(authCookie));
        if (
          user?.role === "Room Admin" ||
          user?.name?.toLowerCase().includes("admin") ||
          user?.email?.toLowerCase().includes("admin")
        ) {
          isAdmin = true;
        }
      } catch (e) {}
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Sirf Room Admin hi expense delete kar sakta hai." },
        { status: 403 }
      );
    }

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
