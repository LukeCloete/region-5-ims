"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateItem } from "../../_lib/actions";

// Define the form schema for validation using Zod.
// This schema will ensure the data submitted by the user is valid.
const formSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  barcode: z.number().min(1, "Barcode is required and must be a number."),
  serialNumber: z.string().min(1, "Serial number is required."),
  cluster: z.string().min(1, "Cluster is required."),
  quantity: z.number().min(0, "Quantity must be a non-negative number."),
  category: z.string().min(1, "Category is required."),
  description: z.string().optional(),
});

// The main component for the dynamic edit page.
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<z.infer<typeof formSchema> | null>(null);

  // Initialize the form with react-hook-form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      barcode: 0,
      serialNumber: "",
      cluster: "",
      quantity: 0,
      category: "",
      description: "",
    },
  });

  // useEffect hook to fetch the item data when the component mounts or itemId changes.
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const itemDocRef = doc(db, "items", id);
        const itemDoc = await getDoc(itemDocRef);

        if (itemDoc.exists()) {
          const docData = itemDoc.data();
          // Reset the form with the fetched data to pre-fill the inputs.
          form.reset({
            name: docData.name,
            barcode: docData.barcode,
            serialNumber: docData.serialNumber,
            cluster: docData.cluster,
            quantity: docData.quantity,
            category: docData.category,
            description: docData.description,
          });
        } else {
          setError("Item not found.");
        }
      } catch (e) {
        console.error("Failed to fetch item:", e);
        setError(getErrorMessage(e));
        toast.error("Failed to load item data.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, form]);

  // Function to handle form submission.
  const handleSubmit = async (
    id: string,
    values: z.infer<typeof formSchema>
  ) => {
    try {
      setLoading(true);
      const itemDocRef = doc(db, "items", id);

      const formData = new FormData();

      if (values.barcode && values.barcode !== item?.barcode) {
        formData.append("barcode", values.barcode.toString());
      }

      await updateItem(id, formData);
      toast.success("Item updated successfully!");
    } catch (e) {
      console.error("Failed to update item:", e);
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitWithId = handleSubmit.bind(null, id);

  // Render the loading or error state if necessary.
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="mt-4 text-sm text-gray-500">Loading item data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <h2 className="text-xl font-bold">Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  // Render the edit form.
  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="px-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>Edit Inventory Item</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitWithId)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-1/3">
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
                        <SelectTrigger className="bg-transparent border-gray-700 mt-3 text-white placeholder-gray-500 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <SelectValue placeholder="Select a cluster" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
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
            <div className="w-1/3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="category">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      name="category"
                    >
                      <FormControl>
                        <SelectTrigger className="bg-transparent border-gray-700 mt-3 text-white placeholder-gray-500 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="home-equipment">
                          Home Equipment
                        </SelectItem>
                        <SelectItem value="branding">Branding</SelectItem>
                        <SelectItem value="gadgets">Gadgets</SelectItem>
                        <SelectItem value="it-networking">
                          IT/Networking
                        </SelectItem>
                        <SelectItem value="stationery">Stationery</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
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
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
