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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  recipientName: z.string().min(1, "Recipient name is required."),
  recipientPhoneNumber: z.number().min(1, "Recipient number is required."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
  cluster: z.enum([
    "accreditation",
    "ceremonies",
    "security",
    "infrastructure",
    "game-services",
    "transport",
    "protocol",
    "marketing",
    "games-village",
    "catering",
    "health",
    "accomodation",
    "safe-guarding",
    "None",
  ]),
});

export function StockOutDialog({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      recipientPhoneNumber: 0,
      quantity: 1,
      cluster: "None",
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
        values.recipientName,
        values.recipientPhoneNumber
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
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Mark &apos;{item.name}&apos; as Stock Out</DialogTitle>
            <DialogDescription>
              Enter the recipient name, phone number, cluster and item quanitity
              to dispense this item.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the name of the individual receiving the item"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient phone number</FormLabel>
                      <FormControl>
                        <Input
                          min={1}
                          type="number"
                          placeholder="Enter the phone number of the individual receiving the item "
                          {...field}
                          onChange={(event) => {
                            field.onChange(event.target.valueAsNumber || ""); // Handle number input, setting to '' if invalid
                          }}
                        />
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
                <FormField
                  control={form.control}
                  name="cluster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="cluster">Cluster</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        name="cluster"
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-dashboardBackground mt-3 text-white rounded-md">
                            <SelectValue placeholder="Select a cluster" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className=" text-white border-dashboardBackground">
                          <SelectItem value="accreditation">
                            Accreditation
                          </SelectItem>
                          <SelectItem value="ceremonies">Ceremonies</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="infrastructure">
                            Infrastructure
                          </SelectItem>
                          <SelectItem value="game-services">
                            Game Services
                          </SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="protocol">Protocol</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="games-village">
                            Games Village
                          </SelectItem>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="accomodation">
                            Accomodation
                          </SelectItem>
                          <SelectItem value="safe-guarding">
                            Safe Guarding
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="">
                <Button type="submit">Dispense</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
