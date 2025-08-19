"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { cn, getErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Dummy data for clusters and categories. In a real app, this would be fetched from a database.
const clusters = ["Cluster A", "Cluster B", "Cluster C"];
const categories = ["Equipment", "Merchandise", "Supplies"];

const formSchema = z
  .object({
    itemName: z.string().optional(),
    barcode: z.string().optional(),
    quantity: z.number().min(1, "Quantity must be at least 1."),
    destination: z.string().min(1, "Destination is required."),
    cluster: z.string().min(1, "Cluster is required."),
    category: z.string().min(1, "Category is required."),
    description: z.string().optional(),
    dispenseDate: z.date({
      error: "A dispense date is required.",
    }),
  })
  .refine(
    (data) => data.itemName || data.barcode,
    "Either Item Name or Barcode must be entered."
  );

type FormData = z.infer<typeof formSchema>;

export default function DispenseItemPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      barcode: "",
      quantity: 1,
      destination: "",
      cluster: "",
      category: "",
      description: "",
      dispenseDate: new Date(),
    },
  });

  // Handle form submission and record a transaction in Firestore.
  const handleSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    toast.info("Dispensing item...");

    try {
      if (!user) throw new Error("User not authenticated.");

      const transactionData = {
        itemName: values.itemName,
        barcode: values.barcode,
        quantity: values.quantity,
        type: "stock-out",
        source: "Games Warehouse",
        destination: values.destination,
        cluster: values.cluster,
        category: values.category,
        userId: user.uid,
        date: values.dispenseDate,
        description: values.description || "",
      };

      // Add the new transaction document to the "transactions" collection
      await addDoc(collection(db, "transactions"), transactionData);

      toast.success("Item dispensed successfully!");
      form.reset(); // Clear the form after a successful submission
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-2 border-foreground/20 rounded-xl p-4 gap-4 justify-start items-start w-full">
      <Card>
        <CardHeader className="bg-dashboardBackgroundDark border-b-[1px] border-b-foreground/20 text-foreground font-bold text-2xl">
          <CardTitle>Dispense Item</CardTitle>
        </CardHeader>
        <CardContent className="bg-dashboardBackgroundDark">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 w-full"
            >
              <div className="flex flex-row items-center justify-start gap-4 py-2">
                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Item Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Item Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-xl font-bold">OR</span>
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Barcode</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Barcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Destination</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter destination"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center justify-start gap-4">
                <FormField
                  control={form.control}
                  name="cluster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Cluster</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a cluster" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clusters.map((cluster) => (
                            <SelectItem key={cluster} value={cluster}>
                              {cluster}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dispenseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">Dispense Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Reason for dispensing item"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} type="submit" className="w-full">
                Dispense Item
              </Button>
              <Link href="/dashboard/inventory">
                <Button variant="ghost" className="w-full">
                  Cancel
                </Button>
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
