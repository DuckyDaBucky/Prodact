import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "@/components/login-form";
import { getServerSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <AuthCard
        eyebrow="Employee Access"
        title="Log in to Prodact"
        description="Use your employee ID to enter the internal workspace. The sign-up route exists for project setup but is intentionally hidden from the main experience."
      >
        <LoginForm />
      </AuthCard>
    </main>
  );
}
