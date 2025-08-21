"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockOutDialog } from "../_components/StockOutDialog";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { deleteItem, markItemAsStockIn } from "../_lib/actions";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import DeleteConfirmationDialog from "../_components/DeleteActionDialog";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import StockInConfirmationDialog from "../_components/StockInDialog";

// Define the interface for your data.
export interface Item {
  id: string;
  barcode: number;
  serialNumber: string;
  cluster: string;
  name: string;
  quantity: number;
  categoryId: string;
  itemCondition: string;
  productCode: string;
  currentTimestamp: Timestamp;
}

const ALLOWED_ROLES = ["admin", "superuser"];
// A dedicated component to handle the cell's interactive logic and hooks.
const ActionCell = ({ item }: { item: Item }) => {
  const { user } = useAuthContext();

  const handleDelete = async () => {
    try {
      const result = await deleteItem(item.id);
      if (result.success) {
        toast.success("Item deleted successfully.");
      } else {
        toast.error(getErrorMessage(result) || "Failed to delete item.");
      }
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
    const handleStockIn = async () => {
      if (!user) {
        toast.error("You must be logged in to perform this action.");
        return;
      }

      try {
        await markItemAsStockIn(item.id, user.uid);
        toast.success("Item marked as stock-in.");
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    };
  };

  const canEditOrDelete =
    typeof user?.role === "string" && ALLOWED_ROLES.includes(user.role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {canEditOrDelete && (
          <>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
              <StockInConfirmationDialog item={item} userUid={user.uid} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
              <StockOutDialog item={item} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="w-full px-2  justify-start font-normal"
                href={`/inventory/edit/${item.id}`}
              >
                Edit Item
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
              <DeleteConfirmationDialog item={item} onDelete={handleDelete} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Define the columns.
export const columns: ColumnDef<Item>[] = [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }) => {
      // The row.index is a 0-based number, so we add 1 to make it 1-based
      return <div>{row.index + 1}</div>;
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Barcode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "productCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "serialNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Serial Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "cluster",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cluster
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "itemCondition",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item condition
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "currentTimestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Upload
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const dateString = getValue() as Timestamp | null;

      // Check if the date string is valid before creating a Date object.
      if (!dateString) {
        return "N/A"; // Or any placeholder you prefer for a missing date.
      }
      const date = new Date(dateString.seconds * 1000);

      // Ensure the date is not 'Invalid Date' before formatting.
      return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionCell item={row.original} />;
    },
  },
];
