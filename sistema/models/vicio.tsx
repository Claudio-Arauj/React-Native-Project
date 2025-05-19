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

  static fromDb(row: {
    id: string;
    usuario_id: string;
    nome: string;
    gasto?: string | null;
    periodo: 'diário' | 'semanal' | 'mensal';
    data_inicio: string;
  }): Vicio {
    return new Vicio(
      row.id,
      row.usuario_id,
      row.nome,
      row.periodo,
      new Date(row.data_inicio),
      row.gasto ? parseFloat(row.gasto) : undefined
    );
  }
}
