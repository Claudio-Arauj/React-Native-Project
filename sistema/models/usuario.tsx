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
}
