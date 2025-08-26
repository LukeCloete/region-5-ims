"use server";

import { db } from "@/lib/firebase";
import { collection, doc, runTransaction, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

/**
 * Handles the return of a stocked-out item. It updates the 'returns' record
 * and adds the returned quantity back to the main 'items' collection.
 *
 * @param {string} returnId The ID of the record in the 'returns' collection.
 * @param {string} userId The ID of the user performing the action.
 * @param {number} quantity The quantity of items being returned.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function markItemAsReturned(
  transactionId: string,
  userId: string,
  quantityToReturn: number
) {
  const transactionRef = doc(db, "transactions", transactionId);

  await runTransaction(db, async (transaction) => {
    // 1. Get the original stocked-out transaction document.
    const transactionDoc = await transaction.get(transactionRef);
    if (!transactionDoc.exists()) {
      throw new Error("Transaction record does not exist!");
    }

    // 2. Get the associated item from the 'items' collection.
    const itemId = transactionDoc.data().itemId;
    const itemRef = doc(db, "items", itemId);
    const itemDoc = await transaction.get(itemRef);

    if (!itemDoc.exists()) {
      throw new Error("Associated item does not exist!");
    }

    const currentQuantityInTransaction = transactionDoc.data().quantity;
    const newQuantityInTransaction =
      currentQuantityInTransaction - quantityToReturn;

    const remainingStockQuantity = transactionDoc.data().remaining;
    const newRemainingQuantity = remainingStockQuantity + quantityToReturn;

    // Check if the returned quantity exceeds the original stocked-out quantity.

    if (quantityToReturn > currentQuantityInTransaction) {
      throw new Error("Returned quantity exceeds stock-out quantity");
    }

    // Determine the new type and status of the transaction.
    let newType = "stock-out";
    if (newQuantityInTransaction < 1) {
      newType = "stock-in";
    }

    console.log("newType is", newType);
    console.log("new quantity is", newQuantityInTransaction);

    // 1. Update the original transaction document with the returned details.
    transaction.update(transactionRef, {
      type: newType,
      returnedAt: Timestamp.fromDate(new Date()),
      returnedBy: userId,
      returnedQuantity: quantityToReturn,
      remaining: newRemainingQuantity,
      quantity: newQuantityInTransaction,
    });

    // 2. Update the item's quantity in the main inventory.
    transaction.update(itemRef, { quantity: newRemainingQuantity });
  });

  revalidatePath("/inventory");
  revalidatePath("/returns");
  revalidatePath("/transactions");
}
