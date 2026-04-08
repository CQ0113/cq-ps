import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";

export async function uploadProjectImage(file, userId = "admin") {
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLowerCase();
  const filePath = `projects/${userId}/${Date.now()}-${safeName || `image.${extension}`}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg"
  });

  return getDownloadURL(storageRef);
}

export async function uploadPersonalAvatar(file, userId = "admin") {
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLowerCase();
  const filePath = `personal/${userId}/${Date.now()}-${safeName || `avatar.${extension}`}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg"
  });

  return getDownloadURL(storageRef);
}

export async function uploadProjectImages(files, userId = "admin") {
  if (!files || files.length === 0) return [];

  const uploadPromises = Array.from(files).map((file) =>
    uploadProjectImage(file, userId)
  );

  return Promise.all(uploadPromises);
}
