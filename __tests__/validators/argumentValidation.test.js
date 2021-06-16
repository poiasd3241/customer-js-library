const { test, expect, describe } = require("@jest/globals");
const currency = require("currency.js");
const Person = require("../../src/entities/Person");
const { ArgumentErrorType } = require("../../src/errors/ArgumentErrorType");
const {
  validateArgumentWrapper,
  validateArgument,
  validateInstanceof,
  validateCurrencyJS,
} = require("../../src/validators/argumentValidation");
const { DataType } = require("../../src/validators/DataType");

class TestClass {}

describe("Argument wrapper validation", () => {
  test("Should validate", () => {
    const result = validateArgumentWrapper({ something: "ok" });

    expect(result.isValid).toBe(true);
    expect(result.argumentWrapper).toBe(undefined);
    expect(result.errorType).toBe(undefined);
    expect(result.expected).toBe(undefined);
  });

  test("Should invalidate by null", () => {
    const result = validateArgumentWrapper(null);

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({
      argumentWrapper: null,
    });
    expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
    expect(result.expected).toBe("not null");
  });

  test("Should invalidate by type (not object)", () => {
    const result = validateArgumentWrapper("no wrapper");

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({
      argumentWrapper: "no wrapper",
    });
    expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
    expect(result.expected).toBe(DataType.OBJECT);
  });

  test("Should invalidate by keys amount (more than 1)", () => {
    const result = validateArgumentWrapper({ one: 1, two: 2 });

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({
      argumentWrapper: { one: 1, two: 2 },
    });
    expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
    expect(result.expected).toBe("single key");
  });
});

describe("Argument validation", () => {
  describe("Should invalidate by bad arguments", () => {
    test("notNull (not boolean)", () => {
      const result = validateArgument(
        { something: "ok" },
        DataType.STRING,
        "not a boolean!"
      );

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        notNull: "not a boolean!",
      });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(DataType.BOOLEAN);
    });

    test("type (not DataType 'enum')", () => {
      const result = validateArgument({ something: "ok" }, "wrong");

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        type: "wrong",
      });
      expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
      expect(result.expected).toBe(`any of ${DataType}`);
    });

    test("argumentWrapper (not object)", () => {
      const result = validateArgument("no wrapper", DataType.STRING);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        argumentWrapper: "no wrapper",
      });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(DataType.OBJECT);
    });

    test("argumentWrapper (more than 1 key)", () => {
      const result = validateArgument({ one: 1, two: 2 }, DataType.STRING);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        argumentWrapper: { one: 1, two: 2 },
      });
      expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
      expect(result.expected).toBe("single key");
    });
  });

  describe("Should validate", () => {
    test("Not null", () => {
      const result = validateArgument({ something: "ok" }, DataType.STRING);

      expect(result.isValid).toBe(true);
      expect(result.argumentWrapper).toBe(undefined);
      expect(result.errorType).toBe(undefined);
      expect(result.expected).toBe(undefined);
    });

    test("Null", () => {
      const something = null;
      const result = validateArgument({ something }, DataType.STRING, false);

      expect(result.isValid).toBe(true);
      expect(result.argumentWrapper).toBe(undefined);
      expect(result.errorType).toBe(undefined);
      expect(result.expected).toBe(undefined);
    });
  });

  describe("Should invalidate", () => {
    test("Null", () => {
      const something = null;
      const result = validateArgument({ something }, DataType.STRING);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({ something: null });
      expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
      expect(result.expected).toBe("not null");
    });

    test("Type (null allowed)", () => {
      const something = "ok";
      const result = validateArgument({ something }, DataType.BOOLEAN, false);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({ something: "ok" });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(`${DataType.BOOLEAN} or null`);
    });

    test("Type (null not allowed)", () => {
      const something = "ok";
      const result = validateArgument({ something }, DataType.BOOLEAN);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({ something: "ok" });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(DataType.BOOLEAN);
    });
  });
});

describe("Instanceof validation", () => {
  describe("Should invalidate by bad arguments", () => {
    test("argumentWrapper (not object)", () => {
      const result = validateInstanceof("no wrapper", DataType.STRING);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        argumentWrapper: "no wrapper",
      });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(DataType.OBJECT);
    });

    test("argumentWrapper (more than 1 key)", () => {
      const result = validateInstanceof({ one: 1, two: 2 }, DataType.STRING);

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        argumentWrapper: { one: 1, two: 2 },
      });
      expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
      expect(result.expected).toBe("single key");
    });
  });

  test("Should validate", () => {
    const person = new TestClass();
    const result = validateInstanceof({ person }, TestClass);

    expect(result.isValid).toBe(true);
    expect(result.argumentWrapper).toBe(undefined);
    expect(result.errorType).toBe(undefined);
    expect(result.expected).toBe(undefined);
  });

  test("Should invalidate", () => {
    const something = "ok";
    const result = validateInstanceof({ something }, Person);

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({ something });
    expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
    expect(result.expected).toBe("instanceof Person");
  });
});

describe("currency.js validation", () => {
  describe("Should invalidate by bad arguments", () => {
    test("currency (not object)", () => {
      const result = validateCurrencyJS("not currency");

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        currencyObj: "not currency",
      });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(DataType.OBJECT);
    });

    test("currency (not object)", () => {
      const result = validateCurrencyJS("not currency");

      expect(result.isValid).toBe(false);
      expect(result.argumentWrapper).toStrictEqual({
        currencyObj: "not currency",
      });
      expect(result.errorType).toBe(ArgumentErrorType.WRONG_TYPE);
      expect(result.expected).toBe(DataType.OBJECT);
    });
  });

  test("Should validate", () => {
    const currencyObj = currency(123);
    const result = validateCurrencyJS(currencyObj);

    expect(result.isValid).toBe(true);
    expect(result.argumentWrapper).toBe(undefined);
    expect(result.errorType).toBe(undefined);
    expect(result.expected).toBe(undefined);
  });

  test("Should invalidate (null)", () => {
    const result = validateCurrencyJS(null);

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({ currencyObj: null });
    expect(result.errorType).toBe(ArgumentErrorType.BAD_VALUE);
    expect(result.expected).toBe("not null");
  });

  test(`Should invalidate (missing properties, "s" partially included)`, () => {
    const result = validateCurrencyJS({ intValue: 222, s: { symbol: "$" } });

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({
      currencyObj: { intValue: 222, s: { symbol: "$" } },
    });
    expect(result.errorType).toBe(ArgumentErrorType.MISSING_PROPERTY);
    expect(result.expected).toStrictEqual([
      "value",
      "p",
      "s.separator",
      "s.decimal",
      "s.errorOnInvalid",
      "s.precision",
      "s.pattern",
      "s.negativePattern",
      "s.format",
      "s.fromCents",
      "s.increment",
      "s.groups",
    ]);
  });

  test(`Should invalidate (missing properties, "s" missing)`, () => {
    const result = validateCurrencyJS({ intValue: 222 });

    expect(result.isValid).toBe(false);
    expect(result.argumentWrapper).toStrictEqual({
      currencyObj: { intValue: 222 },
    });
    expect(result.errorType).toBe(ArgumentErrorType.MISSING_PROPERTY);
    expect(result.expected).toStrictEqual(["value", "s", "p"]);
  });
});
