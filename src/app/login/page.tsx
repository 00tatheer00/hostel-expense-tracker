import { PublicLayout } from "@/components/layout/public-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | KamraKhata",
  description: "Sign in to Room 304 Hostel Expense Tracker",
};

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="w-full py-8">
        <LoginForm />
      </div>
    </PublicLayout>
  );
}
