import DomainEvent from './DomainEvent';

export class EventProcessor {
  public isActive: boolean = false;

  constructor (public log: DomainEvent[] = []) {
  }

  public process (e: DomainEvent): void {
    this.isActive = true;
    e.process();
    this.isActive = false;
    this.log.push(e);
  }


  public reverse (): void {
    const e = this.log.pop();
    e && e.reverse();
  }
}
