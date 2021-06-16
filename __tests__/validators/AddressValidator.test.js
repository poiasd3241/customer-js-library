const { test, describe, expect } = require("@jest/globals");
const Address = require("../../src/entities/Address");
const { AddressType } = require("../../src/entities/AddressType");
const ArgumentError = require("../../src/errors/ArgumentError");
const AddressValidator = require("../../src/validators/AddressValidator");

describe("Validating individual properties", () => {
  // Required, maxlength, string: Line, City, Postal code, State
  describe.each([
    {
      propertyName: "Line",
      parameterName: "line",
      maxLength: 100,
      validate: AddressValidator.validateLine,
      validRealValue: "one",
    },
    {
      propertyName: "City",
      parameterName: "city",
      maxLength: 50,
      validate: AddressValidator.validateCity,
      validRealValue: "Seattle",
    },
    {
      propertyName: "Postal code",
      parameterName: "postalCode",
      maxLength: 6,
      validate: AddressValidator.validatePostalCode,
      validRealValue: "123456",
    },
    {
      propertyName: "State",
      parameterName: "state",
      maxLength: 20,
      validate: AddressValidator.validateState,
      validRealValue: "Washington",
    },
  ])(
    "$propertyName",
    ({ propertyName, parameterName, maxLength, validate, validRealValue }) => {
      test("Should validate", () => {
        const result = validate(validRealValue);

        expect(result.isValid).toBe(true);
        expect(result.propertyName).toBe(undefined);
        expect(result.message).toBe(undefined);
      });

      describe("Should invalidate", () => {
        test("Required - null", () => {
          const result = validate(null);

          expect(result.isValid).toBe(false);
          expect(result.propertyName).toBe(propertyName);
          expect(result.message).toBe("Required.");
        });

        test.each(["", " "])("Empty/whitespace %p", (str) => {
          const result = validate(str);

          expect(result.isValid).toBe(false);
          expect(result.propertyName).toBe(propertyName);
          expect(result.message).toBe(
            "Cannot be empty or consist of whitespace characters."
          );
        });

        test(`Too long: max ${maxLength} characters`, () => {
          const tooLong = "a".repeat(maxLength + 1);
          const result = validate(tooLong);

          expect(result.isValid).toBe(false);
          expect(result.propertyName).toBe(propertyName);
          expect(result.message).toBe(`Maximum ${maxLength} characters.`);
        });
      });

      test("Should throw on bad argument", () => {
        const notString = 123;

        expect.assertions(2);

        try {
          validate(notString);
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument '${parameterName}' is invalid. Reason: Wrong type.\n` +
              `Actual type: 'number'; expected: 'string'.`
          );
        }
      });
    }
  );

  // Optional, string
  describe.each([
    {
      propertyName: "Line2",
      parameterName: "line2",
      maxLength: 100,
      validate: AddressValidator.validateLine2,
    },
  ])(
    "$propertyName",
    ({ propertyName, parameterName, maxLength, validate }) => {
      describe("Should validate", () => {
        test.each([
          { title: "Optional - null", value: null },
          { title: "Not null", value: "valid line2" },
        ])("$title", ({ value }) => {
          const result = AddressValidator.validateLine2(value);

          expect(result.isValid).toBe(true);
          expect(result.propertyName).toBe(undefined);
          expect(result.message).toBe(undefined);
        });
      });

      describe("Should invalidate", () => {
        test.each(["", " "])("Empty/whitespace %p", (str) => {
          const result = validate(str);

          expect(result.isValid).toBe(false);
          expect(result.propertyName).toBe(propertyName);
          expect(result.message).toBe(
            "Cannot be empty or consist of whitespace characters."
          );
        });

        test(`Too long: max ${maxLength} characters`, () => {
          const tooLong = "a".repeat(maxLength + 1);
          const result = validate(tooLong);

          expect(result.isValid).toBe(false);
          expect(result.propertyName).toBe(propertyName);
          expect(result.message).toBe(`Maximum ${maxLength} characters.`);
        });
      });

      test("Should throw on bad argument", () => {
        const notString = 123;

        expect.assertions(2);

        try {
          validate(notString);
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument '${parameterName}' is invalid. Reason: Wrong type.\n` +
              `Actual type: 'number'; expected: 'string or null'.`
          );
        }
      });
    }
  );

  // Type
  describe("Type", () => {
    describe("Should validate", () => {
      test.each([
        { title: "Shipping", value: 1 },
        { title: "Billing", value: 2 },
      ])("$title", ({ value }) => {
        const result = AddressValidator.validateType(value);

        expect(result.isValid).toBe(true);
        expect(result.propertyName).toBe(undefined);
        expect(result.message).toBe(undefined);
      });
    });

    describe("Should throw on bad argument", () => {
      test("Not a number", () => {
        const notNumber = "ok";

        expect.assertions(2);

        try {
          AddressValidator.validateType(notNumber);
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument 'type' is invalid. Reason: Wrong type.\n` +
              `Actual type: 'string'; expected: 'number'.`
          );
        }
      });

      test.each([0, 3])("Not a valid address type value - %p", (value) => {
        expect.assertions(2);

        try {
          AddressValidator.validateType(value);
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument 'type' is invalid. Reason: Bad value.\n` +
              `Actual value: '${value}'; expected: 'either 1 (Shipping) or 2 (Billing)'.`
          );
        }
      });
    });
  });

  // Country
  describe.each([
    {
      propertyName: "Country",
      parameterName: "country",
      validate: AddressValidator.validateCountry,
    },
  ])("$propertyName", ({ propertyName, parameterName, validate }) => {
    test.each(["United States", "Canada"])("Should validate - %p", (value) => {
      const result = validate(value);

      expect(result.isValid).toBe(true);
      expect(result.propertyName).toBe(undefined);
      expect(result.message).toBe(undefined);
    });

    describe("Should invalidate", () => {
      test("Required - null", () => {
        const result = validate(null);

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("Required.");
      });

      test.each(["", " "])("Empty/whitespace %p", (str) => {
        const result = validate(str);

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe(
          "Cannot be empty or consist of whitespace characters."
        );
      });

      test(`Only 'United States' or 'Canada'`, () => {
        const result = validate("Japan");

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe(`Either 'United States' or 'Canada'.`);
      });
    });

    test("Should throw on bad argument", () => {
      const notString = 123;

      expect.assertions(2);

      try {
        validate(notString);
      } catch (error) {
        expect(error).toBeInstanceOf(ArgumentError);
        expect(error.message).toBe(
          `The argument '${parameterName}' is invalid. Reason: Wrong type.\n` +
            `Actual type: 'number'; expected: 'string'.`
        );
      }
    });
  });
});

// Address object
const getValidAddress = () =>
  new Address(
    "one",
    "two",
    AddressType.BILLING,
    "Seattle",
    "123456",
    "Washington",
    "United States"
  );

describe("Validating the Address object", () => {
  test("Should validate", () => {
    const address = getValidAddress();

    const result = AddressValidator.validate(address);

    expect(result.isValid).toBe(true);
    expect(result.messages).toStrictEqual([]);
  });

  test("Should invalidate Line2 and City", () => {
    const address = getValidAddress();
    address.line2 = "  ";
    address.city = "a".repeat(51);

    const result = AddressValidator.validate(address);

    expect(result.isValid).toBe(false);
    expect(result.messages).toStrictEqual([
      {
        propertyName: "Line2",
        message: "Cannot be empty or consist of whitespace characters.",
      },
      { propertyName: "City", message: "Maximum 50 characters." },
    ]);
  });

  test("Should throw on bad property - City", () => {
    const address = getValidAddress();
    address.city = 123;

    expect.assertions(2);

    try {
      AddressValidator.validate(address);
    } catch (error) {
      expect(error).toBeInstanceOf(ArgumentError);
      expect(error.message).toBe(
        `The argument 'city' is invalid. Reason: Wrong type.\n` +
          `Actual type: 'number'; expected: 'string'.`
      );
    }
  });
});

module.exports = { getValidAddress };
