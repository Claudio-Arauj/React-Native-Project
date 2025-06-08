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
}
