const currency = require("currency.js");
const Address = require("./Address");
const Person = require("./Person");

class Customer extends Person {
  /**
   * @param {string} firstName
   * @param {string} lastName
   * @param {Address[]} addresses
   * @param {string} phoneNumber
   * @param {string} email
   * @param {string} notes
   * @param {currency} totalPurchasesAmount
   * @param {Date} lastPurchaseDate
   */
  constructor(
    firstName,
    lastName,
    addresses,
    phoneNumber,
    email,
    notes,
    totalPurchasesAmount,
    lastPurchaseDate
  ) {
    super(firstName, lastName);
    this.addresses = addresses;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.notes = notes;
    this.totalPurchasesAmount = totalPurchasesAmount;
    this.lastPurchaseDate = lastPurchaseDate;
  }
}

module.exports = Customer;
