const { test, expect } = require("@jest/globals");
const {
  ArgumentErrorType,
  isArgumentErrorType,
  isNotArgumentErrorType,
} = require("../../src/errors/ArgumentErrorType");

test("Is ArgumentErrorType 'enum'", () => {
  expect(isArgumentErrorType(ArgumentErrorType.BAD_VALUE)).toBe(true);
  expect(isArgumentErrorType(ArgumentErrorType.WRONG_TYPE)).toBe(true);
  expect(isArgumentErrorType(ArgumentErrorType.MISSING_PROPERTY)).toBe(true);

  expect(isArgumentErrorType("whatever")).toBe(false);

  expect(isNotArgumentErrorType("whatever")).toBe(true);
});
