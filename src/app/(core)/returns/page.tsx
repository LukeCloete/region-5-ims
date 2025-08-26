import { DataTable } from "./_components/data-table";
import { columns } from "./_definitions/columns";
import { getAllReturns } from "./_lib/data";

const mockData = [
  {
    id: "1",
    itemId: "item-1",
    userEmail: "user1@example.com",
    itemName: "Item 1",
    stockInAt: "2023-01-01T00:00:00Z",
    stockOutAt: "2023-01-02T00:00:00Z",
    returnedAt: "2023-01-03T00:00:00Z",
    quantity: 5,
    remaining: 10,
    barcode: "1234567890123",
    productCode: "PROD-001",
    serialNumber: "SN-001",
    cluster: "Cluster A",
    category: "Category 1",
    itemCondition: "New",
    recipientName: "Recipient 1",
  },
  // Add more mock data as needed
];

export default async function ReturnsPage() {
  console.log("Fetching all returns...");
  const data = await getAllReturns();

  console.log("data:", data);

  return (
    <div className="border-2 border-foreground/20 rounded-xl  p-4 gap-4 justify-start items-start w-full">
      <h1 className="py-2 w-full border-b-[1px] border-b-foreground/20 text-foreground font-bold text-2xl">
        Returns
      </h1>
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
}
