export class ProgressoMetaHabito {
  id: string;
  goalId: string;
  data: Date;
  concluido: boolean;

  constructor(
    id: string,
    goalId: string,
    data: Date,
    concluido: boolean = false
  ) {
    this.id = id;
    this.goalId = goalId;
    this.data = data;
    this.concluido = concluido;
  }

  static fromDb(row: {
    id: string;
    goal_id: string;
    data: string; // vem como 'YYYY-MM-DD' do banco
    concluido?: boolean;
  }): ProgressoMetaHabito {
    return new ProgressoMetaHabito(
      row.id,
      row.goal_id,
      new Date(row.data),
      row.concluido ?? false
    );
  }
}
