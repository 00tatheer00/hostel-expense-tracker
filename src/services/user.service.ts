import { UserRepository } from "./repositories/user.repository";
import { UserRow } from "@/types/database";

export class UserService {
  private userRepo = new UserRepository();

  async getAllUsers(): Promise<UserRow[]> {
    return await this.userRepo.getUsers();
  }

  async getUserById(id: string): Promise<UserRow | null> {
    return await this.userRepo.getUserById(id);
  }

  async updateUserTheme(id: string, theme: "light" | "dark" | "system"): Promise<UserRow> {
    return await this.userRepo.updateUser(id, { theme });
  }
}
