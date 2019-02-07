import { EventProcessor } from './EventProcessor';
import Port from './Port';
import Ship from './Ship';

export default class CustomsEventGateway {
  public sentMessages: any[] = [];

  constructor (private eventProcessor: EventProcessor) {
  }

  notify (date: Date, ship: Ship, port: Port) {
    this.eventProcessor.isActive && this.send(date, ship, port);
  }

  private send (date: Date, ship: Ship, port: Port): void {
    this.sentMessages.push({ date, ship, port });
  }
}