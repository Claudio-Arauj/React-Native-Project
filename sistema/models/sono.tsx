export class Sono {
  constructor(
    public id: string,
    public userId: string,
    public horarioDormir: string,
    public notificacoesAtivas: boolean,
    public criadoEm: Date = new Date()
  ) {}
}
