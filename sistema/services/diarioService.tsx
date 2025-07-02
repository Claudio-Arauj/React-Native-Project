// services/diarioService.ts
import app from '../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Diario } from '../models/diario';

const auth = getAuth(app);
const firestore = getFirestore(app);

export async function salvarDiario(diario: Diario): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const diarioRef = doc(firestore, 'usuarios', user.uid, 'diarios', diario.data);
  await setDoc(diarioRef, {
    nota: diario.nota,
    emocao: diario.emocao,
  });
}

export async function buscarDiarios(): Promise<Record<string, Diario>> {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const diariosRef = collection(firestore, 'usuarios', user.uid, 'diarios');
  const querySnapshot = await getDocs(diariosRef);

  const diarios: Record<string, Diario> = {};
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.id;
    const docData = docSnap.data();
    diarios[data] = {
      data,
      nota: docData.nota,
      emocao: docData.emocao,
    };
  });

  return diarios;
}

export async function buscarDiarioPorData(data: string): Promise<Diario | null> {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const diarioRef = doc(firestore, 'usuarios', user.uid, 'diarios', data);
  const docSnap = await getDoc(diarioRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();
    return {
      data,
      nota: docData.nota,
      emocao: docData.emocao,
    };
  } else {
    return null;
  }
}
