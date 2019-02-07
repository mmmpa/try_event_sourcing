import CustomsEventGateway from './CustomsEventGateway';
import EventProcessor from './EventProcessor';
import PricingGateway from './PricingGateway';

export default class Registry{
  public static CustomsNotificationGateway: CustomsEventGateway
  public static PricingGateway: PricingGateway
}
