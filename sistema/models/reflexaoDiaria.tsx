export class ReflexaoDiaria {
  id: string;
  usuarioId: string;
  data: Date;
  texto?: string;
  sentimento: number;

  constructor(
    id: string,
    usuarioId: string,
    data: Date,
    sentimento: number,
    texto?: string
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.data = data;
    this.sentimento = sentimento;
    this.texto = texto;
  }

  static fromDb(row: {
    id: string;
    usuario_id: string;
    data: string;
    texto?: string | null;
    sentimento: number;
  }): ReflexaoDiaria {
    return new ReflexaoDiaria(
      row.id,
      row.usuario_id,
      new Date(row.data),
      row.sentimento,
      row.texto ?? undefined
    );
  }
}
