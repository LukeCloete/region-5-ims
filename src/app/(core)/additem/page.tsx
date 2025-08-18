"use client";
import SideBar from "@/components/SideBar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
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

export default function Page() {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-dashboardBackgroundDark px-2 py-4 ">
      {/* <div className="w-full h-full flex-none md:w-64">
        <SideBar />
      </div> */}

      <form action={addItem} className="w-full h-screen">
        <Card className="bg-dashboardBackgroundDark border-dashboardBackground">
          <CardHeader>
            <CardTitle className="text-white">Add / Scan item</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-dashboardBackgroundDark border-dashboardBackground">
          <CardHeader className="mt-2">
            <CardTitle className="text-white">
              Use a barcode scanner or continue with manual form entry below
            </CardTitle>
            <CardDescription className="text-white">
              Click 'Scan' to add an item if you have a barcode scanner
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
                    <DialogTitle className="mt-3">Barcode scanner</DialogTitle>
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
                        id="barcode"
                        name="barcode"
                        type="text"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-projectGreen">
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
            <div>
              <div className="grid w-full items-center gap-4 text-white">
                <div className="mt-8 flex w-full">
                  <div className="w-1/3">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="barcode"
                      name="barcode"
                      placeholder="Barcode of the item"
                    />
                  </div>

                  <div className="w-1/3">
                    <Label htmlFor="serial-number">Serial Number</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="serial-number"
                      name="serial-number"
                      placeholder="Serial number of the item"
                    />
                  </div>

                  <div className="w-1/3">
                    <Label htmlFor="cluster">Cluster</Label>
                    <Select>
                      <SelectTrigger
                        className="bg-transparent border-dashboardBackground mt-3"
                        id="category"
                        name="category"
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

                <div className="mt-8 flex ">
                  <div className="w-1/3">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="item-name"
                      name="item-name"
                      placeholder="Name of the item"
                    />
                  </div>

                  <div className="w-1/3">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="quantity"
                      name="quantity"
                      placeholder="item quantity"
                    />
                  </div>
                  <div className="w-1/3">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger
                        className="bg-transparent border-dashboardBackground mt-3"
                        id="category"
                        name="category"
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

                <div className=" mt-8 min-h-48">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    className="bg-transparent min-h-48 border-dashboardBackground
                    mt-3"
                    id="description"
                    name="description"
                    placeholder="Add any relavent comments about the item"
                  />
                </div>

                <div className="mt-6 flex">
                  <div className="w-1/3">
                    <Label htmlFor="date-of-purchase">
                      Date of Purchase (Optional)
                    </Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="date-of-purchase"
                      name="date-of-purchase"
                      placeholder="The date when the item was purchased"
                      // className="h-24"
                    />
                  </div>
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
    </div>
  );
}
