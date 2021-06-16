const { test, expect } = require("@jest/globals");
const { ArgumentErrorType } = require("../../src/errors/ArgumentErrorType");
const ArgumentValidationResult = require("../../src/validators/ArgumentValidationResult");

describe("Constructor", () => {
  test("Should create ArgumentValidationResult", () => {
    const result = new ArgumentValidationResult(
      false,
      { myProp: "myProp" },
      ArgumentErrorType.BAD_VALUE,
      "5"
    );

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({ myProp: "myProp" });
    expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
    expect(result.expected).toBe("5");
  });
});

describe("Static methods", () => {
  test("Should return valid ArgumentValidationResult", () => {
    const result = ArgumentValidationResult.Valid();

    expect(result.isValid).toBe(true);
    expect(result.argumentWrapper).toBe(undefined);
    expect(result.errorType).toBe(undefined);
    expect(result.expected).toBe(undefined);
  });

  test("Should return invalid ArgumentValidationResult", () => {
    const result = ArgumentValidationResult.Invalid(
      { myProp: "myProp" },
      ArgumentErrorType.BAD_VALUE,
      "5"
    );

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({ myProp: "myProp" });
    expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
    expect(result.expected).toBe("5");
  });
});
