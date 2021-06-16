const { test, expect } = require("@jest/globals");
const {
  isAddressType,
  isNotAddressType,
} = require("../../src/entities/AddressType");

test("Is AddressType 'enum'", () => {
  expect(isAddressType(1)).toBe(true);
  expect(isAddressType(2)).toBe(true);

  expect(isAddressType(0)).toBe(false);
  expect(isNotAddressType(0)).toBe(true);
});
