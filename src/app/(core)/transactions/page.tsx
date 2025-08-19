import { DataTable } from "./_components/data-table";
import { columns, Transaction } from "./_definitions/columns";

async function getData(): Promise<Transaction[]> {
  return [
    {
      itemId: "example-id-of-item-from-items-1",
      quantity: 5,
      source: "Main Warehouse",
      destination: "Games Village",
      type: "stock-out",
      userId: "user-id-1",
      date: new Date("2025-08-16"),
      cluster: "",
      category: "",
    },
    {
      itemId: "example-id-of-item-from-items-2",
      quantity: 25,
      source: "Supplier",
      destination: "Main Warehouse",
      type: "stock-in",
      userId: "user-id-2",
      date: new Date("2025-08-15"),
      cluster: "",
      category: "",
    },
    {
      itemId: "example-id-of-item-from-items-3",
      quantity: 1,
      source: "Main Warehouse",
      destination: "Security Office",
      type: "stock-out",
      userId: "user-id-3",
      date: new Date("2025-08-14"),
      cluster: "",
      category: "",
    },
  ];
}

export default async function TransactionsPage() {
  const data = await getData();

  return (
    <div className="border-2 border-foreground/20 rounded-xl p-4 gap-4 justify-start items-start w-full">
      <h1 className="py-2 w-full border-b-[1px] border-b-foreground/20 text-foreground font-bold text-2xl">
        Transactions
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
