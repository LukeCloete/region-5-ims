import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Returns } from "../_definitions/columns";

/**
 * Fetches all returns from the 'returns' Firestore collection.
 * This function is designed to provide the data required for the inventory table.
 *
 * @returns {Promise<Returns[]>} A promise that resolves to an array of Returns objects.
 */
export async function getAllReturns(): Promise<Returns[]> {
  console.log("Fetching all returns from Firestore...");
  try {
    const transactionsCollectionRef = collection(db, "transactions");
    const returnsQuery = query(
      transactionsCollectionRef,
      where("returnedAt", "!=", null)
    );
    const returnsSnapshot = await getDocs(returnsQuery);

    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userMap = new Map<string, any>();
    usersSnapshot.docs.forEach((doc) => {
      userMap.set(doc.id, doc.data());
    });

    const returns: Returns[] = returnsSnapshot.docs.map((doc) => {
      const docData = doc.data();

      const userId = docData.userId || "N/A";
      const user = userMap.get(userId);
      const userEmail = user ? user.email : "N/A";

      let stockInAt: Timestamp | null = null;
      if (docData.date instanceof Timestamp) {
        stockInAt = docData.date;
      } else {
        stockInAt = null;
      }

      let stockOutAt: Timestamp | null = null;
      if (docData.date instanceof Timestamp) {
        stockOutAt = docData.currentTimestamp;
      } else {
        stockInAt = null;
      }
      let returnedAt: Timestamp | null = null;
      if (docData.returnedAt instanceof Timestamp) {
        returnedAt = docData.returnedAt;
      } else {
        returnedAt = null;
      }

      return {
        id: doc.id,
        itemId: docData.itemId || "N/A",
        userEmail: userEmail,
        itemName: docData.itemName || "N/A",
        stockInAt: stockInAt,
        stockOutAt: stockOutAt,
        returnedAt: returnedAt,
        quantity: docData.returnedQuantity || 0,
        remaining: docData.remaining || 0,
        barcode: docData.barcode || "N/A",
        productCode: docData.productCode || "N/A",
        serialNumber: docData.serialNumber || "N/A",
        cluster: docData.cluster || "N/A",
        category: docData.category || "N/A",
        itemCondition: docData.itemCondition || "N/A",
        recipientName: docData.recipientName || "N/A",
        recipientPhoneNumber: docData.recipientPhoneNumber || "N/A",
      } as Returns;
    });

    return returns;
  } catch (error) {
    console.error("Failed to fetch returns data:", error);
    return [];
  }
}
