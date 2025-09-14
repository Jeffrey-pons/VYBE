import { db } from '@/config/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc, collection, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';

type FavoriteIdDoc = {
  agendaId: string;
  eventId: string;
  createdAt?: Timestamp;
};

const favRef = (uid: string, eventKey: string) =>
  doc(db, 'users', uid, 'favoriteEvents', eventKey);

export async function addFavoriteId(uid: string, agendaId: string, eventId: string) {
  const eventKey = `${agendaId}_${eventId}`;
  await setDoc(
    favRef(uid, eventKey),
    { agendaId, eventId, createdAt: serverTimestamp() },
    { merge: true }
  );
}

export async function removeFavoriteId(uid: string, agendaId: string, eventId: string) {
  const eventKey = `${agendaId}_${eventId}`;
  await deleteDoc(favRef(uid, eventKey));
}

export async function isFavoritedId(uid: string, agendaId: string, eventId: string) {
  const eventKey = `${agendaId}_${eventId}`;
  const snap = await getDoc(favRef(uid, eventKey));
  return snap.exists();
}

export function listenFavoriteIds(
  uid: string,
  cb: (items: { agendaId: string; eventId: string; eventKey: string }[]) => void
) {
  const q = query(
    collection(db, 'users', uid, 'favoriteEvents'),
    orderBy('createdAt', 'desc') // tri du dernier liké au premier
  );

  return onSnapshot(q, (qs) => {
    cb(
      qs.docs.map((d) => {
        const data = d.data() as FavoriteIdDoc;
        return { eventKey: d.id, agendaId: data.agendaId, eventId: data.eventId };
      })
    );
  });
}
