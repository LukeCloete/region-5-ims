"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CircleDotDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";
import { markItemAsStockIn } from "../../inventory/_lib/actions";
import { markItemAsReturned } from "../_lib/actions";
import { Input } from "@/components/ui/input";

/**
 * A reusable dialog component for confirming the marking of stock-in for an item.
 * It handles the state for showing/hiding the dialog, the loading state during stock-in,
 * and the actual call to the server action.
 *
 * @param {object} props - The component props.
 * @param {Item} props.item - The item object to be marked as stock-in.
 */
const ReturnsConfirmationDialog = ({
  transactionId,
  userUid,
  quantityIssued = 1,
}: {
  transactionId: string;
  userUid: string;
  quantityIssued: number;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [quantityToReturn, setQuantityToReturn] =
    useState<number>(quantityIssued);

  const handleSubmit = async () => {
    console.log("transactionId:", transactionId);
    if (quantityToReturn <= 0 || quantityToReturn > quantityIssued) {
      toast.error(
        `Please enter a valid quantity between 1 and ${quantityIssued}.`
      );
      return;
    }
    setIsMarking(true);
    try {
      await markItemAsReturned(transactionId, userUid, quantityToReturn);
      toast.success("Transaction marked as returned.");
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Failed to mark transaction as returned."
      );
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
        Mark Item(s) as Returned
      </Button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-zinc-800">
            <h3 className="text-lg font-bold">Confirm Return</h3>
            <p className="my-2">
              Enter the quantity to be returned. This action cannot be undone.
            </p>
            <Input
              type="number"
              value={quantityToReturn}
              onChange={(e) =>
                setQuantityToReturn(parseInt(e.target.value, 10))
              }
              min={1}
              max={quantityIssued}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isMarking}>
                {isMarking ? (
                  <CircleDotDashed className="h-4 w-4 animate-spin" />
                ) : (
                  `Mark ${quantityToReturn} of ${quantityIssued} as Returned`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnsConfirmationDialog;
