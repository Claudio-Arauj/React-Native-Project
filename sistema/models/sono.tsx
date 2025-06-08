export class Sono {
  id: string;
  usuarioId: string;
  horarioDormir: string;       // TIME geralmente como string "HH:MM:SS"
  notificacoesAtivas: boolean;

  constructor(
    id: string,
    usuarioId: string,
    horarioDormir: string,
    notificacoesAtivas: boolean = true
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.horarioDormir = horarioDormir;
    this.notificacoesAtivas = notificacoesAtivas;
  }
}
