import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import app from '../firebase-config';
import { VicioSelecionado } from '../models/vicio';

const db = getFirestore(app);

export function observarVicios(userId: string, callback: (dados: VicioSelecionado[]) => void) {
  const viciosRef = collection(db, 'usuarios', userId, 'vicios');
  return onSnapshot(viciosRef, (snapshot) => {
    const dados = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome,
        icon: data.icon,
        cor: data.cor,
        dataInicio: data.dataInicio?.toDate?.() || new Date(),
        descricao: data.descricao || '',
      } as VicioSelecionado;
    });

    callback(dados);
  });
}

export async function adicionarVicio(userId: string, vicio: Omit<VicioSelecionado, 'id'>) {
  const vicioRef = collection(db, 'usuarios', userId, 'vicios');
  await addDoc(vicioRef, {
    ...vicio,
    dataInicio: Timestamp.fromDate(vicio.dataInicio),
  });
}

export async function atualizarDescricao(userId: string, vicioId: string, descricao: string) {
  const vicioRef = doc(db, 'usuarios', userId, 'vicios', vicioId);
  await updateDoc(vicioRef, { descricao });
}

export async function resetarDataInicio(userId: string, vicioId: string) {
  const vicioRef = doc(db, 'usuarios', userId, 'vicios', vicioId);
  await updateDoc(vicioRef, { dataInicio: Timestamp.now() });
}
