import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../firebase-config';

const db = getFirestore(app);

export async function buscarMensagensMotivacionais(): Promise<string[]> {
  const mensagens: string[] = [];
  try {
    // Buscar apenas as mensagens ativas (ativo == true)
    const q = query(collection(db, 'mensagens_motivacionais'), where('ativo', '==', true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.mensagem) {
        mensagens.push(data.mensagem);
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens motivacionais:', error);
  }
  return mensagens;
}
