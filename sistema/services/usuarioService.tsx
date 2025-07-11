import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Usuario } from '../models/usuario';
import app from '../firebase-config';

const db = getFirestore(app);

export async function buscarUsuario(userId: string): Promise<Usuario | null> {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return new Usuario(
        userSnap.id,
        data.nome,
        data.email,
        data.senhaHash,
        new Date(data.criadoEm),
        data.atualizadoEm ? new Date(data.atualizadoEm) : undefined
      );
    } else {
      console.warn('Usuário não encontrado no Firestore.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return null;
  }
}

