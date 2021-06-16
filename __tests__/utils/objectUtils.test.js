const { test, expect, describe } = require("@jest/globals");
const {
  getWrappedName,
  getFirstItem,
  doesContainProperty,
} = require("../../src/utils/objectUtils");

test("Should get the name of the property that is wrapped in an object", () => {
  const original = "one";
  const wrapper = { original };
  expect(getWrappedName(wrapper)).toBe("original");
});

test("Should get the first property of an object", () => {
  const obj = { one: "123", two: "456" };
  expect(getFirstItem(obj)).toBe("123");
});

describe("Whether an object contains the specified property (by name)", () => {
  test("Does contain.", () => {
    const obj = { one: "123", two: "456" };
    expect(doesContainProperty(obj, "two")).toBe(true);
  });

  test("Does not contain.", () => {
    const obj = { one: "123", two: "456" };
    expect(doesContainProperty(obj, "three")).toBe(false);
  });
});
