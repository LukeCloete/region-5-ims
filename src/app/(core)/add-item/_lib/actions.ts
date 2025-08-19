// every action EXCEPT reading
"use server";

// Okay I create a function to enter an item into the database
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

export async function addItem(formData: FormData) {
  const rawFormData = {
    barcode: formData.get("barcode"),
    serialNumber: formData.get("serial-number"),
    cluster: formData.get("cluster"),
    category: formData.get("category"),
    itemName: formData.get("item-name"),
    quantity: formData.get("quantity"),
    description: formData.get("description"),
    dateOfPurchase: formData.get("date-of-purchase"),
  };

  const itemData = {
    barCode: rawFormData.barcode,
    serialNumber: rawFormData.serialNumber,
    cluster: rawFormData.cluster,
    category: rawFormData.category,
    itemName: rawFormData.itemName,
    quantity: rawFormData.quantity,
    description: rawFormData.description,
    dateOfPurchase: rawFormData.dateOfPurchase,
  };

  console.log("Raw Form Data:", rawFormData);
  await addDoc(collection(db, "items"), itemData);

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

/* Maybe

    1.first find the document ID of the currently signed in user,
    2. use that as the third argument in the 'doc' function, instead of hardcoding it like i am doing rn.
*/
export async function getCurrentUserDetails() {
  const docRef = doc(db, "users", "tgqiJjA2znXIbdSivKuE8SSZdFf1");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    console.log("email:", docSnap.data().email);
    console.log("name:", docSnap.data().name);
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
  return docSnap.data();
}
