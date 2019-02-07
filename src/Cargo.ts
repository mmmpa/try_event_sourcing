import ArrivalEvent from './ArrivalEvent';
import { Country } from './index';

export default class Cargo {
  public isHasBeenInCanada: boolean = false;

  constructor (public name: string) {
  }

  public arrive (e: ArrivalEvent) {
    e.port.country === Country.CANADA && (this.isHasBeenInCanada = true);
  }
}
