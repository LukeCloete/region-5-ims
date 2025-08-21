"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addItem } from "./_lib/actions";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthContext } from "@/lib/contexts/AuthContext";

const formSchema = z.object({
  barcode: z.number(),
  serialNumber: z.string(),
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
  itemName: z.string(),
  quantity: z.number(),
  category: z.enum([
    "home-equipment",
    "branding",
    "gadgets",
    "it-networking",
    "stationery",
    "electronics",
    "None",
  ]),
  itemCondition: z.enum(["Good", "Bad", "Damaged", ""]),
  dateOfPurchase: z.date(),
  productCode: z.string(),
});

export default function Page() {
  const { user } = useAuthContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode: 0,
      serialNumber: "",
      cluster: "None",
      itemName: "",
      quantity: 0,
      category: "None",
      itemCondition: "",
      dateOfPurchase: new Date(),
      productCode: "",
    },
  });

  const [dialogBarcode, setDialogBarcode] = useState(0);

  const handleDialogSubmit = () => {
    if (dialogBarcode) {
      // Save to local storage
      localStorage.setItem("scannedBarcode", dialogBarcode.toString());

      // Set the barcode field in the main form
      // form.setValue("barcode", dialogBarcode, {
      //   shouldValidate: true,
      // });

      // Close the dialog
      // Reset dialog barcode for next scan
      // setDialogBarcode(0);
    } else {
      // You might want to show a validation message inside the dialog here
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    const formData = new FormData();
    formData.append("barcode", values.barcode.toString());
    formData.append("serial-number", values.serialNumber);
    formData.append("cluster", values.cluster);
    formData.append("category", values.category);
    formData.append("item-name", values.itemName);
    formData.append("quantity", values.quantity.toString());
    formData.append("item-condition", values.itemCondition);
    formData.append("productCode", values.productCode);
    formData.append("userId", user.uid);
    toast.info("Adding item...");
    try {
      await addItem(formData);
      toast.success(`Added item successfully`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:overflow-hidden bg-dashboardBackgroundDark px-2 py-4 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {/* Add / Scan item */}
          <Card className="bg-dashboardBackgroundDark border-dashboardBackground">
            <CardHeader>
              <CardTitle className="text-white">Add / Scan item</CardTitle>
            </CardHeader>
          </Card>

          {/* Second card */}
          <Card className="bg-dashboardBackgroundDark border-dashboardBackground">
            <CardHeader className="mt-2">
              <CardTitle className="text-white">
                Use a barcode scanner or continue with manual form entry below
              </CardTitle>
              <CardDescription className="text-white">
                Click &lsquo;Scan&rsquo; to add an item if you have a barcode
                scanner
              </CardDescription>

              <Dialog>
                <div>
                  <DialogTrigger asChild>
                    <Button className="w-1/6 overflow-hidden bg-projectGreen ">
                      Scan with barcode scanner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-dashboardBackgroundDark border-dashboardBackground text-white sm:max-w-[576px] ">
                    <DialogHeader>
                      <DialogTitle className="mt-3">
                        Barcode scanner
                      </DialogTitle>
                      <DialogDescription className="text-white">
                        Click on the barcode field then scan an item with your
                        scanner to add it&apos;s barcode.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 mb-6">
                      <div className="grid gap-3 mt-4">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                          className="bg-transparent border-dashboardBackground "
                          id="barcode-dialog"
                          name="barcode-dialog"
                          type="text"
                          value={dialogBarcode}
                          onChange={(e) =>
                            setDialogBarcode(Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      onClick={handleDialogSubmit}
                      className="bg-projectGreen"
                    >
                      Submit and continue entry
                    </Button>
                    <DialogClose asChild>
                      <Button className="bg-projectRed mb-6">Cancel</Button>
                    </DialogClose>
                  </DialogContent>
                </div>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className=" grid w-full items-center gap-4 text-white">
                <div className="mt-8 flex w-full">
                  <div className="w-1/3">
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="barcode">Barcode</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-transparent border-dashboardBackground mt-3 text-white placeholder-gray-500 rounded-md "
                              placeholder="Barcode of the item"
                              id="barcode"
                              type="number"
                              {...field}
                              onChange={(event) => {
                                field.onChange(
                                  event.target.valueAsNumber || ""
                                ); // Handle number input, setting to '' if invalid
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-1/3">
                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="serial-number">
                            Serial Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-transparent border-dashboardBackground mt-3 text-white placeholder-gray-500 rounded-md "
                              placeholder="Serial number of the item"
                              id="serial-number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                              <SelectTrigger className="bg-transparent border-dashboardBackground mt-3 text-white rounded-md">
                                <SelectValue placeholder="Select a cluster" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className=" text-white border-dashboardBackground">
                              <SelectItem value="accreditation">
                                Accreditation
                              </SelectItem>
                              <SelectItem value="ceremonies">
                                Ceremonies
                              </SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="infrastructure">
                                Infrastructure
                              </SelectItem>
                              <SelectItem value="game-services">
                                Game Services
                              </SelectItem>
                              <SelectItem value="transport">
                                Transport
                              </SelectItem>
                              <SelectItem value="protocol">Protocol</SelectItem>
                              <SelectItem value="marketing">
                                Marketing
                              </SelectItem>
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
                              <SelectItem value="Technical">
                                Technical
                              </SelectItem>
                              <SelectItem value="LOC">LOC</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* item name div  */}
                <div className="mt-8 flex ">
                  <div className="w-1/3">
                    <FormField
                      control={form.control}
                      name="itemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="item-name">Item Name</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-transparent border-dashboardBackground mt-3 text-white placeholder-gray-500 "
                              placeholder="Name of the item"
                              id="item-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-1/3">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="quantity">Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="bg-transparent border-dashboardBackground mt-3 text-white placeholder-gray-500 rounded-md "
                              placeholder="Item quantity"
                              id="quantity"
                              {...field}
                              onChange={(event) => {
                                field.onChange(
                                  event.target.valueAsNumber || ""
                                ); // Handle number input, setting to '' if invalid
                              }}
                            />
                          </FormControl>
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
                              <SelectTrigger className="bg-transparent border-dashboardBackground mt-3 text-white  rounded-md ">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-dashboardBackground text-white">
                              <SelectItem value="home-equipment">
                                Home Equipment
                              </SelectItem>
                              <SelectItem value="branding">Branding</SelectItem>
                              <SelectItem value="gadgets">Gadgets</SelectItem>
                              <SelectItem value="it-networking">
                                IT/Networking
                              </SelectItem>
                              <SelectItem value="stationery">
                                Stationery
                              </SelectItem>
                              <SelectItem value="electronics">
                                Electronics
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-8 flex">
                  <div className="w-1/3">
                    <FormField
                      control={form.control}
                      name="itemCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="item-condition">
                            Item condition
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            name="item-condition"
                          >
                            <FormControl>
                              <SelectTrigger className="bg-transparent border-dashboardBackground mt-3 text-white  rounded-md ">
                                <SelectValue placeholder="Select the condition of the item" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-dashboardBackground text-white">
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Bad">Bad</SelectItem>
                              <SelectItem value="Damaged">Damaged</SelectItem>
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
                      name="productCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="productCode">
                            Product Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-transparent border-dashboardBackground mt-3 text-white placeholder-gray-500 "
                              placeholder="The product code of the item"
                              id="productCode"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row ">
              <Button type="submit" className="bg-projectGreen">
                Submit
              </Button>
              <Button className="bg-projectRed hover:bg-projectRed">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
