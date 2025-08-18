import SideBar from "@/components/SideBar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export default function Page() {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-dashboardBackgroundDark px-2 py-4 ">
      <div className="w-full h-full flex-none md:w-64">
        <SideBar />
      </div>
      <div className="  w-full h-screen">
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
            <Button className="w-1/6 bg-projectGreen ">
              Scan with barcode scanner
            </Button>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4 text-white">
                <div className="mt-8 flex w-full">
                  <div className="w-1/3">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="barcode"
                      placeholder="Barcode of the item"
                    />
                  </div>

                  <div className="w-1/3">
                    <Label htmlFor="serial-number">Serial Number</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="serial-number"
                      placeholder="Serial number of the item"
                    />
                  </div>

                  <div className="w-1/3">
                    <Label htmlFor="cluster">Cluster</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="cluster"
                      placeholder="Cluster the item belongs to"
                    />
                  </div>
                </div>

                <div className="mt-8 flex ">
                  <div className="w-1/3">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="item-name"
                      placeholder="Name of the item"
                    />
                  </div>

                  <div className="w-1/3">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="quantity"
                      placeholder="item quantity"
                    />
                  </div>
                  <div className="w-1/3">
                    <Label htmlFor="category">Category</Label>
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

                <div className="mt-8 h-48">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    className="bg-transparent h-full border-dashboardBackground mt-3"
                    id="description"
                    placeholder="Add any relavent comments about the item"
                  />
                </div>

                <div className="mt-8 flex">
                  <div className="w-1/3">
                    <Label htmlFor="date-of-purchase">
                      Date of Purchase (Optional)
                    </Label>
                    <Input
                      className="bg-transparent border-dashboardBackground mt-3"
                      id="date-of-purchase"
                      placeholder="The date when the item was purchased"
                      // className="h-24"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-row ">
            <Button className="bg-projectGreen">Submit</Button>
            <Button className="bg-projectRed">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
