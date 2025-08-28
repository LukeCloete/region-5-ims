import { DataTable } from "./_components/data-table";
import { columns } from "./_definitions/columns";
import { getAllReturns } from "./_lib/data";

export default async function ReturnsPage() {
  const data = await getAllReturns();

  return (
    <div className="border-2 border-foreground/20 rounded-xl  p-4 gap-4 justify-start items-start w-full">
      <h1 className="py-2 w-full border-b-[1px] border-b-foreground/20 text-foreground font-bold text-2xl">
        Returns
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
