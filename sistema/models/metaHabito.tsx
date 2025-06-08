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
}
