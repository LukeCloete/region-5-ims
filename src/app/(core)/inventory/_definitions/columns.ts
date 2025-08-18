"use client";

import { ColumnDef } from "@tanstack/react-table";

// Define the interface for your data.
export interface Item {
  id: string;
  barcode: number;
  serialNumber: string;
  cluster: string;
  name: string;
  quantity: number;
  categoryId: string;
  description: string;
  dateOfPurchase: Date;
}

// Define the columns.
export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
  },
  {
    accessorKey: "id",
    header: "Item ID",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "cluster",
    header: "Cluster",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "dateOfPurchase",
    header: "Date of Purchase",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  // A column for actions will need to be added on the page component
  // where the UI components are available.
];
