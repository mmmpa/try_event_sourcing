import Cargo from './Cargo';
import DomainEvent from './DomainEvent';
import Port from './Port';
import Ship from './Ship';

export default class LoadEvent extends DomainEvent {
  public priorPort: Port | null = null;

  constructor (public data: Date, public cargo: Cargo, public ship: Ship) {
    super(data);
  }

  public process () {
    this.cargo.handleLoad(this);
  }

  public reverse () {
    this.cargo.reverseLoad(this);
  }
}
