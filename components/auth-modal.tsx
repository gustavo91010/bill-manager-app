import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AuthModal({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"token" | "password">("token")
  const [email, setEmail] = useState("")
  const [tokenOrPassword, setTokenOrPassword] = useState("")

  const handleSubmit = async () => {
    let token = ""
    if (mode === "token") {
      // chama endpoint de login por token
      token = await loginWithToken(tokenOrPassword)
    } else {
      // chama endpoint de login com email + senha
      token = await loginWithEmailAndPassword(email, tokenOrPassword)
    }

    if (token) {
      localStorage.setItem("accessToken", token)
      onAuthenticated()
    }
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Autenticação</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mode === "token"}
          />
          <Input
            placeholder={mode === "token" ? "Token" : "Senha"}
            type={mode === "token" ? "text" : "password"}
            value={tokenOrPassword}
            onChange={(e) => setTokenOrPassword(e.target.value)}
          />

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Usar: </span>
            <Button variant="link" size="sm" onClick={() => setMode(mode === "token" ? "password" : "token")}>
              {mode === "token" ? "E-mail + Senha" : "Token"}
            </Button>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Entrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function loginWithToken(token: string) {
  const res = await fetch("/api/auth/token", {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) return ""
  const { accessToken } = await res.json()
  return accessToken
}

async function loginWithEmailAndPassword(email: string, password: string) {
  const res = await fetch("/api/auth/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) return ""
  const { accessToken } = await res.json()
  return accessToken
}

