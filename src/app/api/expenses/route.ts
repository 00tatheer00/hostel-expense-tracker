import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key);
}

// GET /api/expenses - fetch all expenses with splits and payer details
export async function GET() {
  try {
    const supabase = getServiceClient();

    // 1. Fetch expenses
    const { data: expenses, error: expError } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (expError) {
      console.error("GET expenses error:", expError);
      return NextResponse.json({ expenses: [], error: expError.message }, { status: 200 });
    }

    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ expenses: [] });
    }

    // 2. Fetch all splits
    const { data: splits } = await supabase.from("expense_splits").select("*");

    // 3. Fetch all users for payer and user details
    const { data: usersData } = await supabase.from("users").select("*");
    const usersMap = new Map((usersData || []).map((u: any) => [u.id, u]));

    // Join data together
    const result = expenses.map((exp: any) => {
      const payerUser = usersMap.get(exp.paid_by);
      const expSplits = (splits || [])
        .filter((s: any) => s.expense_id === exp.id)
        .map((s: any) => {
          const splitUser = usersMap.get(s.user_id);
          return {
            ...s,
            user: splitUser
              ? {
                  id: splitUser.id,
                  name: splitUser.name,
                  email: splitUser.email,
                  avatar_color: splitUser.avatar_color || "#10B981",
                  theme: splitUser.theme || "dark",
                  created_at: splitUser.created_at || new Date().toISOString(),
                }
              : undefined,
          };
        });

      return {
        ...exp,
        payer: payerUser
          ? {
              id: payerUser.id,
              name: payerUser.name,
              email: payerUser.email,
              avatar_color: payerUser.avatar_color || "#10B981",
              theme: payerUser.theme || "dark",
              created_at: payerUser.created_at || new Date().toISOString(),
            }
          : undefined,
        splits: expSplits,
      };
    });

    return NextResponse.json({ expenses: result });
  } catch (e: any) {
    console.error("GET expenses exception:", e);
    return NextResponse.json({ expenses: [], error: e.message }, { status: 500 });
  }
}

// POST /api/expenses - create a new expense with splits
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, amount, description, category, paidBy, splits } = body;

    if (!amount || !description || !paidBy || !splits || !Array.isArray(splits)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for expense creation" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    
    // Ensure valid UUID format for expense id
    let expenseId = id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!expenseId || !uuidRegex.test(expenseId)) {
      expenseId = crypto.randomUUID();
    }

    // 1. Insert main expense record
    const { error: expErr } = await supabase.from("expenses").insert({
      id: expenseId,
      amount,
      description: description.trim(),
      category: category || "Other",
      paid_by: paidBy,
      created_at: new Date().toISOString(),
    });

    if (expErr) {
      console.error("POST expense insert error:", expErr);
      return NextResponse.json({ success: false, error: expErr.message }, { status: 500 });
    }

    // 2. Prepare split records
    const splitRecords = splits.map((s: any) => {
      let splitId = s.id;
      if (!splitId || !uuidRegex.test(splitId)) {
        splitId = crypto.randomUUID();
      }
      return {
        id: splitId,
        expense_id: expenseId,
        user_id: s.userId || s.user_id,
        share_amount: s.shareAmount || s.share_amount,
        created_at: new Date().toISOString(),
      };
    });

    const { error: splitErr } = await supabase.from("expense_splits").insert(splitRecords);
    if (splitErr) {
      console.error("Insert to expense_splits failed:", splitErr);
    }

    return NextResponse.json({ success: true, id: expenseId });
  } catch (e: any) {
    console.error("POST expense exception:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
