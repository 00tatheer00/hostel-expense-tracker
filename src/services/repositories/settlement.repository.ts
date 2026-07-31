import { createClient } from "@/lib/supabase/client";
import { SettlementRow } from "@/types/database";
import { DatabaseError } from "@/lib/errors";

export class SettlementRepository {
  private supabase = createClient();

  async getSettlements(): Promise<SettlementRow[]> {
    const { data, error } = await this.supabase
      .from("settlements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new DatabaseError("Failed to fetch settlements", error);
    }
    return data || [];
  }

  async createSettlement(
    settlement: Omit<SettlementRow, "id" | "created_at">
  ): Promise<SettlementRow> {
    const { data, error } = await this.supabase
      .from("settlements")
      .insert(settlement)
      .select()
      .single();

    if (error) {
      throw new DatabaseError("Failed to record settlement", error);
    }
    return data;
  }
}
