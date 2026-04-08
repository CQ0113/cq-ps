import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/config";

function withTimestamps(payload, includeCreatedAt = false) {
  return {
    ...payload,
    updatedAt: serverTimestamp(),
    ...(includeCreatedAt ? { createdAt: serverTimestamp() } : {})
  };
}

export function subscribeToCollection(collectionName, onData, onError) {
  const collectionRef = collection(db, collectionName);

  return onSnapshot(
    collectionRef,
    (snapshot) => {
      const records = snapshot.docs.map((record) => ({
        id: record.id,
        ...record.data()
      }));
      onData(records);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    }
  );
}

export async function addCollectionItem(collectionName, payload) {
  const collectionRef = collection(db, collectionName);
  return addDoc(collectionRef, withTimestamps(payload, true));
}

export async function updateCollectionItem(collectionName, id, payload) {
  const docRef = doc(db, collectionName, id);
  return updateDoc(docRef, withTimestamps(payload));
}

export async function deleteCollectionItem(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  return deleteDoc(docRef);
}
