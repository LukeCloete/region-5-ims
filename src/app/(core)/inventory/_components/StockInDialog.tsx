"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CircleDotDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";
import { markItemAsStockIn } from "../_lib/actions";
import { Item } from "../_definitions/columns";

/**
 * A reusable dialog component for confirming the marking of stock-in for an item.
 * It handles the state for showing/hiding the dialog, the loading state during stock-in,
 * and the actual call to the server action.
 *
 * @param {object} props - The component props.
 * @param {Item} props.item - The item object to be marked as stock-in.
 */
const StockInConfirmationDialog = ({
  item,
  userUid,
}: {
  item: Item;
  userUid: string;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const handleSubmit = async () => {
    setIsMarking(true);
    try {
      await markItemAsStockIn(item.id, userUid).then(() => {
        toast.success("Item marked as stock-in.");
      });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to mark item as stock-in.");
    } finally {
      setIsMarking(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button
        className="w-full justify-start font-normal"
        onClick={() => setShowConfirm(true)}
      >
        Mark as Stock-in
      </Button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-800">
            <h3 className="text-lg font-bold">Confirm Stock-in</h3>
            <p className="my-2">
              Are you sure you want to mark this item as stock-in? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isMarking}>
                {isMarking ? (
                  <CircleDotDashed className="h-4 w-4 animate-spin" />
                ) : (
                  "Mark as Stock-in"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StockInConfirmationDialog;
