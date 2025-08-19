import { DataTable } from "./_components/data-table";
import { columns, Item } from "./_definitions/columns";
import { getAllItems } from "./_lib/data";

// async function getData(): Promise<Item[]> {
//   return [
//     {
//       id: "728ed52f",
//       barcode: 123456,
//       serialNumber: "SN123456",
//       cluster: "A",
//       name: "Item 1",
//       quantity: 100,
//       categoryId: "cat1",
//       description: "Description for Item 1",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52g",
//       barcode: 654321,
//       serialNumber: "SN654321",
//       cluster: "B",
//       name: "Item 2",
//       quantity: 50,
//       categoryId: "cat2",
//       description: "Description for Item 2",
//       dateOfPurchase: new Date(),
//     },
//     // Add more items as needed
//     {
//       id: "728ed52h",
//       barcode: 789012,
//       serialNumber: "SN789012",
//       cluster: "C",
//       name: "Item 3",
//       quantity: 75,
//       categoryId: "cat3",
//       description: "Description for Item 3",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52f",
//       barcode: 123456,
//       serialNumber: "SN123456",
//       cluster: "A",
//       name: "Item 1",
//       quantity: 100,
//       categoryId: "cat1",
//       description: "Description for Item 1",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52g",
//       barcode: 654321,
//       serialNumber: "SN654321",
//       cluster: "B",
//       name: "Item 2",
//       quantity: 50,
//       categoryId: "cat2",
//       description: "Description for Item 2",
//       dateOfPurchase: new Date(),
//     },
//     // Add more items as needed
//     {
//       id: "728ed52h",
//       barcode: 789012,
//       serialNumber: "SN789012",
//       cluster: "C",
//       name: "Item 3",
//       quantity: 75,
//       categoryId: "cat3",
//       description: "Description for Item 3",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52f",
//       barcode: 123456,
//       serialNumber: "SN123456",
//       cluster: "A",
//       name: "Item 1",
//       quantity: 100,
//       categoryId: "cat1",
//       description: "Description for Item 1",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52g",
//       barcode: 654321,
//       serialNumber: "SN654321",
//       cluster: "B",
//       name: "Item 2",
//       quantity: 50,
//       categoryId: "cat2",
//       description: "Description for Item 2",
//       dateOfPurchase: new Date(),
//     },
//     // Add more items as needed
//     {
//       id: "728ed52h",
//       barcode: 789012,
//       serialNumber: "SN789012",
//       cluster: "C",
//       name: "Item 3",
//       quantity: 75,
//       categoryId: "cat3",
//       description: "Description for Item 3",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52h",
//       barcode: 789012,
//       serialNumber: "SN789012",
//       cluster: "C",
//       name: "Item 3",
//       quantity: 75,
//       categoryId: "cat3",
//       description: "Description for Item 3",
//       dateOfPurchase: new Date(),
//     },
//     {
//       id: "728ed52h",
//       barcode: 789012,
//       serialNumber: "SN789012",
//       cluster: "C",
//       name: "Item 3",
//       quantity: 75,
//       categoryId: "cat3",
//       description: "Description for Item 3",
//       dateOfPurchase: new Date(),
//     },
//   ];
// }

export default async function page() {
  const data = await getAllItems();
  return (
    <div className="border-2 border-foreground/20 rounded-xl  p-4 gap-4 justify-start items-start w-full">
      <h1 className="py-2 w-full border-b-[1px] border-b-foreground/20 text-foreground font-bold text-2xl">
        Inventory
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
