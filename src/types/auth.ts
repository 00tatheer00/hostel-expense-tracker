export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Room Admin" | "Roommate";
  avatarColor?: string;
  themePreference?: "light" | "dark" | "system";
}

export interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}
