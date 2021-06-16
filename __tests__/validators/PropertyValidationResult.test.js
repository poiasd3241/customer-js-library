const { test, expect } = require("@jest/globals");
const PropertyValidationResult = require("../../src/validators/PropertyValidationResult");

describe("Constructor", () => {
  test("Should create PropertyValidationResult", () => {
    const result = new PropertyValidationResult(false, "myProp", "not mine");

    expect(result.isValid).toBe(false);
    expect(result.propertyName).toBe("myProp");
    expect(result.message).toBe("not mine");
  });
});

describe("Static methods", () => {
  test("Should return valid PropertyValidationResult", () => {
    const result = PropertyValidationResult.Valid();

    expect(result.isValid).toBe(true);
    expect(result.propertyName).toBe(undefined);
    expect(result.message).toBe(undefined);
  });

  test("Should return invalid PropertyValidationResult", () => {
    const result = PropertyValidationResult.Invalid("myProp", "not mine");

    expect(result.isValid).toBe(false);
    expect(result.propertyName).toBe("myProp");
    expect(result.message).toBe("not mine");
  });
});
