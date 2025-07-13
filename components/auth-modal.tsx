import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authorizeToken, loginWithEmailAndPassword, registerUser } from "@/lib/api"

export default function AuthModal({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [emailOrToken, setEmailOrToken] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const isEmail = emailOrToken.includes("@")

  const handleSubmit = async () => {
    if (!emailOrToken.trim()) return

    setLoading(true)
    try {
      let data
      let token = ""

      if (isRegistering) {
        if (!name.trim() || !password.trim() || !emailOrToken.includes("@")) {
          alert("Preencha nome, e-mail válido (com @) e senha para registrar")
          setLoading(false)
          return
        }
        data = await registerUser({ name, email: emailOrToken, password })
        token = data.access_token
      } else if (isEmail) {
        data = await loginWithEmailAndPassword(emailOrToken, password)
        token = data.access_token
      } else {
        data = await authorizeToken(emailOrToken)
        token = data.access_token
      }

      if (token) {
        localStorage.setItem("accessToken", token)
        localStorage.setItem("userName", data.name || "")
        localStorage.setItem("userEmail", data.email || "")
        localStorage.setItem("userApplication", data.aplication || "")
        onAuthenticated()
      }
    } catch {
      alert("Credenciais inválidas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Bill Manager</DialogTitle>
          <DialogDescription className="text-center mb-4 text-muted-foreground">
            Seu gestor de pagamentos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isRegistering && (
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <Input
            placeholder="E-mail"
            value={emailOrToken}
            onChange={(e) => setEmailOrToken(e.target.value)}
          />

          {(isRegistering || isEmail) && (
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          )}

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading
              ? isRegistering
                ? "Registrando..."
                : "Entrando..."
              : isRegistering
                ? "Registrar"
                : "Entrar"}
          </Button>

          <Button
            variant="link"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-center"
          >
            {isRegistering ? "Já tem conta? Entre" : "Não tem conta? Cadastre-se"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
