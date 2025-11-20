'use client'
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import Image from "next/image";
import { authorizeToken, loginWithEmailAndPassword, registerUser } from "@/src/lib/api"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function AuthModal({ onAuthenticated }: { onAuthenticated: () => void }) {
  const router = useRouter()
  const [emailOrToken, setEmailOrToken] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async () => {
    if (!emailOrToken.trim()) return

    setLoading(true)
    try {
      let data
      let token = ""

      if (isRegistering) {
        if (!name.trim() || !password.trim() || !emailOrToken.includes("@")) {
          alert("Preencha nome, e-mail válido (com o @) e senha para registrar")
          setLoading(false)
          return
        }
        data = await registerUser({ name, email: emailOrToken, password })
        token = data.jwt
        if (!token) {
          const loginData = await loginWithEmailAndPassword(emailOrToken, password);
          token = loginData.jwt;
        }

      } else {
        data = await loginWithEmailAndPassword(emailOrToken, password);
        token = data.jwt
      }
      console.log(token)

      if (token) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userName", data.name || "");
        localStorage.setItem("userEmail", data.email || "");

        await fetch("/api/set-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        onAuthenticated();

        router.push("/");
      } else {
        alert("Erro ao autenticar: token não retornado.");
      }

    } catch {
      alert("Credenciais inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-[768px] h-[480px] bg-white shadow-2xl rounded-xl flex relative overflow-hidden">

        <div className={`w-1/2 p-8 z-20 transition-opacity duration-500 ${isRegistering ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <div className="space-y-4">
            <Input
              placeholder="E-mail"
              value={emailOrToken}
              onChange={(e) => setEmailOrToken(e.target.value)}
            />

            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Button onClick={handleSubmit} className="w-full " disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => alert("Login com Google")}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
              >
                <Image
                  src="/google-logo.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-sm">Entrar com Google</span>
              </button>

              <button
                onClick={() => alert("Login com GitHub")}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
              >
                <img src="/github-logo.png" alt="GitHub" className="w-5 h-5" />
                <span className="text-sm">Entrar com GitHub</span>
              </button>
            </div>
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center text-[#4e4e4e]"
            >Não tem conta? Cadastre-se
            </Button>

          </div>
        </div>

        <div className={`w-1/2 p-8 z-20 transition-opacity duration-500 ${isRegistering ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <h2 className="text-2xl font-bold mb-4">Registrar</h2>
          <div className="space-y-3">
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="E-mail"
              value={emailOrToken}
              onChange={(e) => setEmailOrToken(e.target.value)}
            />

            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Button onClick={handleSubmit} className="w-full " disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => alert("Login com Google")}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
              >
                <img src="/google-logo.png" alt="Google" className="w-5 h-5" />
                <span className="text-sm">Registrar com Google</span>
              </button>

              <button
                onClick={() => alert("Login com GitHub")}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
              >
                <img src="/github-logo.png" alt="GitHub" className="w-5 h-5" />
                <span className="text-sm">Registrar com GitHub</span>
              </button>
            </div>

            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center text-[#4e4e4e]"
            >Já tem conta? Entre
            </Button>
          </div>
        </div>

        <div className={`
          absolute top-0 h-full w-1/2 bg-[#0c0c0c] text-white flex flex-col items-center justify-center
          transition-transform duration-500 z-10 rounded-xl gap-20
          ${isRegistering ? 'translate-x-0 left-0' : 'translate-x-full left-0'}
        `}>

          <div className="flex flex-col items-center justify-center">
            <img src="/logo-white.png" className="-mt-16" alt="Logo" width={250} />
            <h3 className="text-lg -mt-20"> Seu gestor de pagamentos</h3>
          </div>

          <h2 className="text-xl font-semibold">
            {isRegistering ? 'Faça seu registro' : 'Acesse sua conta'}
          </h2>

        </div>
      </div>
    </div>
  );
}
