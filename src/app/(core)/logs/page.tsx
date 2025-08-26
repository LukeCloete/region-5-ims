// import { collection, getDocs, Timestamp } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { Transaction } from "../transactions/_definitions/columns";

// /**
//  * Fetches all transactions from the 'transactions' Firestore collection.
//  * This function is designed to provide data for a transactions log or table.
//  *
//  * @returns {Promise<Transaction[]>} A promise that resolves to an array of Transaction objects.
//  */
// export async function getAllTransactions(): Promise<Transaction[]> {
//   try {
//     // Get a reference to the 'transactions' collection.
//     const transactionsCollectionRef = collection(db, "transactions");

//     // Fetch all documents from the collection.
//     const transactionsSnapshot = await getDocs(transactionsCollectionRef);

//     // Map the documents to the Transaction interface, handling data types.
//     const transactions: Transaction[] = transactionsSnapshot.docs.map((doc) => {
//       const docData = doc.data();

//       // Safely convert Firestore Timestamp to a serializable ISO string for 'date'.
//       let transactionDate: string | null = null;
//       if (docData.date instanceof Timestamp) {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         transactionDate = docData.date.toDate().toLocaleDateString();
//       }

//       // Safely convert the 'dateOfPurchase' field if it exists and is a Timestamp.
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       let dateOfPurchase: string | null = "N/A";
//       if (docData.dateOfPurchase instanceof Timestamp) {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         dateOfPurchase = docData.dateOfPurchase.toDate().toISOString();
//       }

//       return {
//         id: doc.id,
//         itemId: docData.itemId || "N/A",
//         quantity: docData.quantity || 0,
//         source: docData.source || "N/A",
//         barcode: docData.barcode || "N/A",
//         recipientName: docData.recipientName || "N/A",
//         type: docData.type || "N/A",
//         userId: docData.userId || "N/A",
//         date: docData.date,
//         cluster: docData.cluster || "N/A",
//         category: docData.category || "N/A",
//         serialNumber: docData.serialNumber || "N/A",
//         dateOfPurchase: docData.dateOfPurchase,
//         itemName: docData.itemName || "N/A",
//         remaining: docData.remaining ?? 0,
//       };
//     });

//     return transactions;
//   } catch (error) {
//     console.error("Failed to fetch transactions data:", error);
//     return [];
//   }
// }
