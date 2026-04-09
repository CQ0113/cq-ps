import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch
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

export async function reorderCollectionItems(collectionName, orderedIds) {
  const batch = writeBatch(db);
  const total = orderedIds.length;

  orderedIds.forEach((id, index) => {
    const docRef = doc(db, collectionName, id);
    batch.update(docRef, {
      order: total - index,
      updatedAt: serverTimestamp()
    });
  });

  return batch.commit();
}
