import Cargo from './Cargo';
import DomainEvent from './DomainEvent';
import Ship from './Ship';

export default class LoadEvent extends DomainEvent {
  constructor (public data: Date, public cargo: Cargo, public ship: Ship) {
    super(data);
  }

  public process () {
    this.ship.load(this);
  }
}
