"use client"

import AuthModal from "./auth-modal"
import { useEffect, useState } from "react"
import { Calendar, DollarSign, Home, PieChart, Settings, CheckCircle, Circle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authorizeToken, deleteExpense, getCategory, getPayments, getSumary } from "@/lib/api"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AddExpenseDialog } from "./add-expense-dialog"
import { CalendarWidget } from "./calendar-widget"
import { ExpenseItem } from "./expense-item"
import { UserNav } from "./user-nav"
import type { AdaptedExpenses, CategoryExpense } from "@/app/api/types/payments"
import type { Sumary } from "@/app/api/types/sumary"

export default function Dashboard() {
  // Autenticação
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  // Dados dashboard
  const [expenses, setExpenses] = useState<AdaptedExpenses[]>([])
  const [categories, setCategories] = useState<CategoryExpense[]>([])
  const [sumary, setSumary] = useState<Sumary>()
  const [refreshKey, setRefreshKey] = useState(0) // Para forçar re-render
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<{
    id: number
    name: string
    amount: number
    dueDate?: string,
    category?: string
  } | null>(null)
  const [expandedDates, setExpandedDates] = useState<string[]>(["20 de Maio"])
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Campos do modal
  const [inputToken, setInputToken] = useState("")
  const [useTokenLogin, setUseTokenLogin] = useState(true)

  useEffect(() => {
    // Tenta pegar token do localStorage ao montar
    const token = localStorage.getItem("accessToken")
    if (token) {
      validateToken(token)
      setAccessToken(token)
    } else {
      setIsAuthenticating(false)
    }
  }, [])

  async function validateToken(token: string) {
    setIsAuthenticating(true)
    setAuthError(null)
    try {
      const data = await authorizeToken(token)
      setAccessToken(data.access_token)
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("userName", data.name)
      localStorage.setItem("userEmail", data.email)
      localStorage.setItem("userApplication", data.aplication)
    } catch (err) {
      setAuthError("Token inválido ou expirado")
      setAccessToken(null)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userApplication")
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function onSubmitToken() {
    if (!inputToken.trim()) return
    await validateToken(inputToken.trim())
  }

  // Funções dashboard que usam o token
  const reloadData = async (date: Date = calendarDate) => {
    if (!accessToken) return
    try {
      console.log("Recarregando dados...", { date, accessToken: !!accessToken })
      
      // Força limpeza do estado antes de atualizar
      setExpenses([])
      setSumary(undefined)
      
      // Força atualização do sumário
      const newSumary = await getSumary(date, accessToken)
      setSumary(newSumary)
      
      // Força atualização dos pagamentos
      const paymentsData = await getPayments(date, accessToken)
      setExpenses([...paymentsData]) // Força novo array
      
      // Atualiza categorias
      const categories = await getCategory(accessToken)
      setCategories([...categories]) // Força novo array
      
      // Força re-renderização
      setRefreshKey(prev => prev + 1)
      
      console.log("Dados recarregados com sucesso", { 
        expenses: paymentsData.length, 
        sumary: newSumary,
        categories: categories.length 
      })
    } catch (error) {
      console.error("Erro ao recarregar dados:", error)
    }
  }

  useEffect(() => {
    if (accessToken) reloadData()
  }, [calendarDate, accessToken])

  // Funções auxiliares
  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]))
  }

  function renderCurrency(value?: number): string {
    return value !== undefined ? `R$ ${value.toFixed(2)}` : "Carregando..."
  }

  function getDayStatusIcon(expenses: AdaptedExpenses["expenses"]) {
    const allPaid = expenses.every((e) => e.status.toLowerCase() === "pago")
    const anyOverdue = expenses.some((e) => e.status.toLowerCase() === "vencido")
    const anyDueSoon = expenses.some((e) => e.status.toLowerCase() === "a_vencer")
    const anyDueToday = expenses.some((e) => e.status.toLowerCase() === "vencendo_hoje")
    const nonePaid = expenses.every((e) => e.status.toLowerCase() !== "pago")

    if (allPaid)
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Pago</span>
        </div>
      )
    if (anyOverdue)
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Vencido</span>
        </div>
      )
    if (anyDueToday)
      return (
        <div className="flex items-center gap-1 text-orange-600">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium">Vencendo Hoje</span>
        </div>
      )
    if (anyDueSoon)
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <Circle className="h-4 w-4" />
          <span className="text-xs font-medium">A Vencer</span>
        </div>
      )
    if (nonePaid)
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Não Pago</span>
        </div>
      )
    return (
      <div className="flex items-center gap-1 text-yellow-500">
        <Circle className="h-4 w-4" />
        <span className="text-xs font-medium">Parcial</span>
      </div>
    )
  }

  if (!accessToken) {
    return <AuthModal onAuthenticated={() => window.location.reload()} />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <span className="font-semibold">Contas a Pagar</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="#">
                        <Home className="h-4 w-4" />
                        <span>Visão Geral</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <DollarSign className="h-4 w-4" />
                        <span>Despesas</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Calendar className="h-4 w-4" />
                        <span>Calendário</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Outros</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <PieChart className="h-4 w-4" />
                        <span>Relatórios</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground">© 2024 Finanças Pessoais</div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 lg:h-[60px]">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Painel de Controle</h1>
            </div>
            <UserNav />
          </header>

          <main className="flex-1 space-y-6 p-6">
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-blue-100 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total do Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{renderCurrency(sumary?.totalDue)}</div>
                </CardContent>
              </Card>
              <Card className="border-green-100 bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Já Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">{renderCurrency(sumary?.amountPaid)}</div>
                </CardContent>
              </Card>
              <Card className="border-red-100 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Restante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">{renderCurrency(sumary?.remaining)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Pagamentos Próximos</h2>
                  <Button
                    onClick={() => {
                      setIsAddExpenseOpen(true)
                      setEditingExpense(null)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Adicionar Nova Despesa
                  </Button>
                </div>
                <div className="space-y-4">
                  {expenses.map((dateGroup) => (
                    <Card key={`${dateGroup.date}-${refreshKey}`} className="border-gray-200">
                      <CardHeader className="cursor-pointer py-3" onClick={() => toggleDateExpansion(dateGroup.date)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle>{dateGroup.date}</CardTitle>
                            {getDayStatusIcon(dateGroup.expenses)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dateGroup.expenses.length} itens · R${" "}
                            {dateGroup.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                          </div>
                        </div>
                      </CardHeader>
                      {expandedDates.includes(dateGroup.date) && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {dateGroup.expenses.map((expense) => (
                              <ExpenseItem
                                key={`${expense.id}-${refreshKey}`}
                                expense={expense}
                                onPaymentConfirmed={reloadData}
                                onEdit={(expense) => {
                                  setEditingExpense({
                                    id: expense.id,
                                    name: expense.name,
                                    amount: expense.amount,
                                    dueDate: expense.dueDate,
                                    category: expense.category.name
                                  })
                                  setIsAddExpenseOpen(true)
                                }}
                                onDelete={(id) => {
                                  setDeleteId(id)
                                  setIsConfirmDeleteOpen(true)
                                }}
                              />
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Card className="h-full border-blue-100">
                  <CardHeader>
                    <CardTitle>Calendário de Pagamentos</CardTitle>
                    <CardDescription>Visualize suas datas de vencimento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalendarWidget
                      expenses={expenses}
                      onMonthChange={async (date) => {
                        const data = await getPayments(date, accessToken)
                        setExpenses(data)
                        setCalendarDate(date)
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={(open) => {
          setIsAddExpenseOpen(open)
          // Só limpa o editingExpense quando o modal fecha
          if (!open) {
            setTimeout(() => setEditingExpense(null), 100)
          }
        }}
        onReload={reloadData}
        expense={editingExpense}
        selectedDate={calendarDate}
        categories={categories}
      />

      <ConfirmDeleteDialog
        open={isConfirmDeleteOpen}
        onCancel={() => {
          setIsConfirmDeleteOpen(false)
          setDeleteId(null)
        }}
        onConfirm={async () => {
          if (deleteId !== null) {
            await deleteExpense(deleteId, accessToken)
            setIsConfirmDeleteOpen(false)
            setDeleteId(null)
            await reloadData()
          }
        }}
      />
    </SidebarProvider>
  )
}
