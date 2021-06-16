// eslint-disable-next-line no-unused-vars
const { AddressType } = require("./AddressType");

class Address {
  /**
   * @param {string} line
   * @param {string} line2
   * @param {number} type Must be an {@link AddressType}.
   * @param {string} city
   * @param {string} postalCode
   * @param {string} state
   * @param {string} country
   */
  constructor(line, line2, type, city, postalCode, state, country) {
    this.line = line;
    this.line2 = line2;
    this.type = type;
    this.city = city;
    this.postalCode = postalCode;
    this.state = state;
    this.country = country;
  }
}

module.exports = Address;
