/**
 * The data type 'enum'.
 */
const DataType = Object.freeze({
  OBJECT: "object",
  STRING: "string",
  BOOLEAN: "boolean",
  NUMBER: "number",
  SYMBOL: "symbol",
  BIGINT: "bigint",
  FUNCTION: "function",
  UNDEFINED: "undefined",
});

/**
 * @param {*} value
 * @returns True if the specified value is a valid {@link DataType}; otherwise, false.
 */
const isDataType = (value) =>
  value === DataType.OBJECT ||
  value === DataType.STRING ||
  value === DataType.BOOLEAN ||
  value === DataType.NUMBER ||
  value === DataType.SYMBOL ||
  value === DataType.BIGINT ||
  value === DataType.FUNCTION ||
  value === DataType.UNDEFINED;

/**
 * @param {*} value
 * @returns True if the specified value is not a valid {@link DataType}; otherwise, false.
 */
const isNotDataType = (value) => isDataType(value) === false;

module.exports = {
  DataType,
  isDataType,
  isNotDataType,
};
