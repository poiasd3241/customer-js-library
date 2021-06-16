/**
 * @param {Object} obj The object.
 * @returns {string} The name of the first key of the specified object.
 */
const getWrappedName = (obj) => Object.keys(obj)[0];

/**
 * @param {object} obj The object.
 * @returns {*} The value at the first key of the specified object.
 */
const getFirstItem = (obj) => obj[getWrappedName(obj)];

/**
 *
 * @param {object} obj The object
 * @param {string} propertyName The property name (the object key).
 * @returns True if the specified object contains the specified key; otherwise, false.
 */
const doesContainProperty = (obj, propertyName) =>
  Object.prototype.hasOwnProperty.hasOwnProperty.call(obj, propertyName);

module.exports = { getWrappedName, getFirstItem, doesContainProperty };
