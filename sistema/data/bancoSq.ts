import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

// Inicializa o banco e preenche as mensagens se estiver vazio
export async function inicializarBanco() {
  db = await SQLite.openDatabaseAsync('meubanco.db');

  // Cria a tabela e insere mensagens caso esteja vazia
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      texto TEXT NOT NULL
    );
  `);

  const countResult = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) as total FROM mensagens'
  );

  if (countResult?.total === 0) {
    const frases = [
      'Acredite em você!',
      'Você é capaz de conquistar grandes coisas.',
      'Cada passo importa.',
      'Nunca é tarde para recomeçar.',
      'Seja constante, não perfeito.',
    ];

    for (const texto of frases) {
      await db.runAsync('INSERT INTO mensagens (texto) VALUES (?)', texto);
    }
  }
}

// Recupera uma mensagem aleatória
export async function buscarMensagemAleatoria(): Promise<string | null> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('meubanco.db');
  }

  const resultado = await db.getFirstAsync<{ texto: string }>(
    'SELECT texto FROM mensagens ORDER BY RANDOM() LIMIT 1'
  );

  return resultado?.texto ?? null;
}
