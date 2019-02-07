import DomainEvent from './DomainEvent';

export class EventProcessor {
  constructor (private log: DomainEvent[] = []) {
  }

  public process (e: DomainEvent): void {
    e.process();
    this.log.push(e);
  }
}
