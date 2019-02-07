import Cargo from './Cargo';
import DomainEvent from './DomainEvent';
import Ship from './Ship';

export default class UnloadEvent extends DomainEvent {
  public priorShip: Ship | null = null;

  constructor (public data: Date, public cargo: Cargo, public ship: Ship) {
    super(data);
  }

  public process () {
    this.cargo.handleUnload(this);
  }

  public reverse () {
    this.cargo.reverseUnload(this);
  }
}
