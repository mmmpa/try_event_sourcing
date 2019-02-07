import ArrivalEvent from '../ArrivalEvent';
import Cargo from '../Cargo';
import DepartureEvent from '../DepartureEvent';
import { EventProcessor } from '../EventProcessor';
import { Country } from '../index';
import LoadEvent from '../LoadEvent';
import Port, { atSea } from '../Port';
import Ship from '../Ship';
import UnloadEvent from '../UnloadEvent';

describe('move ship', () => {
  const ep = new EventProcessor();
  const sanFransisco = new Port('San Francisco', Country.US);
  const losAngels = new Port('Los Angels', Country.US);
  const vancouver = new Port('Vancouver', Country.CANADA);

  let kingRoy:Ship;
  let refactoring:Cargo;

  beforeEach(() => {
    kingRoy = new Ship('King Roy');
    refactoring = new Cargo('refactoring');
  });

  test('arrive', () => {
    const e = new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy);
    ep.process(e);
    expect(kingRoy.port).toEqual(sanFransisco);
  });

  test('departure', () => {
    ep.process(new ArrivalEvent(new Date(2005, 10, 1), losAngels, kingRoy));
    ep.process(new ArrivalEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    ep.process(new DepartureEvent(new Date(2005, 11, 1), sanFransisco, kingRoy));
    expect(kingRoy.port).toEqual(atSea);
  });

  describe('load/unload cargo', () => {
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
});
