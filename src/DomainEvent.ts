export default class DomainEvent {
  private recorded: Date;

  constructor (private occurred: Date) {
    this.recorded = new Date();
  }

  public process () {
  }
}
