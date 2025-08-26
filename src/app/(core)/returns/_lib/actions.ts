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
  returnId: string,
  userId: string,
  quantity: number
) {
  const returnRef = doc(db, "transactions", returnId);

  await runTransaction(db, async (transaction) => {
    const returnDoc = await transaction.get(returnRef);
    if (!returnDoc.exists()) {
      throw new Error("Return record does not exist!");
    }

    // Get the item ID from the return record to update the main inventory.
    const itemId = returnDoc.data().itemId;
    const itemRef = doc(db, "items", itemId);
    const itemDoc = await transaction.get(itemRef);

    if (!itemDoc.exists()) {
      throw new Error("Associated item does not exist!");
    }

    const currentReturnedQuantity = returnDoc.data().returnedQuantity || 0;
    const newReturnedQuantity = currentReturnedQuantity + quantity;

    const originalStockedOutQuantity = returnDoc.data().quantity;
    if (newReturnedQuantity > originalStockedOutQuantity) {
      throw new Error("Returned quantity exceeds stocked out quantity!");
    }

    // 1. Update the return record with the returned quantity and timestamp.
    transaction.update(returnRef, {
      returnedAt: Timestamp.fromDate(new Date()),
      returnedQuantity: newReturnedQuantity,
    });

    // 2. Update the item's quantity in the main inventory.
    const newInventoryQuantity = (itemDoc.data().quantity || 0) + quantity;
    transaction.update(itemRef, { quantity: newInventoryQuantity });

    // 3. Create a transaction record for the return event.
    const transactionsCollectionRef = collection(db, "transactions");
    const transactionData = {
      itemId: itemRef.id,
      userId: userId,
      itemName: itemDoc.data().itemName,
      quantity: quantity,
      remaining: newInventoryQuantity,
      type: "stock-in",
      returnedAt: Timestamp.fromDate(new Date()),
    };
    const newTransactionRef = doc(transactionsCollectionRef);
    transaction.set(newTransactionRef, transactionData);
  });

  revalidatePath("/inventory");
  revalidatePath("/returns");
  revalidatePath("/transactions");
}
