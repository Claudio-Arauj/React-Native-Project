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

  static fromDb(row: {
    id: string;
    usuario_id: string;
    horario_dormir: string;
    notificacoes_ativas?: boolean | null;
  }): Sono {
    return new Sono(
      row.id,
      row.usuario_id,
      row.horario_dormir,
      row.notificacoes_ativas ?? true
    );
  }
}
