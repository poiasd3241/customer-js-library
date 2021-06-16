const Address = require("../entities/Address");
const { isNotAddressType } = require("../entities/AddressType");
const ArgumentError = require("../errors/ArgumentError");
const { ArgumentErrorType } = require("../errors/ArgumentErrorType");
const { isEmptyOrWhitespace } = require("../utils/stringUtils");
const {
  validateArgument,
  validateInstanceof,
} = require("./argumentValidation");
const { DataType } = require("./DataType");
const PropertyValidationResult = require("./PropertyValidationResult");

/**
 * @typedef {Object} AddressValidatorResult
 * @property {boolean} isValid
 * @property {string[]} messages
 */

/**
 * Validator for {@link Address} objects.
 */
class AddressValidator {
  /**
   * Validates the {@link Address} object.
   * @param {Address} address The address to validate.
   * @returns {AddressValidatorResult} (messages property is empty when the address is valid).
   */
  static validate(address) {
    validateInstanceof(address, Address);

    const results = [];

    results.push(AddressValidator.validateLine(address.line));
    results.push(AddressValidator.validateLine2(address.line2));
    results.push(AddressValidator.validateType(address.type));
    results.push(AddressValidator.validateCity(address.city));
    results.push(AddressValidator.validatePostalCode(address.postalCode));
    results.push(AddressValidator.validateState(address.state));
    results.push(AddressValidator.validateCountry(address.country));

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
   * Line - required (not null), maxLength 100.
   * @param {string} line
   * @returns {PropertyValidationResult}
   */
  static validateLine(line) {
    const propertyName = "Line";

    if (line === null) {
      return PropertyValidationResult.Invalid(propertyName, "Required.");
    }

    ArgumentError.throwOnInvalid(validateArgument({ line }, DataType.STRING));

    if (isEmptyOrWhitespace(line)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (line.length > 100) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 100 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Line2 - optional (null), maxLength 100.
   * @param {string} line2
   * @returns {PropertyValidationResult}
   */
  static validateLine2(line2) {
    if (line2 === null) {
      return PropertyValidationResult.Valid();
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ line2 }, DataType.STRING, false)
    );

    const propertyName = "Line2";
    if (isEmptyOrWhitespace(line2)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (line2.length > 100) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 100 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Type - either of {@link AddressType}.
   * @param {number} type .
   * @returns {PropertyValidationResult}
   */
  static validateType(type) {
    ArgumentError.throwOnInvalid(validateArgument({ type }, DataType.NUMBER));

    if (isNotAddressType(type)) {
      throw new ArgumentError(
        { type },
        ArgumentErrorType.BAD_VALUE,
        "either 1 (Shipping) or 2 (Billing)"
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * City - required (not null), maxLength 50.
   * @param {string} city
   * @returns {PropertyValidationResult}
   */
  static validateCity(city) {
    const propertyName = "City";

    if (city === null) {
      return PropertyValidationResult.Invalid(propertyName, "Required.");
    }

    ArgumentError.throwOnInvalid(validateArgument({ city }, DataType.STRING));

    if (isEmptyOrWhitespace(city)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (city.length > 50) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 50 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Postal code - required (not null), maxLength 6.
   * @param {string} postalCode
   * @returns {PropertyValidationResult}
   */
  static validatePostalCode(postalCode) {
    const propertyName = "Postal code";

    if (postalCode === null) {
      return PropertyValidationResult.Invalid(propertyName, "Required.");
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ postalCode }, DataType.STRING)
    );

    if (isEmptyOrWhitespace(postalCode)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (postalCode.length > 6) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 6 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * State - required (not null), maxLength 20.
   * @param {string} state
   * @returns {PropertyValidationResult}
   */
  static validateState(state) {
    const propertyName = "State";

    if (state === null) {
      return PropertyValidationResult.Invalid(propertyName, "Required.");
    }

    ArgumentError.throwOnInvalid(validateArgument({ state }, DataType.STRING));

    if (isEmptyOrWhitespace(state)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (state.length > 20) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Maximum 20 characters."
      );
    }

    return PropertyValidationResult.Valid();
  }

  /**
   * Coutnry - required (not null), either 'United States' or 'Canada'.
   * @param {string} country
   * @returns {PropertyValidationResult}
   */
  static validateCountry(country) {
    const propertyName = "Country";

    if (country === null) {
      return PropertyValidationResult.Invalid(propertyName, "Required.");
    }

    ArgumentError.throwOnInvalid(
      validateArgument({ country }, DataType.STRING)
    );

    if (isEmptyOrWhitespace(country)) {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Cannot be empty or consist of whitespace characters."
      );
    }

    if (country !== "United States" && country !== "Canada") {
      return PropertyValidationResult.Invalid(
        propertyName,
        "Either 'United States' or 'Canada'."
      );
    }

    return PropertyValidationResult.Valid();
  }
}

module.exports = AddressValidator;
