import ArrivalEvent from './ArrivalEvent';
import Cargo from './Cargo';
import DepartureEvent from './DepartureEvent';
import LoadEvent from './LoadEvent';
import Port, { atSea } from './Port';
import Registry from './Registry';
import UnloadEvent from './UnloadEvent';

export default class Ship {
  public id: string = require('uuid/v4')();
  private cargo: { [key: string]: Cargo } = {};

  constructor (public name: string, public port: Port | null) {
  }

  public has (c: Cargo): boolean {
    return !!this.cargo[c.id];
  }

  public handleArrival (e: ArrivalEvent) {
    e.priorPort = this.port;
    this.port = e.port;
    Object.keys(this.cargo).forEach(k => this.cargo[k].handleArrival(e));
    Registry.CustomsNotificationGateway.notify(e.data, e.ship, e.port);
  }

  public reverseArrival (e: ArrivalEvent) {
    Registry.CustomsNotificationGateway.notify(e.data, e.ship, e.port);
    Object.keys(this.cargo).forEach(k => this.cargo[k].reverseArrival(e));
    this.port = e.priorPort;
  }

  public handleDeparture (e: DepartureEvent) {
    e.priorPort = this.port;
    Object.keys(this.cargo).forEach(k => this.cargo[k].handleDeparture(e));
    this.port = atSea;
  }

  public reverseDeparture (e: DepartureEvent) {
    Object.keys(this.cargo).forEach(k => this.cargo[k].reverseDeparture(e));
    this.port = e.priorPort;
  }

  public handleLoad ({ cargo }: LoadEvent) {
    this.cargo[cargo.id] = cargo;
  }

  public reverseLoad ({ cargo }: LoadEvent) {
    delete this.cargo[cargo.id];
  }

  public handleUnload ({ cargo }: UnloadEvent) {
    delete this.cargo[cargo.id];
  }

  public reverseUnload ({ cargo }: UnloadEvent) {
    this.cargo[cargo.id] = cargo;
  }
}
