import ArrivalEvent from './ArrivalEvent';
import { Country } from './index';
import LoadEvent from './LoadEvent';
import Port from './Port';
import Ship from './Ship';
import UnloadEvent from './UnloadEvent';

export default class Cargo {
  public id: string = require('uuid/v4')();
  public isHasBeenInCanada: boolean = false;
  public ship: Ship | null = null;

  constructor (public name: string, public port: Port | null) {
  }

  public handleArrival (e: ArrivalEvent) {
    e.priorIsHasBeenInCanada[this.id] = this.isHasBeenInCanada;
    e.port.country === Country.CANADA && (this.isHasBeenInCanada = true);
  }

  public reverseArrival (e: ArrivalEvent) {
    this.isHasBeenInCanada = e.priorIsHasBeenInCanada[this.id];
  }

  public handleLoad (e: LoadEvent) {
    e.priorPort = this.port;
    this.port = null;
    this.ship = e.ship;
    e.ship.handleLoad(e);
  }

  public reverseLoad (e: LoadEvent) {
    e.ship.reverseLoad(e);
    this.ship = null;
    this.port = e.priorPort;
  }

  public handleUnload (e: UnloadEvent) {
    e.priorShip = this.ship;
    this.ship = null;
    this.port = e.ship.port;
    e.ship.handleUnload(e);
  }

  public reverseUnload (e: UnloadEvent) {
    e.ship.reverseUnload(e);
    this.port = null;
    this.ship = e.priorShip;
  }
}
