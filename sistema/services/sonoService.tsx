import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import app from '../firebase-config';
import { Sono } from '../models/sono';

const db = getFirestore(app);

export const adicionarSono = async (userId: string, sono: Omit<Sono, 'id'>) => {
  const docRef = await addDoc(collection(db, `usuarios/${userId}/sonos`), {
    ...sono,
    criadoEm: new Date(),
  });
  return docRef.id;
};

export const observarSonos = (
  userId: string,
  callback: (dados: Sono[]) => void
) => {
  const q = query(collection(db, `usuarios/${userId}/sonos`), orderBy('criadoEm', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const dados: Sono[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Sono(
        doc.id,
        userId,
        data.horarioDormir,
        data.notificacoesAtivas,
        data.criadoEm?.toDate()
      );
    });
    callback(dados);
  });
};
