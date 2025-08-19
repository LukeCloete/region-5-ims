"use server";

import { app, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Marks an item as stocked out by updating its quantity in the 'items' collection
 * and creating a corresponding record in the 'transactions' collection.
 * This operation is performed as a Firestore transaction to ensure data consistency.
 *
 * @param {string} itemId The ID of the item being stocked out.
 * @param {string} userId The ID of the user performing the action.
 * @param {number} quantity The quantity to stock out.
 * @param {string} destination The destination of the dispensed item.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function markItemAsStockOut(
  itemId: string,
  userId: string,
  quantity: number,
  destination: string
) {
  const itemRef = doc(db, "items", itemId);
  const transactionsCollectionRef = collection(db, "transactions");

  await runTransaction(db, async (transaction) => {
    const itemDoc = await transaction.get(itemRef);

    if (!itemDoc.exists()) {
      throw new Error("Item does not exist!");
    }

    const newQuantity = itemDoc.data().quantity - quantity;

    if (newQuantity < 0) {
      throw new Error("Not enough quantity in stock!");
    }

    // Update the item's quantity.
    transaction.update(itemRef, { quantity: newQuantity });

    // Create a new transaction record.
    const transactionData = {
      itemId: itemRef.id,
      quantity: quantity,
      destination: destination,
      type: "stock-out",
      userId: userId,
      date: Timestamp.fromDate(new Date()),
    };
    await addDoc(transactionsCollectionRef, transactionData);
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}
