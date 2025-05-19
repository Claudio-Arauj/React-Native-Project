export class Usuario {
  id: string;             // UUID ou SERIAL vindo do banco
  nome: string;           // VARCHAR(100)
  email: string;          // VARCHAR(100), único
  senhaHash: string;      // TEXT
  criadoEm: Date;         // TIMESTAMP, default NOW()
  atualizadoEm?: Date;    // TIMESTAMP, pode ser nulo

  constructor(
    id: string,
    nome: string,
    email: string,
    senhaHash: string,
    criadoEm: Date,
    atualizadoEm?: Date
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senhaHash = senhaHash;
    this.criadoEm = criadoEm;
    this.atualizadoEm = atualizadoEm;
  }

  // Exemplo de método estático para criar a partir de um objeto vindo do banco
  static fromDb(row: {
    id: string;
    nome: string;
    email: string;
    senha_hash: string;
    criado_em: string;
    atualizado_em: string | null;
  }): Usuario {
    return new Usuario(
      row.id,
      row.nome,
      row.email,
      row.senha_hash,
      new Date(row.criado_em),
      row.atualizado_em ? new Date(row.atualizado_em) : undefined
    );
  }
}
