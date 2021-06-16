/**
 * The argument error type 'enum'.
 */
const ArgumentErrorType = Object.freeze({
  BAD_VALUE: Symbol("Bad value"),
  WRONG_TYPE: Symbol("Wrong type"),
  MISSING_PROPERTY: Symbol("Missing property"),
});

/**
 * @param {*} value
 * @returns True if the specified value is a valid {@link ArgumentErrorType}; otherwise, false.
 */
const isArgumentErrorType = (value) =>
  value === ArgumentErrorType.BAD_VALUE ||
  value === ArgumentErrorType.WRONG_TYPE ||
  value === ArgumentErrorType.MISSING_PROPERTY;

/**
 * @param {*} value
 * @returns True if the specified value is not a valid {@link ArgumentErrorType}; otherwise, false.
 */
const isNotArgumentErrorType = (value) => isArgumentErrorType(value) === false;

module.exports = {
  ArgumentErrorType,
  isArgumentErrorType,
  isNotArgumentErrorType,
};
