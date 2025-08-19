import { z } from "zod";

export const dispenseSchema = z.object({
  itemId: z.string().min(1, { message: "Item is required." }),
  quantity: z
    .number()
    .min(1, { message: "Quantity must be at least 1." })
    .int({ message: "Quantity must be a whole number." }),
  notes: z.string().optional(),
});

export type DispenseFormValues = z.infer<typeof dispenseSchema>;
