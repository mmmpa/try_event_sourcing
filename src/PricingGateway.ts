import Cargo from './Cargo';
import EventProcessor from './EventProcessor';
import PricingLoggingGateway from './PricingLoggingGateway';

export default class PricingGateway {
  loggingGateway: PricingLoggingGateway;

  constructor (private ep: EventProcessor) {
    this.loggingGateway = new PricingLoggingGateway(ep);
  }

  price (c: Cargo): Money {
    return this.loggingGateway.price(c);
  }
}
