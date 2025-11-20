"use client";

import AuthModal from "@/src/components/auth-modal";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <AuthModal onAuthenticated={() => window.location.href = "/"} />
    </div>
  );
}
