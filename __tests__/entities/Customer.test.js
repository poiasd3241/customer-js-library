const { test, expect } = require("@jest/globals");
const currency = require("currency.js");
const Customer = require("../../src/entities/Customer");
const { getAddress } = require("./Address.test");

test("Should create Customer", () => {
  const address1 = getAddress();
  const address2 = getAddress();
  const lastPurchaseDate = new Date(Date.UTC(2021, 1, 2));
  const totalPurchasesAmount = currency(123.55);

  const customer = new Customer(
    "one",
    "two",
    [address1, address2],
    "+12345",
    "my@asd.com",
    ["first note", "second note"],
    totalPurchasesAmount,
    lastPurchaseDate
  );

  expect(customer.firstName).toBe("one");
  expect(customer.lastName).toBe("two");
  expect(customer.addresses).toStrictEqual([address1, address2]);
  expect(customer.phoneNumber).toBe("+12345");
  expect(customer.email).toBe("my@asd.com");
  expect(customer.notes).toStrictEqual(["first note", "second note"]);
  expect(customer.totalPurchasesAmount).toBe(totalPurchasesAmount);
  expect(customer.lastPurchaseDate).toBe(lastPurchaseDate);
});
