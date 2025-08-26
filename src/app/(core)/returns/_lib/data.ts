import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Returns } from "../_definitions/columns";
import { da } from "date-fns/locale";

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

    const userMap = new Map<string, any>();
    usersSnapshot.docs.forEach((doc) => {
      userMap.set(doc.id, doc.data());
    });

    const returns: Returns[] = returnsSnapshot.docs.map((doc) => {
      const docData = doc.data();

      const userId = docData.userId || "N/A";
      const user = userMap.get(userId);
      const userEmail = user ? user.email : "N/A";

      let stockInAt: string | null = "N/A";
      if (docData.stockInAt instanceof Timestamp) {
        stockInAt = docData.stockInAt.toDate().toISOString();
      }

      let stockOutAt: string | null = "N/A";
      if (docData.stockOutAt instanceof Timestamp) {
        stockOutAt = docData.stockOutAt.toDate().toISOString();
      }

      let returnedAt: string | null = "N/A";
      if (docData.returnedAt instanceof Timestamp) {
        returnedAt = docData.returnedAt.toDate().toISOString();
      }

      console.log("Return Document:", docData);
      return {
        id: doc.id,
        itemId: docData.itemId || "N/A",
        userEmail: userEmail,
        itemName: docData.itemName || "N/A",
        stockInAt: docData.stockInAt || "N/A",
        stockOutAt: docData.stockOutAt || "N/A",
        returnedAt: docData.returnedAt || "N/A",
        quantity: docData.quantity || 0,
        remaining: docData.remaining || 0,
        barcode: docData.barcode || "N/A",
        productCode: docData.productCode || "N/A",
        serialNumber: docData.serialNumber || "N/A",
        cluster: docData.cluster || "N/A",
        category: docData.category || "N/A",
        itemCondition: docData.itemCondition || "N/A",
        recipientName: docData.recipientName || "N/A",
      } as Returns;
    });

    return returns;
  } catch (error) {
    console.error("Failed to fetch returns data:", error);
    return [];
  }
}
