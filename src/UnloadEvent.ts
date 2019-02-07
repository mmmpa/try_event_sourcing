import Cargo from './Cargo';
import DomainEvent from './DomainEvent';
import Ship from './Ship';

export default class UnloadEvent extends DomainEvent {
  constructor (public data: Date, public cargo: Cargo, public ship: Ship) {
    super(data);
  }

  public process () {
    this.ship.unload(this);
  }
}
