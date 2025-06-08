export class Vicio {
  id: string;
  usuarioId: string;
  nome: string;
  gasto?: number;
  periodo: 'diário' | 'semanal' | 'mensal';
  dataInicio: Date;

  constructor(
    id: string,
    usuarioId: string,
    nome: string,
    periodo: 'diário' | 'semanal' | 'mensal',
    dataInicio: Date,
    gasto?: number
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.nome = nome;
    this.periodo = periodo;
    this.dataInicio = dataInicio;
    this.gasto = gasto;
  }
}
