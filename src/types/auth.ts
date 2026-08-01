export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Room Admin" | "Roommate";
  status?: "approved" | "pending" | "rejected";
  avatarColor?: string;
  themePreference?: "light" | "dark" | "system";
}

export interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}
