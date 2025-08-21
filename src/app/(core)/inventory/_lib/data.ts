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
    const itemsCollectionRef = collection(db, "items");
    const itemsSnapshot = await getDocs(itemsCollectionRef);
    const items: Item[] = itemsSnapshot.docs.map((doc) => {
      const docData = doc.data();

      // Handle barcode conversion, ensuring it's a number and not NaN.
      // We use radix 10 to ensure it's parsed as a decimal number.

      const barcodeValue = docData.barCode.toString();
      // console.log("barcode for each entry", barcodeValue);

      // if (typeof barcodeValue === "string") {
      //   barcodeValue = parseInt(barcodeValue, 10);
      // }
      // if (typeof barcodeValue !== "number" || isNaN(barcodeValue)) {
      //   barcodeValue = 0; // Default to 0 if invalid.
      // }

      // // Safely convert Firestore Timestamp to a Date object or null.
      // let dateOfPurchase: string | null = "N/A";
      // if (docData.dateOfPurchase instanceof Timestamp) {
      //   dateOfPurchase = docData.dateOfPurchase.toDate().toISOString();
      // }

      return {
        id: doc.id,
        barcode: barcodeValue,
        serialNumber: docData.serialNumber || "N/A",
        cluster: docData.cluster,
        name: docData.itemName,
        quantity: docData.quantity,
        categoryId: docData.category,
        itemCondition: docData.itemCondition,
        currentTimestamp: docData.currentTimestamp,
        dateOfPurchase: docData.dateOfPurchase,
        productCode: docData.productCode || "",
      } as Item;
    });

    return items;
  } catch (error) {
    console.error("Failed to fetch inventory data:", error);
    return [];
  }
}
