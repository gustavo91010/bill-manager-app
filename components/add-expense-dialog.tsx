"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createExpense, updateExpense } from "@/lib/api"

const formSchema = z.object({
  description: z.string().min(3, {
    message: "A descrição deve ter pelo menos 3 caracteres.",
  }),
  amount: z.coerce.number().positive({
    message: "O valor deve ser maior que zero.",
  }),
  dueDate: z.date({
    required_error: "A data de vencimento é obrigatória.",
  }),
})

type ExpensePayload = {
  description: string
  value: number
  due_date: string
}

type ExpenseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReload: () => Promise<void>
  expense?: {
    id: number
    name: string
    amount: number
    dueDate?: string
  } | null
  selectedDate?: Date
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onReload,
  expense,
  selectedDate
}: ExpenseDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!expense

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      dueDate: undefined,
    },
  })

  const parseDate = (dateStr: string) => {
    if (!dateStr) return undefined
    const parts = dateStr.split("-")
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  }
  useEffect(() => {
    if (expense && open) {
      form.reset({
        description: expense.name,
        amount: expense.amount,
        dueDate: expense.dueDate ? parseDate(expense.dueDate) : selectedDate,
      })
    } else if (!expense && open) {
      form.reset({
        description: "",
        amount: undefined,
        dueDate: selectedDate,
      })
    }
  }, [expense, open, form, selectedDate])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const formattedValues: ExpensePayload = {
        description: values.description,
        value: values.amount,
        due_date: values.dueDate.toISOString().split("T")[0],
      }

      if (isEditing) {
        toast({
          title: "Atualizando despesa",
          description: `Atualizando a despesa: ${formattedValues.description}`,
        })
        await updateExpense(expense.id, formattedValues, localStorage.getItem("accessToken") ?? "")
        // await updateExpense(expense.id, formattedValues)
      } else {
        toast({
          title: "Criando nova despesa",
          description: `Criando a despesa: ${formattedValues.description}`,
        })
        await createExpense(formattedValues, localStorage.getItem("accessToken") ?? "")
      }

      await onReload()

      toast({
        title: isEditing ? "Despesa atualizada" : "Despesa adicionada",
        description: isEditing
          ? "A despesa foi atualizada com sucesso."
          : "A despesa foi adicionada com sucesso.",
      })

      form.reset()
      onOpenChange(false)
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a despesa. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Despesa" : "Adicionar Nova Despesa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Altere os detalhes da despesa."
              : "Insira os detalhes da sua nova despesa."}
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
                    <Input placeholder="Descrição da despesa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : Number(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          type="button"
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999]" align="start" side="bottom" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        locale={ptBR}
                      />
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
