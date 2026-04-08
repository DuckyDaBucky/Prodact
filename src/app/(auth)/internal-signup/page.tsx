import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth-card";
import { SignupForm } from "@/components/signup-form";
import { getServerSession } from "@/lib/session";

export default async function InternalSignupPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <AuthCard
        eyebrow="Hidden Setup Route"
        title="Create a demo employee account"
        description="This page is not linked anywhere in the UI. It exists so the team can bootstrap test users during the class project without shipping a visible public sign-up flow."
      >
        <SignupForm />
      </AuthCard>
    </main>
  );
}
