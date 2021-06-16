class PropertyValidationResult {
  /**
   * @param {boolean} isValid
   * @param {string} propertyName The name of the invalid property.
   * @param {string} message The message on why the property is invalid.
   */
  constructor(isValid, propertyName, message) {
    this.isValid = isValid;
    this.propertyName = propertyName;
    this.message = message;
  }

  /**
   * @returns A valid instance of {@link PropertyValidationResult}.
   */
  static Valid() {
    return new PropertyValidationResult(true);
  }

  /**
   * @param {string} propertyName The name of the invalid property.
   * @param {string} message The message on why the property is invalid.
   * @returns An  invalid instance of {@link PropertyValidationResult} using the provided data.
   */
  static Invalid(propertyName, message) {
    return new PropertyValidationResult(false, propertyName, message);
  }
}

module.exports = PropertyValidationResult;
