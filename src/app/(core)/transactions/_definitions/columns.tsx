// src/components/tables/transactions-columns.ts

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the transaction data structure
export type TransactionType = "stock-in" | "stock-out";

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  type: TransactionType;
  date: Date;
  userId: string;
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "itemName",
    header: "Item Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionType;
      return (
        <div
          className={cn("font-medium capitalize", {
            "text-green-500": type === "stock-in",
            "text-red-500": type === "stock-out",
          })}
        >
          {type === "stock-in" ? (
            <ArrowRight className="inline-block h-4 w-4 mr-1" />
          ) : (
            <ArrowLeft className="inline-block h-4 w-4 mr-1" />
          )}
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      const formattedDate =
        date.toLocaleDateString() + " " + date.toLocaleTimeString();
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
];
