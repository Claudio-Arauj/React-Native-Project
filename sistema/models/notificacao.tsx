export class Notificacao {
  id: string;
  usuarioId: string;
  tipo: string;
  mensagem: string;
  enviadaEm: Date;

  constructor(
    id: string,
    usuarioId: string,
    tipo: string,
    mensagem: string,
    enviadaEm: Date
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.tipo = tipo;
    this.mensagem = mensagem;
    this.enviadaEm = enviadaEm;
  }
}
