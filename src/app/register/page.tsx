import { PublicLayout } from "@/components/layout/public-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Roommate | Room 14 Al Syed Hostel",
  description: "Sign up as a roommate for Room 14, Al Syed Hostel Daily Expense Tracker",
};

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="w-full py-8">
        <RegisterForm />
      </div>
    </PublicLayout>
  );
}
