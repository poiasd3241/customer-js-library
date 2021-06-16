const { test, expect } = require("@jest/globals");
const Person = require("../../src/entities/Person");

test("Should create Person", () => {
  const person = new Person("one", "two");

  expect(person.firstName).toBe("one");
  expect(person.lastName).toBe("two");
});
