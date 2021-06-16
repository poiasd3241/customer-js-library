const { test, describe, expect } = require("@jest/globals");
const currency = require("currency.js");
const Address = require("../../src/entities/Address");
const { AddressType } = require("../../src/entities/AddressType");
const Customer = require("../../src/entities/Customer");
const ArgumentError = require("../../src/errors/ArgumentError");
const AddressValidator = require("../../src/validators/AddressValidator");
const CustomerValidator = require("../../src/validators/customerValidator");
const { getValidAddress } = require("./AddressValidator.test");

describe("Validating individual properties", () => {
  // First name
  describe.each([
    {
      propertyName: "First name",
      parameterName: "firstName",
      maxLength: 50,
      validate: CustomerValidator.validateFirstName,
    },
  ])(
    "$propertyName",
    ({ propertyName, parameterName, maxLength, validate }) => {
      describe("Should validate", () => {
        test.each([
          { title: "Optional - null", value: null },
          { title: "Not null", value: "Whatever" },
        ])("$title", ({ value }) => {
          const result = validate(value);

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

  // Last name
  describe.each([
    {
      propertyName: "Last name",
      parameterName: "lastName",
      maxLength: 50,
      validate: CustomerValidator.validateLastName,
      validRealValue: "Whatever",
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

  // Addresses
  describe.each([
    {
      propertyName: "Addresses",
      parameterName: "addresses",
      validate: CustomerValidator.validateAddresses,
    },
  ])("$propertyName", ({ propertyName, parameterName, validate }) => {
    test("Should validate", () => {
      const addresses = [getValidAddress()];
      const result = validate(addresses);

      expect(result.isValid).toBe(true);
      expect(result.propertyName).toBe(undefined);
      expect(result.message).toBe(undefined);
    });

    describe("Should invalidate", () => {
      test.each([
        { title: "Required - null", value: null },
        { title: "Required - empty", value: [] },
      ])("$title", ({ value }) => {
        const result = validate(value);

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("At least one address is required.");
      });

      test("At least 1 bad address", () => {
        const validAddress = getValidAddress();
        const invalidAddress = getValidAddress();
        invalidAddress.country = "Japan";

        const result = validate([validAddress, invalidAddress]);

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("1 addresses invalid.");
      });
    });

    describe("Should throw", () => {
      test("Bad argument - not an array", () => {
        expect.assertions(2);

        try {
          validate({ notArray: "bad" });
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument '${parameterName}' is invalid. Reason: Bad value.\n` +
              `Actual value: '[object Object]'; expected: 'Address[]'.`
          );
        }
      });

      test("Bad address", () => {
        const badAddress = getValidAddress();
        badAddress.line = undefined;

        expect.assertions(2);

        try {
          validate([badAddress]);
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument 'line' is invalid. Reason: Wrong type.\n` +
              `Actual type: 'undefined'; expected: 'string'.`
          );
        }
      });
    });
  });

  // Phone number
  describe.each([
    {
      propertyName: "Phone number",
      parameterName: "phoneNumber",
      validate: CustomerValidator.validatePhoneNumber,
    },
  ])("$propertyName", ({ propertyName, parameterName, validate }) => {
    describe("Should validate", () => {
      test.each([
        { title: "Optional - null", value: null },
        { title: "Not null", value: "+12345" },
      ])("$title", ({ value }) => {
        const result = validate(value);

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

      test("E.164 format", () => {
        const result = validate("012345");

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("Must be in E.164 format.");
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
  });

  // Email
  describe.each([
    {
      propertyName: "Email",
      parameterName: "email",
      validate: CustomerValidator.validateEmail,
    },
  ])("$propertyName", ({ propertyName, parameterName, validate }) => {
    describe("Should validate", () => {
      test.each([
        { title: "Optional - null", value: null },
        { title: "Not null", value: "my@asd.com" },
      ])("$title", ({ value }) => {
        const result = validate(value);

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

      test("Email format", () => {
        const result = validate("@my@asd com");

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("Must be a valid email.");
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
  });

  // Notes
  describe.each([
    {
      propertyName: "Notes",
      parameterName: "notes",
      validate: CustomerValidator.validateNotes,
    },
  ])("$propertyName", ({ propertyName, parameterName, validate }) => {
    test("Should validate", () => {
      const notes = ["asd"];
      const result = validate(notes);

      expect(result.isValid).toBe(true);
      expect(result.propertyName).toBe(undefined);
      expect(result.message).toBe(undefined);
    });

    describe("Should invalidate", () => {
      test.each([
        { title: "Required - null", value: null },
        { title: "Required - empty", value: [] },
      ])("$title", ({ value }) => {
        const result = validate(value);

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("At least one note is required.");
      });

      test("At least 1 bad note", () => {
        const result = validate(["asd", "", " "]);

        expect(result.isValid).toBe(false);
        expect(result.propertyName).toBe(propertyName);
        expect(result.message).toBe("Cannot contain empty notes.");
      });
    });

    describe("Should throw", () => {
      test("Bad argument - not an array", () => {
        expect.assertions(2);

        try {
          validate({ notArray: "bad" });
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument '${parameterName}' is invalid. Reason: Bad value.\n` +
              `Actual value: '[object Object]'; expected: 'string[]'.`
          );
        }
      });

      test("Bad note", () => {
        expect.assertions(2);

        try {
          validate([123]);
        } catch (error) {
          expect(error).toBeInstanceOf(ArgumentError);
          expect(error.message).toBe(
            `The argument 'note' is invalid. Reason: Wrong type.\n` +
              `Actual type: 'number'; expected: 'string or null'.`
          );
        }
      });
    });
  });

  // Total purchases amount
  describe.each([
    {
      propertyName: "Total purchases amount",
      parameterName: "totalPurchasesAmount",
      validate: CustomerValidator.validateTotalPurchasesAmount,
    },
  ])("$propertyName", ({ parameterName, validate }) => {
    describe("Should validate", () => {
      test.each([
        { title: "Optional - null", value: null },
        { title: "Not null", value: currency(123) },
      ])("$title", ({ value }) => {
        const result = validate(value);

        expect(result.isValid).toBe(true);
        expect(result.propertyName).toBe(undefined);
        expect(result.message).toBe(undefined);
      });
    });

    test("Should throw on bad argument", () => {
      expect.assertions(2);

      try {
        validate({ whatever: "bad" });
      } catch (error) {
        expect(error).toBeInstanceOf(ArgumentError);
        expect(error.message).toBe(
          `The argument 'currencyObj' is invalid. Reason: Missing property.\n` +
            `Missing properties: 'intValue,value,s,p'.`
        );
      }
    });
  });

  // Last purchase date
  describe.each([
    {
      propertyName: "Last purchase date",
      parameterName: "lastPurchaseDate",
      validate: CustomerValidator.validateLastPurchaseDate,
    },
  ])("$propertyName", ({ propertyName, parameterName, validate }) => {
    describe("Should validate", () => {
      test.each([
        { title: "Optional - null", value: null },
        { title: "Not null", value: new Date(Date.UTC(2021, 1, 1)) },
      ])("$title", ({ value }) => {
        const result = validate(value);

        expect(result.isValid).toBe(true);
        expect(result.propertyName).toBe(undefined);
        expect(result.message).toBe(undefined);
      });
    });

    test("Should invalidate - earlier than 2020-1-1", () => {
      const result = validate(new Date(Date.UTC(2019, 12, 31)));

      expect(result.isValid).toBe(false);
      expect(result.propertyName).toBe(propertyName);
      expect(result.message).toBe("Must be not earlier than 2020-1-1.");
    });

    test("Should throw on bad argument", () => {
      expect.assertions(2);

      try {
        validate("not a Date");
      } catch (error) {
        expect(error).toBeInstanceOf(ArgumentError);
        expect(error.message).toBe(
          `The argument '${parameterName}' is invalid. Reason: Bad value.\n` +
            `Actual value: 'not a Date'; expected: 'instanceof Date'.`
        );
      }
    });
  });

  // Customer object
  describe("Validating the Customer object", () => {
    test("Should validate", () => {
      const customer = new Customer(
        "one",
        "two",
        [getValidAddress()],
        "+12345",
        "my@asd.com",
        ["whatever"],
        currency(1234),
        new Date(Date.UTC(2021, 1, 1))
      );

      const result = CustomerValidator.validate(customer);

      expect(result.isValid).toBe(true);
      expect(result.messages).toStrictEqual([]);
    });

    test("Should invalidate Last name and Notes", () => {
      const customer = new Customer(
        "one",
        null,
        [getValidAddress()],
        "+12345",
        "my@asd.com",
        [],
        currency(1234),
        new Date(Date.UTC(2021, 1, 1))
      );

      const result = CustomerValidator.validate(customer);

      expect(result.isValid).toBe(false);
      expect(result.messages).toStrictEqual([
        {
          propertyName: "Last name",
          message: "Required.",
        },
        { propertyName: "Notes", message: "At least one note is required." },
      ]);
    });
  });
});
