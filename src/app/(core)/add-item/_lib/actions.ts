// every action EXCEPT reading
"use server";

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
    productCode: formData.get("productCode"),
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
  };

  await addDoc(collection(db, "items"), itemData);
}
