import Cargo from './Cargo';
import EventProcessor from './EventProcessor';

function toId (ep: EventProcessor, c: Cargo) {
  return `${ep.currentEvent.id}_${c.id}`;
}

function fetchPrice (c: Cargo): Money {
  return Date.now() * Math.random();
}

export default class PricingLoggingGateway {
  private store: { [key: string]: PricingLog } = {};

  constructor (private ep: EventProcessor) {
  }

  public price (c: Cargo): Money {
    const id = toId(this.ep, c);
    const log = this.find(id) || this.request(id, c);
    return log.price;
  }

  private find (id: string): PricingLog {
    return this.store[id];
  }

  private request (id: string, c: Cargo): PricingLog {
    const log = new PricingLog(id, fetchPrice(c));
    this.store[id] = log;
    return log;
  }
}

class PricingLog {
  constructor (public id: string, public price: Money) {
  }
}