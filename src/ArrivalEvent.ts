import DomainEvent from './DomainEvent';
import Port from './Port';
import Ship from './Ship';

export default class ArrivalEvent extends DomainEvent {
  priorPort: Port | null = null;
  priorIsHasBeenInCanada: { [key: string]: boolean } = {};

  constructor (public data: Date, public port: Port, public ship: Ship) {
    super(data);
  }

  public process () {
    this.ship.handleArrival(this);
  }

  public reverse () {
    this.ship.reverseArrival(this);
  }
}
