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
});

export default function Page() {
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
    },
  });

  const [dialogBarcode, setDialogBarcode] = useState(0);

  const handleDialogSubmit = () => {
    if (dialogBarcode) {
      // Save to local storage
      localStorage.setItem("scannedBarcode", dialogBarcode.toString());
      console.log("Dialog barcode saved:", dialogBarcode);

      // Set the barcode field in the main form
      // form.setValue("barcode", dialogBarcode, {
      //   shouldValidate: true,
      // });

      // Close the dialog
      // Reset dialog barcode for next scan
      // setDialogBarcode(0);
    } else {
      console.log("Dialog barcode is empty.");
      // You might want to show a validation message inside the dialog here
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("barcode", values.barcode.toString());
    formData.append("serial-number", values.serialNumber);
    formData.append("cluster", values.cluster);
    formData.append("category", values.category);
    formData.append("item-name", values.itemName);
    formData.append("quantity", values.quantity.toString());
    formData.append("item-condition", values.itemCondition);
    formData.append("date-of-purchase", values.dateOfPurchase.toISOString());
    toast.info(true ? "Adding item..." : "Adding item...");
    try {
      await addItem(formData);
      toast.success(`Added item successfully`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-dashboardBackgroundDark px-2 py-4 ">
      {/* <div className="w-full h-full flex-none md:w-64">
        <SideBar />
      </div> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-screen"
        >
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

              {/* <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button className="w-1/6 bg-projectGreen ">2ND DIALOG</Button>
                </DialogTrigger>
                <DialogContent className="bg-dashboardBackgroundDark border-dashboardBackground text-white sm:max-w-[576px] ">
                  <DialogHeader>
                    <div className="mt-3">
                      <DialogTitle>This item already exists</DialogTitle>
                      <DialogDescription className="text-white">
                        Thebarcode you entered is assigned to an existing item.
                      </DialogDescription>
                    </div>
                    <div className="mt-3">
                      <DialogTitle className="mt-3">Existing item:</DialogTitle>
                      <DialogDescription className="text-white">
                        <div className="mt-2">
                          <p>Barcode Number:</p>
                        </div>
                        <div>
                          <p>Category:</p>
                        </div>
                        <div>
                          <p>Cluster:</p>
                        </div>
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <div className="grid gap-4 mb-6">
                    <DialogTitle className="mt-3">
                      Add quantity of scanned item:
                    </DialogTitle>
                    <div className="grid gap-3 mt-4">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        className="bg-transparent border-dashboardBackground "
                        id="quantity"
                        name="quantity"
                      />
                    </div>
                    <DialogTitle className="mt-3">Change Cluster:</DialogTitle>
                    <div className="grid gap-3 mt-4">
                      <Label htmlFor="Cluster">Cluster</Label>
                      <Select>
                        <SelectTrigger
                          className="bg-transparent border-dashboardBackground mt-3"
                          id="category"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="next">Next.js</SelectItem>
                          <SelectItem value="sveltekit">SvelteKit</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="bg-projectGreen">
                    Submit and continue entry
                  </Button>
                  <DialogClose asChild>
                    <Button className="bg-projectRed mb-6">Cancel</Button>
                  </DialogClose>
                </DialogContent>
              </form>
            </Dialog> */}
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
                                Good
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

                <div className=" mt-8 min-h-48">
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
                          <SelectContent className="border-dashboardBackground text-white border-dashboardBackground">
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

                <div className="mt-6 flex">
                  <div className="w-1/3">
                    <FormField
                      control={form.control}
                      name="dateOfPurchase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="date-of-purchase">
                            Date of Purchase (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="bg-transparent border-dashboardBackground mt-3 text-white "
                              placeholder="The date when the item was purchased"
                              id="date-of-purchase"
                              // Ensure the value is always a string in 'YYYY-MM-DD' format
                              value={
                                field.value
                                  ? field.value instanceof Date
                                    ? field.value.toISOString().split("T")[0]
                                    : field.value
                                  : ""
                              }
                              onChange={(e) => {
                                field.onChange(e.target.value); // type="date" input already provides value as 'YYYY-MM-DD' string
                              }}
                              onBlur={field.onBlur} // Keep onBlur from {...field}
                              name={field.name} // Keep name from {...field}
                              ref={field.ref} // Keep ref from {...field}
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
              <Button
                type="submit"
                onClick={() => {
                  console.log("This also means you submitted");
                }}
                className="bg-projectGreen"
              >
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
