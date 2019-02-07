export default class DomainEvent {
  public id: string = require('uuid/v4')();
  private recorded: Date;

  constructor (private occurred: Date) {
    this.recorded = new Date();
  }

  public process () {
  }

  public reverse () {
  }
}
