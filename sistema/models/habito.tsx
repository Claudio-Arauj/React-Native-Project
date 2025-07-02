export class MetaHabito {
  constructor(
    public id: string,
    public usuarioId: string,
    public nome: string,
    public frequencia: 'diária' | 'semanal',
    public criadoEm: Date,
    public lembreteHorario?: string,
    public cor?: string
  ) {}

  static fromFirestore(id: string, data: any): MetaHabito {
    return new MetaHabito(
      id,
      data.usuarioId,
      data.nome,
      data.frequencia,
      data.criadoEm?.toDate?.() ?? new Date(),
      data.lembreteHorario,
      data.cor
    );
  }

  toFirestore() {
    return {
      usuarioId: this.usuarioId,
      nome: this.nome,
      frequencia: this.frequencia,
      criadoEm: this.criadoEm,
      lembreteHorario: this.lembreteHorario,
      cor: this.cor
    };
  }
}
