// eslint-disable-next-line no-unused-vars
const { ArgumentErrorType } = require("../errors/ArgumentErrorType");

class ArgumentValidationResult {
  /**
   * @param {boolean} isValid
   * @param {object} argumentWrapper The wrapper containing the invalid argument as its only property.
   * @param {symbol} errorType The reason the argument is invalid. Must be an {@link ArgumentErrorType}.
   * @param {*} expected The expected value.
   */
  constructor(isValid, argumentWrapper, errorType, expected) {
    this.isValid = isValid;
    this.argumentWrapper = argumentWrapper;
    this.errorType = errorType;
    this.expected = expected;
  }

  /**
   * @returns A valid instance of {@link ArgumentValidationResult}.
   */
  static Valid() {
    return new ArgumentValidationResult(true);
  }

  /**
   * @param {object} argumentWrapper The wrapper containing the invalid argument as its only property.
   * @param {symbol} errorType The reason the argument is invalid. Must be an {@link ArgumentErrorType}.
   * @param {*} expected The expected value.
   * @returns An  invalid instance of {@link ArgumentValidationResult} using the provided data.
   */
  static Invalid(argumentWrapper, errorType, expected) {
    return new ArgumentValidationResult(
      false,
      argumentWrapper,
      errorType,
      expected
    );
  }
}

module.exports = ArgumentValidationResult;
