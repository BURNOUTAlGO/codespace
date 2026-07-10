import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const ROOM_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

export async function cleanupExpiredRooms() {
  try {
    const roomsSnap = await getDocs(collection(db, "rooms"));

    const now = Date.now();

    for (const room of roomsSnap.docs) {
      const data = room.data();

      // Room doesn't have lastActiveAt
      if (!data.lastActiveAt) continue;

      const lastActive = data.lastActiveAt.toDate().getTime();

      // Room is still active
      if (now - lastActive < ROOM_EXPIRY_MS) continue;

      // Check active users
      const presenceSnap = await getDocs(
        collection(db, "rooms", room.id, "presence")
      );

      // Someone is still inside
      if (!presenceSnap.empty) continue;

      console.log("Deleting expired room:", room.id);

      // Delete files
      const filesSnap = await getDocs(
        collection(db, "rooms", room.id, "files")
      );

      for (const file of filesSnap.docs) {
        await deleteDoc(file.ref);
      }

      // Delete stale presence docs
      for (const p of presenceSnap.docs) {
        await deleteDoc(p.ref);
      }

      // Delete room document
      await deleteDoc(doc(db, "rooms", room.id));

      console.log("Room deleted:", room.id);
    }
  } catch (err) {
    console.error("Room cleanup failed:", err);
  }
}