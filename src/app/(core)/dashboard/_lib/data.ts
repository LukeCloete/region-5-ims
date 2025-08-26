import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function getDataForDashboard() {
  const num2 = 2;
  // The below is how to get all data of items from the database

  /* total inventory count */
  try {
    const itemsCollectionRef = collection(db, "items");
    const itemsSnapshot = await getDocs(itemsCollectionRef);

    const transactionsCollection = collection(db, "transactions");
    // const transactionsSnapshot = await getDocs(transactionsCollection);

    /* Total stock in */
    const stockInQuery = query(
      transactionsCollection,
      where("type", "==", "stock-in")
    );
    const stockInSnapshot = await getCountFromServer(stockInQuery);
    const stockInInstancesCount = stockInSnapshot.data().count;

    /* Total stock out */
    const stockOutQuery = query(
      transactionsCollection,
      where("type", "==", "stock-out")
    );
    const stockOutSnapshot = await getCountFromServer(stockOutQuery);
    const stockOutInstancesCount = stockOutSnapshot.data().count;

    let itemsCounter = 0;
    itemsSnapshot.docs.map((doc) => {
      doc.data();
      itemsCounter++;
    });

    // Get the start of the current day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get the start of the next day (end of today)
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    // // 2. Query for daily 'stock-in' transactions
    // const dailyStockInQuery = query(
    //   transactionsCollection,
    //   where("type", "==", "stock-in"),
    //   where("currentTimestamp", ">=", startOfToday), // From the start of today
    //   where("currentTimestamp", "<", startOfTomorrow) // Up to (but not including) the start of tomorrow
    // );
    // const dailyStockInSnapshot = await getCountFromServer(dailyStockInQuery);
    // const dailyStockInCount = dailyStockInSnapshot.data().count;

    // // 3. Query for daily 'stock-out' transactions
    // const dailyStockOutQuery = query(
    //   transactionsCollection,
    //   where("type", "==", "stock-out"),
    //   where("currentTimestamp", ">=", startOfToday),
    //   where("currentTimestamp", "<", startOfTomorrow)
    // );
    // const dailyStockOutSnapshot = await getCountFromServer(dailyStockOutQuery);
    // const dailyStockOutCount = dailyStockOutSnapshot.data().count;

    const totalRemaining = itemsCounter - stockOutInstancesCount;

    // return { itemsCounter, stockInCount };
    return {
      totalInventory: itemsCounter,
      // dailyStockIn: dailyStockInCount,
      // dailyStockOut: dailyStockOutCount,
      totalItemsAdded: stockInInstancesCount,
      totalItemsDispensed: stockOutInstancesCount,
      totalItemsRemaining: totalRemaining,
      totalItemsReturned: num2,
    };
    return itemsCounter as number;
  } catch (error) {
    console.error("Failed to fetch inventory data:", error);
    return console.error("Failed to fetch inventory data:", error);
  }
}
