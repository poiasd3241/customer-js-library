const { test, expect } = require("@jest/globals");
const { isDataType, isNotDataType } = require("../../src/validators/DataType");

test("Is DataType 'enum'", () => {
  expect(isDataType("object")).toBe(true);
  expect(isDataType("string")).toBe(true);
  expect(isDataType("boolean")).toBe(true);
  expect(isDataType("number")).toBe(true);
  expect(isDataType("symbol")).toBe(true);
  expect(isDataType("bigint")).toBe(true);
  expect(isDataType("function")).toBe(true);
  expect(isDataType("undefined")).toBe(true);

  expect(isDataType("whatever")).toBe(false);
  expect(isNotDataType("whatever")).toBe(true);
});
