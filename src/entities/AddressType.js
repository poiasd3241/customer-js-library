/**
 * The address type 'enum'.
 */
const AddressType = Object.freeze({
  SHIPPIING: 1,
  BILLING: 2,
});

/**
 * @param {*} value
 * @returns True if the specified value is a valid {@link AddressType}; otherwise, false.
 */
const isAddressType = (value) =>
  value === AddressType.SHIPPIING || value === AddressType.BILLING;

/**
 * @param {*} value
 * @returns True if the specified value is not a valid {@link AddressType}; otherwise, false.
 */
const isNotAddressType = (value) => isAddressType(value) === false;

module.exports = {
  AddressType,
  isAddressType,
  isNotAddressType,
};
