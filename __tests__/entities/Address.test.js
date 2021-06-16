const { test, expect } = require("@jest/globals");
const Address = require("../../src/entities/Address");

const getAddress = () =>
  new Address(
    "one",
    "two",
    "Shipping",
    "Seattle",
    "12345",
    "Washington",
    "USA"
  );

test("Should create Address", () => {
  const address = getAddress();

  expect(address.line).toBe("one");
  expect(address.line2).toBe("two");
  expect(address.type).toBe("Shipping");
  expect(address.city).toBe("Seattle");
  expect(address.postalCode).toBe("12345");
  expect(address.state).toBe("Washington");
  expect(address.country).toBe("USA");
});

module.exports = { getAddress };
