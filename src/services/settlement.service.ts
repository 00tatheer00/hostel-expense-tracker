import { SettlementRepository } from "./repositories/settlement.repository";
import { CreateSettlementInput, CreateSettlementSchema } from "@/lib/validations/expense";
import { SettlementRow } from "@/types/database";
import { ValidationError } from "@/lib/errors";

export class SettlementService {
  private settlementRepo = new SettlementRepository();

  async getSettlements(): Promise<SettlementRow[]> {
    return await this.settlementRepo.getSettlements();
  }

  async recordSettlement(input: CreateSettlementInput): Promise<SettlementRow> {
    const parseResult = CreateSettlementSchema.safeParse(input);
    if (!parseResult.success) {
      throw new ValidationError(
        parseResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const { fromUser, toUser, amount, note } = parseResult.data;

    return await this.settlementRepo.createSettlement({
      from_user: fromUser,
      to_user: toUser,
      amount,
      note: note || null,
    });
  }
}
