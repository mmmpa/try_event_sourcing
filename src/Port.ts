import { Country } from './index';

export default class Port {
  public id: string = require('uuid/v4')();

  constructor (public name: string, public country: Country) {
  }
}
export const atSea = new Port('at sea', Country.SEA);
