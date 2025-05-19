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

  static fromDb(row: {
    id: string;
    usuario_id: string;
    tipo: string;
    mensagem: string;
    enviada_em: string;
  }): Notificacao {
    return new Notificacao(
      row.id,
      row.usuario_id,
      row.tipo,
      row.mensagem,
      new Date(row.enviada_em)
    );
  }
}
