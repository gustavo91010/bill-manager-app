// "use client"

// import { useState, useEffect } from "react"
// import { CalendarIcon } from 'lucide-react'
// import { format } from "date-fns"
// import { ptBR } from "date-fns/locale"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"

// const formSchema = z.object({
//   description: z.string().min(3, {
//     message: "A descrição deve ter pelo menos 3 caracteres.",
//   }),
//   amount: z.coerce.number().positive({
//     message: "O valor deve ser maior que zero.",
//   }),
//   dueDate: z.date({
//     required_error: "A data de vencimento é obrigatória.",
//   }),
// })

// type ExpensePayload = {
//   description: string
//   value: number
//   due_date: string
// }

// type ExpenseDialogProps = {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onReload: () => Promise<void>
//   expense?: {
//     id: number
//     name: string
//     amount: number
//     dueDate?: string
//   } | null
// }

// export function ExpenseDialog({ open, onOpenChange, onReload, expense }: ExpenseDialogProps) {
//   const { toast } = useToast()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const isEditing = !!expense

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       description: "",
//       amount: undefined,
//       dueDate: undefined,
//     },
//   })

//   useEffect(() => {
//     if (expense && open) {
//       form.reset({
//         description: expense.name,
//         amount: expense.amount,
//         dueDate: expense.dueDate ? new Date(expense.dueDate) : undefined,
//       })
//     } else if (!expense && open) {
//       form.reset({
//         description: "",
//         amount: undefined,
//         dueDate: undefined,
//       })
//     }
//   }, [expense, open, form])

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       setIsSubmitting(true)

//       const formattedValues: ExpensePayload = {
//         description: values.description,
//         value: values.amount,
//         due_date: values.dueDate.toISOString().split("T")[0],
//       }

//       if (isEditing) {
//         console.log("Atualizando despesa:", expense?.id, formattedValues)
//         // await updateExpense(expense.id, formattedValues)
//       } else {
//         console.log("Criando nova despesa:", formattedValues)
//         // await createExpense(formattedValues)
//       }

//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       await onReload()

//       toast({
//         title: isEditing ? "Despesa atualizada" : "Despesa adicionada",
//         description: isEditing 
//           ? "A despesa foi atualizada com sucesso." 
//           : "A despesa foi adicionada com sucesso.",
//       })

//       form.reset()
//       onOpenChange(false)
//     } catch (error) {
//       console.error("Erro ao salvar despesa:", error)
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro ao salvar a despesa. Tente novamente.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? "Editar Despesa" : "Adicionar Nova Despesa"}
//           </DialogTitle>
//           <DialogDescription>
//             {isEditing 
//               ? "Altere os detalhes da despesa." 
//               : "Insira os detalhes da sua nova despesa."
//             }
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Descrição</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Descrição da despesa" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Valor</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       placeholder="0,00"
//                       value={field.value ?? ""}
//                       onChange={(e) => {
//                         const value = e.target.value === "" ? undefined : Number(e.target.value)
//                         field.onChange(value)
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="dueDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Data de Vencimento</FormLabel>
//                   <Popover modal={true}>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                           type="button"
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP", { locale: ptBR })
//                           ) : (
//                             <span>Selecione uma data</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent 
//                       className="w-auto p-0 z-[9999]" 
//                       align="start"
//                       side="bottom"
//                       sideOffset={4}
//                     >
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
//                         initialFocus
//                         locale={ptBR}
//                       />
//                     </PopoverContent>
//                   </Popover>
