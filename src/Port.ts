import { Country } from './index';

export default class Port {
  constructor (public name: string, public country: Country) {
  }
}
export const atSea = new Port('at sea', Country.SEA);
