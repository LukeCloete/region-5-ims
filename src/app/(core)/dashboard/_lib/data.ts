import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ExcelJS from "exceljs";
import { getAllItems } from "../../inventory/_lib/data";

export interface Metrics {
  totalInventory: number;
  dailyStockIn: number;
  dailyStockOut: number;
  totalItemsAdded: number;
  totalItemsDispensed: number;
  totalItemsRemaining: number;
  totalItemsReturns: number;
}

export async function getDataForDashboard(): Promise<Metrics[]> {
  const num1 = 1;
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
    // return {
    //   totalInventory: itemsCounter,
    //   // dailyStockIn: dailyStockInCount,
    //   // dailyStockOut: dailyStockOutCount,
    //   totalItemsAdded: stockInInstancesCount,
    //   totalItemsDispensed: stockOutInstancesCount,
    //   totalItemsRemaining: totalRemaining,
    //   totalItemsReturned: num2,
    // };
    return [
      {
        totalInventory: itemsCounter,
        dailyStockIn: num1,
        dailyStockOut: num1,
        totalItemsAdded: stockInInstancesCount,
        totalItemsDispensed: stockOutInstancesCount,
        totalItemsRemaining: totalRemaining,
        totalItemsReturns: num2,
      },
    ] as Metrics[];
    // return itemsCounter as number;
  } catch (error) {
    console.error("Failed to fetch inventory data:", error);
    return [];
  }
}

export async function getDataForReport() {
  const items = await getAllItems();

  // 1. Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();

  // 2. Add a new worksheet to the workbook
  const worksheet = workbook.addWorksheet("My First Sheet");

  // 3. Add headers to the worksheet
  worksheet.columns = [
    { header: "Item Name", key: "name", width: 30 },
    { header: "Item ID", key: "id", width: 30 },
    { header: "Item Serial Number", key: "serialNumber", width: 30 },
    { header: "Quantity", key: "quantity", width: 15 },
    { header: "Category", key: "category", width: 15 },
    { header: "Cluster", key: "cluster", width: 15 },
    { header: "Date of Upload", key: "dateOfUpload", width: 30 },
    { header: "Item Condition", key: "itemCondition", width: 15 },
  ];

  items.map((doc) => {
    // 1. Convert Firestore Timestamp to total milliseconds
    const totalMilliseconds =
      doc.currentTimestamp.seconds * 1000 +
      doc.currentTimestamp.nanoseconds / 1000000;

    // 2. Create a new Date object
    const dateObject = new Date(totalMilliseconds);

    // 3. Format the Date object into a human-readable string (e.g., 15:34 31/08/2025)
    const formatter = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const formattedDate = formatter.format(dateObject);

    worksheet.addRow({
      name: doc.name,
      id: doc.id,
      serialNumber: doc.serialNumber,
      quantity: doc.quantity,
      category: doc.categoryId,
      cluster: doc.cluster,
      dateOfUpload: formattedDate,
      itemCondition: doc.itemCondition,
    });
  });

  // 4. Add some data rows to the worksheet
  // worksheet.addRow({ id: 1, name: "Wireless Keyboard", quantity: 50 });
  // worksheet.addRow({ id: 2, name: "Gaming Mouse", quantity: 25 });
  // worksheet.addRow({ id: 3, name: "HD Monitor", quantity: 10 });
  // worksheet.addRow({ id: 4, name: "Webcam", quantity: 75 });

  // Use the buffering approach to return the data to the client.
  // This is different from the streaming approach used in the API route.
  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;

  // 5. Write the workbook to a buffer
  // This is the correct way to get the file data in a web environment.
  try {
    const buffer = await workbook.xlsx.writeBuffer();

    // In a real web application, you would send this buffer back in an HTTP response.
    // For this demonstration, we'll log its size.

    console.log(
      `Excel file successfully generated in memory as a buffer with a size of ${buffer.byteLength} bytes.`
    );
    console.log(buffer, "This is what the bufffer looks like");
  } catch (error) {
    console.error("Error creating the Excel buffer:", error);
  }
}
