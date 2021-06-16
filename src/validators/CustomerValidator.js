const currency = require("currency.js");
const Address = require("../entities/Address");
const Customer = require("../entities/Customer");
const ArgumentError = require("../errors/ArgumentError");
const { ArgumentErrorType } = require("../errors/ArgumentErrorType");
const { getWrappedName } = require("../utils/objectUtils");
const { isEmptyOrWhitespace } = require("../utils/stringUtils");
const AddressValidator = require("./AddressValidator");
const {
  validateArgument,
  validateInstanceof,
  validateCurrencyJS,
} = require("./argumentValidation");
const { DataType } = require("./DataType");
const PropertyValidationResult = require("./PropertyValidationResult");

/**
 * @typedef {Object} CustomerValidatorResult
 * @property {boolean} isValid
 * @property {string[]} messages
 */

/**
 * @param {string} phoneNumber The phone number.
 * @returns True if the phone number matches the E.164 format; otherwise, false.
 */
const validatePhoneNumberFormatE164 = (phoneNumber) => {
  const pattern = /^\+?[1-9]\d{1,14}$/;
  return pattern.test(phoneNumber);
};

/**
 * @param {string} email The email.
 * @returns True if the email matches the valid format; otherwise, false.
 */
const validateEmailFormat = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Validator for {@link Customer} objects.
 */
class CustomerValidator {
  /**
   * Validates the {@link Customer} object.
   * @param {Customer} customer The customer to validate.
   * @returns {CustomerValidatorResult} (messages property is empty when the address is valid).
   */
  static validate(customer) {
    validateInstanceof(customer, Customer);

    const results = [];

    results.push(CustomerValidator.validateFirstName(customer.firstName));
    results.push(CustomerValidator.validateLastName(customer.lastName));
    results.push(CustomerValidator.validateAddresses(customer.addresses));
    results.push(CustomerValidator.validatePhoneNumber(customer.phoneNumber));
    results.push(CustomerValidator.validateEmail(customer.email));
    results.push(CustomerValidator.validateNotes(customer.notes));
    results.push(
      CustomerValidator.validateTotalPurchasesAmount(
        customer.totalPurchasesAmount
      )
    );
    results.push(
      CustomerValidator.validateLastPurchaseDate(customer.lastPurchaseDate)
    );

    const messages = [];

    results.forEach((result) => {
      if (result.isValid === false) {
        messages.push({
          propertyName: result.propertyName,
          message: result.message,
        });
      }
    });

    return { isValid: messages.length === 0, messages };
  }

  /**
   * First name: optional (null), maxLength 50.
   * @param {string} firstName
   * @returns {PropertyValidationResult}
   */
  static validateFirstName(firstName) {
    if (firstName === null) {
      return PropertyValidationResult.Valid();
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ firstName }, DataType.STRING, false)
    );

    const propertyName = "First name";

    if (isEmptyOrWhitespace(firstName)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (firstName.length > 50) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 50 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Last name: required (not null), maxLength 50.
   * @param {string} lastName
   * @returns {PropertyValidationResult}
   */
  static validateLastName(lastName) {
    const propertyName = "Last name";

    if (lastName === null) {
      return PropertyValidationResult.Invalid(propertyName, "Required.");
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ lastName }, DataType.STRING)
    );

    if (isEmptyOrWhitespace(lastName)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (lastName.length > 50) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 50 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Addresses: at least 1 is required.
   * @param {Address[]} addresses
   * @returns {PropertyValidationResult}
   */
  static validateAddresses(addresses) {
    const propertyName = "Addresses";

    if (addresses === null) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "At least one address is required."
      );
    }

    if (Array.isArray(addresses) === false) {
      throw new ArgumentError(
        { addresses },
        ArgumentErrorType.BAD_VALUE,
        `${getWrappedName({ Address })}[]`
      );
    }

    if (addresses.length === 0) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "At least one address is required."
      );
    }

    let badAddresses = 0;

    addresses.forEach((address) => {
      if (AddressValidator.validate(address).isValid === false) {
        badAddresses += 1;
      }
    });

    if (badAddresses > 0) {
      return PropertyValidationResult.Invalid(
        propertyName,
        `${badAddresses} addresses invalid.`
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Phone number: optional (null), E.164 format.
   * @param {string} phoneNumber Can be null.
   * @returns {PropertyValidationResult}
   */
  static validatePhoneNumber(phoneNumber) {
    if (phoneNumber === null) {
      return PropertyValidationResult.Valid();
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ phoneNumber }, DataType.STRING, false)
    );

    const propertyName = "Phone number";

    if (isEmptyOrWhitespace(phoneNumber)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (validatePhoneNumberFormatE164(phoneNumber) === false) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Must be in E.164 format."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Email: optional (null).
   * @param {string} email Can be null.
   * @returns {PropertyValidationResult}
   */
  static validateEmail(email) {
    if (email === null) {
      return PropertyValidationResult.Valid();
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ email }, DataType.STRING, false)
    );

    const propertyName = "Email";

    if (isEmptyOrWhitespace(email)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (validateEmailFormat(email) === false) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Must be a valid email."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Notes: at least 1 is required.
   * @param {string[]} notes
   * @returns {PropertyValidationResult}
   */
  static validateNotes(notes) {
    const propertyName = "Notes";

    if (notes === null) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "At least one note is required."
      );
    }

    if (Array.isArray(notes) === false) {
      throw new ArgumentError(
        { notes },
        ArgumentErrorType.BAD_VALUE,
        "string[]"
      );
    }

    if (notes.length === 0) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "At least one note is required."
      );
    }

    let emptyNotes = 0;

    notes.forEach((note) => {
      ArgumentError.throwOnInvalid(
        validateArgument({ note }, DataType.STRING, false)
      );

      if (note === null || isEmptyOrWhitespace(note)) {
        emptyNotes += 1;
      }
    });

    if (emptyNotes > 0) {
      return PropertyValidationResult.Invalid(
        propertyName,
        `Cannot contain empty notes.`
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Total purchases amount: optional (null), {@link currency} object.
   * @param {currency} totalPurchasesAmount Can be null.
   * @returns {PropertyValidationResult}
   */
  static validateTotalPurchasesAmount(totalPurchasesAmount) {
    if (totalPurchasesAmount === null) {
      return PropertyValidationResult.Valid();
    }

    ArgumentError.throwOnInvalid(validateCurrencyJS(totalPurchasesAmount));

    return PropertyValidationResult.Valid();
  }

  /**
   * Last purchase date: optional (null), not earlier than 2020-1-1.
   * @param {Date} lastPurchaseDate Can be null.
   * @returns {PropertyValidationResult}
   */
  static validateLastPurchaseDate(lastPurchaseDate) {
    if (lastPurchaseDate === null) {
      return PropertyValidationResult.Valid();
    }

    ArgumentError.throwOnInvalid(
      validateInstanceof({ lastPurchaseDate }, Date)
    );

    const propertyName = "Last purchase date";

    if (lastPurchaseDate < new Date(Date.UTC(2020, 1, 1))) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Must be not earlier than 2020-1-1."
      );
    }

    return PropertyValidationResult.Valid();
  }
}

module.exports = CustomerValidator;
