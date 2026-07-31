import { createClient } from "@/lib/supabase/client";
import { UserRow } from "@/types/database";
import { DatabaseError } from "@/lib/errors";

export class UserRepository {
  private supabase = createClient();

  async getUsers(): Promise<UserRow[]> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new DatabaseError("Failed to fetch users from database", error);
    }
    return data || [];
  }

  async getUserById(id: string): Promise<UserRow | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(`Failed to fetch user ${id}`, error);
    }
    return data || null;
  }

  async createUser(user: Partial<UserRow>): Promise<UserRow> {
    const { data, error } = await this.supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new DatabaseError("Failed to create user record", error);
    }
    return data;
  }

  async updateUser(id: string, updates: Partial<UserRow>): Promise<UserRow> {
    const { data, error } = await this.supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to update user ${id}`, error);
    }
    return data;
  }
}
