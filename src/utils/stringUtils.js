/**
 * @param {string} str The string.
 * @returns True if the string is empty or whitespace; otherwise, false.
 */
function isEmptyOrWhitespace(str) {
  return str.length === 0 || (str.length !== 0 && str.trim() === "");
}

module.exports = { isEmptyOrWhitespace };
