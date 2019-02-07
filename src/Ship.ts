import ArrivalEvent from './ArrivalEvent';
import Cargo from './Cargo';
import DepartureEvent from './DepartureEvent';
import LoadEvent from './LoadEvent';
import Port, { atSea } from './Port';
import UnloadEvent from './UnloadEvent';

export default class Ship {
  constructor (public name: string, public port?: Port, private cargos: Cargo[] = []) {
  }

  public arrive (e: ArrivalEvent) {
    this.port = e.port;
    this.cargos.forEach(c => c.arrive(e));
  }

  public departure ({ ship }: DepartureEvent) {
    this.port = atSea;
  }

  public load ({ cargo }: LoadEvent) {
    this.cargos.push(cargo);
  }

  public unload ({ cargo }: UnloadEvent) {
    this.cargos = this.cargos.filter(c => c !== cargo);
  }
}
