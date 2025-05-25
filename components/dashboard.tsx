
"use client"
import { useEffect, useState } from "react"
import { Calendar, DollarSign, Home, PieChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPayments, getSumary } from "@/lib/api"
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
import { AdaptedExpenses } from "@/app/api/types/payments"
import { Sumary } from "@/app/api/types/sumary"

export default function Dashboard() {
  const [expenses, setExpenses] = useState<AdaptedExpenses[]>([])
  const [sumary, setSumary] = useState<Sumary>()

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [expandedDates, setExpandedDates] = useState<string[]>(["20 de Maio"])

  const [calendarDate, setCalendarDate] = useState<Date>(new Date())

  useEffect(() => {
    const loadExpenses = async () => {

      // const sumary = await getSumary(calendarDate)
      setSumary(await getSumary(calendarDate))
      // const data = await getPayments(calendarDate)
      setExpenses(await getPayments(calendarDate))
    }

    loadExpenses()
  }, [calendarDate])

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]))
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
                  <div className="text-2xl font-bold text-blue-700">R$ {sumary ? sumary.totalDue.toFixed(2) : "Carregando..."}</div>
                </CardContent>
              </Card>
              <Card className="border-green-100 bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Já Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">R$ {sumary ? sumary.amountPaid.toFixed(2) : "carregand"}</div>
                </CardContent>
              </Card>
              <Card className="border-red-100 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Restante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">R$ {sumary ? sumary.remaining.toFixed(2) : "carregand"}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Upcoming Payments Section */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Pagamentos Próximos</h2>
                  <Button onClick={() => setIsAddExpenseOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    Adicionar Nova Despesa
                  </Button>
                </div>

                <div className="space-y-4">
                  {expenses.map((dateGroup) => (
                    <Card key={dateGroup.date} className="border-gray-200">
                      <CardHeader className="cursor-pointer py-3" onClick={() => toggleDateExpansion(dateGroup.date)}>
                        <div className="flex items-center justify-between">
                          <CardTitle>{dateGroup.date}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {dateGroup.expenses.length} itens · R$
                            {dateGroup.expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                          </div>
                        </div>
                      </CardHeader>

                      {expandedDates.includes(dateGroup.date) && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {dateGroup.expenses.map((expense) => (
                              <ExpenseItem key={expense.id} expense={expense} />
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Calendar Widget */}
              <div>
                <Card className="h-full border-blue-100">
                  <CardHeader>
                    <CardTitle>Calendário de Pagamentos</CardTitle>
                    <CardDescription>Visualize suas datas de vencimento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalendarWidget
                      expenses={expenses}
                      // onRangeChange={setCalendarRange}
                      onMonthChange={async (date) => {
                        // console.log("Mês alterado:", date)
                        const data = await getPayments(date)
                        // window.alert(JSON.stringify(data))
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

      <AddExpenseDialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} />
    </SidebarProvider>
  )
}

