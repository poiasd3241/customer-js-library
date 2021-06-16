const { getWrappedName, getFirstItem } = require("../utils/objectUtils");
const {
  ArgumentErrorType,
  isNotArgumentErrorType,
} = require("./ArgumentErrorType");
const {
  ArgumentValidationResult,
  validateArgumentWrapper,
} = require("../validators/argumentValidation");

/**
 * Throw when a method recieves the bad (unsupported) argument.
 */
class ArgumentError extends Error {
  /**
   * Creates and throws an {@link ArgumentError} instance according to the specified data.
   * Does nothing if the result is valid.
   * @param {ArgumentValidationResult} result The result of the argument validation.
   */
  static throwOnInvalid(result) {
    if (result.isValid === false) {
      throw new ArgumentError(
        result.argumentWrapper,
        result.errorType,
        result.expected
      );
    }
  }

  /**
   * @param {object} argumentWrapper The wrapper containing the invalid argument as its only property.
   * @param {symbol} errorType The reason the argument is invalid. Must be an {@link ArgumentErrorType}.
   * @param {*} expected The expected value.
   */
  constructor(argumentWrapper, errorType, expected) {
    // Make sure the arguments are okay for processing.
    // argumentWrapper
    ArgumentError.throwOnInvalid(validateArgumentWrapper(argumentWrapper));

    // errorType
    if (isNotArgumentErrorType(errorType)) {
      throw new ArgumentError(
        { errorType },
        ArgumentErrorType.BAD_VALUE,
        `any of ${getWrappedName({ ArgumentErrorType })}`
      );
    }

    const argumentName = getWrappedName(argumentWrapper);
    const argument = getFirstItem(argumentWrapper);

    let actualExpectedMessage;

    switch (errorType) {
      case ArgumentErrorType.WRONG_TYPE:
        actualExpectedMessage = `Actual type: '${typeof argument}'; expected: '${expected}'.`;
        break;
      case ArgumentErrorType.MISSING_PROPERTY:
        actualExpectedMessage = `Missing properties: '${expected}'.`;
        break;
      default:
        actualExpectedMessage = `Actual value: '${argument}'; expected: '${expected}'.`;
        break;
    }

    super(
      `The argument '${argumentName}' is invalid. Reason: ${errorType.description}.\n${actualExpectedMessage}`
    );

    this.name = "ArgumentError";
  }
}

module.exports = ArgumentError;
