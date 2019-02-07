import DomainEvent from './DomainEvent';
import Port from './Port';
import Ship from './Ship';

export default class DepartureEvent extends DomainEvent {
  constructor (public data: Date, public port: Port, public ship: Ship) {
    super(data);
  }

  public process () {
    this.ship.departure(this);
  }
}
