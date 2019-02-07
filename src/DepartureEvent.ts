import DomainEvent from './DomainEvent';
import Port from './Port';
import Ship from './Ship';

export default class DepartureEvent extends DomainEvent {
  public priorPort: Port | null = null;

  constructor (public data: Date, public port: Port, public ship: Ship) {
    super(data);
  }

  public process () {
    this.ship.handleDeparture(this);
  }

  public reverse () {
    this.ship.reverseDeparture(this);
  }
}
