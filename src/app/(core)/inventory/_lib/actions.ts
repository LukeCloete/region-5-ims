"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";

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
  recipientName: string,
  recipientPhoneNumber: number,
  cluster: string
) {
  const itemRef = doc(db, "items", itemId);
  const transactionsCollectionRef = collection(db, "transactions");

  await runTransaction(db, async (transaction) => {
    const itemDoc = await transaction.get(itemRef);
    console.log("Item Document:", itemDoc.data());

    if (!itemDoc.exists()) {
      throw new Error("Item does not exist!");
    }

    const newQuantity = itemDoc.data().quantity - quantity;

    if (newQuantity < 0) {
      throw new Error("Not enough quantity in stock!");
    }

    // Update the item's quantity.
    transaction.update(itemRef, { quantity: newQuantity });

    const currentTimestampFromSA = serverTimestamp();

    // Create a new transaction record.
    const transactionData = {
      barcode: itemDoc.data().barCode,
      itemName: itemDoc.data().itemName,
      category: itemDoc.data().category,
      serialNumber: itemDoc.data().serialNumber,
      itemId: itemRef.id,
      quantity: quantity,
      remaining: newQuantity,
      recipientName: recipientName,
      recipientPhoneNumber: recipientPhoneNumber,
      cluster: cluster,
      type: "stock-out",
      userId: userId,
      date: Timestamp.fromDate(new Date()),
      currentTimestamp: currentTimestampFromSA,
    };
    await addDoc(transactionsCollectionRef, transactionData);
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

// Define a Zod schema for validation.
const updateItemSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  barcode: z.coerce
    .number()
    .min(1, "Barcode is required and must be a number."),
  serialNumber: z.string().min(1, "Serial number is required."),
  cluster: z.string().min(1, "Cluster is required."),
  quantity: z.coerce.number().min(0, "Quantity must be a non-negative number."),
  categoryId: z.string().min(1, "Category is required."),
  description: z.string().optional(),
});

/**
 * Updates an existing inventory item in the 'items' Firestore collection.
 * This is a server action that handles form submission and data persistence.
 *
 * @param {string} id The document ID of the item to update.
 * @param {FormData} formData The form data containing the updated item details.
 * @returns {Promise<void>} A promise that resolves when the item is updated.
 */
export async function updateItem(id: string, formData: FormData) {
  try {
    // Convert FormData to a plain JavaScript object.
    const data = Object.fromEntries(formData.entries());

    // Validate the data against the schema.
    const validatedData = updateItemSchema.parse(data);

    // Get a reference to the specific item document.
    const itemDocRef = doc(db, "items", id);

    // Update the document with the validated data.
    // This will only update the fields that are provided.
    await updateDoc(itemDocRef, validatedData);
  } catch (error) {
    // Handle validation errors or Firestore errors.
    console.error("Failed to update item:", getErrorMessage(error));
    // Optionally, you can throw the error or return a status.
    throw new Error("Failed to update item.");
  }

  // Revalidate the cache for the inventory page to reflect the changes.
  revalidatePath("/dashboard/inventory");

  // Redirect the user back to the inventory page.
  redirect("/dashboard/inventory");
}

export async function deleteItem(id: string) {
  try {
    await deleteDoc(doc(db, "items", id));
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}
