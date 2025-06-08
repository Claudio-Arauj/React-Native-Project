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
}
