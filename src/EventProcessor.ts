import DomainEvent from './DomainEvent';

export default class EventProcessor {
  public isActive: boolean = false;
  private log: DomainEvent[] = [];
  private reversed: DomainEvent[] = [];

  constructor () {
  }

  public process (e: DomainEvent): void {
    this.isActive = true;
    this.log.push(e);
    e.process();
    this.isActive = false;
  }

  public reverse (): void {
    const e = this.log.pop();

    if (e) {
      e.reverse();
      this.reversed.push(e);
    }
  }

  public replay (): void {
    const e = this.reversed.pop();

    if (e) {
      this.log.push(e);
      e.process();
    }
  }

  get currentEvent () {
    return this.log[this.log.length - 1];
  }
}
