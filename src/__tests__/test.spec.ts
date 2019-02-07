import ArrivalEvent from '../ArrivalEvent';
import Cargo from '../Cargo';
import CustomsEventGateway from '../CustomsEventGateway';
import DepartureEvent from '../DepartureEvent';
import EventProcessor from '../EventProcessor';
import { Country } from '../index';
import LoadEvent from '../LoadEvent';
import Port, { atSea } from '../Port';
import PricingGateway from '../PricingGateway';
import Registry from '../Registry';
import Ship from '../Ship';
import UnloadEvent from '../UnloadEvent';

describe('move ship', () => {
  const unknownPort = new Port('unknown', Country.US);
  const sanFransisco = new Port('San Francisco', Country.US);
  const losAngels = new Port('Los Angels', Country.US);
  const vancouver = new Port('Vancouver', Country.CANADA);

  let ep: EventProcessor;
  let customsGateway: CustomsEventGateway;
  let pricingGateway: PricingGateway;
  let kingRoy: Ship;
  let refactoring: Cargo;

  beforeEach(() => {
    ep = new EventProcessor();
    kingRoy = new Ship('King Roy', unknownPort);
    refactoring = new Cargo('refactoring', unknownPort);
    customsGateway = new CustomsEventGateway(ep);
    pricingGateway = new PricingGateway(ep);

    Registry.CustomsNotificationGateway = customsGateway;
    Registry.PricingGateway = pricingGateway;
  });

  test('handleArrival', () => {
    const e = new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy);
    ep.process(e);
    expect(kingRoy.port).toEqual(sanFransisco);
  });
  test('notify arrivals by gateway', () => {
    ep.process(new ArrivalEvent(new Date(2005, 10, 1), losAngels, kingRoy));
    ep.process(new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    ep.process(new DepartureEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    expect(customsGateway.sentMessages.length).toEqual(2);
  });

  test('handleDeparture', () => {
    ep.process(new ArrivalEvent(new Date(2005, 10, 1), losAngels, kingRoy));
    ep.process(new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    ep.process(new DepartureEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    expect(kingRoy.port).toEqual(atSea);
  });

  describe('handleLoad/handleUnload cargo', () => {
    test('has been in Canada', () => {
      ep.process(new LoadEvent(new Date(2005, 10, 1), refactoring, kingRoy));
      ep.process(new ArrivalEvent(new Date(2005, 10, 1), vancouver, kingRoy));
      ep.process(new DepartureEvent(new Date(2005, 11, 1), vancouver, kingRoy));
      ep.process(new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
      ep.process(new UnloadEvent(new Date(2005, 11, 5), refactoring, kingRoy));
      expect(refactoring.isHasBeenInCanada).toEqual(true);
    });

    test('has not been in Canada', () => {
      ep.process(new LoadEvent(new Date(2005, 10, 1), refactoring, kingRoy));
      ep.process(new ArrivalEvent(new Date(2005, 10, 1), losAngels, kingRoy));
      ep.process(new DepartureEvent(new Date(2005, 11, 1), losAngels, kingRoy));
      ep.process(new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
      ep.process(new UnloadEvent(new Date(2005, 11, 5), refactoring, kingRoy));
      expect(refactoring.isHasBeenInCanada).toEqual(false);
    });
  });

  test('reverse', () => {
    ep.process(new LoadEvent(new Date(2005, 10, 1), refactoring, kingRoy));
    ep.process(new ArrivalEvent(new Date(2005, 10, 1), vancouver, kingRoy));
    const vanPrice = refactoring.price;
    ep.process(new DepartureEvent(new Date(2005, 11, 1), vancouver, kingRoy));
    ep.process(new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    const sfPrice = refactoring.price;
    ep.process(new UnloadEvent(new Date(2005, 11, 5), refactoring, kingRoy));

    expect(customsGateway.sentMessages.length).toEqual(2);

    expect(refactoring.ship).toEqual(null);
    expect(refactoring.port).toEqual(sanFransisco);
    expect(kingRoy.has(refactoring)).toEqual(false);
    ep.reverse();
    expect(kingRoy.has(refactoring)).toEqual(true);
    expect(refactoring.port).toEqual(null);
    expect(refactoring.ship).toEqual(kingRoy);

    expect(refactoring.price).toEqual(sfPrice);
    expect(kingRoy.port).toEqual(sanFransisco);
    ep.reverse();
    expect(kingRoy.port).toEqual(atSea);
    expect(refactoring.price).toEqual(null);
    ep.reverse();
    expect(kingRoy.port).toEqual(vancouver);
    expect(refactoring.price).toEqual(vanPrice);

    expect(refactoring.isHasBeenInCanada).toEqual(true);
    ep.reverse();
    expect(refactoring.isHasBeenInCanada).toEqual(false);

    expect(kingRoy.port).toEqual(unknownPort);

    expect(refactoring.port).toEqual(null);
    expect(refactoring.ship).toEqual(kingRoy);
    expect(kingRoy.has(refactoring)).toEqual(true);
    ep.reverse();
    expect(kingRoy.has(refactoring)).toEqual(false);
    expect(refactoring.ship).toEqual(null);
    expect(refactoring.port).toEqual(unknownPort);

    ep.replay();
    ep.replay();
    expect(refactoring.price).toEqual(vanPrice);
    ep.replay();
    ep.replay();
    expect(refactoring.price).toEqual(sfPrice);

    expect(customsGateway.sentMessages.length).toEqual(2);
  });
});
