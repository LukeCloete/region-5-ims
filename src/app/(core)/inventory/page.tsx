import { DataTable } from "./_components/data-table";
import { columns, Item } from "./_definitions/columns";

async function getData(): Promise<Item[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      barcode: 123456,
      serialNumber: "SN123456",
      cluster: "A",
      name: "Item 1",
      quantity: 100,
      categoryId: "cat1",
      description: "Description for Item 1",
      dateOfPurchase: new Date(),
    },
    // ...
  ];
}

export default async function page() {
  const data = await getData();
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
