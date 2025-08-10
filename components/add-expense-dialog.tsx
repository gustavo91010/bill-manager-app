"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createExpense, updateExpense } from "@/lib/api"
import { ExpensePayload } from "@/types"

const formSchema = z.object({
  description: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres." }),
  amount: z.coerce.number().positive({ message: "O valor deve ser maior que zero." }),
  periodicity: z.coerce.number().int().positive().optional(),
  dueDate: z.date({ required_error: "A data de vencimento é obrigatória." }),
  category: z.string().min(1, { message: "Selecione uma categoria ou adicione uma nova." }),
  newCategory: z.string().optional()
})

type ExpenseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReload: () => Promise<void>
  categories: { id: number; name: string }[]
  expense?: {
    id: number
    name: string
    amount: number
    periodicity?: number
    dueDate?: string
    category?: string
  } | null
  selectedDate?: Date
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onReload,
  expense,
  selectedDate,
  categories
}: ExpenseDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const isEditing = !!expense

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      periodicity: undefined,
      dueDate: undefined,
      category: "",
      newCategory: ""
    },
  })

  const parseDate = (dateStr: string) => {
    if (!dateStr) return undefined
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  useEffect(() => {
    if (expense && open) {
      form.reset({
        description: expense.name,
        amount: expense.amount,
        periodicity: expense.periodicity,
        dueDate: expense.dueDate ? parseDate(expense.dueDate) : selectedDate,
        category: expense.category ?? "",
        newCategory: ""
      })
      setIsAddingCategory(false)
    } else if (!expense && open) {
      form.reset({
        description: "",
        amount: undefined,
        periodicity: undefined,
        dueDate: selectedDate,
        category: "",
        newCategory: ""
      })
      setIsAddingCategory(false)
    }
  }, [expense, open, form, selectedDate, categories])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.category === "add_new") {
        if (!values.newCategory?.trim()) {
          toast({ title: "Erro", description: "Digite o nome da nova categoria.", variant: "destructive" })
          return
        }
        if (categories.some(c => c.name.toLowerCase() === values.newCategory.toLowerCase())) {
          toast({ title: "Erro", description: "Essa categoria já existe.", variant: "destructive" })
          return
        }
      }

      setIsSubmitting(true)

      const categoryToSave = values.category === "add_new" ? values.newCategory!.trim() : values.category

      const payload: ExpensePayload = {
        description: values.description,
        value: values.amount,
        due_date: format(values.dueDate, "yyyy-MM-dd"),
      }

      ;(payload as any).category = categoryToSave

      if (values.periodicity) {
        payload.periodicity = values.periodicity
      }

      const token = localStorage.getItem("accessToken") ?? ""
      if (isEditing) {
        console.log("Editando despesa:", expense.id, payload)
        await updateExpense(expense.id, payload, token)
        console.log("Despesa editada com sucesso")
      } else {
        console.log("Criando nova despesa:", payload)
        await createExpense(payload, token)
        console.log("Despesa criada com sucesso")
      }

      // Primeiro recarrega os dados
      console.log("Chamando onReload...")
      await onReload()
      console.log("onReload concluído")
      
      // Depois fecha o modal e limpa o formulário
      onOpenChange(false)
      form.reset()
      setIsAddingCategory(false)
    } catch {
      toast({ title: "Erro", description: "Ocorreu um erro ao salvar a despesa.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Despesa" : "Adicionar Nova Despesa"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Altere os detalhes da despesa." : "Insira os detalhes da sua nova despesa."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conta de Luz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val)
                      setIsAddingCategory(val === "add_new")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add_new">+ Adicionar nova categoria</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isAddingCategory && (
              <FormField
                control={form.control}
                name="newCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da nova categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecionar data</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}