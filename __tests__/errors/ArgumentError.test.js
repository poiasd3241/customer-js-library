/* eslint-disable no-unused-vars */
const { test, expect, describe } = require("@jest/globals");
const { throwOnInvalid } = require("../../src/errors/ArgumentError");
const ArgumentError = require("../../src/errors/ArgumentError");
const { ArgumentErrorType } = require("../../src/errors/ArgumentErrorType");
const ArgumentValidationResult = require("../../src/validators/ArgumentValidationResult");

describe("Constructor", () => {
  test("Should create ArgumentError", () => {
    const something = { value: "wrong" };

    const argumentError = new ArgumentError(
      { something },
      ArgumentErrorType.MISSING_PROPERTY,
      "asd"
    );

    expect(argumentError.message).toBe(
      `The argument 'something' is invalid. Reason: Missing property.\n` +
        `Missing properties: 'asd'.`
    );
    expect(argumentError.name).toBe("ArgumentError");
  });

  test("Should throw ArgumentError when passed bad argument wrapper", () => {
    const badWrapper = "wrong";

    expect.assertions(2);

    try {
      const a = new ArgumentError(
        badWrapper,
        ArgumentErrorType.BAD_VALUE,
        "correct"
      );
    } catch (error) {
      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.message).toBe(
        `The argument 'argumentWrapper' is invalid. Reason: Wrong type.\n` +
          `Actual type: 'string'; expected: 'object'.`
      );
    }
  });

  test("Should throw ArgumentError when passed bad error type", () => {
    const something = "wrong";
    const badErrorType = "oops";

    expect.assertions(2);

    try {
      const a = new ArgumentError({ something }, badErrorType, "correct");
    } catch (error) {
      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.message).toBe(
        `The argument 'errorType' is invalid. Reason: Bad value.\n` +
          `Actual value: 'oops'; expected: 'any of ArgumentErrorType'.`
      );
    }
  });
});

describe("Static methods", () => {
  test("Should throw the ArgumentError for the specified argument validation result", () => {
    const something = "wrong";
    const result = ArgumentValidationResult.Invalid(
      { something },
      ArgumentErrorType.BAD_VALUE,
      "correct"
    );

    expect.assertions(2);

    try {
      throwOnInvalid(result);
    } catch (error) {
      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.message).toBe(
        `The argument 'something' is invalid. Reason: Bad value.\n` +
          `Actual value: 'wrong'; expected: 'correct'.`
      );
    }
  });
});
