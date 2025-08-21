"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CircleDotDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";
import { deleteItem } from "../_lib/actions";
import { useRouter } from "next/navigation";
import { Item } from "../_definitions/columns";

/**
 * A reusable dialog component for confirming the deletion of an item.
 * It handles the state for showing/hiding the dialog, the loading state during deletion,
 * and the actual call to the server action.
 *
 * @param {object} props - The component props.
 * @param {Item} props.item - The item object to be deleted.
 */
const DeleteConfirmationDialog = ({ item }: { item: Item }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteItem(item.id);
      if (result.success) {
        toast.success("Item deleted successfully.");
        router.refresh();
      } else {
        toast.error(getErrorMessage(result) || "Failed to delete item.");
      }
      setShowConfirm(false);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start font-normal"
        onClick={() => setShowConfirm(true)}
      >
        Delete Item
      </Button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-800">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="my-2">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <CircleDotDashed className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteConfirmationDialog;
