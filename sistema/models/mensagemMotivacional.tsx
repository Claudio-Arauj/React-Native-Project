export class MensagemMotivacional {
  id: string;
  mensagem: string;
  ativo: boolean;

  constructor(
    id: string,
    mensagem: string,
    ativo: boolean = true
  ) {
    this.id = id;
    this.mensagem = mensagem;
    this.ativo = ativo;
  }

  static fromDb(row: {
    id: string;
    mensagem: string;
    ativo?: boolean | null;
  }): MensagemMotivacional {
    return new MensagemMotivacional(
      row.id,
      row.mensagem,
      row.ativo ?? true
    );
  }
}
