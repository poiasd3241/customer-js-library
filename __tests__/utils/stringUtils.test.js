const { test, expect, describe } = require("@jest/globals");
const { isEmptyOrWhitespace } = require("../../src/utils/stringUtils");

describe.each(["", " ", "\n"])("The string is empty or whitespace.", (str) => {
  test(`'${str}'`, () => {
    expect(isEmptyOrWhitespace(str)).toBe(true);
  });
});

describe.each([" a", "a ", " a ", "a"])(
  "The string is not empty nor whitespace.",
  (str) => {
    test(`'${str}'`, () => {
      expect(isEmptyOrWhitespace(str)).toBe(false);
    });
  }
);
