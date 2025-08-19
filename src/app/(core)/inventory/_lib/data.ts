import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item } from "../_definitions/columns";

/**
 * Fetches all items from the 'items' Firestore collection.
 * This function is designed to provide the data required for the inventory table.
 *
 * @returns {Promise<Item[]>} A promise that resolves to an array of Item objects.
 */
export async function getAllItems(): Promise<Item[]> {
  try {
    // Get a reference to the 'items' collection.
    const itemsCollectionRef = collection(db, "items");

    // Fetch all documents from the collection.
    const itemsSnapshot = await getDocs(itemsCollectionRef);

    // Map the documents to the Item interface.
    const items: Item[] = itemsSnapshot.docs.map((doc) => {
      const docData = doc.data();

      // Ensure that the barcode is a number and convert the Firestore Timestamp
      // to a JavaScript Date object.
      return {
        id: doc.id,
        barcode:
          typeof docData.barcode === "number"
            ? docData.barcode
            : parseInt(docData.barcode, 13),
        serialNumber: docData.serialNumber,
        cluster: docData.cluster,
        name: docData.name,
        quantity: docData.quantity,
        categoryId: docData.categoryId,
        description: docData.description,
        dateOfPurchase: docData.dateOfPurchase || "",
      } as Item; // Cast to Item to satisfy the return type
    });

    return items;
  } catch (error) {
    console.error("Failed to fetch inventory data:", error);
    // Return an empty array on failure to prevent app crashes.
    return [];
  }
}
