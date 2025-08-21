// every action EXCEPT reading
"use server";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addItem(formData: FormData) {
  const rawFormData = {
    barcode: formData.get("barcode"),
    serialNumber: formData.get("serial-number"),
    cluster: formData.get("cluster"),
    category: formData.get("category"),
    itemName: formData.get("item-name"),
    quantity: formData.get("quantity"),
    itemCondition: formData.get("item-condition"),
    productCode: formData.get("productCode"),
    userId: formData.get("userId"),
  };

  const barcodeAsNumber = Number(rawFormData.barcode);

  const currentTimestampFromSA = serverTimestamp();

  const itemData = {
    barCode: barcodeAsNumber,
    serialNumber: rawFormData.serialNumber,
    cluster: rawFormData.cluster,
    category: rawFormData.category,
    itemName: rawFormData.itemName,
    quantity: rawFormData.quantity,
    itemCondition: rawFormData.itemCondition,
    currentTimestamp: currentTimestampFromSA,
    productCode: rawFormData.productCode,
    userId: rawFormData.userId,
  };

  const newItemRef = await addDoc(collection(db, "items"), itemData);

  const transactionData = {
    itemId: newItemRef.id,
    type: "stock-in",
    userId: itemData.userId,
    serialNumber: itemData.serialNumber,
    cluster: itemData.cluster,
    category: itemData.category,
    itemName: itemData.itemName,
    quantity: itemData.quantity,
    itemCondition: itemData.itemCondition,
    currentTimestamp: currentTimestampFromSA,
    productCode: itemData.productCode,
  };
  await addDoc(collection(db, "transactions"), transactionData);

  revalidatePath("/inventory");
  redirect("/inventory");

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
