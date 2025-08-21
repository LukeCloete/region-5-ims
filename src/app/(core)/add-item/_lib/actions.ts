// every action EXCEPT reading
"use server";

// Okay I create a function to enter an item into the database
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function addItem(formData: FormData) {
  const rawFormData = {
    barcode: formData.get("barcode"),
    serialNumber: formData.get("serial-number"),
    cluster: formData.get("cluster"),
    category: formData.get("category"),
    itemName: formData.get("item-name"),
    quantity: formData.get("quantity"),
    itemCondition: formData.get("item-condition"),
    dateOfPurchase: formData.get("date-of-purchase"),
  };

  // Convert match_date to Timestamp
  // const dateOfPurchaseAsTimestamp = rawFormData.dateOfPurchase
  //   ? Timestamp.fromDate(new Date(rawFormData.dateOfPurchase.toString()))
  //   : null;

  const barcodeAsNumber = Number(rawFormData.barcode);

  const currentTimestampFromSA = serverTimestamp();
  console.log("Current Timestamp:", currentTimestampFromSA);
  const itemData = {
    barCode: barcodeAsNumber,
    serialNumber: rawFormData.serialNumber,
    cluster: rawFormData.cluster,
    category: rawFormData.category,
    itemName: rawFormData.itemName,
    quantity: rawFormData.quantity,
    itemCondition: rawFormData.itemCondition,
    dateOfPurchase: rawFormData.dateOfPurchase,
    currentTimestamp: currentTimestampFromSA,
  };

  await addDoc(collection(db, "items"), itemData);

  // import { doc, setDoc, serverTimestamp } from "firebase/firestore";

  // // The below is how to get all data of items from the database
  // const docRef = doc(db, "items", "M9OG7VZMXC4rByaAE9Ye");
  // const docSnap = await getDoc(docRef);
  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // docSnap.data() will be undefined in this case
  //   console.log("No such document!");
  // }
}
