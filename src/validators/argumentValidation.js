/* eslint-disable valid-typeof */
const currency = require("currency.js");
const { ArgumentErrorType } = require("../errors/ArgumentErrorType");
const { DataType, isNotDataType } = require("./DataType");
const { getFirstItem, doesContainProperty } = require("../utils/objectUtils");
const ArgumentValidationResult = require("./ArgumentValidationResult");
// eslint-disable-next-line no-unused-vars
const ArgumentError = require("../errors/ArgumentError");

/**
 * Validates the argument wrapper (the object holding the 'argument' as its only key).
 * @param {object} argumentWrapper
 * @returns {ArgumentValidationResult}
 */
const validateArgumentWrapper = (argumentWrapper) => {
  if (argumentWrapper === null) {
    return ArgumentValidationResult.Invalid(
      { argumentWrapper },
      ArgumentErrorType.BAD_VALUE,
      "not null"
    );
  }

  if (typeof argumentWrapper !== DataType.OBJECT) {
    return ArgumentValidationResult.Invalid(
      { argumentWrapper },
      ArgumentErrorType.WRONG_TYPE,
      DataType.OBJECT
    );
  }

  if (Object.keys(argumentWrapper).length !== 1) {
    return ArgumentValidationResult.Invalid(
      { argumentWrapper },
      ArgumentErrorType.BAD_VALUE,
      "single key"
    );
  }

  return ArgumentValidationResult.Valid();
};

/**
 * Note: undefined will result in {@link WRONG_TYPE} error.
 * @param {object} argumentWrapper The simple single-key object wrapper for the to-be-validated argument.
 * @param {string} type The type the argument must be of. Must be any of {@link DataType}.
 * @param {boolean} notNull True if the argument must be not null (default); false - null is allowed.
 * @returns {ArgumentValidationResult}
 */
const validateArgument = (argumentWrapper, type, notNull = true) => {
  // Make sure the arguments are valid for processing.
  // notNull
  if (typeof notNull !== DataType.BOOLEAN) {
    return ArgumentValidationResult.Invalid(
      { notNull },
      ArgumentErrorType.WRONG_TYPE,
      DataType.BOOLEAN
    );
  }

  // type
  if (isNotDataType(type)) {
    return ArgumentValidationResult.Invalid(
      { type },
      ArgumentErrorType.BAD_VALUE,
      `any of ${DataType}`
    );
  }

  // argumentWrapper
  const argumentWrapperResult = validateArgumentWrapper(argumentWrapper);

  if (argumentWrapperResult.isValid === false) {
    return argumentWrapperResult;
  }

  const argument = getFirstItem(argumentWrapper);

  // Validate the argument.
  if (argument === null) {
    if (notNull) {
      return ArgumentValidationResult.Invalid(
        argumentWrapper,
        ArgumentErrorType.BAD_VALUE,
        "not null"
      );
    }

    return ArgumentValidationResult.Valid();
  }

  if (typeof argument !== type) {
    const expected = notNull ? type : `${type} or null`;
    return ArgumentValidationResult.Invalid(
      argumentWrapper,
      ArgumentErrorType.WRONG_TYPE,
      expected
    );
  }

  return ArgumentValidationResult.Valid();
};

/**
 * @param {object} argumentWrapper The wrapper for the to-be-validated argument.
 * @param {*} instanceType The type the argument must be an instance of.
 * @returns {ArgumentValidationResult}
 */
const validateInstanceof = (argumentWrapper, instanceType) => {
  // Make sure the arguments are valid for processing.
  // argumentWrapper
  const argumentWrapperResult = validateArgumentWrapper(argumentWrapper);

  if (argumentWrapperResult.isValid === false) {
    return argumentWrapperResult;
  }

  // Validate wrapped argument.
  if (getFirstItem(argumentWrapper) instanceof instanceType === false) {
    return ArgumentValidationResult.Invalid(
      argumentWrapper,
      ArgumentErrorType.BAD_VALUE,
      `instanceof ${instanceType.name}`
    );
  }

  return ArgumentValidationResult.Valid();
};

/**
 * Validates the provided object as a non-null {@link currency} object.
 * @param {currency} currencyObj The object to validate.
 * @returns {ArgumentValidationResult}
 */
const validateCurrencyJS = (currencyObj) => {
  // Make sure the argument is valid for processing.
  const argumentResult = validateArgument({ currencyObj }, DataType.OBJECT);

  if (argumentResult.isValid === false) {
    return argumentResult;
  }

  const expectedPropertiesCurrency = ["intValue", "value", "s", "p"];
  const expectedPropertiesS = [
    "symbol",
    "separator",
    "decimal",
    "errorOnInvalid",
    "precision",
    "pattern",
    "negativePattern",
    "format",
    "fromCents",
    "increment",
    "groups",
  ];

  const missingProperties = [];

  expectedPropertiesCurrency.forEach((propertyName) => {
    if (doesContainProperty(currencyObj, propertyName) === false) {
      missingProperties.push(propertyName);
    }
  });

  if (missingProperties.includes("s") === false) {
    const { s } = currencyObj;
    expectedPropertiesS.forEach((propertyName) => {
      if (doesContainProperty(s, propertyName) === false) {
        missingProperties.push(`s.${propertyName}`);
      }
    });
  }

  if (missingProperties.length !== 0) {
    return ArgumentValidationResult.Invalid(
      { currencyObj },
      ArgumentErrorType.MISSING_PROPERTY,
      missingProperties
    );
  }

  return ArgumentValidationResult.Valid();
};

module.exports = {
  validateArgumentWrapper,
  validateArgument,
  validateInstanceof,
  validateCurrencyJS,
};
