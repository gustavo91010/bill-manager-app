import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authorizeToken, loginWithEmailAndPassword } from "@/lib/api"

export default function AuthModal({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [emailOrToken, setEmailOrToken] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const isEmail = emailOrToken.includes("@")

  const handleSubmit = async () => {
    if (!emailOrToken.trim()) return

    setLoading(true)
    try {
      let token = ""
      let data

      if (isEmail) {
        token = await loginWithEmailAndPassword(emailOrToken, password)
        data = { access_token: token, name: "", email: emailOrToken, aplication: "" } // ou adapte se tiver dados
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
          <Input
            placeholder="Código de acesso ou E-mail"
            value={emailOrToken}
            onChange={(e) => setEmailOrToken(e.target.value)}
          />
          {isEmail && (
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
