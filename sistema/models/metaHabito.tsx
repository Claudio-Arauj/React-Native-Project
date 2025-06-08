export class MetaHabito {
  id: string;
  usuarioId: string;
  nome: string;
  frequencia: 'diária' | 'semanal';
  lembreteHorario?: string;
  criadoEm: Date;
  cor?: string // <= nova propriedade

  constructor(
    id: string,
    usuarioId: string,
    nome: string,
    frequencia: 'diária' | 'semanal',
    criadoEm: Date,
    lembreteHorario?: string,
    cor?: string // <= nova propriedade
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.nome = nome;
    this.frequencia = frequencia;
    this.criadoEm = criadoEm;
    this.lembreteHorario = lembreteHorario;
    this.cor = cor;
  }

  static fromDb(row: {
    id: string;
    usuario_id: string;
    nome: string;
    frequencia: 'diária' | 'semanal';
    lembrete_horario?: string | null;
    cor?: string | null;
    criado_em: string;
  }): MetaHabito {
    return new MetaHabito(
      row.id,
      row.usuario_id,
      row.nome,
      row.frequencia,
      new Date(row.criado_em),
      row.lembrete_horario ?? undefined,
      row.cor ?? undefined
    );
  }
}
