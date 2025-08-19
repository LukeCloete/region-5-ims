// src/app/(core)/inventory/_components/StockOutDialog.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { Item } from "../_definitions/columns";
import { markItemAsStockOut } from "../_lib/actions";

// Define the form schema for validation
const formSchema = z.object({
  destination: z.string().min(1, "Destination is required."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
});

export function StockOutDialog({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      quantity: 1,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      await markItemAsStockOut(
        item.id,
        user.uid,
        values.quantity,
        values.destination
      );
      toast.success("Item successfully stocked out!");
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Mark as Stock Out</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark "{item.name}" as Stock Out</DialogTitle>
            <DialogDescription>
              Enter the quantity and destination to dispense this item.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Department A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          min={1}
                          onChange={(event) => {
                            field.onChange(event.target.valueAsNumber || ""); // Handle number input, setting to '' if invalid
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Dispense</Button>
                <button
                  onClick={() => {
                    console.log(form.getValues("quantity"));
                  }}
                >
                  Click to view the values of quantity
                </button>
                <button
                  onClick={() => {
                    console.log(typeof form.getValues("quantity"));
                  }}
                >
                  Click to view data type of quantity
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
