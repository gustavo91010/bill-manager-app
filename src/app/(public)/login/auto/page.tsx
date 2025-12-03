"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // pega os headers enviados pelo callback
    fetch("/api/auth/me-headers").then(async (res) => {
      const name = res.headers.get("x-user-name");
      const email = res.headers.get("x-user-email");

      if (name) localStorage.setItem("name", name);
      if (email) localStorage.setItem("email", email);

      router.push("/dashboard");
    });
  }, []);

  return <p>Autenticando...</p>;
}

