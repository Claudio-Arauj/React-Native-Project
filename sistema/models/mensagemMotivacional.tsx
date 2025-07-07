export class MensagemMotivacional {
  mensagem: string;
  ativo: boolean;

  constructor(
    mensagem: string,
    ativo: boolean = true
  ) {
    this.mensagem = mensagem;
    this.ativo = ativo;
  }
}

