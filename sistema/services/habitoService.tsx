import { getFirestore, collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { MetaHabito } from '../models/habito';
import app from '../firebase-config';

const db = getFirestore(app);

export async function adicionarHabito(userId: string, habito: MetaHabito) {
  await addDoc(collection(db, 'usuarios', userId, 'habitos'), habito.toFirestore());
}

export function observarHabitos(userId: string, callback: (dados: MetaHabito[]) => void) {
  const habitosRef = collection(db, 'usuarios', userId, 'habitos');
  const q = query(habitosRef);

  return onSnapshot(q, (snapshot) => {
    const habitos = snapshot.docs.map(doc => MetaHabito.fromFirestore(doc.id, doc.data()));
    callback(habitos);
  });
}
