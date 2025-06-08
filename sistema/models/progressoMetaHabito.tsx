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
}
